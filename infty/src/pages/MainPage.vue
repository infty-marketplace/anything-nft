<template>
    <div class="flex-wrapper">
        <div class="fluent-warning">
            <p v-if="!isFluent">
                You need to install
                <a href="https://fluentwallet.com/">Fluent wallet</a> to access this
                site
            </p>
        </div>
        <Navbar/>
        <div class="main">
            <img :src="banner" class="banner"/>
            <p class="banner-text mt-5">
                {{ $t("banner") }}
            </p>
            <div class="btn-bg bg-1">
                <div class="btn btn-2">
                    <router-link to="/marketplace"
                    >
                        <button>{{ $t("explore") }}</button>
                    </router-link
                    >
                </div>
                <div class="btn btn-1">
                    <router-link to="/mine/create"
                    >
                        <button>{{ $t("create") }}</button>
                    </router-link
                    >
                </div>
            </div>
            <span class="shape"></span>
            <span class="shape"></span>
            <span class="shape"></span>

            <div
                    class="about-us"
                    data-sal="fade"
                    data-sal-delay="200"
                    data-sal-duration="800"
            >
                <span class="about-shape"></span>
                <div class="sm:w-2/3 sm:mr-10">
                    <div class="about-text">
                        <h2 class="font-bold stress">
                            {{ $t("about") }}
                            <span class="font-bold stress">{{ $t("our_team") }}</span>
                        </h2>
                        <p class="text-gray-700">
                            {{ $t("aboutUsContent") }}
                        </p>
                    </div>
                </div>
                <img :src="team" class="team"/>
            </div>
        </div>
        <svg class="editorial" preserveAspectRatio="none" viewBox="0 24 150 28">
            <defs>
                <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                />
            </defs>
            <g class="parallax">
                <use fill="#95d0f9" x="50" xlink:href="#gentle-wave" y="2"/>
                <use fill="#379eff" x="50" xlink:href="#gentle-wave" y="6"/>
                <use fill="#121212" x="50" xlink:href="#gentle-wave" y="8"/>
            </g>
        </svg>

        <Footer/>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import sal from "sal.js";

export default {
    name: "App",
    components: {
        Navbar,
        Footer,
    },
    data: () => ({
        banner: require("../assets/imgs/banner.svg"),
        team: require("../assets/imgs/aboutUs.svg"),
        isFluent: false,
    }),
    mounted() {
        sal();
        this.checkFluentWallet();
    },
    methods: {
        checkFluentWallet() {
            if (window.fluent) {
                this.isFluent = true;
            } else {
                this.isFluent = false;
            }
        },
    },
};
</script>

<style scoped>
@import "../../node_modules/sal.js/dist/sal.css";

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

.fluent-warning {
    justify-content: center;
    align-items: center;
}

@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
.fluent-warning p {
    font-family: "Montserrat", sans-serif;
    background-color: #f45050;
    color: #fff;
    text-align: center;
    font-weight: 500;
    margin: 0;
}
</style>
