import Vue from 'vue';
import Vuex from 'vuex';
import { eventBus } from './main';
import axios from 'axios';
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        address: undefined,
        apiUrl: 'http://localhost:3001/api',
        managerAddr: 'cfxtest:aar3amuxs8fg2u7h1tsngukey8vm2h6vgujhf413e6',
        minterContract: undefined,
        minterAddress: 'cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr',
        stakeContract: undefined,
        stakeAddress: 'cfxtest:aca4k538vsk20xg0s4cphmmjns59kr4yayeccxb602',
        raffleContract: undefined,
        raffleAddress: 'cfxtest:acba17zagxykgrh2hg6uzaukdx5tgrfm5jd5btkxk4',
        profilePic:
            'https://ipfs.io/ipfs/QmR9aGP1cQ13sapFBfFLiuhRVSGcrMYvZPmKXNNrobwtFZ?filename=undraw_male_avatar_323b.png',
        lang: 'en',
    },
    actions: {
        async connectWallet(context) {
            if (!window.conflux) {
                eventBus.$emit('Navbar.noWallet');
                return;
            }
            try {
                const accounts = await window.conflux.send('cfx_requestAccounts');
                context.commit('setAddress', accounts[0]);
                context.commit('setProfilePic');
                eventBus.$emit('Navbar.connectWalletSuccess');
                if (window.location.href.includes('/mine/collections')) eventBus.$emit('Collections.loadCollections');
            } catch (err) {
                console.log(err);
                eventBus.$emit('Navbar.connectWalletFailure');
            }
        },
        notifyWIP() {
            eventBus.$emit('App.notifyWIP');
        },

        notifyLoading(state, payload) {
            const { msg } = payload;
            eventBus.$emit('App.notifyLoading', msg);
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
        setRaffleContract: (state, rc) => {
            state.raffleContract = rc;
        },
        setProfilePic: async (state) => {
            const res = await axios.get(`${state.apiUrl}/profile/${state.address}`);
            state.profilePic = res.data.profile_picture;
        },
        setLang: (state) => {
            if (state.lang === 'cn') {
                state.lang = 'en';
            } else {
                state.lang = 'cn';
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
    },
});

export default store;
