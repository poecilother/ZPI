<template>
  <div id="popup-settings" class="popup" v-if="showPopup">
    <div class="shadow" @click="closePopup()"></div>
    <div class="container">
      <header>
        <h4>Ustawienia</h4>
        <div class="icon-close" v-b-tooltip.hover title="Zamknij" @click="closePopup()">
          <i class="material-icons">close</i>
        </div>
      </header>
      <h5 class="section-header" v-if="boxes.length != 0">Zarządzanie skrzynkami</h5>
      <section class="mailboxes" v-if="boxes.length != 0">
        <div class="mailbox" :class="{ outlook: getHost(box.user) == 'outlook', gmail: getHost(box.user) == 'gmail'}" v-for="box in boxes" :key="box.user">
          <button class="delete" v-b-tooltip.hover title="Usuń" @click="del(box.user)"><i class="material-icons">delete</i></button>
          <h3>{{ getUserLogin(box.user) }}</h3>
          <div class="spam-level">
            <button v-b-tooltip.hover title="Podstawowe filtrowanie spamu" :class="{ active: box.level == 1 }" @click="changeLevel(1, box.level, box.user)">easy</button>
            <button v-b-tooltip.hover title="Średniozaawansowane filtrowanie spamu" :class="{ active: box.level == 2 }" @click="changeLevel(2, box.level, box.user)">medium</button>
            <button v-b-tooltip.hover title="Zaawansowane filtrowanie spamu" :class="{ active: box.level == 3 }" @click="changeLevel(3, box.level, box.user)">hard</button>
          </div>
          <footer>
            <h6>Czarna lista</h6>
            <h5>{{ getHost(box.user) }}</h5>
          </footer>
        </div>
      </section>
      <h5 class="section-header" v-if="boxes.length != 0">Czarna lista słów - dfecica</h5>
      <section class="blacklist words" v-if="boxes.length != 0">
        <div class="add">
          <input class="default" type="text" placeholder="Słowo">
          <button class="icon">
            <i class="material-icons" v-b-tooltip.hover title="Dodaj">add</i>
          </button>
        </div>
        <div class="words">
          <div class="word">
            <p>money</p>
            <i class="material-icons">close</i>
          </div>
          <div class="word">
            <p>example</p>
            <i class="material-icons" v-b-tooltip.hover title="Usuń">close</i>
          </div>
        </div>
      </section>
      <h5 class="section-header" v-if="boxes.length != 0">Czarna lista maili - dfecica</h5>
      <section class="blacklist emails" v-if="boxes.length != 0">
        <div class="add">
          <input class="default" type="text" placeholder="Email">
          <button class="icon">
            <i class="material-icons" v-b-tooltip.hover title="Dodaj">add</i>
          </button>
        </div>
        <div class="words">
          <div class="word">
            <p>money@moneny.pl</p>
            <i class="material-icons">close</i>
          </div>
          <div class="word">
            <p>example@example.com</p>
            <i class="material-icons" v-b-tooltip.hover title="Usuń">close</i>
          </div>
        </div>
      </section>
      <h5 class="section-header" v-if="local == 1">Zmiana hasła</h5>
      <section class="password" v-if="local == 1">
        <input class="default" type="password" placeholder="Nowe hasło" v-model="password1" @keyup.enter="changePassword()">
        <input class="default" type="password" placeholder="Powtórz hasło" v-model="password2" @keyup.enter="changePassword()">
        <button class="default" @click="changePassword()">zmień<i class="material-icons">edit</i></button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupSettings',
  data(){
    return{
      local: 0,
      password1: '',
      password2: '',
      boxes: '',
      user: '',
      level: 0,
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    showPopup(){
      return this.$store.state.popupSettings;
    },
    reloadBoxes(){
      return this.$store.state.reloadBoxes;
    }
  },
  created(){
    this.getBoxesApi();
    let self = this;
    this.axios.get(this.api + 'users/checkaccount', { params: { token: localStorage.refresh_token } })
    .then(function (response) {
      if(response.data.account == 'local'){
        self.local = 1;
        self.$store.commit('changeAccountType', 1);
      }else{
        self.local = 0;
        self.$store.commit('changeAccountType', 0);
      }
    })
    console.log(localStorage.access_token)
  },
  watch:{
    newToken(){
      if(this.newToken == -2){
        this.changePasswordApi();
      }else if(this.newToken == -4){
        this.getBoxesApi();
      }else if(this.newToken == -5){
        this.delApi();
      }else if(this.newToken == -7){
        this.changeLevelApi();
      }
    },
    showPopup(){
      this.getBoxesApi();
    },
    reloadBoxes(){
      this.getBoxesApi();
    }
  },
  methods: {
    closePopup(){
      this.$store.commit('togglePopupSettings');
    },
    changePassword(){
      if(this.password1 == '' || this.password2 == ''){
        this.$store.commit('changeAlert', { type: 0, msg: 'Hasła nie mogą być puste' });
      }else if(this.password1 != this.password2){
        this.$store.commit('changeAlert', { type: 0, msg: 'Hasła nie są ze sobą zgodne.' });
      }else{
        this.changePasswordApi();
      }
    },
    getBoxesApi(){
      let self = this;
      this.axios.get(this.api + 'mail/boxes', { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 4);
        }else{
          self.$store.commit('getNewToken', 0);
          self.boxes = response.data.boxes;
          self.$store.commit('changeBoxesCount', self.boxes.length);
        }
      });
    },
    changePasswordApi(){
      let self = this;
      this.axios.post(this.api + 'users/changepassword', { password: this.password1 }, { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 2);
        }else{
          console.log(23)
          self.$store.commit('getNewToken', 0);
          self.password1 = '';
          self.password2 = '';
          self.$store.commit('changeAlert', { type: response.data.success, msg: response.data.msg });
        }
      });
    },
    del(user){
      this.user = user;
      this.delApi();
    },
    delApi(){
      let self = this;
      this.axios.delete(this.api + 'mail/del', {data: { user: this.user }, headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 5);
        }else{
          self.$store.commit('getNewToken', 0);
          self.getBoxesApi();
          self.$store.commit('changeReloadBoxes');
          //self.$store.commit('changeAlert', { type: response.data.success, msg: response.data.msg });
        }
      });
    },
    changeLevel(level, boxLevel, user){
      if(level !== boxLevel){
        this.level = level;
        this.user = user;
        this.changeLevelApi();
      }
    },
    changeLevelApi(){
      let self = this;
      this.axios.post(this.api + 'mail/changelevel', { user: this.user, level: this.level }, { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 7);
        }else{
          self.$store.commit('getNewToken', 0);
          self.getBoxesApi();
        }
      });
    },
    getUserLogin(user){
      let index = user.indexOf("@");
      let login = user.substring(0, index);
      return login;
    },
    getHost(user){
      let index = user.indexOf("@");
      let len = user.length;
      let host = user.substring(index + 1, len - 1);
      index = host.indexOf(".");
      host = host.substring(0, index);
      return host;
    }
  }
}
</script>

