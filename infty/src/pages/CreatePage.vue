<template>
    <div class="flex-wrapper main">
        <Navbar activeIndex="2" />
        <div class="content mt-5 mb-5" v-if="$store.getters.getLogInStatus">
            <h2>{{ $t("createNft.createNft") }}</h2>
            <label class="mt-4">{{ $t("createNft.title") }}</label>
            <b-form-input v-model="title" type="search" v-bind:placeholder="$t('createNft.name')" />
            <label class="mt-5">{{ $t("createNft.image") }}</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;">
                <FileUploader class="file-uploader" pass-file-to-event="CreatePage.receiveFile" />
            </div>
            <label class="mt-5">{{ $t("createNft.description") }}</label>
            <div class="form-group">
                <b-form-textarea
                    id="description"
                    v-bind:placeholder="$t('createNft.descriptionInput')"
                    v-model="description"
                    rows="3"
                />
                <b-icon v-if="description" font-scale="1.5" class="icon" icon="x" @click="clearTextArea"></b-icon>
            </div>
            <label class="mt-5">{{ $t("createNft.labels") }}</label>
            <div style="width:100%">
                <div style="display:inline-block" v-for="(item, index) in labels" :key="index">
                    <button
                        @click="clicked(index)"
                        class="label-selection-button"
                        :class="{ clicked: labelState[index] }"
                    >
                        {{ labels[index] }}
                    </button>
                </div>
            </div>
            <div class="mt-5">
                <b-badge pill variant="info" class="ml-2">Decentralized Image Storage on IPFS</b-badge>
                <b-button variant="primary" class="create-btn" @click="createNft">{{
                    $t("createNft.create")
                }}</b-button>
                <b-button variant="outline-primary" class="create-btn mr-2" @click="ucVisible = true">{{
                    $t("createNft.unlockableContent")
                }}</b-button>
            </div>
            <el-dialog title="Unlockable Content" :visible.sync="ucVisible" width="60%" :before-close="(d) => d()">
                <label>Image</label>
                <div style="display:flex;min-width:100%;justify-content:space-around;">
                    <FileUploader
                        class="uc-file-uploader"
                        id="uc-file-uploader"
                        pass-file-to-event="CreatePage.receiveUCFile"
                    />
                </div>
                <label class="mt-4">Text</label>
                <div class="form-group">
                    <b-form-textarea
                        id="description"
                        placeholder="Enter a detailed description..."
                        v-model="ucDescription"
                        rows="3"
                    />
                    <b-icon
                        v-if="ucDescription"
                        font-scale="1.5"
                        class="icon"
                        icon="x"
                        @click="ucDescription = ''"
                    ></b-icon>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="ucVisible = false">Cancel</el-button>
                    <el-button
                        type="primary"
                        @click="
                            $store.dispatch('notifyWIP');
                            ucVisible = false;
                        "
                        >Confirm</el-button
                    >
                </span>
            </el-dialog>
        </div>
        <ConnectWallet v-else />
        <Footer />
    </div>
</template>

