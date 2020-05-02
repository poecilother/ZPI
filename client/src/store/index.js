import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: 'https://cleanmail.herokuapp.com/',
    newToken: 0,
    menu: 1,
    popupAddMail: 0,
    popupSettings: 0,
    alertType: -1,
    alertMsg: '',
    boxesCount: -1,
    accountType: -1,
    reloadBoxes: 0,
  },
  mutations: {
    getNewToken(state, payload){
      state.newToken = payload;
    },
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
    },
    changeAlert(state, payload){
      console.log(payload.type)
      state.alertType = payload.type;
      state.alertMsg = payload.msg;
    },
    changeBoxesCount(state, payload){
      state.boxesCount = payload;
    },
    changeAccountType(state, payload){
      state.accountType = payload;
    },
    changeReloadBoxes(state){
      if(state.reloadBoxes){
        state.reloadBoxes = 0;
      }else{
        state.reloadBoxes = 1;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
