<template>
    <div class="flex-wrapper main">
        <Navbar/>
        <button class="back-btn" @click="$router.go(-1)"><i class="el-icon-back" style="color:white"/></button>
        <div v-if="!this.isMyself && $store.getters.getLogInStatus" class="actions">
            <el-button type="primary" @click="openSupportModal">打赏</el-button>
            <b-modal ref="support-modal" title="Support Creator" @ok="supportCreator">
                <label>Please enter the amount in CFX</label>
                <b-form-input v-model="supportAmount" class="mb-4" placeholder=""/>
                <label>(Optioal) Leave a message to the creator</label>
                <b-form-input v-model="supportMessage" class="mb-4" placeholder=""/>
            </b-modal>
            <el-button type="primary" @click="$store.dispatch('notifyWIP')">关注</el-button>
            <el-button type="primary" @click="$store.dispatch('notifyWIP')">站内信</el-button>
        </div>
        <div v-if="$store.getters.getLogInStatus" class="profile-pic-container">
            <img id="profile-pic" :src="avatar"/>
            <h2 class="mt-2">{{ first_name }} {{ last_name }}</h2>
            <a :href="`${confluxScanUrl}/address/${$route.params.address}`" target="_blank"
                ><p class="mt-2">{{ this.$route.params.address }}</p></a
            >
        </div>

        <div v-if="$store.getters.getLogInStatus" class="content">
            <div class="padding-border"></div>
            <el-row class="tac">
                <el-col :span="5">
                    <el-menu class="el-menu-vertical-demo" default-active="0" @open="loadSupports"
                             @select="handleSelect">
                        <!-- @open="handleOpen" -->
                        <!-- @close="handleClose" -->
                        <el-submenu v-if="!this.isMyself" index="1">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>Listing</span>
                            </template>
                            <el-menu-item index="1-1">NFT</el-menu-item>
                            <el-menu-item index="1-2">Raffle</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="this.isMyself" index="2">
                            <i class="el-icon-notebook-2"></i>
                            <span slot="title">Transaction History</span>
                        </el-menu-item>
                        <el-menu-item v-if="this.isMyself" id="fav" index="4">
                            <i class="el-icon-star-off"></i>
                            <span slot="title">My liked NFTs</span>
                        </el-menu-item>
                        <el-submenu v-if="this.isMyself" index="6">
                            <template slot="title">
                                <i class="el-icon-goods"></i>
                                <span>Supports</span>
                            </template>
                            <el-menu-item index="6-1">Received</el-menu-item>
                            <el-menu-item index="6-2">Given</el-menu-item>
                        </el-submenu>
                        <el-menu-item v-if="this.isMyself" id="account-menu" index="3">
                            <i class="el-icon-setting"></i>
                            <span slot="title">My Account</span>
                        </el-menu-item>
                        <el-menu-item v-if="!this.isMyself" id="bang" index="5">
                            <i class="el-icon-coin"></i>
                            <span slot="title">粉丝打榜</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="19">
                    <div v-if="selectedIndex == '0'"></div>
                    <div v-if="selectedIndex == '1-1'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard v-for="nft in saleNfts" :key="nft.url" :card="nft" class="mt-4 card"/>
                                <p v-if="saleNfts.length == 0" class="mt-4">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == '1-2'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard v-for="nft in drawNfts" :key="nft.url" :card="nft" class="mt-4 card"/>
                                <p v-if="drawNfts.length == 0" class="mt-4">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == '2'">
                        <el-card class="box-card m-5">
                            <el-table :data="transactions" empty-text="Nothing" height="calc(100vh - 250px)" stripe>
                                <el-table-column type="expand">
                                    <template #default="props">
                                        <p v-for="(value, key) in props.row.details" :key="key">
                                            {{
                                            key + ": " + (typeof value === "object" ? JSON.stringify(value) : value)
                                            }}
                                        </p>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="Time" prop="time"></el-table-column>
                                <el-table-column align="center" label="Title">
                                    <template slot-scope="scope">
                                        <el-link :href="`/nft/${scope.row.nft_id}`" target="_blank">
                                            {{ scope.row.title }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="Price" prop="price"></el-table-column>
                                <el-table-column align="center" label="Currency" prop="currency"></el-table-column>
                                <el-table-column align="center" label="Commission Fee" prop="commission">
                                </el-table-column>
                                <el-table-column align="center" label="Commission Currency" prop="commission_currency">
                                </el-table-column>
                                <el-table-column align="center" label="From">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.fromAddress}`">
                                            {{ scope.row.from }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="To">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.toAddress}`">
                                            {{ scope.row.to }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="Transaction Type" prop="type"></el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                    <div v-if="selectedIndex == '4'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard v-for="nft in likedNfts" :key="nft.url" :card="nft" class="mt-4 card"/>
                                <p v-if="likedNfts.length == 0" class="mt-4">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == '6-1' || selectedIndex == '6-2'">
                        <el-card class="box-card m-5">
                            <el-table
                                    :data="selectedIndex == '6-1' ? receivedSupports : givenSupports"
                                empty-text="Nothing"
                                height="calc(100vh - 250px)"
                                stripe
                            >
                                <el-table-column type="expand">
                                    <template #default="props">
                                        <p class="support-message">
                                            {{ "Message: " + (props.row.message ? props.row.message : "N/A") }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="Time" prop="time"></el-table-column>

                                <el-table-column align="center" label="From">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.fromAddress}`">
                                            {{ scope.row.from }}
                                        </el-link>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="To">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.toAddress}`">
                                            {{ scope.row.to }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="Amount" prop="amount"></el-table-column>
                            </el-table>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == 5">
                        <el-card class="box-card m-5 card-container">
                            <el-empty description="Nothing"></el-empty>
                        </el-card>
                    </div>
                    <div v-if="selectedIndex == '3'">
                        <el-card class="box-card m-5">
                            <div slot="header" class="clearfix">
                                <span>Settings</span>
                                <i
                                    v-if="!editModes"
                                    class="el-icon-edit"
                                    style="float:right;cursor:pointer;"
                                    @click="() => (editModes = true)"
                                ></i>
                                <i
                                    v-if="editModes"
                                    class="el-icon-finished"
                                    style="float:right;cursor:pointer;"
                                    @click="update"
                                />
                            </div>
                            <p>Your Wallet Address</p>
                            <el-input :disabled="true" :placeholder="this.$store.getters.getAddress">
                                <el-button slot="append" @click="$store.dispatch('notifyWIP')">Copy</el-button>
                            </el-input>
                            <p class="mt-3">Info</p>
                            <el-row>
                                <el-col :span="12" class=""
                                >
                                    <el-input
                                        ref="first"
                                        v-model="new_first"
                                        :disabled="!editModes"
                                        placeholder="First Name"
                                    ></el-input
                                    >
                                </el-col>
                                <el-col :span="10" class="pl-3"
                                >
                                    <el-input
                                        ref="last"
                                        v-model="new_last"
                                        :disabled="!editModes"
                                        placeholder="Last Name"
                                    ></el-input
                                    >
                                </el-col>
                                <el-col :span="2" class="pr-3">
                                    <!-- <i v-if="!editModes.name" style='margin-top:10px;float:right;cursor:pointer;' class="el-icon-edit" @click="()=> enableEdit('name')"></i>
                            <i v-if="editModes.name" style='margin-top:10px;float:right;cursor:pointer;' @click="update" class='el-icon-finished'/> -->
                                </el-col>
                            </el-row>
                            <p class="mt-3">Bio</p>
                            <el-row class="mb-3">
                                <el-col :span="22" class=""
                                >
                                    <el-input
                                        ref="bio"
                                        v-model="bio"
                                        :disabled="!editModes"
                                        maxlength="300"
                                        placeholder="Please enter..."
                                        show-word-limit
                                        type="textarea"
                                    >
                                    </el-input
                                    >
                                </el-col>
                                <el-col :span="2" class="pr-3">
                                    <!-- <i v-if="!editModes.bio" style='margin-top:10px;float:right;cursor:pointer;' class="el-icon-edit" @click="() => enableEdit('bio')"></i>
                            <i v-if="editModes.bio" style='margin-top:10px;float:right;cursor:pointer;' @click="update" class='el-icon-finished'/> -->
                                </el-col>
                            </el-row>
                        </el-card>

                        <!-- TODO: Night mode support <el-switch
                            class="ml-5"
                            style="display: inline-block"
                            v-model="modeSwitch"
                            active-color="#ef8e38"
                            inactive-color="rgb(80,80,46)"
                            active-text="Day Mode"
                            inactive-text="Night Mode"
                        >
                        </el-switch> -->
                        <el-button
                            class="mr-5"
                            style="display:inline; float:right;"
                            type="danger"
                            @click="logout"
                            >Log Out
                        </el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <ConnectWallet v-else/>
        <Footer/>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import axios from "axios";
import {Notification} from "element-ui";

export default {
    name: "ProfilePage",
    components: {
        Navbar,
        Footer,
        //   FileUploader,
        ConnectWallet,
        NftCard,
    },
    data: () => ({
        avatar:
            "https://bafybeiasgari2dccg4fcgrkbluberhlhmaq4noxhndz4ktn7pfdiakpp5m.ipfs.nftstorage.link/undraw_profile_pic_ic5t.png",
        selectedIndex: 0,
        modeSwitch: true,
        nftTransactions: [],
        drawTransactions: [],
        bio: "",
        displayBio: "",
        new_first: "",
        new_last: "",
        first_name: "Unregistered",
        last_name: "User",
        editModes: false,
        nfts: [],
        likedNfts: [],
        supportAmount: "",
        supportMessage: "",
        receivedSupports: [],
        givenSupports: [],
        addressToName: {},
    }),
    computed: {
        isMyself: function () {
            return this.$store.getters.getAddress === this.$route.params.address;
        },
        saleNfts: function () {
            return this.nfts.filter((n) => n.status == "sale");
        },
        drawNfts: function () {
            return this.nfts.filter((n) => n.status == "draw");
        },
        transactions: function () {
            if (this.selectedIndex === "2") {
                return this.nftTransactions;
            }
            return [];
        },
        confluxScanUrl() {
            return this.$route.params.address.startsWith("cfxtest:")
                ? "https://testnet.confluxscan.io"
                : "https://confluxscan.io";
        },
    },
    methods: {
        handleSelect(i) {
            if (i == 5) {
                this.$store.dispatch("notifyWIP");
            }
            this.selectedIndex = i;
        },

        enableEdit(key) {
            this.editModes[key] = true;
        },

        update() {
            const newInfo = {
                first_name: this.new_first,
                last_name: this.new_last,
                address: this.$route.params.address,
                description: this.bio,
                profile_picture: this.avatar,
            };

            axios
                .post(this.$store.getters.getApiUrl + "/profile/update-profile", newInfo)
                .then(() => {
                    this.first_name = this.new_first;
                    this.last_name = this.new_last;
                    this.$notify({
                        title: "Congrats",
                        message: "Updated Successfully",
                        duration: 3000,
                        type: "success",
                    });
                })
                .catch(() => {
                    this.$notify({
                        title: "Error",
                        message: "Update Failed",
                        duration: 3000,
                        type: "error",
                    });
                });
            this.editModes = false;
        },
        async getNameByAddress(address) {
            if (this.addressToName[address]) {
                return this.addressToName[address];
            }

            let name;
            try {
                const response = await axios.get(`${this.$store.getters.getApiUrl}/profile/${address}`);
                name = response.data.first_name + " " + response.data.last_name;
            } catch (ignored) {
                name = "Unregistered User";
            }

            this.addressToName[address] = name;
            return name;
        },

        async loadTransactions() {
            const res = await axios.get(`${this.$store.getters.getApiUrl}/transaction/${this.$route.params.address}`);
            let transactions = res.data.map((transaction) => {
                const details = Object.keys(transaction)
                    .filter((key) => !["_id", "__v", "created_at", "updated_at"].includes(key)) // exclude these fields from db
                    .reduce((obj, key) => {
                        obj[key] = transaction[key];
                        return obj;
                    }, {});
                const date = new Date(Date.parse(transaction.created_at));

                return {
                    details: {...details, time: date.toString()},
                    time: `${this.padToTwoDigits(date.getFullYear())}/${this.padToTwoDigits(
                        date.getMonth() + 1
                    )}/${this.padToTwoDigits(date.getDate())} ${this.padToTwoDigits(
                        date.getHours()
                    )}:${this.padToTwoDigits(date.getMinutes())}:${this.padToTwoDigits(date.getSeconds())}`,
                    nft_id: transaction.collection_id,
                    currency: transaction.currency,
                    fromAddress: transaction.seller,
                    toAddress: transaction.buyer,
                    price: transaction.price,
                    type: transaction.seller === this.$route.params.address ? "sell nft" : transaction.transaction_type,
                    commission: transaction.commission,
                    commission_currency: transaction.commission_currency,
                };
            });

            const promises = transactions.map(async (transaction) => {
                transaction.from = await this.getNameByAddress(transaction.fromAddress);
                transaction.to = await this.getNameByAddress(transaction.toAddress);
                await axios
                    .get(`${this.$store.getters.getApiUrl}/nft/${transaction.nft_id}`)
                    .then((r) => {
                        transaction.title = r.data.title;
                    })
                    .catch(() => {
                        transaction.title = "Unknown Title";
                    });
            });
            await Promise.all(promises);

            transactions.forEach((transaction) => {
                if (transaction.type.includes("draw")) {
                    this.drawTransactions.push(transaction);
                } else if (transaction.type.includes("nft")) {
                    this.nftTransactions.push(transaction);
                }
            });
        },
        getOwnerAddress(owners) {
            return owners.find((owner) => owner.percentage === 1).address;
        },
        async loadNfts(nftIds, enableLike = false) {
            const nftPromises = nftIds.map((nftId) => {
                return axios.get(`${this.$store.getters.getApiUrl}/nft/${nftId}`).then(async (res) => {
                        const nft = res.data;
                        nft.url = nft.file;
                        nft.enableLike = enableLike;
                    nft.isLiked = nft.liked_users.includes(this.$store.getters.getAddress);
                        const ownerAddress = this.getOwnerAddress(nft.owner);
                        nft.ownerAddress = ownerAddress;
                    nft.ownerName = await this.getNameByAddress(ownerAddress);
                        return nft;
                    });
            });
            const results = await Promise.allSettled(nftPromises);
            let nfts = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
            return nfts;
        },

        logout() {
            this.$store.commit("setLogin", false);
            this.$store.commit("setAddress", undefined);
            window.sessionStorage.removeItem("infty-marketplace:isLoggedIn");
            window.sessionStorage.removeItem("infty-marketplace:address");
            window.sessionStorage.removeItem("infty-marketplace:profilePic");
        },
        padToTwoDigits(s) {
            s = s.toString();
            if (s.length >= 2) {
                return s;
            } else {
                return this.padToTwoDigits("0" + s);
            }
        },
        async loadSupports() {
            const directions = ["from", "to"];
            for (const direction of directions) {
                await axios
                    .get(`${this.$store.getters.getApiUrl}/support/${direction}/${this.$route.params.address}`)
                    .then(async (res) => {
                        let supports = res.data;
                        supports = supports.map((support) => {
                            support[direction] = this.first_name + " " + this.last_name;

                            const date = new Date(Date.parse(support.created_at));
                            support.time = `${this.padToTwoDigits(date.getFullYear())}/${this.padToTwoDigits(
                                date.getMonth() + 1
                            )}/${this.padToTwoDigits(date.getDate())} ${this.padToTwoDigits(
                                date.getHours()
                            )}:${this.padToTwoDigits(date.getMinutes())}:${this.padToTwoDigits(date.getSeconds())}`;

                            return support;
                        });

                        const oppositeDirection = directions.find((d) => d !== direction);
                        const promises = supports.map(async (support) => {
                            return (support[oppositeDirection] = await this.getNameByAddress(
                                support[oppositeDirection + "Address"]
                            ));
                        });

                        await Promise.all(promises);
                        if (direction === "from") {
                            this.givenSupports = supports;
                        } else if (direction === "to") {
                            this.receivedSupports = supports;
                        }
                    });
            }
        },
        openSupportModal(e) {
            e.preventDefault();
            if (!this.$store.getters.getLogInStatus) {
                this.$notify.info({
                    title: "Warning",
                    message: "Please login to continue",
                    duration: 3000,
                });
            } else {
                this.$refs["support-modal"].show();
            }
        },
        async supportCreator() {
            const to = this.$route.params.address;
            try {
                this.$store.dispatch("notifyLoading", {msg: "Sending transaction"});
                await this.$store.getters.getCfx
                    .sendTransaction({
                        from: (await window.conflux.request({method: "cfx_requestAccounts"}))[0],
                        to: to,
                        gasPrice: this.$store.getters.getGasPrice,
                        value: 1e18 * parseFloat(this.supportAmount),
                    })
                    .executed();
                Notification.closeAll();
                this.$notify.success({
                    title: "Congrats",
                    message: "The creator has received your support, thank you",
                    duration: 3000,
                });
            } catch (e) {
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
                return;
            }
            // record in database
            let data = {
                fromAddress: (await window.conflux.request({method: "cfx_requestAccounts"}))[0],
                toAddress: to,
                amount: parseFloat(this.supportAmount),
            };
            if (this.supportMessage) {
                data.message = this.supportMessage;
            }
            await axios.post(`${this.$store.getters.getApiUrl}/support-user`, data);
        },
    },
    async mounted() {
        if (this.isMyself) {
            this.selectedIndex = "3";
            document.getElementById("account-menu").click();
        } else {
            this.selectedIndex = "1-1";
            document.querySelector(".el-submenu__title").click();
            document.querySelector(".el-menu-item").click();
        }

        const profile = await this.$store.getters.getProfile(this.$route.params.address);
        this.avatar = profile.profile_picture;
        this.first_name = profile.first_name;
        this.last_name = profile.last_name;
        this.new_first = profile.first_name;
        this.new_last = profile.last_name;
        this.bio = profile.description;

        // new database schema
        const nft_ids = profile.nft_ids.map((id) => {
            if (Object.prototype.hasOwnProperty.call(id, "address")) {
                return id.address;
            }
            return Object.keys(id)
                .map((i) => id[i])
                .join("");
        });

        const promises = [];
        // only load what we display
        if (this.isMyself) {
            promises.push((async () => (this.likedNfts = await this.loadNfts(profile.liked_nfts, true)))());
            promises.push(this.loadTransactions());
            promises.push(this.loadSupports());
        } else {
            promises.push((async () => (this.nfts = await this.loadNfts(nft_ids)))());
        }
        await Promise.all(promises);
    },
};
</script>

<style scoped>
.actions {
    position: absolute;
    top: 150px;
    right: 10px;
}

.content {
    width: 100%;
    margin-top: 200px;
    background: white;
    height: 100%;
    padding-bottom: 5%;
}

.main {
    background-color: #f8f8f9;
}

#profile-pic {
    border-radius: 50%;
    height: 300px;
    width: 300px;
    border: 5px solid rgb(190, 234, 255);
    object-fit: cover;
}

.profile-pic-container {
    position: absolute;
    display: block;
    left: 50%;
    margin-left: -150px;
    top: 150px;
    text-align: center;
    z-index: 1;
}

.padding-border {
    height: 250px;
    border-bottom: solid rgb(195, 236, 255) 5px;
}

.el-menu,
.tac {
    height: 100%;
}

.el-col {
    height: calc(100% - 250px);
}

.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
    row-gap: 10px;
    column-gap: 20px;
}

.card {
    width: 250px;
    height: 100%;
}

.support-message {
    padding-left: 10%;
}

/deep/ .el-dropdown {
    display: none;
}

/deep/ .btn-info {
    display: none;
}
</style>
