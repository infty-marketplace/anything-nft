import Vue from 'vue'
import Vuex from 'vuex'
import { eventBus } from './main'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        address: undefined,
        apiUrl: "http://localhost:3001/api"
    },
    actions: {
        async connectWallet(context) {
            if (!window.conflux) {
                eventBus.$emit("Navbar.noWallet")
                return
            }
            try {
                const accounts = await window.conflux.send("cfx_requestAccounts")
                context.commit("setAddress", accounts[0])
                eventBus.$emit("Navbar.connectWalletSuccess")
                if (window.location.href.includes('/mine/collections')) eventBus.$emit("Collections.loadNfts");
            } catch (err) {
                console.log(err)
                eventBus.$emit("Navbar.connectWalletFailure")
            }
        }
    },
    mutations: {
        setAddress: (state, addr) => {
            state.address = addr;
        }
    },
    getters: {
        getAddress: (state) => state.address,
        getApiUrl: (state) => state.apiUrl
    }
})

export default store;