<template>
    <div class="flex-wrapper main">
        <Navbar />
        <button @click="$router.go(-1)" class="back-btn"><i class="el-icon-back" style="color:white" /></button>
        <div class="actions" v-if="!this.isMyself">
            <el-button type="primary" @click="openSupportModal">打赏</el-button>
            <b-modal ref="support-modal" title="Support Creator" @ok="supportCreator">
                <label>Please enter the amount in CFX</label>
                <b-form-input class="mb-4" v-model="supportAmount" placeholder="" />
                <label>(Optioal) Leave a message to the creator</label>
                <b-form-input class="mb-4" v-model="supportMessage" placeholder="" />
            </b-modal>
            <el-button type="primary" @click="$store.dispatch('notifyWIP')">关注</el-button>
            <el-button type="primary" @click="$store.dispatch('notifyWIP')">站内信</el-button>
        </div>
        <div class="profile-pic-container" v-if="$store.getters.getLogInStatus">
            <img :src="avatar" id="profile-pic" />
            <h2 class="mt-2">{{ first_name }} {{ last_name }}</h2>
            <a target="_blank" :href="`${confluxScanUrl}/address/${$route.params.address}`"
                ><p class="mt-2">{{ this.$route.params.address }}</p></a
            >
        </div>

        <div class="content" v-if="$store.getters.getLogInStatus">
            <div class="padding-border"></div>
            <el-row class="tac">
                <el-col :span="5">
                    <el-menu @select="handleSelect" default-active="0" class="el-menu-vertical-demo">
                        <!-- @open="handleOpen" -->
                        <!-- @close="handleClose" -->
                        <el-submenu index="1" v-if="!this.isMyself">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>Listing</span>
                            </template>
                            <el-menu-item index="1-1">NFT</el-menu-item>
                            <el-menu-item index="1-2">Raffle</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="2" v-if="this.isMyself">
                            <i class="el-icon-notebook-2"></i>
                            <span slot="title">Transaction History</span>
                        </el-menu-item>
                        <el-menu-item index="4" v-if="this.isMyself" id="fav">
                            <i class="el-icon-star-off"></i>
                            <span slot="title">My liked NFTs</span>
                        </el-menu-item>
                        <el-submenu index="6" v-if="this.isMyself">
                            <template slot="title">
                                <i class="el-icon-goods"></i>
                                <span>Supports</span>
                            </template>
                            <el-menu-item index="6-1">Received</el-menu-item>
                            <el-menu-item index="6-2">Given</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="3" v-if="this.isMyself" id="account-menu">
                            <i class="el-icon-setting"></i>
                            <span slot="title">My Account</span>
                        </el-menu-item>
                        <el-menu-item index="5" v-if="!this.isMyself" id="bang">
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
                                <NftCard class="mt-4 card" v-for="nft in saleNfts" :card="nft" :key="nft.url" />
                                <p class="mt-4" v-if="saleNfts.length == 0">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == '1-2'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard class="mt-4 card" v-for="nft in drawNfts" :card="nft" :key="nft.url" />
                                <p class="mt-4" v-if="drawNfts.length == 0">
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

                                <el-table-column prop="time" label="Time" align="center"> </el-table-column>
                                <el-table-column label="Title" align="center">
                                    <template slot-scope="scope">
                                        <el-link target="_blank" :href="`/nft/${scope.row.nft_id}`">
                                            {{ scope.row.title }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="Price" align="center"> </el-table-column>
                                <el-table-column prop="currency" label="Currency" align="center"> </el-table-column>
                                <el-table-column prop="commission" label="Commission Fee" align="center">
                                </el-table-column>
                                <el-table-column prop="commission_currency" label="Commission Currency" align="center">
                                </el-table-column>
                                <el-table-column label="From" align="center">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.fromAddress}`">
                                            {{ scope.row.from }}
                                        </el-link>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="type" label="Transaction Type" align="center"> </el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                    <div v-if="selectedIndex == '4'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard class="mt-4 card" v-for="nft in likedNfts" :card="nft" :key="nft.url" />
                                <p class="mt-4" v-if="likedNfts.length == 0">
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
                                        <p>
                                            {{ "Message: " + (props.row.message ? props.row.message : "N/A") }}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="time" label="Time" align="center"> </el-table-column>

                                <el-table-column label="From" align="center">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.fromAddress}`">
                                            {{ scope.row.from }}
                                        </el-link>
                                    </template>
                                </el-table-column>

                                <el-table-column label="To" align="center">
                                    <template slot-scope="scope">
                                        <el-link :href="`/profile/${scope.row.toAddress}`">
                                            {{ scope.row.to }}
                                        </el-link>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="amount" label="Amount" align="center"></el-table-column>
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
                                    style="float:right;cursor:pointer;"
                                    class="el-icon-edit"
                                    @click="() => (editModes = true)"
                                ></i>
                                <i
                                    v-if="editModes"
                                    style="float:right;cursor:pointer;"
                                    @click="update"
                                    class="el-icon-finished"
                                />
                            </div>
                            <p>Your Wallet Address</p>
                            <el-input :placeholder="this.$store.getters.getAddress" :disabled="true">
                                <el-button slot="append" @click="$store.dispatch('notifyWIP')">Copy</el-button>
                            </el-input>
                            <p class="mt-3">Info</p>
                            <el-row>
                                <el-col class="" :span="12"
                                    ><el-input
                                        ref="first"
                                        placeholder="First Name"
                                        v-model="new_first"
                                        :disabled="!editModes"
                                    ></el-input
                                ></el-col>
                                <el-col class="pl-3" :span="10"
                                    ><el-input
                                        ref="last"
                                        placeholder="Last Name"
                                        v-model="new_last"
                                        :disabled="!editModes"
                                    ></el-input
                                ></el-col>
                                <el-col class="pr-3" :span="2">
                                    <!-- <i v-if="!editModes.name" style='margin-top:10px;float:right;cursor:pointer;' class="el-icon-edit" @click="()=> enableEdit('name')"></i>
                            <i v-if="editModes.name" style='margin-top:10px;float:right;cursor:pointer;' @click="update" class='el-icon-finished'/> -->
                                </el-col>
                            </el-row>
                            <p class="mt-3">Bio</p>
                            <el-row class="mb-3">
                                <el-col class="" :span="22"
                                    ><el-input
                                        type="textarea"
                                        placeholder="Please enter..."
                                        v-model="bio"
                                        maxlength="300"
                                        show-word-limit
                                        ref="bio"
                                        :disabled="!editModes"
                                    >
                                    </el-input
                                ></el-col>
                                <el-col class="pr-3" :span="2">
                                    <!-- <i v-if="!editModes.bio" style='margin-top:10px;float:right;cursor:pointer;' class="el-icon-edit" @click="() => enableEdit('bio')"></i>
                            <i v-if="editModes.bio" style='margin-top:10px;float:right;cursor:pointer;' @click="update" class='el-icon-finished'/> -->
                                </el-col>
                            </el-row>
                        </el-card>
                        <!-- <b-modal ref="confirm" title='Confirm Update' @ok="update">
                        <label>First Name</label>
                        <b-form-input class='mb-4' v-model='new_first' readonly/>
                        <label>Last Name</label>
                        <b-form-input class='mb-4' v-model='new_last' readonly/>
                        <label>Description</label>
                        <b-form-input class='mb-4' v-model='bio' readonly/>
                        </b-modal> -->
                        <el-switch
                            class="ml-5"
                            style="display: block"
                            v-model="modeSwitch"
                            active-color="#ef8e38"
                            inactive-color="rgb(80,80,46)"
                            active-text="Day Mode"
                            inactive-text="Night Mode"
                        >
                        </el-switch>
                    </div>
                </el-col>
            </el-row>
        </div>
        <ConnectWallet v-else />
        <Footer />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import axios from "axios";
