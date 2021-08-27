<template>
    <div class='flex-wrapper main'>
        <Navbar />
        <div class='content mt-5 mb-5' v-if='$store.getters.getAddress'>
            <h2>Create your own NFT</h2>
            <label class='mt-4'>Title*</label>
            <b-form-input v-model="title" type="search" placeholder="Enter name of the art..."/>
            <label class='mt-5'>Image*</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;">
                <FileUploader class='file-uploader' pass-file-to-event="CreatePage.receiveFile"/>
            </div>
            <label class='mt-5'>Description</label>
            <div class="form-group">
            <b-form-textarea
                id="description"
                placeholder="Enter a detailed description..."
                v-model='description'
                rows="3"
            />
            <b-icon v-if='description' font-scale="1.5" class="icon" icon="x" @click="clearTextArea"></b-icon>
            </div>
            <div class='mt-5'>
                <b-form-checkbox style="display:inline">Image On-chain Storage<b-badge pill variant='info' class='ml-2'>Free for limited time</b-badge></b-form-checkbox>
                <b-button variant="primary" class='create-btn' @click='createNft'>Create</b-button>
                <b-button variant="outline-primary" class='create-btn mr-2' @click='ucVisible=true'>Add unlockable content</b-button>
            </div>
            <el-dialog
            title="Unlockable Content"
            :visible.sync="ucVisible"
            width="60%"
            :before-close="(d)=>d()">
            <label>Image</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;">
                <FileUploader class='uc-file-uploader' id='uc-file-uploader' pass-file-to-event="CreatePage.receiveUCFile"/>
            </div>
            <label class='mt-4'>Text</label>
            <div class="form-group">
            <b-form-textarea
                id="description"
                placeholder="Enter a detailed description..."
                v-model='ucDescription'
                rows="3"
            />
            <b-icon v-if='ucDescription' font-scale="1.5" class="icon" icon="x" @click="ucDescription=''"></b-icon>
            
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ucVisible = false">Cancel</el-button>
                <el-button type="primary" @click="$store.dispatch('notifyWIP');ucVisible = false">Confirm</el-button>
            </span>
            </el-dialog>
        </div>
        <ConnectWallet v-else />
        <Footer />
    </div>
</template>

<script>
import { eventBus } from "../main"
import axios from "axios"
import { Notification } from 'element-ui';

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
      ConnectWallet
  },
  data: () => ({
      title: "",
      description: "",
      ucDescription: "",
      imageData: undefined,
      ucVisible: false,
      ucImageData: undefined,
  }),
  methods: {
      createNft(){
          this.$notify({
              title: 'Notification',
              message: 'NFT Minting In Progress',
              duration: 0
          })
          const fd = new FormData();
          fd.append('file', this.imageData);
          fd.append('address', this.$store.getters.getAddress)
          fd.append('title', this.title)
          fd.append('description', this.description)

          axios.post(this.$store.getters.getApiUrl+"/create-nft", fd)
            .then(res => {
                if (res.status == 200) {
                    Notification.closeAll()
                    this.$notify({
                        title: "Congrats",
                        message: "NFT Created Successfully",
                        duration: 3000,
                        type: 'success'
                    })
                }
                eventBus.$emit("CreatePage.nftCreated");
                this.title = "";
                this.description = "";
            }).catch(err => {
                console.log(err)
                Notification.closeAll()
                console.log(err)
                if (err.response.status == 409) {
                   this.$notify.error({
                        title: "Error",
                        message: "Conflicting Title: Please try another title for your NFT.",
                        duration: 3000
                    }) 
                } else {
                    this.$notify.error({
                        title: "Error",
                        message: "NFT Creation Failed",
                        duration: 3000
                    })
                }
                
            })
      },

      clearTextArea(){
          this.description = "";
      }
  },
  async mounted() {
      this.$store.dispatch("connectWallet")
      eventBus.$on("CreatePage.receiveFile", (imageData) => {
        this.imageData = imageData;
      })
      eventBus.$on("CreatePage.receiveUCFile", (imageData) => {
        this.ucImageData = imageData;
      })
  },
  beforeDestroy() {
      eventBus.$off("CreatePage.receiveFile")
  }
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
    position:absolute;
    bottom: 0;
    left: 97%;
    cursor: pointer;
}

</style>
<style>
#uc-file-uploader svg {
    display: none;
}
</style>