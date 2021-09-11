<template>
    <div class="flex-wrapper main">
        <Navbar />
        <button @click="$router.go(-1)" class="back-btn"><i class="el-icon-back" style="color:white" /></button>
        <div class='actions' v-if='!this.isMyself' @click='$store.dispatch("notifyWIP")'>
            <el-button type="primary">打赏</el-button>
            <el-button type="primary">关注</el-button>
            <el-button type="primary">站内信</el-button>
        </div>
        <div class="profile-pic-container" v-if="$store.getters.getAddress">
            <img :src="avatar" id="profile-pic" />
            <a @click="uploadAvatar" v-if="this.isMyself">
                <b-icon id="upload_pic_icon" icon="camera" font-scale="2" class="upload-btn p-2" v-if='$store.getters.getAddress==$route.params.address'></b-icon>
            </a>
            <b-form style="display:None">
                <input type="file" ref="avatar_uploader" id="avatar_uploader" @change="onFileSelected" />
            </b-form>
            <h2 class="mt-2">{{ first_name }} {{ last_name }}</h2>
            <a target="_blank" :href="`https://confluxscan.io/address/${this.$route.params.address}`"
                ><p class="mt-2">{{ this.$route.params.address }}</p></a
            >
        </div>

        <div class="content" v-if="$store.getters.getAddress">
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
                            <el-menu-item index="1-2">Album</el-menu-item>
                            <el-menu-item index="1-3">Raffle</el-menu-item>
                        </el-submenu>
                        <el-submenu index="2" v-if="this.isMyself">
                            <template slot="title">
                                <i class="el-icon-notebook-2"></i>
                                <span slot="title">Transaction History</span>
                            </template>
                            <el-menu-item index="2-1">NFT</el-menu-item>
                            <el-menu-item index="2-2">Album</el-menu-item>
                            <el-menu-item index="2-3">Raffle</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="4" v-if="this.isMyself" id='fav'>
                            <i class="el-icon-star-off"></i>
                            <span slot="title">My liked NFTs</span>
                        </el-menu-item>
                        <el-menu-item index="3" v-if="this.isMyself" id='account-menu'>
                            <i class="el-icon-setting"></i>
                            <span slot="title">My Account</span>
                        </el-menu-item>
                        <el-menu-item index="5" v-if="!this.isMyself" id='bang'>
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
                                <AlbumCard
                                    class="mt-4 card"
                                    v-for="album in saleAlbums"
                                    :card="album"
                                    :key="album.url"
                                />
                                <p class="mt-4" v-if="saleAlbums.length == 0">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>
                    <div v-if="selectedIndex == '1-3'">
                        <el-card class="box-card m-5 card-container">
                            <div class="card-container">
                                <NftCard class="mt-4 card" v-for="nft in drawNfts" :card="nft" :key="nft.url" />
                                <p class="mt-4" v-if="drawNfts.length == 0">
                                    <el-empty description="Nothing"></el-empty>
                                </p>
                            </div>
                        </el-card>
                    </div>

                    <div v-if="selectedIndex == '2-1' || selectedIndex == '2-2' || selectedIndex == '2-3'">
                        <el-card class="box-card m-5 transaction-card">
                            <el-table :data="transactions" empty-text="Nothing" height="calc(100vh - 250px)">
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
                                <el-table-column prop="from" label="From" align="center"> </el-table-column>
                                <el-table-column prop="type" label="Transaction Type" align="center"> </el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                     <div v-if="selectedIndex == '4'">
                        <el-card class="box-card m-5 card-container">
                             <el-empty description="Nothing"></el-empty>
                        </el-card>
                     </div>
                     <div v-if='selectedIndex == 5'> 
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
                                <el-button slot="append" @click='$store.dispatch("notifyWIP")'>Copy</el-button>
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
// import FileUploader from '../components/FileUploader.vue'
import NftCard from "../components/NftCard.vue";
import AlbumCard from "../components/AlbumCard.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import axios from "axios";
export default {
    name: "ProfilePage",
    components: {
        Navbar,
        Footer,
        //   FileUploader,
        ConnectWallet,
        NftCard,
        AlbumCard,
    },
    data: () => ({
        avatar: null,
        selectedIndex: 0,
        modeSwitch: true,
        nftTransactions: [],
        drawTransactions: [],
        albumTransactions: [],

        bio: "",
        displayBio: "",
        new_first: "",
        new_last: "",
        first_name: "",
        last_name: "",
        editModes: false,
        nfts: [],
        albums: [],
        raffles: [],
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
        saleAlbums: function() {
            return this.albums.filter((n) => n.status == "sale");
        },
        transactions: function() {
            if (this.selectedIndex === "2-1") {
                return this.nftTransactions;
            } else if (this.selectedIndex === "2-2") {
                return this.albumTransactions;
            } else if (this.selectedIndex === "2-3") {
                return this.drawTransactions;
            }
            return []
        },
    },
    methods: {
        handleSelect(i) {
            if (i == 4 || i == 5) {
                this.$store.dispatch('notifyWIP')
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
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Update Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
            this.editModes = false;
        },

        loadTransactions() {
            axios
                .get(`${this.$store.getters.getApiUrl}/transaction/${this.$route.params.address}`)
                .then((res) => {
                    res.data.map((record) => {
                        const date = Date.parse(record.created_at);
                        let current = {
                            time: new Date(date).toString(),
                            nft_id: record.collection_id,
                            currency: record.currency,
                            from: record.seller,
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
                        console.log(current);
                        if (current.type.includes("draw")) {
                            this.drawTransactions.push(current);
                        } else if (current.type.includes("album")) {
                            this.albumTransactions.push(current);
                        } else if (current.type.includes("nft")) {
                            this.nftTransactions.push(current);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        async loadNfts(nftIds) {
            const promises = nftIds.map((nftId) => axios.get(`${this.$store.getters.getApiUrl}/nft/${nftId}`));
            await Promise.allSettled(promises).then((results) => {
                results.forEach((result) => {
                    if (result.status == "fulfilled") {
                        const nft = result.value.data;
                        nft.url = nft.file;
                        nft.author = `${this.first_name} ${this.last_name}`;
                        this.nfts.push(nft);
                    }
                });
            });
        },

        async loadAlbums(albumIds) {
            const promises = albumIds.map((albumId) => axios.get(`${this.$store.getters.getApiUrl}/album/${albumId}`));
            await Promise.allSettled(promises).then((results) => {
                results.forEach((result) => {
                    if (result.status == "fulfilled") {
                        const album = result.value.data;
                        album.url = album.file;
                        album.author = `${this.first_name} ${this.last_name}`;
                        this.albums.push(album);
                    }
                });
            });
        },

        uploadAvatar() {
            this.$refs["avatar_uploader"].click();
        },

        onFileSelected(e) {
            let image = e.target.files[0];
            if (!image.type.match("image/*")) {
                this.$bvToast.toast("Please Select Image to Upload", {
                    title: "Error",
                    autoHideDelay: 3000,
                    appendToast: false,
                });
            }
            this.updateAvatar(image);
        },

        updateAvatar(avatar) {
            const fd = new FormData();
            fd.append("file", avatar);
            fd.append("address", this.$store.getters.getAddress);

            axios
                .post(this.$store.getters.getApiUrl + "/profile/update-avatar", fd)
                .then((res) => {
                    this.avatar = res.data.url;
                    this.$store.commit("setProfilePic");
                    this.$notify({
                        title: "Congrats",
                        message: "Avatar Updated Successfully",
                        duration: 3000,
                        type: "success",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Avatar Update Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
        },
    },
    async mounted() {
        await this.$store.dispatch("connectWallet");
        const profile = await this.$store.getters.getProfile(this.$route.params.address);
        this.avatar = profile.profile_picture;
        this.first_name = profile.first_name;
        this.last_name = profile.last_name;
        this.new_first = profile.first_name;
        this.new_last = profile.last_name;
        this.bio = profile.description;
        this.loadTransactions();
        await this.loadNfts(profile.nft_ids);
        await this.loadAlbums(profile.album_ids);
        if (this.isMyself) {
            this.selectedIndex = '3'
            document.getElementById('account-menu').click()
        } else {
            this.selectedIndex = '1-1'
            document.querySelector('.el-submenu__title').click()
            document.querySelector('.el-menu-item').click()
        }
    },
    beforeDestroy() {},
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
.create-btn {
    float: right;
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
#upload_pic_icon {
    margin-left: 70%;
    margin-top: -15%;
    display: block;
    position: absolute;
}

.upload-btn {
    color: white;
    border-radius: 50%;
    background-color: rgb(95, 167, 167);
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

/deep/.card-owner {
    pointer-events: none;
}
</style>
