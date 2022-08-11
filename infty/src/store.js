import Vue from "vue";
import Vuex from "vuex";
import { eventBus } from "./main";
import axios from "axios";
import { PersonalMessage } from "js-conflux-sdk"
import { Conflux } from "js-conflux-sdk" 
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        cfx: undefined,
        address: undefined,
        apiUrl: "/api",
        managerAddr: "cfxtest:aar3amuxs8fg2u7h1tsngukey8vm2h6vgujhf413e6",
        minterContract: undefined,
        minterAddress: "cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr",
        stakeContract: undefined,
        stakeAddress: "cfxtest:aca4k538vsk20xg0s4cphmmjns59kr4yayeccxb602",
        raffleContract: undefined,
        raffleAddress: "cfxtest:acba17zagxykgrh2hg6uzaukdx5tgrfm5jd5btkxk4",
        profilePic: undefined,
        lang: "en",
        isLoggedIn: false,
    },
    actions: {
        async connectWallet(context) {
            console.log(1)
            if (this.state.isLoggedIn) {
                return;
            }
            console.log(2)
            if (!window.conflux) {
                eventBus.$emit("Navbar.noWallet");
                return;
            }
            console.log(3)
            try {
                if (!this.state.address) {
                    const accounts = await window.conflux.request({method:"cfx_accounts"});
                    
                    context.commit("setAddress", accounts[0]);
                    // format: Infty: <unix timestamp>
                    const timestamp = Date.now();
                    // const msg = "0x496e6674793a" + timestamp;
                    const msg = "Hello World12";
                    const b = await this.state.cfx.request({method: "personal_sign", params:[msg, this.state.address], from: this.state.address})
                    const a = await window.conflux.request({method: "personal_sign", params:[msg, this.state.address], from: this.state.address})
                    console.log(a)
                        
                    ;
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
        },
        setProfilePic: async (state) => {
            const res = await axios.get(`${state.apiUrl}/profile/${state.address}`);
            state.profilePic = res.data.profile_picture
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
