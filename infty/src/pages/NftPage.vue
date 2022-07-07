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
                                    :href="`${this.confluxScanUrl}/address/${$store.getters.getMinterAddress}`"
                                    >{{ card.nft_id.split("-")[0] }}
                                </a>
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
                        <div class="like">
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
                <b-card class="transaction-info" header-tag="header" footer-tag="footer" v-if="card.status == 'sale'">
                    <template #header>
                        <h6 class="mb-0"><b-icon icon="clock"></b-icon>&nbsp;For Sale Now</h6>
                    </template>
                    <b-card-text>Current Price</b-card-text>
                    <p>
                        <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                        {{ card.price }}
                    </p>

                    <b-button href="#" variant="primary" @click="buyNowClicked" v-if="!isOwner && card.status == 'sale'"
                        ><b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy now</b-button
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
                        Transaction History
                    </template>
                    <el-table :data="transactions" style="width: 100%" stripe empty-text="Nothing">
                        <el-table-column type="expand">
                            <template #default="props">
                                <p v-for="(value, key) in props.row.details" :key="key">
                                    {{ key + ": " + (typeof value === "object" ? JSON.stringify(value) : value) }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="txnHash" label="Txn Hash" width="180">
                            <template slot-scope="scope">
                                <a target="_blank" :href="scope.row.txnHashUrl">{{ scope.row.txnHash }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="from" label="From" width="180">
                            <template slot-scope="scope">
                                <a target="_blank" :href="scope.row.fromUrl">{{ scope.row.from }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="to" label="To" width="180">
                            <template slot-scope="scope">
                                <a target="_blank" :href="scope.row.toUrl">{{ scope.row.to }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="time" label="Time" width="180"> </el-table-column>
                        <el-table-column prop="age" label="Age" width="180"> </el-table-column>
                        <el-table-column prop="epoch" label="Epoch" width="180">
                            <template slot-scope="scope">
                                <a target="_blank" :href="scope.row.epochUrl">{{ scope.row.epoch }}</a>
                            </template>
                        </el-table-column>
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
import { eventBus } from "../main";

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
            transactions: [],
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
                return "";
            }
        },
        confluxScanUrl() {
            return this.$route.params.id.startsWith("cfxtest:")
                ? "https://testnet.confluxscan.io"
                : "https://confluxscan.io";
        },
        window: () => window,
        console: () => console,
    },
    created() {
        eventBus.$on("NftPage.reload", () => {
            this.fetchNftData();
            this.fetchTransactionHistory();
        });
    },
    async mounted() {
        // fetch and update the views with api to backend
        await axios
            .post(`${this.$store.getters.getApiUrl}/update-views/${this.$route.params.id}`)
            .then((res) => (this.views = res.data.views))
            .catch(() => (this.views = 1));
        if (!this.card) {
            await Promise.add([this.fetchNftData(), this.fetchTransactionHistory()]);
        }
    },
    methods: {
        cellClicked(a, b) {
            if (b.label == "Owner") {
                this.$router.push(`/profile/${a.owner}`);
            }
        },
        getOwnerAddress(owners) {
            return owners.find((owner) => owner.percentage === 1).address;
        },
        async fetchNftData() {
            const getters = this.$store.getters;

            let card;
            try {
                card = (await axios.get(`${getters.getApiUrl}/nft/${this.$route.params.id}`)).data;
            } catch (error) {
                // if nft not found, redirect to marketplace
                this.$router.push({ path: "/marketplace" });
                this.$notify.error({
                    title: "Error",
                    message: "NFT not found",
                    duration: 3000,
                });
                return;
            }
            this.fractionProg = card.owner.slice(1).reduce((pv, cv) => pv + cv.percentage, 0) * 100;

            await axios
                .get(`${this.$store.getters.getApiUrl}/profile/${card.author}`)
                .then((res) => {
                    card.author_name = res.data.first_name + " " + res.data.last_name;
                })
                .catch(() => {
                    card.author_name = "Unregistered User";
                });

            this.isOwner = this.$store.getters.getAddress === this.getOwnerAddress(card.owner);

            await axios
                .get(`${this.$store.getters.getApiUrl}/profile/${this.getOwnerAddress(card.owner)}`)
                .then((res) => {
                    card.owner_name = res.data.first_name + " " + res.data.last_name;
                })
                .catch(() => {
                    card.owner_name = "Unregistered User";
                });

            card.url = card.file;
            card.likes = card.liked_users.length;
            card.isLiked = card.liked_users.includes(this.$store.getters.getAddress);
            this.card = card;
        },
        truncate(fullStr, strLen, separator = "...") {
            fullStr = fullStr.toString();
            if (fullStr.length <= strLen) {
                return fullStr;
            }

            const sepLen = separator.length,
                charsToShow = strLen - sepLen,
                frontChars = Math.ceil(charsToShow / 2),
                backChars = Math.floor(charsToShow / 2);

            return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
        },
        msToTime(ms) {
            const days = Math.floor(ms / (24 * 60 * 60 * 1000));
            const daysms = ms % (24 * 60 * 60 * 1000);
            const hours = Math.floor(daysms / (60 * 60 * 1000));
            const hoursms = ms % (60 * 60 * 1000);
            const minutes = Math.floor(hoursms / (60 * 1000));
            const minutesms = ms % (60 * 1000);
            const seconds = Math.floor(minutesms / 1000);
            return [days, hours, minutes, seconds];
        },
        padToTwoDigits(s) {
            s = s.toString();
            if (s.length >= 2) {
                return s;
            } else {
                return this.padToTwoDigits("0" + s);
            }
        },
        async fetchTransactionHistory() {
            const [contractAddress, tokenId] = this.$route.params.id.split("-");
            const transferUrl = `${this.confluxScanUrl}/v1/transfer?address=${contractAddress}&limit=100&skip=0&tokenId=${tokenId}&transferType=ERC721`;

            await axios.get(transferUrl).then((res) => {
                this.transactions = res.data.list.map((data) => {
                    const txnDate = new Date(parseInt(data.timestamp) * 1000);
                    const taxDateString = `${this.padToTwoDigits(txnDate.getFullYear())}/${this.padToTwoDigits(
                        txnDate.getMonth() + 1
                    )}/${this.padToTwoDigits(txnDate.getDate())} ${this.padToTwoDigits(
                        txnDate.getHours()
                    )}:${this.padToTwoDigits(txnDate.getMinutes())}:${this.padToTwoDigits(txnDate.getSeconds())}`;

                    const [days, hours, minutes, seconds] = this.msToTime(new Date() - txnDate);
                    const strLength = 22;

                    const transaction = {
                        details: {
                            ...data,
                            age: `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ago`,
                            time: txnDate.toString(),
                        },
                        txnHash: this.truncate(data.transactionHash, strLength),
                        txnHashUrl: `${this.confluxScanUrl}/transaction/${data.transactionHash}`,
                        from: this.truncate(data.from, strLength),
                        fromUrl: `${this.confluxScanUrl}/address/${data.from}`,
                        to: this.truncate(data.to, strLength),
                        toUrl: `${this.confluxScanUrl}/address/${data.to}`,
                        epoch: this.truncate(data.epochNumber, strLength),
                        epochUrl: `${this.confluxScanUrl}/epoch/${data.epochNumber}`,
                        time: this.truncate(taxDateString, strLength),
                        age: this.truncate(`${days} days ${hours} hours ago`, strLength),
                    };
                    return transaction;
                });
            });
        },
        buyNowClicked(e) {
            e.preventDefault();
            if (!this.$store.getters.getLogInStatus) {
                this.$notify.info({
                    title: "Warning",
                    message: "Please login to continue",
                    duration: 3000,
                });
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

            this.$store.dispatch("notifyLoading", { msg: "Purchasing now" });
            const res = await window.confluxJS
                .sendTransaction({
                    from: (await window.conflux.send("cfx_requestAccounts"))[0],
                    to: getters.getManagerAddr,
                    gasPrice: 1000000000,
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
                .catch(() => {
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
                .then(() => {
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
