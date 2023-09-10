<template>
    <footer>
        <div class="content">
            <div class="top">
                <router-link to="/"
                >
                    <div class="logo-details">
                        <img alt="logo" class="logo-img" src="@/assets/imgs/infty-logo.png"/></div
                    >
                </router-link>
                <div class="media-icons">
                    <a href="https://github.com/infty-marketplace/anything-nft" target="_blank"
                    >
                        <b-icon icon="github"></b-icon>
                    </a>
                </div>
            </div>
            <div class="link-boxes">
                <ul class="box">
                    <li class="link_name">{{ $t("marketplace") }}</li>
                    <li><a href="/marketplace">{{ $t("footer.allNFTs") }}</a></li>
                    <li v-for="category in categories" :key="category">
                        <router-link :to="`/marketplace?category=${category}`">
                            {{ category }}
                        </router-link>
                    </li>

                </ul>
                <ul class="box">
                    <li class="link_name">{{ $t("cutoffx") }}</li>
                    <li><a href="mailto:contact@whileone.solutions">{{ $t("footer.contactUs") }}</a></li>
                    <li><a href="/">{{ $t("footer.aboutUs") }}</a></li>
                </ul>
                <ul class="box input-box">
                    <li class="link_name">{{ $t("subscribe") }}</li>
                    <li><input type="text" v-bind:placeholder="$t('footer.enterEmail')"/></li>
                    <li @click="subscribe"><input type="button" v-bind:value="$t('subscribe')"/></li>
                    <el-switch
                            v-model="$i18n.locale"
                            active-color="#13ce66"
                            active-text="CN"
                            active-value="cn"
                            class="mt-3"
                            inactive-color="#3faac1ba"
                            inactive-text="EN"
                            inactive-value="en"
                            style="display: block;float: right;margin-right:-55px;"
                    >
                    </el-switch>
                </ul>
            </div>
        </div>
        <div class="bottom-details">
            <div class="bottom_text">
                <span class="copyright_text">{{ $t("copyright") }} &nbsp; &nbsp; {{ $t("rights") }}</span>
                <span class="policy_terms">
                    <a href="#">{{ $t("privacy") }}</a>
                    <a href="#">{{ $t("terms") }}</a>
                </span>
            </div>
        </div>
    </footer>
</template>

<script>
import constant from "../constants/index.js";
import { eventBus } from '../main.js';
export default {
    name: "Navbar",
    data() { return { categories: constant.LABELS,};},
    methods: {
        subscribe() {
            this.$notify({
                title: "Congrats",
                message: "You are now subscribed to receive the latest and greatest news!",
                duration: 5000,
                type: "success",
            });
        }
    },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
}

footer {
    /* position: fixed; */
    background: rgb(18, 18, 18);
    width: 100%;
    padding-top: 5px;
    /* margin-top: 5%; */
    /* padding-bottom: 30px; */
    bottom: 0;
    left: 0;
}

footer::before {
    content: '';
    position: absolute;
    left: 0;
    top: 100px;
    height: 1px;
    width: 100%;
    /* background: #afafb6; */
}

footer .content {
    /* max-width: 1250px; */
    margin-left: 10%;
    margin-right: 11%;
    margin-top: 30px;
    margin-bottom: 40px;
}

footer .content .box {
    padding-left: 0;
}

footer .content .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 50px;
}

.content .top .logo-details {
    color: #fff;
    font-size: 30px;
}

.content .top .media-icons {
    display: flex;
}

.content .top .media-icons a {
    height: 50px;
    width: 50px;
    margin: 0 8px;
    border-radius: 50%;
    text-align: center;
    line-height: 52px;
    color: #fff;
    font-size: 30px;
    text-decoration: none;
    transition: all 0.4s ease;
}

.logo-img {
    cursor: pointer;
    width: 70px;
}

.top .media-icons a:nth-child(1) {
    background: rgb(47, 125, 246);
}

.top .media-icons a:nth-child(1):hover {
    color: rgb(47, 125, 246);
    background: #fff;
}

.top .media-icons a:nth-child(2) {
    background: #1da1f2;
}

