import Vue from "vue";
import Vuex from "vuex";
import { eventBus } from "./main";
import axios from "axios";
import { PersonalMessage } from "js-conflux-sdk"
import { Conflux } from "js-conflux-sdk" 
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        cfx: new Conflux({
            networkId: 1,
        }),
        address: undefined,
        apiUrl: "/api",
        managerAddr: "cfxtest:aar3amuxs8fg2u7h1tsngukey8vm2h6vgujhf413e6",
        minterContract: undefined,
        minterAddress: "cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr",
        profilePic: undefined,
        lang: "en",
        isLoggedIn: false,
        gasPrice: 1e9,
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
                    await window.conflux.request({method:"cfx_requestAccounts"}); // connect wallet
                    const accounts = await window.conflux.request({method:"cfx_accounts"}); // get accounts
                    console.log(accounts)
                    const address = accounts[0];
                    // format: Infty: <unix timestamp>
                    const timestamp = Date.now();
                    // const msg = "0x496e6674793a" + timestamp;
                    const msg = "Infty:"+timestamp;
                    const sig = await this.state.cfx.request({method: "personal_sign", params: [msg, address], from: address})
                    // const a = await window.conflux.request({method: "personal_sign", params:[msg], from: this.state.address})
                    await axios.post(`${this.state.apiUrl}/auth`, {
                        msg,
                        sig,
                        address: address
                    })
                    context.commit("setAddress", address); // needs to be last to do
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

                if (window.location.href.includes("/mine/collections")) eventBus.$emit("Collections.loadCollections");
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
        setCfx(state, payload) {
            state.cfx = payload;
        },
        setLogin(state, payload) {
            state.isLoggedIn = payload;
        },
        setAddress: (state, addr) => {
            state.address = addr;
            window.sessionStorage.setItem("infty-marketplace:address", addr);
        },
        setMinterContract: (state, mc) => {
            state.minterContract = mc;
        },
        setProfile: async (state, profile) => {
            state.profilePic = profile.profile_picture;
            state.isLoggedIn = true;
            window.sessionStorage.setItem("infty-marketplace:profilePic", profile.profile_picture);
            window.sessionStorage.setItem("infty-marketplace:isLoggedIn", true);
        },
        setProfilePic: async (state) => {
            const res = await axios.get(`${state.apiUrl}/profile/${state.address}`);
            state.profilePic = res.data.profile_picture
        },
    },
    getters: {
        getCfx: (state) => state.cfx,
        getAddress: (state) => state.address,
        getApiUrl: (state) => state.apiUrl,
        getManagerAddr: (state) => state.managerAddr,
        getMinterContract: (state) => state.minterContract,
        getMinterAddress: (state) => state.minterAddress,
        getProfile: (state) => async (addr) => {
            const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
            return res.data;
        },
        getProfilePic: (state) => state.profilePic,
        getLogInStatus: (state) => state.isLoggedIn,
        getGasPrice: (state) => state.gasPrice,
    },
});

export default store;
