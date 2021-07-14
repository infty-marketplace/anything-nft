import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        account: undefined,
    },
    mutations: {
        setAccount: (state, acc) => {
            state.account = acc;
        }
    },
    getters: {
        getAccount: (state) => {
            return state.account;
        }
    }
})

export default store;