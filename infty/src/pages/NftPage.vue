<template>
    <div class="flex-wrapper">
        <Navbar />
        <button @click="$router.go(-1)" class="back-btn"><i class="el-icon-back" style="color:white" /></button>
        <div class="percent" v-if="card.fractional">
            <span
                style="line-height:80%;text-align:center;color:white;font-size: 100%;left:50%;top:50%;position:absolute;transform: translate(-50%, -50%);"
            >
                {{ sharesOwned }}
                Shares
            </span>
        </div>
        <div class="detail-content mb-4">
            <b-card class="detailed-card" :img-src="card && card.url" img-alt="Card image" img-top>
                <b-card-title><b-icon icon="card-text"></b-icon>&nbsp;Description</b-card-title>
                <b-card-text>
                    <p class="card-owner" @click="handleRedirectToProfile(card.author)">
                        Created by {{ card && card.author_name }}
                    </p>
                    <p>
                        {{ (card && card.description) || "No description." }}
                    </p>
                </b-card-text>
                <b-list-group flush>
                    <b-list-group-item>
                        <b-button v-b-toggle.collapse-1 variant="outline-secondary" class="category-button"
                            ><b-icon icon="file-earmark-richtext"></b-icon>About</b-button
                        >
                        <b-collapse id="collapse-1" class="mt-2">
                            <p>
                                Pixelglyphs are a set of 10,000 unique on-chain avatar NFTs created using a cellular
                                automaton on the Conflux blockchain.
                            </p>
                        </b-collapse>
                    </b-list-group-item>
                    <b-list-group-item>
                        <b-button v-b-toggle.collapse-2 variant="outline-secondary" class="category-button"
                            ><b-icon icon="file-earmark-text"></b-icon>Details</b-button
                        >
                        <b-collapse id="collapse-2" class="mt-2">
                            <p>
                                Contract Address:
                                <a
                                    target="_blank"
                                    :href="`https://testnet.confluxscan.io/token/${$store.getters.getMinterAddress}`"
                                    >{{ $store.getters.getMinterAddress }}</a
                                >
                            </p>
                            <p>Token ID {{ rand(1000, 9999) }}</p>
                        </b-collapse>
                    </b-list-group-item>
                </b-list-group>
            </b-card>
            <div class="album-title-container">
                <h1 class="album-title">&nbsp;{{ card.title }}</h1>

                <h5 class="owner">
                  &nbsp;&nbsp;&nbsp;&nbsp;
                    <div class="card-owner" v-if='!card.fragmented' @click="handleRedirectToProfile(card.owner[0].address)">
                        Owned by {{ card.owner_name }}&nbsp;&nbsp;&nbsp;
                    </div>
                    <div style="display: inline-block"><b-icon icon="eye" />&nbsp;{{ views }} views</div>
                    <div style="display: inline-block">
                        <div
                            class="like"
                            @click="
                                likes += likeswitch;
                                likeswitch *= -1;
                            "
                        >
                            <heart-btn />
                        </div>
                        {{ likes }} likes
                    </div>
                </h5>
            </div>

            <b-card-group deck class="transaction">
                <el-tooltip
                    style="cursor:pointer"
                    effect="dark"
                    content="You'll see the content once you purchase the NFT."
                    placement="top"
                >
                    <div class="unlock"><i class="el-icon-lock"></i>&nbsp;&nbsp;Contains Unlockable Content</div>
                </el-tooltip>
                <b-card class="transaction-info" header-tag="header" footer-tag="footer" v-if="!isOwner">
                    <template #header>
                        <h6 class="mb-0"><b-icon icon="clock"></b-icon>&nbsp;Sale ends in 5 days</h6>
                    </template>
                    <b-card-text>Current Price</b-card-text>
                    <p>
                        <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                        {{ card.price }}
                    </p>

                    <b-button href="#" variant="primary" @click="buyNowClicked" v-if="!isOwner && card.status == 'sale'"
                        ><b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy now</b-button
                    >
                    <b-button variant="outline-primary" class="ml-2" @click="$store.dispatch('notifyWIP')"
                        ><b-icon icon="tag-fill" />&nbsp;Make offer</b-button
                    >
                    <b-modal ref="buy-modal" title="List Item" @ok="purchaseNft">
                        <label>Price</label>
                        <p>
                            <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                            {{ card.price }}
                        </p>
                        <label>Commision Fee</label>
                        <b-form-input
                            class="mb-4"
                            v-model="listing_commision"
                            placeholder="How much in cfx... (Minimum 2.5%)"
                        />
                    </b-modal>
                    <!-- <template #footer>
            <em>Footer Slot</em>
          </template> -->
                </b-card>
                <b-card
                    class="transaction-info"
                    header-tag="header"
                    footer-tag="footer"
                    v-if="card.status == 'sale' && card.fractional"
                >
                    <template #header>
                        <h6 class="mb-0"><i class="el-icon-menu" />&nbsp;Fractional Trading</h6>
                    </template>
                    <div v-if="card.status == 'sale'">
                        <el-progress :text-inside="true" :stroke-width="26" :percentage="fractionProg"></el-progress>
                        <hr />
                        <el-input v-if="!isOwner" v-model="shares" type="number" style="width: calc(100% - 12rem)" />
                        <b-button v-if="!isOwner" variant="primary" @click="purchaseShares" style="float:right"
                            ><i class="el-icon-s-ticket" />&nbsp;&nbsp;Purchase shares</b-button
                        >
                    </div>
                    <el-table
                        @cell-click="cellClicked"
                        :data="sharesTable"
                        style="width: 100%"
                        height="150"
                        empty-text="Unfunded"
                        :cell-style="
                            ({ columnIndex }) => {
                                if (columnIndex == 0) return 'cursor:pointer; color: #007bff;';
                            }
                        "
                    >
                        <el-table-column prop="owner" label="Owner"> </el-table-column>
                        <el-table-column prop="shares" label="Shares" width="80"> </el-table-column>
                        <el-table-column prop="price" label="Price (cfx)" width="60"> </el-table-column>
                        <el-table-column prop="sale" label="Sale" width="180">
                            <template slot-scope="scope">
                                <b-button
                                    variant="primary"
                                    size="sm"
                                    @click="() => transferShares(scope.row)"
                                    v-if="scope.row.status == 'sale'"
                                    ><i class="el-icon-s-ticket" />&nbsp;&nbsp;<span style="font-size: 0.6rem;"
                                        >Purchase shares</span
                                    ></b-button
                                >
                                <div v-else>Not on sale.</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </b-card>
                <b-card class="transaction-info" header-tag="header" footer-tag="footer">
                    <template #header>
                        Offers
                    </template>
                    <el-table :data="offersData" style="width: 100%" height="200" empty-text="Nothing">
                        <el-table-column prop="unit_price" label="Unit Price" width="180"> </el-table-column>
                        <el-table-column prop="usd" label="USD" width="180"> </el-table-column>
                        <el-table-column prop="exp" label="Expiration"> </el-table-column>
                        <el-table-column prop="from" label="From"> </el-table-column>
                    </el-table>
                </b-card>
            </b-card-group>
        </div>

        <Footer style="z-index: 1" />
    </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import HeartBtn from "../components/HeartBtn.vue";
