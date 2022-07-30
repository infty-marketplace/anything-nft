import Vue from "vue";
import Vuex from "vuex";
import { eventBus } from "./main";
import axios from "axios";
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        address: undefined,
        apiUrl: process.env.VUE_APP_API_URL,
        managerAddr: process.env.VUE_APP_MANAGER_ADDRESS,
        minterContract: undefined,
        minterAddress: process.env.VUE_APP_MINTER_ADDRESS,
        stakeContract: undefined,
        stakeAddress: process.env.VUE_APP_STAKE_ADDRESS,
        raffleContract: undefined,
        raffleAddress: process.env.VUE_APP_RAFFLE_ADDRESS,
        profilePic: undefined,
        lang: "en",
        isLoggedIn: false,
    },
    actions: {
        async connectWallet(context) {
            if (this.state.isLoggedIn) {
                return;
            }
            if (!window.conflux) {
                eventBus.$emit("Navbar.noWallet");
                return;
            }
            try {
                if (!this.state.address) {
                    const accounts = await window.conflux.send(
                        "cfx_requestAccounts"
                    );
                    context.commit("setAddress", accounts[0]);
                    eventBus.$emit("Navbar.connectWalletSuccess");
                }
                await axios
                    .get(`${this.state.apiUrl}/profile/${this.state.address}`)
                    .then((res) => {
                        context.commit("setProfile", res.data);
                    })
                    .catch(() => {
                        eventBus.$emit("Navbar.noProfile"); // no profile found
                    });

                if (window.location.href.includes("/mine/collections"))
                    eventBus.$emit("Collections.loadCollections");
            } catch (err) {
                console.log(err);
                eventBus.$emit("Navbar.connectWalletFailure");
            }
        },
        notifyWIP() {
            eventBus.$emit("App.notifyWIP");
        },

        notifyLoading(state, payload) {
            const { msg } = payload;
            eventBus.$emit("App.notifyLoading", msg);
        },
        notifyErr() {
            eventBus.$emit("App.notifyErr");
        },
        loadFromSessionStorage(state) {
            Object.keys(sessionStorage).forEach((key) => {
                if (key.startsWith("infty-marketplace:")) {
                    const value = window.sessionStorage.getItem(key);
                    const stateKey = key.split(":")[1];
                    state.state[stateKey] = value;
                }
            });
        },
    },
    mutations: {
        setAddress: (state, addr) => {
            state.address = addr;
            window.sessionStorage.setItem("infty-marketplace:address", addr);
        },
        setMinterContract: (state, mc) => {
            state.minterContract = mc;
        },
        setStakeContract: (state, sc) => {
            state.stakeContract = sc;
        },
        setRaffleContract: (state, rc) => {
            state.raffleContract = rc;
        },
        setProfile: async (state, profile) => {
            state.profilePic = profile.profile_picture;
            state.isLoggedIn = true;
            window.sessionStorage.setItem(
                "infty-marketplace:profilePic",
                profile.profile_picture
            );
            window.sessionStorage.setItem("infty-marketplace:isLoggedIn", true);
        },
        setLang: (state) => {
            if (state.lang === "cn") {
                state.lang = "en";
            } else {
                state.lang = "cn";
            }
        },
    },
    getters: {
        getAddress: (state) => state.address,
        getApiUrl: (state) => state.apiUrl,
        getManagerAddr: (state) => state.managerAddr,
        getMinterContract: (state) => state.minterContract,
        getMinterAddress: (state) => state.minterAddress,
        getStakeContract: (state) => state.stakeContract,
        getStakeAddress: (state) => state.stakeAddress,
        getRaffleContract: (state) => state.raffleContract,
        getRaffleAddress: (state) => state.raffleAddress,
        getProfile: (state) => async (addr) => {
            const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
            return res.data;
        },
        getProfilePic: (state) => state.profilePic,
        getLogInStatus: (state) => state.isLoggedIn,
    },
});

export default store;
