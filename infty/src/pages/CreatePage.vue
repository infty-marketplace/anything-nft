<template>
    <div class='flex-wrapper main'>
        <Navbar />
        <div class='content mt-5 mb-5'>
            <h2>Create your own NFT</h2>
            <label class='mt-4'>Title*</label>
            <b-form-input v-model="title" placeholder="Enter name of the art..."/>
            <label class='mt-5'>Image*</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;"><FileUploader/></div>
            <label class='mt-5'>Description</label>
            <b-form-textarea
                id="description"
                placeholder="Enter a detailed description..."
                v-model='description'
                rows="3"
            ></b-form-textarea>
            <div class='mt-5'>
                <b-form-checkbox style="display:inline">Image On-chain Storage<b-badge pill variant='info' class='ml-2'>Free for limited time</b-badge></b-form-checkbox>
                <b-button variant="primary" class='create-btn' @click='createNft'>Create</b-button>
            </div>
            
        </div>
        <Footer />
    </div>
</template>

<script>
import { eventBus } from "../main"
import axios from "axios"

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import FileUploader from '../components/FileUploader.vue'
export default {
  name: 'CreatePage',
  components: {
      Navbar,
      Footer,
      FileUploader,
  },
  data: () => ({
      title: "",
      description: "",
      imageData: undefined,
  }),
  methods: {
      createNft(){
          console.log(1)
          const fd = new FormData();
          fd.append('file', this.imageData);
          fd.append('address', this.$store.getters.getAccount)
          fd.append('title', this.title)
          fd.append('description', this.description)
          

          axios.post("http://localhost:3001/api/create-nft", fd)
            .then(res => {
                console.log(res)
            })
      },
  },
  created() {
      eventBus.$on("FileUploader.imageUploaded", (imageData) => {
        this.imageData = imageData;
      })
  },
  beforeDestroy() {
      eventBus.$off("FileUploader.imageUploaded")
  }
}
</script>

<style scoped>
.content {
    min-width: 60vw;
    margin: 0px auto;
}
.main {
    background-color: #f8f8f9;
}
.create-btn {
    float: right;
}
</style>