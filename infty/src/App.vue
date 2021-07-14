<template>
  <div id="app">
    <Navbar />
    <img class='banner' :src="banner" />
    <p class="banner-text">Create, collect, and trade any craft as NFT.</p>
    <b-button variant="primary">Explore</b-button>
    <b-button variant="outline-primary ml-4">Create</b-button>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  data: () => ({
    banner: require("./assets/imgs/banner.svg"),
  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100vw;
}
</style>

<style scoped>
.banner {
  margin-top: 150px;
}
.banner-text {
  font-size: 2rem;
  font-weight: 1000;
}
</style>
