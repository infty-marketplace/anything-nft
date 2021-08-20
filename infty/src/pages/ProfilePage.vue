<template>
    <div class='flex-wrapper main'>
        <Navbar />
        <div class='profile-pic-container'>
            <img :src="profile_picture" class='profile-pic' />
            <h2 class='mt-2'>{{first_name}} {{last_name}}</h2>
            <a target="_blank" :href="`https://confluxscan.io/address/${this.$route.params.address}`"><p class='mt-2' >{{ this.$route.params.address }}</p></a>
        </div>
        
        <div class='content' v-if='$store.getters.getAddress'>
            <div class='padding-border'></div>
            <el-row class="tac">
            <el-col :span="4">
                <el-menu
                @select='handleSelect'
                default-active="3"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>More</span>
                    </template>
                    <el-menu-item-group>
                    <template slot="title">分组一</template>
                    <el-menu-item index="1-1">选项1</el-menu-item>
                    <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-notebook-2"></i>
                    <span slot="title">Transaction History</span>
                </el-menu-item>
                <!-- <el-menu-item index="3" disabled>
                    <i class="el-icon-document"></i>
                    <span slot="title">导航三</span>
                </el-menu-item> -->
                <el-menu-item index="3">
                    <i class="el-icon-setting"></i>
                    <span slot="title">Settings</span>
                </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span='20'>
                <div v-if='selectedIndex == 1-1'>1</div>
                <div v-if='selectedIndex == 2'>2</div>
                <div v-if='selectedIndex == 3'>
                    <el-card class="box-card m-5">
                    <div slot="header" class="clearfix">
                        <span>Settings</span>
                        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    </div>
                    <p>Your Wallet Address</p>
                    <el-input :placeholder="this.$store.getters.getAddress" :disabled='true'>
                        <el-button slot='append'>Copy</el-button>
                    </el-input>
                    <p class='mt-3'>Info</p>
                    <el-row>
                        <el-col class='' :span="12"><el-input placeholder="First Name"/></el-col>
                        <el-col class='pl-3' :span="10"><el-input placeholder="Last Name"/></el-col>
                        <el-col class='pr-3' :span='2'><i style='margin-top:10px;float:right' class="el-icon-edit"></i></el-col>
                    </el-row>
                    <p class='mt-3'>Bio</p>
                    <el-row class='mb-3'>
                        <el-col class='' :span="22"><el-input
                            type="textarea"
                            placeholder="请输入内容"
                            v-model="textarea"
                            maxlength="300"
                            show-word-limit
                            >
                            </el-input></el-col>
                        <el-col class='pr-3' :span='2'><i style='margin-top:10px;float:right' class="el-icon-edit"></i></el-col>
                    </el-row>
                    </el-card>
                    <el-switch
                    class='ml-5'
                    style="display: block"
                    v-model="modeSwitch"
                    active-color="#ef8e38"
                    inactive-color="rgb(80,80,46)"
                    active-text="Day Mode"
                    inactive-text="Night Mode">
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
import { eventBus } from "../main"
import axios from "axios"

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
// import FileUploader from '../components/FileUploader.vue'
import ConnectWallet from '../components/ConnectWallet.vue'
export default {
  name: 'ProfilePage',
  components: {
      Navbar,
      Footer,
    //   FileUploader,
      ConnectWallet,

  },
  data: () => ({
      profile_picture: undefined,
      selectedIndex: 3,
      modeSwitch: true, 
  }),
  methods: {
      handleSelect(i){
          this.selectedIndex = i;
      },
      createNft(){
          const fd = new FormData();
          fd.append('file', this.imageData);
          fd.append('address', this.$store.getters.getAddress)
          fd.append('title', this.title)
          fd.append('description', this.description)

          axios.post(this.$store.getters.getApiUrl+"/create-nft", fd)
            .then(res => {
                if (res.status == 200) {
                    this.$bvToast.toast("NFT Created", {
                        title: "Notification",
                        autoHideDelay: 3000
                    })
                }
                eventBus.$emit("CreatePage.nftCreated");
                this.title = "";
                this.description = "";
            }).catch(err => {
                console.log(err)
                this.$bvToast.toast("NFT Creation Failed", {
                    title: "Error",
                    autoHideDelay: 3000
                })
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
      const profile = await this.$store.getters.getProfile(this.$route.params.address)
      this.profile_picture = profile.profile_picture
      this.first_name = profile.first_name
      this.last_name = profile.last_name
  },
  beforeDestroy() {
      eventBus.$off("CreatePage.receiveFile")
  }
}
</script>

<style scoped>
.content {
    width: 100%;
    margin-top:200px;
    background: white;
    height: 1000px;
}
.main {
    background-color: #f8f8f9;
}
.create-btn {
    float: right;
}
.profile-pic {
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
    z-index:1;
}
.padding-border {
    height: 250px;
    border-bottom: solid rgb(195, 236, 255) 5px;
}
.el-menu, .tac {
    height: 100%;
}
.el-col {
    height: calc(100% - 250px);
}
</style>