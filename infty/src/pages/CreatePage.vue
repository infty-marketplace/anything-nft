<template>
    <div class='flex-wrapper main'>
        <Navbar />
        <div class='content mt-5'>
            <h2>Create your own NFT</h2>
            <label class='mt-4'>Title*</label>
            <b-form-input placeholder="Enter name of the art..."/>
            <label class='mt-5'>Image*</label>
            <div style="display:flex;min-width:100%;justify-content:space-around;"><FileUploader/></div>
            <label class='mt-5'>Description</label>
            <b-form-textarea
                id="description"
                placeholder="Enter a detailed description..."
                rows="3"
            ></b-form-textarea>
            <div class='mt-5'>
                <b-form-checkbox style="display:inline">Image On-chain Storage<b-badge pill variant='info' class='ml-2'>Free for limited time</b-badge></b-form-checkbox>
                <b-button variant="primary" class='create-btn'>Create</b-button>
            </div>
            
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import FileUploader from '../components/FileUploader.vue'
export default {
  name: 'CreatePage',
  components: {
      Navbar,
      Footer,
      FileUploader
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