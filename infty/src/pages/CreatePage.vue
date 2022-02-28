<template>
    <div class="flex-wrapper main">
        <Navbar />
        <div class="content mt-5 mb-5" v-if="$store.getters.getAddress">
            <h2>Create your own NFT</h2>
            <label class="mt-4">Title*</label>
            <b-form-input v-model="title" type="search" placeholder="Enter name of the art..." />
            <label class="mt-5">Image*</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;">
                <FileUploader class="file-uploader" pass-file-to-event="CreatePage.receiveFile" />
            </div>
            <label class="mt-5">Description</label>
            <div class="form-group">
                <b-form-textarea
                    id="description"
                    placeholder="Enter a detailed description..."
                    v-model="description"
                    rows="3"
                />
                <b-icon v-if="description" font-scale="1.5" class="icon" icon="x" @click="clearTextArea"></b-icon>
            </div>
            <label class="mt-5">Labels</label>
            <div style="width:100%">
                <div style="display:inline-block" v-for="(item, index) in labels" :key="index">
                    <button @click="clicked(index)" class="label-selection-button" 
                    :class="{'clicked': labelState[index]}">{{labels[index]}}</button>
                </div>
            </div>
            <div class="mt-5">
                <b-form-checkbox style="display:inline"
                    >Image On-chain Storage<b-badge pill variant="info" class="ml-2"
                        >Free for limited time</b-badge
                    ></b-form-checkbox
                >
                <b-button variant="primary" class="create-btn" @click="createNft">Create</b-button>
                <b-button variant="outline-primary" class="create-btn mr-2" @click="ucVisible = true"
                    >Add unlockable content</b-button
                >
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
                            $store.dispatch('notifyWIP')
                            ucVisible = false
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
import { eventBus } from '../main'
import axios from 'axios'
import { Notification } from 'element-ui'

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import FileUploader from '../components/FileUploader.vue'
import ConnectWallet from '../components/ConnectWallet.vue'
export default {
    name: 'CreatePage',
    components: {
        Navbar,
        Footer,
        FileUploader,
        ConnectWallet,
    },
    data: () => ({
        title: '',
        description: '',
        ucDescription: '',
        imageData: undefined,
        ucVisible: false,
        ucImageData: undefined,
        labels: ['Animal', 'Nature', 'Landscape', 'Painting'],
        labelState: [],
    }),

    beforeMount() {
        this.labels.forEach((item, index) => this.$set(this.labelState, index, false))
    },

    methods: {
        createNft() {
            if (!this.imageData || !this.title || this.title.replace(/\s+/g, '').length == 0) {
                Notification.closeAll()
                this.$notify.error({
                    title: 'Missing Required Information',
                    message: 'Please fill in all fields marked *.',
                    duration: 3000,
                })
                return
            }
            this.$notify({
                title: 'Notification',
                dangerouslyUseHTMLString: true,
                message:
                    '<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">NFT Minting In Progress</div></div>',
                duration: 0,
            })
            const fd = new FormData()
            fd.append('file', this.imageData)
            fd.append('address', this.$store.getters.getAddress)
            fd.append('title', this.title)
            fd.append('description', this.description)
            const selectedLabels = this.labels.filter((l, i) => this.labelState[i]==true)
            fd.append('labels', JSON.stringify(selectedLabels))
            axios
                .post(this.$store.getters.getApiUrl + '/create-nft', fd)
                .then((res) => {
                    if (res.status == 200) {
                        Notification.closeAll()
                        this.$notify({
                            title: 'Congrats',
                            message: 'NFT Created Successfully',
                            duration: 3000,
                            type: 'success',
                        })
                    }
                    eventBus.$emit('CreatePage.nftCreated')
                    this.title = ''
                    this.description = ''
                })
                .catch((err) => {
                    console.log(err)
                    Notification.closeAll()
                    if (err.response.status == 409) {
                        this.$notify.error({
                            title: 'Error',
                            message: 'Conflicting Title: Please try another title for your NFT.',
                            duration: 3000,
                        })
                    } else {
                        this.$notify.error({
                            title: 'Error',
                            message: 'NFT Creation Failed',
                            duration: 3000,
                        })
                    }
                })
        },

        clearTextArea() {
            this.description = ''
        },

        clicked(index) {
            this.$set(this.labelState, index, !this.labelState[index]) // change label state on click
        }
    },
    async mounted() {
        this.$store.dispatch('connectWallet')
        eventBus.$on('CreatePage.receiveFile', (imageData) => {
            this.imageData = imageData
        })
        eventBus.$on('CreatePage.receiveUCFile', (imageData) => {
            this.ucImageData = imageData
        })
    },
    beforeDestroy() {
        eventBus.$off('CreatePage.receiveFile')
    },
}
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
