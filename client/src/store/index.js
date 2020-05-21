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
    popupStats: 0,
    alertType: -1,
    alertMsg: '',
    boxesCount: -1,
    accountType: -1,
    reloadBoxes: 0,
    activeInboxUser: '',
    activeInboxFolder: 1,
    selectedMails: [],
    allMails: 0,
    unseenMails: 0,
    unseenSelectedMails: [],
    subAction: 0,
    readMailId: 0,
    readMailUnseen: 0,
    downloadMails: 0,
    reloadMenuCore: 0,
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
    togglePopupStats(state){
      if(state.popupStats){
        state.popupStats = 0;
      }else{
        state.popupStats = 1;
      }
    },
    changeAlert(state, payload){
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
    },
    changeActiveInboxUser(state, payload){
      state.activeInboxUser = payload;
    },
    changeActiveInboxFolder(state, payload){
      state.activeInboxFolder = payload;
    },
    selectMail(state, payload){
      if(state.selectedMails.indexOf(payload) == -1){
        state.selectedMails.push(payload);
      }else{
        state.selectedMails.splice(state.selectedMails.indexOf(payload), 1);
      }
    },
    selectUnseenMails(state, payload){
      if(state.unseenSelectedMails.indexOf(payload) == -1){
        state.unseenSelectedMails.push(payload);
      }else{
        state.unseenSelectedMails.splice(state.unseenSelectedMails.indexOf(payload), 1);
      }
    },
    clearSelected(state){
      state.selectedMails = [];
      state.unseenSelectedMails = [];
    },
    changeAllMails(state, payload){
      state.allMails = payload;
    },
    changeUnseenMails(state, payload){
      state.unseenMails = payload;
    },
    changeSubAction(state, payload){
      state.subAction = payload;
    },
    changeReadMailId(state, payload){
      state.readMailId = payload;
    },
    changeReadMailUnseen(state, payload){
      state.readMailUnseen = payload;
    },
    changeDownloadMails(state){
      if(state.downloadMails){
        state.downloadMails = 0;
      }else{
        state.downloadMails = 1;
      }
    },
    changeReloadMenuCore(state){
      if(state.reloadMenuCore){
        state.reloadMenuCore = 0;
      }else{
        state.reloadMenuCore = 1;
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
