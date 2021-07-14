<template>
  <div>
    <Navbar />
    <img class='banner' :src="banner" />
    <p class="banner-text mt-5">Create, collect, and trade any craft as NFT.</p>
    <b-button variant="primary" href="/marketplace">Explore</b-button>
    <b-button variant="outline-primary ml-4" href="/mine/create">Create</b-button>
    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  data: () => ({
    banner: require("../assets/imgs/banner.svg"),
  }),
};
</script>

<style scoped>
.banner {
  margin-top: 150px;
}
.banner-text {
  font-size: 2rem;
  font-weight: 1000;
}
</style>
