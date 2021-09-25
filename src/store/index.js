import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        goodInfo: {}
    },
    mutations: {
        setGoodInfo(state, goodInfo) {
            state.goodInfo = goodInfo
        }
    },
    getters: {

    }
})