.top .media-icons a:nth-child(2):hover {
    color: #1da1f2;
    background: #fff;
}

.top .media-icons a:nth-child(3) {
    background: #e1306c;
}

.top .media-icons a:nth-child(3):hover {
    color: #e1306c;
    background: #fff;
}

.top .media-icons a:nth-child(4) {
    background: #0077b5;
}

.top .media-icons a:nth-child(4):hover {
    color: #0077b5;
    background: #fff;
}

.top .media-icons a:nth-child(5) {
    background: #ff0000;
}

.top .media-icons a:nth-child(5):hover {
    color: #ff0000;
    background: #fff;
}

footer .content .link-boxes {
    width: 100%;
    display: flex;
    /* justify-content: space-between; */
    /* justify-content: flex-start; */
    text-align: left;
}

footer .content .link-boxes .box {
    width: calc(100% / 5 - 10px);
}

.content .link-boxes .box .link_name {
    color: #fff;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 10px;
    position: relative;
}

.link-boxes .box .link_name::before {
    content: '';
    position: absolute;
    /* left: 0; */
    bottom: -2px;
    height: 2px;
    width: 35px;
    background: #fff;
}

.content .link-boxes .box li {
    margin: 6px 0;
    list-style: none;
}

.content .link-boxes .box li a {
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    text-decoration: none;
    opacity: 0.8;
    transition: all 0.4s ease;
}

.content .link-boxes .box li a:hover {
    opacity: 1;
    /* text-decoration: underline; */
    color: #0088a9;
}

.content .link-boxes .input-box {
    margin-right: 55px;
}

.link-boxes .input-box input {
    height: 40px;
    width: calc(100% + 55px);
    outline: none;
    border: 2px solid #afafb6;
    background: #edf0f1;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 15px;
    color: rgb(18, 18, 18);
    margin-top: 5px;
}

.link-boxes .input-box input::placeholder {
    color: #737377;
    font-size: 16px;
}

.link-boxes .input-box input[type='button'] {
    background: rgb(47, 125, 246);
    color: #fff;
    border: none;
    font-size: 18px;
    font-weight: 500;
    margin: 4px 0;
    opacity: 0.8;
    cursor: pointer;
    transition: all 0.4s ease;
}

.input-box input[type='button']:hover {
    opacity: 1;
}

footer .bottom-details {
    width: 100%;
    background: black;
    padding: 30px 10%;
}

footer .bottom-details .bottom_text {
    /* max-width: 1250px; */
    /* margin-right: -20; */
    margin: 0;
    padding-top: 40px;
    padding-bottom: 40px;
    display: flex;
    justify-content: space-between;
}

.bottom-details .bottom_text span,
.bottom-details .bottom_text a {
    font-size: 14px;
    font-weight: 300;
    color: #fff;
    opacity: 0.8;
    text-decoration: none;
}

.bottom-details .bottom_text a:hover {
    opacity: 1;
    text-decoration: underline;
}

.bottom-details .bottom_text a {
    margin-right: 10px;
}

@media (max-width: 900px) {
    footer .content .link-boxes {
        flex-wrap: wrap;
    }

    footer .content .link-boxes .input-box {
        width: 40%;
        margin-top: 10px;
    }
}

@media (max-width: 700px) {
    footer {
        position: relative;
    }

    .content .top .logo-details {
        font-size: 26px;
    }

    .content .top .media-icons a {
        height: 35px;
        width: 35px;
        font-size: 14px;
        line-height: 35px;
    }

    footer .content .link-boxes .box {
        width: calc(100% / 3 - 10px);
    }

    footer .content .link-boxes .input-box {
        width: 60%;
    }

    .bottom-details .bottom_text span,
    .bottom-details .bottom_text a {
        font-size: 12px;
    }
}

@media (max-width: 520px) {
    footer::before {
        top: 145px;
    }

    footer .content .top {
        flex-direction: column;
    }

    .content .top .media-icons {
        margin-top: 16px;
    }

    footer .content .link-boxes .box {
        width: calc(100% / 2 - 10px);
    }

    footer .content .link-boxes .input-box {
        width: 100%;
    }
}
</style>
