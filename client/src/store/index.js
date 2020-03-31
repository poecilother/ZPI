import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menu: 1,
    popupAddMail: 0,
    popupSettings: 0,
  },
  mutations: {
    toggleMenu(state, payload){
      state.menu = payload;
    },
    togglePopupAddMail(state){
      if(state.popupAddMail){
        state.popupAddMail = 0;
      }else{
        state.popupAddMail = 1;
      }
    },
    togglePopupSettings(state){
      if(state.popupSettings){
        state.popupSettings = 0;
      }else{
        state.popupSettings = 1;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
