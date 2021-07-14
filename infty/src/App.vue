<template>
  <div id="app">
    <Navbar />
    <img :src="banner" />
    <p class="banner-text">Create, buy, and sell any craft as NFT.</p>
    <b-button variant="primary">Explore</b-button>
    <b-button variant="outline-primary ml-2">Create</b-button>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'App',
  components: {
    Navbar
  },
  data: () => ({
    banner: require('./assets/imgs/banner.svg')
  }),
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style scoped>
.banner-text {
  font-size: 2rem;
  font-weight: 1000;
}
</style>
