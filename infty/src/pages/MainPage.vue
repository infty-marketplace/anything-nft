<template>
    <div class="flex-wrapper">
        <Navbar />
        <div class="main">
            <img class="banner" :src="banner" />
            <p class="banner-text mt-5">
                Create, collect, and trade any craft as NFT.
            </p>
            <div class="btn-bg bg-1">
                <div class="btn btn-2">
                    <router-link to="/marketplace"><button>Explore</button></router-link>
                </div>
                <div class="btn btn-1">
                    <router-link to="/mine/create"><button>Create</button></router-link>
                </div>
            </div>
            <span class="shape"></span>
            <span class="shape"></span>
            <span class="shape"></span>
            
            <div class="about-us" data-sal='fade' data-sal-delay="200" data-sal-duration="800">
                <span class="about-shape"></span>
                <div class="sm:w-2/3 sm:mr-10">
                    <div class="about-text">
                        <h2 class="font-bold stress">About <span class="font-bold stress">Our Team</span></h2>
                        <p class="text-gray-700">
                            At Infty, we work on this open-source community-driven NFT trading platform. Our core
                            members come from a variety of fields in computer science, such as software engineers at
                            giant tech comapnies, and graduate students at top universities. We came to know each other
                            because we are all graduates of University of Toronto, but more importantly, we are a group
                            of blockchain enthusiasts.
                        </p>
                    </div>
                </div>
                <img class="team" :src="team" />
            </div>
        </div>
        <svg class="editorial" viewBox="0 24 150 28" preserveAspectRatio="none">
            <defs>
                <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
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
import sal from 'sal.js'

export default {
    name: "App",
    components: {
        Navbar,
        Footer,
    },
    data: () => ({
        banner: require("../assets/imgs/banner.svg"),
        team: require("../assets/imgs/aboutUs.svg"),
    }),
    created() {
        sal();
    }
};
</script>

<style scoped>
@import '../../node_modules/sal.js/dist/sal.css';
.main {
    text-align: center;
    overflow: hidden;
}
.banner {
    margin-top: 150px;
    width: 40%;
}
@media screen and (max-width: 1500px) {
    .banner {
        margin-top: 150px;
        width: 50%;
    }
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

.shape:nth-of-type(1) {
    width: 20vw;
    height: 20vw;
    background: #e5e5e5;
    position: absolute;
    left: 10px;
    top: 130px;
    opacity: 0;
    z-index: -1;
    animation: wave 6s ease-in-out infinite;
}

.shape:nth-of-type(2) {
    width: 60vw;
    height: 40vw;
    left: 20%;
    top: 250px;
    background: #95d0f9;
    position: absolute;
    opacity: 0.3;
    z-index: -1;
    animation: wave 12s ease-in-out infinite;
}

.shape:nth-of-type(3) {
    width: 20vw;
    height: 20vw;
    background: #95d0f9;
    position: absolute;
    right: 0;
    top: calc(70vh);
    opacity: 0;
    z-index: -1;
    animation: wave 15s ease-in-out infinite;
}
.about-shape {
    width: 125%;
    height: 100%;
    background: #e5e5e5;
    position: absolute;
    left: -30%;
    top: 0%;
    opacity: 0.3;
    z-index: -1;
    animation: wave 10s ease-in-out infinite;
}

.text-bg {
    width: 130%;
    height: 80%;
    background: #e5e5e5;
    position: absolute;
    left: -30%;
    top: 0%;
    opacity: 0.3;
    z-index: -1;
    animation: wave 10s ease-in-out infinite;
}

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

.btn-bg.bg-1 .btn-2 button {
    /* color: #95d0f9;
  background: transparent; */
    background: #95d0f9;
    color: #ffffff;
    border: 3px solid #95d0f9;
    border-radius: 5px;
    -webkit-transition: all 0.5s ease;
    transition: all 0.5s ease;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
}
body .btn-bg.bg-1 .btn-2 button a {
    color: #95d0f9;
}
body .btn-bg.bg-1 .btn-2 button:hover {
    /* background: #95d0f9;
  color: #ffffff; */
    background: #55b8ff;
    border: 3px solid #95d0f9;
    -webkit-transition: all 0.35s ease;
    transition: all 0.35s ease;
}
.btn-bg.bg-1 .btn-1 button:hover > a {
    color: #6ab1c9;
    -webkit-transition: all 0.35s ease;
    transition: all 0.35s ease;
}
.btn-bg.bg-1 .btn-2 button:active {
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
.about-us {
    position: relative;
    text-align: left;
    display: flex;
    padding: 5%;
    margin-top: 10%;
}
.team {
    height: 40%;
    width: 40%;
}
.font-bold {
    font-weight: 600;
}
.font-bold > .stress {
    font-weight: 900;
    color: #2f7df6;
}
.about-us p {
    margin-top: 2em;
    font-size: 1.3em;
    font-weight: 400;
    color: #3f3e54;
}

</style>
