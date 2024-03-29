<template>
    <div class="flex-wrapper">
        <Navbar/>
        <button class="back-btn" @click="$router.go(-1)"><i class="el-icon-back" style="color:white"/></button>
        <div class="detail-content mb-4">
            <b-card :img-src="card && card.url" class="detailed-card" img-alt="Card image" img-top>
                <b-card-title>
                    <b-icon icon="card-text"></b-icon>&nbsp;Description
                </b-card-title>
                <b-card-text>
                    <p class="card-owner" @click="handleRedirectToProfile(card.author)">
                        Created by {{ card && card.author_name }}
                    </p>
                    <p>
                        {{ (card && card.description) || "No description." }}
                    </p>
                </b-card-text>
                <span
                    v-for="(item, index) in card.labels"
                    :key="index"
                    class="badge badge-pill badge-info"
                    style="display:inline-block;margin-right:5px;"
                >
                    {{ item }}
                </span>
                <b-list-group flush>
                    <b-list-group-item>
                        <b-button v-b-toggle.collapse-2 class="category-button" variant="outline-secondary"
                        >
                            <b-icon icon="file-earmark-text"></b-icon>
                            Details
                        </b-button
                        >
                        <b-collapse id="collapse-2" class="mt-2">
                            <p>
                                Contract Address:
                                <a
                                        :href="`${this.confluxScanUrl}/address/${$store.getters.getMinterAddress}`"
                                    target="_blank"
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
                        v-if="!card.fragmented"
                        class="card-owner"
                        @click="handleRedirectToProfile(card.owner[0].address)"
                    >
                        Owned by {{ card.owner_name }}&nbsp;&nbsp;&nbsp;
                    </div>
                    <div style="display: inline-block">
                        <b-icon icon="eye"/>&nbsp;{{ views }} views
                    </div>
                    <div style="display: inline-block">
                        <div class="like">
                            <heart-btn ref="heartBtn" :isLiked="card.isLiked" :nftId="card.nft_id"/>
                        </div>
                        {{ card.likes }} likes
                    </div>
                </h5>
            </div>

            <b-card-group class="transaction" deck>
                <div v-show="card.unlockable_content.text && card.unlockable_content.text" id="lockable-content"
                     style="width: 100%">
                    <el-tooltip
                        content="You'll see the content once you purchase the NFT."
                        effect="dark"
                        placement="top"
                        style="cursor:pointer"
                    >
                        <div class="unlock" style="width: 100%" @click="ucVisible = isOwner"><i
                                class="el-icon-lock"></i>&nbsp;&nbsp;Contains Unlockable Content
                        </div>
                    </el-tooltip>
                    <el-dialog :before-close="(d) => d()" :visible.sync="ucVisible" title="Unlockable Content"
                               width="60%">
                        <label>Image</label>
                        <div v-if="!card.unlockable_content.image.length">No Unlockable Image</div>
                        <img :src="card.unlockable_content.image"
                             style="display:flex;margin-left:auto;margin-right:auto;justify-content:space-around;max-height:50vh;">
                        <label class="mt-4">Text</label>
                        <div v-if="!card.unlockable_content.text.length">No Unlockable Text</div>
                        <p>{{ card.unlockable_content.text }}</p>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="ucVisible = false">Close</el-button>
                        </span>
                    </el-dialog>
                </div>
                <b-card v-if="card.status == 'sale'" class="transaction-info" footer-tag="footer" header-tag="header">
                    <template #header>
                        <h6 class="mb-0">
                            <b-icon icon="clock"></b-icon>&nbsp;For Sale Now
                        </h6>
                    </template>
                    <b-card-text>Current Price</b-card-text>
                    <p>
                        <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                        {{ card.price }}
                    </p>

                    <b-button v-if="!isOwner && card.status == 'sale'" href="#" variant="primary" @click="buyNowClicked"
                    >
                        <b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy now
                    </b-button
                    >
                    <b-modal ref="buy-modal" title="List Item" @ok="purchaseNft">
                        <label>Price</label>
                        <p>
                            <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
                            {{ card.price }}
                        </p>
                        <label>Commision Fee</label>
                        <b-form-input
                            v-model="listing_commision"
                            class="mb-4"
                            placeholder="How much in cfx... (Minimum 2.5%)"
                        />
                    </b-modal>
                </b-card>
                <b-card class="transaction-info" footer-tag="footer" header-tag="header">
                    <template #header>
                        Transaction History
                    </template>
                    <el-table :data="transactions" empty-text="Nothing" stripe style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="props">
                                <p v-for="(value, key) in props.row.details" :key="key">
                                    {{ key + ": " + (typeof value === "object" ? JSON.stringify(value) : value) }}
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="Txn Hash" prop="txnHash" width="180">
                            <template slot-scope="scope">
                                <a :href="scope.row.txnHashUrl" target="_blank">{{ scope.row.txnHash }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="From" prop="from" width="180">
                            <template slot-scope="scope">
                                <a :href="scope.row.fromUrl" target="_blank">{{ scope.row.from }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="To" prop="to" width="180">
                            <template slot-scope="scope">
                                <a :href="scope.row.toUrl" target="_blank">{{ scope.row.to }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="Time" prop="time" width="180"></el-table-column>
                        <el-table-column label="Age" prop="age" width="180"></el-table-column>
                        <el-table-column label="Epoch" prop="epoch" width="180">
                            <template slot-scope="scope">
                                <a :href="scope.row.epochUrl" target="_blank">{{ scope.row.epoch }}</a>
                            </template>
                        </el-table-column>
                    </el-table>
                </b-card>
            </b-card-group>
        </div>

        <Footer style="z-index: 1"/>
    </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import HeartBtn from "../components/HeartBtn.vue";
import {Notification} from "element-ui";
import {eventBus} from "../main";

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
            listing_commision: "",
            sharesTable: [],
            transactions: [],
            ucVisible: false,
        };
    },
    computed: {
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
            await Promise.all([this.fetchNftData(), this.fetchTransactionHistory()]);
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
                this.$router.push({path: "/marketplace"});
                this.$notify.error({
                    title: "Error",
                    message: "NFT not found",
                    duration: 3000,
                });
                return;
            }

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
            if (!card.unlockable_content) {
                card.unlockable_content = {image: "", text: ""};
            }

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
                this.transactions = res.data.data.list.map((data) => {
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
                await axios.post(`${getters.getApiUrl}/validate-nft`, {nft_id: this.card.nft_id});
            } catch (err) {
                this.$notify.error({
                    title: "NFT No Longer Available for Purchase",
                    message: "The NFT is transferred outside our platform",
                    duration: 3000,
                });

                return;
            }

            this.$store.dispatch("notifyLoading", {msg: "Purchasing now"});
            const res = await this.$store.getters.getCfx
                .sendTransaction({
                    from: (await window.conflux.request({method: "cfx_requestAccounts"}))[0],
                    to: getters.getManagerAddr,
                    gasPrice: getters.getGasPrice,
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
                        this.$notify.success({
                            title: "Congrats",
                            message: "NFT Purchased Successfully",
                            duration: 3000,
                        });
                        const ownerAddress = getters.getAddress;
                        axios.get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`).then((resp) => {
                            this.card.owner_name = resp.data.first_name + " " + resp.data.last_name;
                                this.isOwner = true;
                                this.card.status = "private";
                                this.$forceUpdate();
                            });
                    }
                })
                .catch(() => {
                    this.$notify({
                        title: "Error",
                        message: "Purchase Failed",
                        duration: 3000,
                        type: "error",
                    });
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
    margin-top: 2rem;
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
