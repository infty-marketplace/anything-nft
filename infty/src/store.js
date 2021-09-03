import Vue from "vue";
import Vuex from "vuex";
import { eventBus } from "./main";
import axios from "axios";
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        address: undefined,
        apiUrl: "http://localhost:3001/api",
        managerAddr: "cfxtest:aar3amuxs8fg2u7h1tsngukey8vm2h6vgujhf413e6",
        minterContract: undefined,
        minterAddress: "cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr",
        stakeContract: undefined,
        stakeAddress: "cfxtest:aca4k538vsk20xg0s4cphmmjns59kr4yayeccxb602",
    },
    actions: {
        async connectWallet(context) {
            if (!window.conflux) {
                eventBus.$emit("Navbar.noWallet");
                return;
            }
            try {
                const accounts = await window.conflux.send("cfx_requestAccounts");
                context.commit("setAddress", accounts[0]);
                eventBus.$emit("Navbar.connectWalletSuccess");
                if (window.location.href.includes("/mine/collections")) eventBus.$emit("Collections.loadCollections");
            } catch (err) {
                console.log(err);
                eventBus.$emit("Navbar.connectWalletFailure");
            }
        },
        notifyWIP() {
            eventBus.$emit("App.notifyWIP");
        },

        notifyCommission() {
            eventBus.$emit("App.notifyCommission");
        },
    },
    mutations: {
        setAddress: (state, addr) => {
            state.address = addr;
        },
        setMinterContract: (state, mc) => {
            state.minterContract = mc;
        },
        setStakeContract: (state, sc) => {
            state.stakeContract = sc;
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
        getProfile: (state) => async (addr) => {
            const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
            return res.data;
        },
        getProfilePic: (state) => async (addr) => {
            const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
            return res.data.profile_picture;
        },
        getNftsInAlbum: (state) => async (aid) => {
            return (await axios.get(`${state.apiUrl}/album/${aid}`)).data.nft_ids;
        },
    },
});

export default store;
