import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        account: undefined,
        apiUrl: "http://localhost:3001"
    },
    mutations: {
        setAccount: (state, acc) => {
            state.account = acc;
        }
    },
    getters: {
        getAccount: (state) => state.account,
        getApiUrl: (state) => state.apiUrl
    }
})

export default store;