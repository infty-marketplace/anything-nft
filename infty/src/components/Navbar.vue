<template>
    <div>
        <header>
            <div class="logo">
                <router-link to="/">
                    <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
                </router-link>
            </div>
            <nav>
                <ul class="nav__links">
                    <li v-bind:class="{ active: activeIndex == 0 }">
                        <router-link to="/marketplace">{{ $t("marketplace") }}</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 2 }">
                        <router-link to="/mine/create">{{ $t("create") }}</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 3 }">
                        <router-link to="/mine/collections">{{ $t("collections") }}</router-link>
                    </li>
                    <li v-if="$store.getters.getLogInStatus">
                        <img :src="profilePicture" class="profile-pic" @click="toProfile" />
                    </li>
                    <li v-else>
                        <b-button pill variant="primary" class="wallet-btn" @click="connectWallet">
                            <b-icon class="ml-2 mr-2" icon="wallet2" aria-hidden="true"></b-icon>
                        </b-button>
                    </li>
                </ul>
            </nav>
        </header>
        <b-modal ref="reg-modal" title="Register" @ok="handleRegister">
            <div class="mb-4">
                We noticed that this is your first time connecting to our platform, so we need some info from you.
            </div>
            <label>First Name</label>
            <b-form-input class="mb-4" v-model="firstName" placeholder="Your creative first name here..." />
            <label>Last Name</label>
            <b-form-input class="mb-4" v-model="lastName" placeholder="Optional" />
            <label>Terms & Conditions</label>
            <div class="scrollable-div">
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut laoreet risus quis neque vestibulum mollis. Duis placerat dignissim enim et dapibus. Ut velit ex, aliquet et quam at, tincidunt varius nulla. Quisque dictum ex id vestibulum semper. In nibh urna, iaculis elementum eros sit amet, dignissim imperdiet tellus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In varius at urna id sodales. Nulla ut porta sem. Sed purus justo, pulvinar sit amet felis sed, eleifend dignissim augue. Aenean fermentum, nibh sed condimentum facilisis, quam magna dignissim nisi, eget vulputate odio risus vel quam.
            </div>
            <input type="checkbox" id="terms" v-model="checkedTerms">
            <label for="terms" class="termsLabel">I have read and agreed to the above Terms & Conditions.</label>

        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import { Notification } from "element-ui";

export default {
    name: "Navbar",
    props: ["activeIndex"],
    data: () => ({
        firstName: "",
        lastName: "",
        checkedTerms: false
    }),
    methods: {
        connectWallet() {
            this.$store.dispatch("connectWallet");
        },
        async handleRegister() {
            if (this.firstName && this.checkedTerms) {
                this.$notify({
                    title: "Pending",
                    dangerouslyUseHTMLString: true,
                    message:
                        '<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">Creating your profile</div></div>',
                    duration: 0,
                });
                await axios
                    .post(`${this.$store.getters.getApiUrl}/profile/update-profile`, {
                        first_name: this.firstName,
                        last_name: this.lastName,
                        address: this.$store.getters.getAddress,
                    })
                    .then((res) => {
                        console.log("profile saved", res);
                        this.connectWallet();
                        Notification.closeAll();
                        this.$notify({
                            title: "Success",
                            message: "Profile created",
                            duration: 3000,
                        });
                    });
            } else {
                this.$notify.error({
                    title: "Error",
                    dangerouslyUseHTMLString: true,
                    message:
                        'You must fill in your first name and accept our Terms & Conditions.',
                    duration: 3000,
                });
            }
        },
        toProfile() {
            const path = this.$route.path;
            if (path.includes("profile") && path.split("profile/")[1] != this.$store.getters.getAddress) {
                window.location.pathname = `/profile/${this.$store.getters.getAddress}`;
            } else {
                this.$router.push(`/profile/${this.$store.getters.getAddress}`);
            }
        },
    },
    computed: {
        profilePicture: function() {
            return this.$store.getters.getProfilePic;
        },
    },
    async created() {
        eventBus.$on("Navbar.noWallet", () => {
            this.$notify.info({
                title: "Wallet not Detected",
                dangerouslyUseHTMLString: true,
                message: `<a href="https://portal.confluxnetwork.org/" target="_blank">Please install it here</a>`,
                duration: 0,
            });
        });
        eventBus.$on("Navbar.noProfile", () => {
            this.$refs["reg-modal"].show();
        });
        eventBus.$on("Navbar.connectWalletSuccess", async () => {
            // this.$notify({
            //     title: "Wallet Connected",
            //     message: "We have connected to your wallet",
            //     duration: 3000,
            // });
        });
        eventBus.$on("Navbar.connectWalletFailure", () => {
            this.$notify.error({
                title: "Wallet not Connected",
                message: "Failed to connect to your wallet, please try again",
                duration: 3000,
            });
        });
    },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 10%;
    background-color: rgb(18, 18, 18);
}

.logo {
    margin-right: auto;
}

.logo-img {
    cursor: pointer;
    width: 70px;
}

.nav__links a,
.overlay__content a {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 1.2rem;
    color: #edf0f1;
    text-decoration: none;
    cursor: pointer;
}

.nav__links {
    list-style: none;
    display: flex;
    align-items: center;
}

.nav__links li {
    padding: 0px 20px;
    cursor: pointer;
}

.nav__links li a {
    transition: color 0.3s ease 0s;
}

.nav__links li a:hover {
    color: #0088a9;
}

.wallet-btn {
    margin-left: 15px;
}

.active {
    border-bottom: 2px solid #0088a9;
}

.profile-pic {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
    transition: all 0.4s ease;
}
.profile-pic:hover {
    transform: scale(1.1);
}

.scrollable-div {
    height: 100px;
    overflow-y: scroll;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    padding-left: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
    font-size: 1rem;
    text-align: justify;
    color: #495057;
}

.termsLabel {
    padding: 0.375rem 0.75rem;
}

</style>