import { Notification } from "element-ui";

export default {
    name: "DetailPage",
    components: {
        Navbar,
        Footer,
        HeartBtn,
    },

    data() {
        return {
            card: { owner: [] },
            isOwner: true,
            likes: this.rand(0, 100),
            // view: this.rand(100, 2000),
            views: '',
            likeswitch: 1,
            shares: 1,
            fractionProg: 0,
            listing_commision: "",
            sharesTable: [],
            offersData: [
                {
                    unit_price: 30,
                    usd: 9,
                    exp: "2 days",
                    from: "William M",
                },
                {
                    unit_price: 1,
                    usd: 0.3,
                    exp: "1 days",
                    from: "User M",
                },
                {
                    unit_price: 1,
                    usd: 0.3,
                    exp: "1 days",
                    from: "User A",
                },
                {
                    unit_price: 1,
                    usd: 0.3,
                    exp: "1 days",
                    from: "User B",
                },
            ],
        };
    },
    computed: {
        sharesOwned: function() {
            if (!this.card) return "";
            try {
                const i = this.card.owner.findIndex((o) => o.address == this.$store.getters.getAddress);
                if (i == -1) return "";
                return this.card.owner[i].percentage * 100;
            } catch (e) {
                console.log(e);
                return "";
            }
        },
        window: () => window,
        console: () => console,
    },
    created() {
        if (!this.card) this.reload();
        if (this.$store.getters.getAddress == undefined) this.$store.dispatch("connectWallet");
    },

    async mounted() {
        // fetch and update the views with api to backend
        const res = await axios.post(`${this.$store.getters.getApiUrl}/update-views/${this.$route.params.id}`);
        this.views = res.data.views;
        
        this.reload();
    },
    methods: {
        cellClicked(a, b) {
            if (b.label =='Owner') {
              this.$router.push(`/profile/${a.owner}`)
            }
        },
                        
        async reload() {
            const getters = this.$store.getters;

            const res = await axios.get(`${getters.getApiUrl}/nft/${this.$route.params.id}`);
            const card = res.data;
            const frags = (await axios.get(`${getters.getApiUrl}/fragments?nft_id=${card.nft_id}`)).data;
            this.fractionProg = card.owner.slice(1).reduce((pv, cv) => pv + cv.percentage, 0) * 100;
            if (card.status == "sale") {
                this.sharesTable = frags.map((o) => ({
                    owner: o.owner,
                    price: o.status == "sale" ? `${o.price}` : "N/A",
                    shares: o.percentage * 100,
                    status: o.status,
                    nft_id: o.nft_id,
                }));
            }

            if (card.status == "private") {
                this.sharesTable = card.owner.map((o) => {
                    return {
                        owner: o.address,
                        shares: o.percentage * 100,
                        ...frags[frags.findIndex((f) => f.owner == o.address)],
                    };
                });
            }

            const resp = await axios.get(`${this.$store.getters.getApiUrl}/profile/${card.author}`);
            card.author_name = resp.data.first_name + " " + resp.data.last_name;
            if (this.$store.getters.getAddress != card.owner[0].address) this.isOwner = false;

            await axios.get(`${this.$store.getters.getApiUrl}/profile/${card.owner[0].address}`);
            card.owner_name = resp.data.first_name + " " + resp.data.last_name;
            card.url = card.file;
            this.card = card;
        },
        rand(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },

        buyNowClicked(e) {
            e.preventDefault();
            this.$refs["buy-modal"].show();
        },

        async purchaseNft() {
            const getters = this.$store.getters;
            this.$store.dispatch("notifyLoading", {msg:"Paying commission now."});
            const tx = window.confluxJS.sendTransaction({
                from: (await window.conflux.send("cfx_requestAccounts"))[0],
                to: getters.getManagerAddr,
                gasPrice: 1,
                value: 1e18 * (parseFloat(this.listing_commision) + parseFloat(this.card.price)),
            });

            const res = await tx.executed();
            console.log(res);
            const data = {
                nft_id: this.card.nft_id,
                buyer: getters.getAddress,
                commission: this.listing_commision,
                commission_currency: "cfx",
            };
            axios
                .post(`${getters.getApiUrl}/purchase-nft`, data)
                .then((res) => {
                    Notification.closeAll();
                    if (res.status == 200) {
                        this.$bvToast.toast("NFT Purchased Successfully", {
                            title: "Notification",
                            autoHideDelay: 3000,
                        });
                        const ownerAddress = getters.getAddress;
                        axios.get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`).then((resp) => {
                            this.card.owner_name = resp.data.first_name + " " + resp.data.last_name;
                            this.isOwner = ownerAddress == this.card.author;
                            this.card.status = "private";
                            this.$forceUpdate();
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Purchase Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
        },

        async purchaseShares() {
            const addr = (await window.conflux.send("cfx_requestAccounts"))[0];
            this.$store.dispatch("notifyLoading", {msg:"Paying commission now."});
            const getters = this.$store.getters;
            const tx = window.confluxJS.sendTransaction({
                from: addr,
                to: getters.getManagerAddr,
                gasPrice: 1,
                value: 1e18 * ((parseFloat(this.card.price) / 100) * this.shares),
            });

            await tx.executed();

            axios
                .post(`${getters.getApiUrl}/fund-nft`, {
                    nft_id: this.$route.params.id,
                    buyer: addr,
                    percentage: parseFloat(this.shares) * 0.01,
                })
                .then((res) => {
                    console.log(res);
                    Notification.closeAll();
                    this.$bvToast.toast("NFT Shares Purchased Successfully", {
                        title: "Notification",
                        autoHideDelay: 3000,
                    });
                    this.$router.go();
                });
        },

        async transferShares(obj) {
            const getters = this.$store.getters;
            const addr = (await window.conflux.send("cfx_requestAccounts"))[0];
            this.$store.dispatch("notifyLoading", {msg:"Paying commission now."});
            const tx = window.confluxJS.sendTransaction({
                from: addr,
                to: getters.getManagerAddr,
                gasPrice: 1,
                value: 1e18 * parseFloat(obj.price),
            });

            await tx.executed();
            axios
                .post(`${getters.getApiUrl}/purchase-fragment`, {
                    owner: obj.owner,
                    nft_id: obj.nft_id,
                    buyer: getters.getAddress,
                })
                .then(() => {
                    Notification.closeAll();
                    this.$bvToast.toast("NFT Shares Purchased Successfully", {
                        title: "Notification",
                        autoHideDelay: 3000,
                    });
                    this.$router.go();
                });
        },
        handleRedirectToProfile(address) {
            this.$router.push({
                path: "/profile/" + address,
            });
        },
    },
};
</script>

<style scoped>
.detailed-card {
    float: left;
    width: 500px;
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-right: 1rem;
}
@media screen and (max-width: 2000px) {
    .detailed-card {
        width: 300px;
    }
}
.category-button {
    width: 100%;
}
.heart {
    float: right;
}
.detail-content {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}
@media screen and (max-width: 2000px) {
    .detailed-content {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
    }
}
.transaction {
    float: left;
    margin-top: 2rem;
    margin-left: 0.5rem;
    width: calc(80vw - 600px);
    display: flex;
    flex-direction: column;
    gap: 40px;
}
@media screen and (max-width: 2000px) {
    .transaction {
        width: calc(80vw - 350px);
    }
}
.transaction-info {
    max-width: 100%;
}

.album-title-container {
    margin-top: 2rem;
}
.album-title {
    font-weight: bold;
    font-size: 4rem;
}

.like {
    display: inline-block;
    transform: scale(0.2);
    margin-top: -100px;
    margin-bottom: -58px;
    margin-left: -30px;
    margin-right: -60px;
}
.back-btn {
    position: absolute;
    top: 150px;
    left: -10px;
    width: 60px;
    border-radius: 20%;
    background-color: rgb(72, 83, 87);
    border: unset;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
.unlock {
    display: inline-block;
    padding: 0.3rem;
    font-size: 1rem;
    font-weight: bold;
    color: rgb(203, 132, 236);
    border-style: solid;
    border-width: 0.2rem;
    border-image: linear-gradient(170deg, rgb(224, 169, 255), rgb(101, 224, 255)) 1;
    margin: 0 15px;
}

.percent {
    position: absolute;
    top: 150px;
    right: 50px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgb(92, 192, 228);
    border: unset;
    z-index: -1;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
.card-owner {
    cursor: pointer;
    display: inline-block;
}

.card-owner:hover {
    color: #0088a9;
}
</style>
