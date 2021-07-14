<template>
  <div id="app">
    <Navbar />
    <img :src="banner" />
    <p>Create, buy, and sell your craft as NFT.</p>
    <b-button>Button</b-button>
    <b-button>Button</b-button>
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