import { Notification } from "element-ui";

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
    }),
    computed: {
        isMyself: function() {
            return this.$store.getters.getAddress === this.$route.params.address;
        },
        saleNfts: function() {
            return this.nfts.filter((n) => n.status == "sale");
        },
        drawNfts: function() {
            return this.nfts.filter((n) => n.status == "draw");
        },
        transactions: function() {
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
                    this.$bvToast.toast("Update Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
            this.editModes = false;
        },

        loadTransactions() {
            axios.get(`${this.$store.getters.getApiUrl}/transaction/${this.$route.params.address}`).then((res) => {
                res.data.map((record) => {
                    const details = Object.keys(record)
                        .filter((key) => !["_id", "__v", "created_at", "updated_at"].includes(key))
                        .reduce((obj, key) => {
                            obj[key] = record[key];
                            return obj;
                        }, {});
                    const date = new Date(Date.parse(record.created_at));
                    let current = {
                        details: { ...details, time: date.toString() },
                        time: `${this.padToTwoDigits(date.getFullYear())}/${this.padToTwoDigits(
                            date.getMonth() + 1
                        )}/${this.padToTwoDigits(date.getDate())} ${this.padToTwoDigits(
                            date.getHours()
                        )}:${this.padToTwoDigits(date.getMinutes())}:${this.padToTwoDigits(date.getSeconds())}`,
                        nft_id: record.collection_id,
                        currency: record.currency,
                        fromAddress: record.seller,
                        price: record.price,
                        type: record.transaction_type,
                        commission: record.commission,
                        commission_currency: record.commission_currency,
                    };
                    axios.get(`${this.$store.getters.getApiUrl}/profile/${record.seller}`).then((r) => {
                        current.from = r.data.first_name + " " + r.data.last_name;
                    });
                    axios.get(`${this.$store.getters.getApiUrl}/nft/${current.nft_id}`).then((r) => {
                        current.title = r.data.title;
                    });
                    if (current.type.includes("draw")) {
                        this.drawTransactions.push(current);
                    } else if (current.type.includes("nft")) {
                        this.nftTransactions.push(current);
                    }
                });
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
                    await axios
                        .get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`)
                        .then((res) => {
                            nft.ownerName = res.data.first_name + " " + res.data.last_name;
                        })
                        .catch(() => {
                            nft.ownerName = "Unregistered User";
                        });
                    return nft;
                });
            });
            const results = await Promise.allSettled(nftPromises);
            let nfts = results.filter((result) => result.status === "fulfilled").map((result) => result.value);
            return nfts;
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
                        const promises = supports.map((support) => {
                            return axios
                                .get(
                                    `${this.$store.getters.getApiUrl}/profile/${support[oppositeDirection + "Address"]}`
                                )
                                .then((res) => {
                                    support[oppositeDirection] = res.data.first_name + " " + res.data.last_name;
                                })
                                .catch(() => {
                                    support[oppositeDirection] = "Unregistered User";
                                });
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
            try {
                this.$store.dispatch("notifyLoading", { msg: "Sending transaction" });
                await window.confluxJS
                    .sendTransaction({
                        from: (await window.conflux.send("cfx_requestAccounts"))[0],
                        to: this.$route.params.address,
                        gasPrice: 1e9,
                        value: 1e18 * parseFloat(this.supportAmount),
                    })
                    .executed();
                Notification.closeAll();
                this.$notify({
                    title: "Notification",
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
                fromAddress: (await window.conflux.send("cfx_requestAccounts"))[0],
                toAddress: this.$route.params.address,
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

        [this.likedNfts, this.nfts] = await Promise.all([
            this.loadNfts(profile.liked_nfts, true),
            this.loadNfts(nft_ids),
            this.loadTransactions(),
            this.loadSupports(),
        ]);
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
#profile-pic ~ a {
    opacity: 0;
    cursor: pointer;
}
#profile-pic ~ a:hover {
    opacity: 1;
    cursor: pointer;
}
#profile-pic:hover ~ a {
    opacity: 1;
    cursor: pointer;
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

/deep/.el-dropdown {
    display: none;
}

/deep/.btn-info {
    display: none;
}
</style>