<style lang="scss">
  div#popup-settings div.container { width: calc(100% - 40px); max-width: 100%; height: calc(100% - 40px); overflow-y: overlay; top: 20px; left: 20px;  color: #000;  }
  div#popup-settings div.container h5.section-header { height: 35px; line-height: 35px; margin: 20px 40px; padding: 0 20px; color: rgba(0, 0, 0, 0.5); font-size: 18px; 
  font-weight: 400; border-left: 2px solid rgba(0, 0, 0, 0.1); }
  div#popup-settings div.container section.mailboxes { display: flex; flex-wrap: wrap; padding: 0; }
  div#popup-settings div.container section.mailboxes button:focus { outline: 0; }
  div#popup-settings div.container section.mailboxes div.mailbox { display: flex; flex-direction: column; width: 200px; height: 175px; margin: 20px 0 40px 40px; padding: 10px; 
   border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.05); background: url('../assets/mail-other-24.png') no-repeat 10px 10px; }
  div#popup-settings div.container section.mailboxes div.mailbox.outlook { background: url('../assets/mail-outlook-24.png') no-repeat 10px 10px; border: 1px solid rgba(0, 0, 0, 0.05); }
  div#popup-settings div.container section.mailboxes div.mailbox.gmail { background: url('../assets/mail-gmail-24.png') no-repeat 10px 10px; border: 1px solid rgba(0, 0, 0, 0.05); }
  div#popup-settings div.container section.mailboxes button.delete { display: block; height: 24px; margin: 0 0 0 auto; padding: 0; border: 0; background: 0; }
  div#popup-settings div.container section.mailboxes button.delete i.material-icons { font-size: 24px; color: rgba(0, 0, 0, 0.2); }
  div#popup-settings div.container section.mailboxes button.delete:hover i.material-icons { font-size: 24px; color: rgba(0, 0, 0, 0.6); }
  div#popup-settings div.container section.mailboxes h3 { margin: 20px 0 0 0; padding: 0; text-align: center; font-size: 18px;}
  div#popup-settings div.container section.mailboxes div.spam-level { display: flex; margin-top: auto; width: 100%; }
  div#popup-settings div.container section.mailboxes div.spam-level button { display: block; width: 33.33333%; height: 20px; margin: 0; padding: 0; border: 0; font-size: 9px; 
    text-transform: uppercase; font-weight: 700; background: rgba(0, 0, 0, 0.05); color: rgba(0, 0, 0, 0.5); }
  div#popup-settings div.container section.mailboxes div.spam-level button:first-child { border-top-left-radius: 3px; border-bottom-left-radius: 3px; }
  div#popup-settings div.container section.mailboxes div.spam-level button:last-child { border-top-right-radius: 3px; border-bottom-right-radius: 3px; }
  div#popup-settings div.container section.mailboxes div.spam-level button:first-child:hover { background: linear-gradient(90deg,rgba(87,23,120,1) 0%, rgba(73,28,130,1) 100%,); }
  div#popup-settings div.container section.mailboxes div.spam-level button.active:first-child { background: linear-gradient(90deg,rgba(87,23,120,1) 0%, rgba(73,28,130,1) 100%,);  }
  div#popup-settings div.container section.mailboxes div.spam-level button.active { background: linear-gradient(90deg,rgba(73,28,130,1) 0%, rgba(62,33,139,1) 100%,); 
    color: rgba(255, 255, 255, 0.8); }
  div#popup-settings div.container section.mailboxes div.spam-level button:hover { background: linear-gradient(90deg,rgba(73,28,130,1) 0%, rgba(62,33,139,1) 100%,); 
    color: rgba(255, 255, 255, 0.8); }
  div#popup-settings div.container section.mailboxes div.spam-level button:last-child:hover { background: linear-gradient(90deg,rgba(62,33,139,1) 0%, rgba(50,38,148,1) 100%,); }
  div#popup-settings div.container section.mailboxes div.spam-level button.active:last-child { background: linear-gradient(90deg,rgba(62,33,139,1) 0%, rgba(50,38,148,1) 100%,); }
  div#popup-settings div.container section.mailboxes footer h5 { margin: 0; padding: 0; text-align: center; font-size: 11px; color: $pink; 
    text-transform: capitalize; font-weight: 600; }
  div#popup-settings div.container section.mailboxes footer { display: flex; justify-content: space-between; margin: 15px 0 0 0; }
  div#popup-settings div.container section.mailboxes footer h6 { margin: 0; padding: 0; font-size: 11px; color: rgba(0, 0, 0, 0.2); cursor: pointer; }
  div#popup-settings div.container section.mailboxes footer h6:hover { color: rgba(0, 0, 0, 0.5); }
  div#popup-settings div.container section.blacklist div.add { display: flex; margin: 40px 40px 0 40px; }
  div#popup-settings div.container section.blacklist div.add input { width: 300px; }
  div#popup-settings div.container section.blacklist div.add button { margin-left: 20px; }
  div#popup-settings div.container section.blacklist div.words { display: flex; padding: 20px 33px; }
  div#popup-settings div.container section.blacklist div.word { display: flex; align-items: center; margin: 7px; padding: 5px 13px; border-radius: 25px; 
    background: rgba(0, 0, 0, 0.05); }
  div#popup-settings div.container section.blacklist div.word p { margin: 0; padding: 0; font-size: 13px; color: rgba(0, 0, 0, 0.7); }
  div#popup-settings div.container section.blacklist div.word i.material-icons { display: block; width: 13px; height: 13px; margin-top: 2px; margin-left: 3px; font-size: 13px; 
    color: rgba(0, 0, 0, 0.1); cursor: pointer; }
  div#popup-settings div.container section.blacklist div.word i.material-icons:hover { color: rgba(0, 0, 0, 1); } 
  div#popup-settings div.container section.password { padding: 20px 40px; }
  div#popup-settings div.container section.password input, div#popup-settings div.container section.password button { width: 300px; }


  @media (max-width: 520px) {
    div#popup-settings div.container section.mailboxes { justify-content: center; }
    div#popup-settings div.container section.password input, div#popup-settings div.container section.password button { width: 100%; }
  }
</style>
