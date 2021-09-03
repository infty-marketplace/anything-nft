<template>
  <div class="flex-wrapper">
    <Navbar />
    <div class="main">
      <img class="banner" :src="banner" />
      <p class="banner-text mt-5">
        Create, collect, and trade any craft as NFT.
      </p>
      <!-- <b-button variant="primary" href="/marketplace">Explore</b-button>
      <b-button variant="outline-primary ml-4" href="/mine/create"
        >Create</b-button
      > -->
      <div class="btn-bg bg-1">
        <div class="btn btn-1">
          <router-link to="/marketplace"><button>Explore</button></router-link>
        </div>
        <div class="btn btn-1">
          <router-link to="/mine/create"><button>Create</button></router-link>
        </div>
      </div>
      <div class="row-outer">
        <div class="wrapper">
          <span class="shape"></span>
          <span class="shape"></span>
          <span class="shape"></span>
          <span class="shape"></span>
          <span class="shape"></span>
        </div>
      </div>
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
        <use xlink:href="#gentle-wave" x="50" y="6" fill="#379eff" />
        <use xlink:href="#gentle-wave" x="50" y="8" fill="#121212" />
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
  overflow: hidden;
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
  /* opacity: 0.5; */
}
.parallax > use {
  animation: move-forever 12s linear infinite;
}
.parallax > use:nth-child(1) {
  /* animation: move-forever -2s; */
  animation-delay: 2s;
  opacity: 0.4;
  /* animation-delay: -2s; */
}
.parallax > use:nth-child(2) {
  animation-delay: -2s;
  animation-duration: 5s;
  opacity: 0.4;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 3s;
}

/* @keyframes move-forever {
  0% {
    transform: translate(-90px, 0%);
  }
  100% {
    transform: translate(85px, 0%);
  }
} */

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50vh;
  position: absolute;
  /* overflow: hidden; */
}
.shape:nth-of-type(1) {
  width: 800px;
  height: 800px;
  background: #95d0f9;
  position: absolute;
  top: -1200px;
  left: -400px;
  opacity: 0.2;
  z-index: -1;
  animation: wave 6s ease-in-out infinite;
}
/* .shape:nth-of-type(2) {
  width: 800px;
  height: 800px;
  background: #7998ff;
  position: absolute;
  top: -200px;
  left: -400px;
  opacity: 0.2;
  z-index: -1;
  animation: wave 5s ease-in-out infinite;
} */
.shape:nth-of-type(3) {
  width: 750px;
  height: 700px;
  background: #95d0f9;
  position: absolute;
  bottom: 400px;
  left: 30%;
  right: -10%;
  opacity: 0.3;
  z-index: -1;
  animation: wave 12s ease-in-out infinite;
}
/* .shape:nth-of-type(4) {
  width: 250px;
  height: 250px;
  background: #fbff0d;
  position: absolute;
  bottom: -120px;
  left: 40%;
  opacity: 0.4;
  z-index: -1;
  animation: wave 6s ease-in-out infinite;
} */
.shape:nth-of-type(5) {
  width: 600px;
  height: 500px;
  background: #e5e5e5;
  position: absolute;
  top: -1200px;
  /* left: 80%; */
  right: 0%;
  opacity: 0.6;
  z-index: -1;
  animation: wave 15s ease-in-out infinite;
}
/* .shape:nth-of-type(6) {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 40%;
  right: 25%;
  opacity: 0.5;
  z-index: -1;
  transform: rotate(90deg);
  animation: wave 15s ease-in-out infinite;
} */
@keyframes wave {
  0%,
  100% {
    border-radius: 66% 34% 37% 63% / 57% 31% 69% 43%;
  }
  50% {
    border-radius: 26% 74% 51% 49% / 22% 53% 47% 78%;
  }
}

.btn-bg.bg-1 .btn-1 button {
  color: #95d0f9;
  background: transparent;
  border: 3px solid #95d0f9;
  border-radius: 5px;
  -webkit-transition: all 0.5s ease;
  transition: all 0.5s ease;
  -webkit-transform: translate(0, 0);
  transform: translate(0, 0);
}
body .btn-bg.bg-1 .btn-1 button a {
  color: #95d0f9;
}
body .btn-bg.bg-1 .btn-1 button:hover {
  background: #95d0f9;
  color: #ffffff;
  border: 3px solid #95d0f9;
  -webkit-transition: all 0.35s ease;
  transition: all 0.35s ease;
}
.btn-bg.bg-1 .btn-1 button:hover > a {
  color: #6ab1c9;
  -webkit-transition: all 0.35s ease;
  transition: all 0.35s ease;
}
.btn-bg.bg-1 .btn-1 button:active {
  -webkit-transform: translate(5px, 5px);
  transform: translate(5px, 5px);
}

.btn {
  margin: 0 auto 30px auto;
  /* display: block; */
}

button {
  cursor: pointer;
  overflow: hidden;
  outline: none;
  color: #fff;
  position: relative;
  letter-spacing: 0.1em;
  font-weight: 400;
  padding: 1rem 3rem 1rem 3rem;
  text-transform: uppercase;
  font-family: "Lato";
  font-size: 1.5em;
}
button a {
  text-decoration: none;
}
</style>
