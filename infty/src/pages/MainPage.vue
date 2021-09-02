<template>
  <div class="flex-wrapper">
    <Navbar />
    <div class="main">
      <img class="banner" :src="banner" />
      <p class="banner-text mt-5">
        Create, collect, and trade any craft as NFT.
      </p>
      <b-button variant="primary" href="/marketplace">Explore</b-button>
      <b-button variant="outline-primary ml-4" href="/mine/create"
        >Create</b-button
      >
    </div>
    <svg class="editorial" viewBox="0 24 150 28" preserveAspectRatio="none">
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <use xlink:href="#gentle-wave" x="50" y="2" fill="#95d0f9" />
        <use xlink:href="#gentle-wave" x="50" y="6" fill="#547186" />
        <use xlink:href="#gentle-wave" x="50" y="12" fill="#121212" />
      </g>
    </svg>

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
.main {
  text-align: center;
  margin-bottom: 5%;
}
.banner {
  margin-top: 150px;
}
.banner-text {
  font-size: 2rem;
  font-weight: 1000;
}
.editorial {
  display: block;
  width: 100%;
  height: 10em;
  max-height: 100vh;
  margin: 0;
}
.parallax > use {
  animation: move-forever 12s linear infinite;
}
.parallax > use:nth-child(1) {
  /* animation: move-forever -2s; */
  animation-delay: 2s;
  /* animation-delay: -2s; */
}
.parallax > use:nth-child(2) {
  animation-delay: -2s;
  animation-duration: 5s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 3s;
}

@keyframes move-forever {
  0% {
    transform: translate(-90px, 0%);
  }
  100% {
    transform: translate(85px, 0%);
  }
}
</style>
