<template>
    <div class="flex-wrapper">
        <Navbar />
        <button @click="$router.go(-1)" class="back-btn"><i class="el-icon-back" style="color:white" /></button>
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
                            <span
                                class="badge badge-pill badge-info"
                                style="display:inline-block;margin-right:5px;"
                                v-for="(item, index) in card.labels"
                                :key="index"
                            >
                                {{ item }}
                            </span>
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
                                    >{{ card.nft_id.split("-")[0] }}</a
                                >
                            </p>
                            <p>Token ID {{ card.nft_id.split("-")[1] }}</p>
                        </b-collapse>
                    </b-list-group-item>
                </b-list-group>
            </b-card>
            <div class="title-container">
                <h1 class="title">&nbsp;{{ card.title }}</h1>

                <h5 class="owner">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div
                        class="card-owner"
                        v-if="!card.fragmented"
                        @click="handleRedirectToProfile(card.owner[0].address)"
                    >
                        Owned by {{ card.owner_name }}&nbsp;&nbsp;&nbsp;
                    </div>
                    <div style="display: inline-block"><b-icon icon="eye" />&nbsp;{{ views }} views</div>
                    <div style="display: inline-block">
                        <div class="like" @click="onClickHeart">
                            <heart-btn ref="heartBtn" :nftId="card.nft_id" :isLiked="card.isLiked" />
                        </div>
                        {{ card.likes }} likes
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
                        <h6 class="mb-0"><b-icon icon="clock"></b-icon>&nbsp;On Sale Now</h6>
                    </template>
                    <b-card-text>Current Price</b-card-text>
                    <p>
                        <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                        {{ card.price }}
                    </p>

                    <b-button href="#" variant="primary" @click="buyNowClicked" v-if="!isOwner && card.status == 'sale'"
                        ><b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy now</b-button
                    >
                    <b-button
                        variant="outline-primary"
                        class="ml-2"
                        @click="$store.dispatch('notifyWIP')"
                        v-if="!isOwner && card.status == 'sale'"
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
            card: undefined,
            isOwner: true,
            views: "",
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
            if (b.label == "Owner") {
                this.$router.push(`/profile/${a.owner}`);
            }
        },
        async onClickHeart() {
            await this.$refs.heartBtn.waitUntilUpdated();
            this.reload();
        },
        getOwnerAddress(owners) {
            return owners.find((owner) => owner.percentage === 1).address;
        },
        async reload() {
            const getters = this.$store.getters;

            const card = (await axios.get(`${getters.getApiUrl}/nft/${this.$route.params.id}`)).data;

            this.fractionProg = card.owner.slice(1).reduce((pv, cv) => pv + cv.percentage, 0) * 100;

            const author = (await axios.get(`${this.$store.getters.getApiUrl}/profile/${card.author}`)).data;
            card.author_name = author.first_name + " " + author.last_name;

            this.isOwner = this.$store.getters.getAddress === this.getOwnerAddress(card.owner);

            const owner = (
                await axios.get(`${this.$store.getters.getApiUrl}/profile/${this.getOwnerAddress(card.owner)}`)
            ).data;
            card.owner_name = owner.first_name + " " + owner.last_name;
            card.url = card.file;
            card.likes = card.liked_users.length;
            card.isLiked = card.liked_users.includes(this.$store.getters.getAddress);
            this.card = card;
        },
        rand(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        },

        buyNowClicked(e) {
            e.preventDefault();
            if (!this.$store.getters.getLogInStatus) {
                this.$store.dispatch("connectWallet");
            } else {
                this.$refs["buy-modal"].show();
            }
        },

        async purchaseNft() {
            const getters = this.$store.getters;
            try {
                await axios.post(`${getters.getApiUrl}/validate-nft`, { nft_id: this.card.nft_id });
            } catch (err) {
                this.$notify.error({
                    title: "NFT No Longer Available for Purchase",
                    message: "The NFT is transferred outside our platform",
                    duration: 3000,
                });

                return;
            }

            this.$store.dispatch("notifyLoading", { msg: "Paying commission now" });
            const res = await window.confluxJS
                .sendTransaction({
                    from: (await window.conflux.send("cfx_requestAccounts"))[0],
                    to: getters.getManagerAddr,
                    gasPrice: 1,
                    value: 1e18 * (parseFloat(this.listing_commision) + parseFloat(this.card.price)),
                })
                .executed()
                .catch((e) => {
                    Notification.closeAll();
                    let title = "Transaction Failed";
                    let message = "Transaction failed, please try again";
                    if (e.code === 4001) {
                        message = "User denied transaction signature";
                    }
                    this.$notify.error({
                        title,
                        message,
                        duration: 3000,
                    });
                });

            // if res is undefined, then the transaction is not executed, we should abort
            if (!res) {
                return;
            }
            const data = {
                nft_id: this.card.nft_id,
                buyer: getters.getAddress,
                commission: this.listing_commision,
                commission_currency: "cfx",
            };
            await axios
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
            this.$store.dispatch("notifyLoading", { msg: "Paying commission now." });
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
            this.$store.dispatch("notifyLoading", { msg: "Paying commission now." });
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

.title-container {
    margin-top: 2rem;
}
.title {
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