<script>
import { eventBus } from "../main";
import axios from "axios";
import { Notification } from "element-ui";

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import FileUploader from "../components/FileUploader.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import constant from "../constants/index.js";
export default {
    name: "CreatePage",
    components: {
        Navbar,
        Footer,
        FileUploader,
        ConnectWallet,
    },
    data: () => ({
        title: "",
        description: "",
        ucDescription: "",
        imageData: undefined,
        ucVisible: false,
        ucImageData: undefined,
        labels: constant.LABELS,
        labelState: [],
    }),

    beforeMount() {
        this.labels.forEach((item, index) => this.$set(this.labelState, index, false));
    },

    methods: {
        async createNft() {
            if (!this.imageData || !this.title || this.title.replace(/\s+/g, "").length === 0) {
                Notification.closeAll();
                this.$notify.error({
                    title: "Missing Required Information",
                    message: "Please fill in all fields marked *",
                    duration: 3000,
                });
                return;
            }

            // limit file size to 100 MB
            if (this.imageData.size > 100 * 1024 * 1024) {
                Notification.closeAll();
                this.$notify.error({
                    title: "File Too Large",
                    message: "Please ensure the file size is no larger than 100 MB",
                    duration: 3000,
                });
                return;
            }

            this.$notify({
                title: "Pending",
                dangerouslyUseHTMLString: true,
                message:
                    '<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">NFT minting in progress</div></div>',
                duration: 0,
            });

            const fd = new FormData();
            fd.append("file", this.imageData);
            fd.append("address", this.$store.getters.getAddress);
            fd.append("title", this.title);
            fd.append("description", this.description);
            const selectedLabels = this.labels.filter((l, i) => this.labelState[i] == true);
            fd.append("labels", JSON.stringify(selectedLabels));

            // Obtain estimation
            const estimation = (await axios.post(this.$store.getters.getApiUrl + "/mint-estimate")).data.gas;
            // Charge User
            const getters = this.$store.getters;
            this.$store.dispatch("notifyLoading", { msg: "Paying commission now" });

            let error = false; // flag is set to true when errors occur in transaction
            await window.confluxJS
                .sendTransaction({
                    from: (await window.conflux.request("cfx_requestAccounts"))[0],
                    to: getters.getManagerAddr,
                    gasPrice: getters.getGasPrice,
                    value: estimation,
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
                    error = true;
                });

            if (error) {
                return; // Stop to create nft if the transaction failed
            }

            // Create nft
            axios
                .post(this.$store.getters.getApiUrl + "/create-nft", fd)
                .then((res) => {
                    if (res.status == 200) {
                        Notification.closeAll();
                        this.$notify({
                            title: "Congrats",
                            message: "NFT created successfully",
                            duration: 3000,
                            type: "success",
                        });
                    }
                    eventBus.$emit("CreatePage.nftCreated");
                    this.title = "";
                    this.description = "";
                })
                .catch((err) => {
                    Notification.closeAll();
                    let title = "Error";
                    let message = "NFT creation failed";

                    if (err.response.status == 409) {
                        title = "Conflicting Title";
                        message = "Please try another title for your NFT";
                    } else if (err.response.status == 429) {
                        title = "Daily Creation Limit Reached";
                        message = "If you'd like to create more NFTs, please contact us at contacts@infty.market";
                    } else if (err.response.status == 413) {
                        title = "File Too Large";
                        message = "Please ensure the file size is no larger than 100 MB";
                    }
                    this.$notify.error({
                        title: title,
                        message: message,
                        duration: 3000,
                    });
                });
        },

        clearTextArea() {
            this.description = "";
        },

        clicked(index) {
            this.$set(this.labelState, index, !this.labelState[index]); // change label state on click
        },
    },
    async mounted() {
        eventBus.$on("CreatePage.receiveFile", (imageData) => {
            this.imageData = imageData;
        });
        eventBus.$on("CreatePage.receiveUCFile", (imageData) => {
            this.ucImageData = imageData;
        });
    },
    beforeDestroy() {
        eventBus.$off("CreatePage.receiveFile");
    },
};
</script>

<style scoped>
.content {
    width: 60vw;
    margin: 0px auto;
}
.main {
    background-color: #f8f8f9;
}
.create-btn {
    float: right;
}
.file-uploader {
    width: 80%;
    height: 500px;
}
#uc-file-uploader {
    width: 80%;
    height: 250px;
}

.form-group {
    position: relative;
}
.icon {
    position: absolute;
    bottom: 0;
    left: 97%;
    cursor: pointer;
}
</style>
<style>
#uc-file-uploader svg {
    display: none;
}
.label-selection-button {
    background-color: white; /* Green */
    border: 1px solid rgb(54, 91, 192);
    color: rgb(54, 91, 192);
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;
    margin-right: 10px;
    border-radius: 12px;
    font-size: 14px;
}
.clicked {
    background: rgb(54, 91, 192);
    color: white;
}
</style>
