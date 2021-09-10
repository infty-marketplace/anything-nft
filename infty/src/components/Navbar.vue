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
                        <router-link to="/marketplace">Marketplace</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 1 }">
                        <router-link to="/raffles">Raffles</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 2 }">
                        <router-link to="/mine/collections">Collections</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 3 }"><router-link to="/stake">Staking</router-link></li>
                    <li v-if="!loggedIn">
                        <b-button pill variant="primary" class="wallet-btn" @click="connectWallet">
                            <b-icon class="ml-2 mr-2" icon="wallet2" aria-hidden="true"></b-icon>
                        </b-button>
                    </li>
                    <li v-else>
                        
                        <img :src="profile_picture" class="profile-pic" @click='toProfile'/>
                        
                    </li>
                </ul>
            </nav>
        </header>
        <b-modal ref="reg-modal" title="Register" @ok="handleRegister">
            <div class="mb-4">
                We noticed that this is your first time connecting to our platform, so we need some info from you.
            </div>
            <label>First Name</label>
            <b-form-input class="mb-4" v-model="first_name" placeholder="Your creative first name here..." />
            <label>Last Name</label>
            <b-form-input class="mb-4" v-model="last_name" placeholder="Optional" />
        </b-modal>
        <b-toast id="no-wallet-toast" title="No Wallet Detected">
            <a href="https://portal.confluxnetwork.org/" target="_blank">Please install it here.</a>
        </b-toast>
        <b-toast id="wallet-failure-toast" title="Failed to connect wallet">
            Failed to connect, try again later.
        </b-toast>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
    name: "Navbar",
    props: ["activeIndex"],
    data: () => ({
        first_name: "",
        last_name: "",
    }),
    methods: {
        connectWallet() {
            this.$store.dispatch("connectWallet");
        },
        handleRegister() {
            axios
                .post(`${this.$store.getters.getApiUrl}/profile/update-profile`, {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    address: this.$store.getters.getAddress,
                })
                .then((res) => {
                    console.log('profile saved', res);
                });
        },
        toProfile() {
            const path = this.$route.path
            if (path.includes('profile') && path.split('profile/')[1] != this.$store.getters.getAddress) {
                window.location.pathname = `/profile/${this.$store.getters.getAddress}`
            } else {
                this.$router.push(`/profile/${this.$store.getters.getAddress}`)
            }
        }
    },
    computed: {
        loggedIn: function() {
            return !!this.$store.getters.getAddress;
        },
        addr: function() {
          return this.$store.getters.getAddress
        },
        profile_picture: function() {
            return this.$store.getters.getProfilePic
        }
    },
    async created() {
    //   this.connectWallet()
      
      eventBus.$on("Navbar.noWallet", () => {
          this.$bvToast.show("no-wallet-toast");
      });
      eventBus.$on("Navbar.connectWalletSuccess", async () => {
        axios
            .get(`${this.$store.getters.getApiUrl}/profile/${(await window.conflux.send("cfx_requestAccounts"))[0]}`)
            .then((res) => {
                console.log('wallet connected', res);
            })
            .catch((err) => {
                if (!err.response || err.response.status == 404) {
                    this.$refs["reg-modal"].show();
                }
            });
      });
      eventBus.$on("Navbar.connectWalletFailure", () => {
          this.$bvToast.show("wallet-failure-toast");
      });
    },
    beforeDestroy() {
        eventBus.$off("Navbar.noWallet");
        eventBus.$off("Navbar.connectWalletSuccess");
        eventBus.$off("Navbar.connectWalletFailure");
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
</style>
