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
    raffleContract: undefined,
    raffleContractAddress: "cfxtest:aca94xv52k2zbjbtjx7jvcy9kzc02mznr6rs6xytke",
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
        if (window.location.href.includes("/mine/collections"))
          eventBus.$emit("Collections.loadCollections");
      } catch (err) {
        console.log(err);
        eventBus.$emit("Navbar.connectWalletFailure");
      }
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
    },
    setMinterContract: (state, mc) => {
      console.log("mc", mc);
      state.minterContract = mc;
    },
    setRaffleContract: (state, rc) => {
      console.log("rc", rc);
      state.raffleContract = rc;
    },
  },
  getters: {
    getAddress: (state) => state.address,
    getApiUrl: (state) => state.apiUrl,
    getManagerAddr: (state) => state.managerAddr,
    getMinterContract: (state) => state.minterContract,
    getMinterAddress: (state) => state.minterAddress,
    getProfile: (state) => async (addr) => {
      const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
      return res.data;
    },
    getProfilePic: (state) => async (addr) => {
      const res = await axios.get(`${state.apiUrl}/profile/${addr}`);
      return res.data.profile_picture;
    },
    getRaffleContract: (state) => state.raffleContract,
    getRaffleContractAddress: (state) => state.raffleContractAddress,
  },
});

export default store;
