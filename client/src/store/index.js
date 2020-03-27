import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menu: 1,
    boxAddMail: 0,
  },
  mutations: {
    toggleMenu(state, payload){
      state.menu = payload;
    },
    toggleBoxAddMail(state){
      if(state.boxAddMail){
        state.boxAddMail = 0;
      }else{
        state.boxAddMail = 1;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
