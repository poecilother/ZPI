<template>
  <menu class="core" v-if="menu">
    <header>
      <div id="menu-close" v-b-tooltip.hover title="Zamknij menu" @click="closeMenu()">
        <i class="material-icons">close</i>
      </div>
      <div id="refresh" v-b-tooltip.hover title="Pobierz pocztę">
        <i class="material-icons">autorenew</i>
      </div>
    </header>
    <div class="mail">
      <h3 class="all">Wszystkie</h3>
      <ul>
        <li class="active">
          <i class="material-icons">inbox</i>
          <h4>Skrzynka odbiorcza</h4>
          <h5>25</h5>
        </li>
        <li>
          <i class="material-icons">report</i>
          <h4>Spam</h4>
          <h5>5</h5>
        </li>
        <li>
          <i class="material-icons">delete</i>
          <h4>Usunięte</h4>
          <h5>3</h5>
        </li>
      </ul>
    </div>
    <div class="mail" v-for="box in boxes" :key="box.user">
      <h3 :class="{ outlook: getHost(box.user) == 'outlook', gmail: getHost(box.user) == 'gmail',}">{{ getUserLogin(box.user) }}</h3>
      <ul>
        <li class="active">
          <i class="material-icons">inbox</i>
          <h4>Skrzynka odbiorcza</h4>
          <h5>25</h5>
        </li>
        <li>
          <i class="material-icons">report</i>
          <h4>Spam</h4>
          <h5>5</h5>
        </li>
        <li>
          <i class="material-icons">delete</i>
          <h4>Usunięte</h4>
          <h5>3</h5>
        </li>
      </ul>
    </div>
  </menu>
</template>

<script>
export default {
  name: 'MenuCore',
  data(){
    return{
      boxes: ''
    }
  },
  computed: {
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    menu () {
      return this.$store.state.menu;
    },
    reloadBoxes(){
      return this.$store.state.reloadBoxes;
    }
  },
  created(){
    this.getBoxesApi();
  },
  watch:{
    newToken(){
      if(this.newToken == -6){
        this.getBoxesApi();
      }
    },
    showPopup(){
      this.getBoxesApi();
    },
    reloadBoxes(){
      this.getBoxesApi();
    }
  },
  methods:{
    closeMenu(){
      this.$store.commit('toggleMenu', 0);
    },
    getBoxesApi(){
      let self = this;
      this.axios.get(this.api + 'mail/boxes', { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 6);
        }else{
          self.$store.commit('getNewToken', 0);
          self.boxes = response.data.boxes;
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
  menu.core { display: block; width: 300px; height: 100%; margin: 0; padding: 0; overflow-y: overlay; border-right: 1px solid #edebe9; background: $grey; }
  menu.core::-webkit-scrollbar { display: none; }
  menu.core header { display: none; justify-content: space-between; height: 50px; }
  menu.core header div { display: flex; justify-content: center; align-items: center; width: 60px; height: 50px; cursor: pointer; }
  menu.core header div:hover { background: $blue; }
  menu.core header div i.material-icons { color: rgba(255, 255, 255, 0.9); font-size: 25px; color: rgba(0, 0, 0, 0.8); }
  menu.core header div:hover i.material-icons { color: #fff; }
  menu.core div.mail h3 { height: 50px; margin: 0; padding: 0 0 0 64px; line-height: 50px; color: rgba(255, 255, 255, 0.9); font-size: 17px; font-weight: 400; 
    background: url('../assets/mail-other-24.png') no-repeat 20px 50%, $purpleDark; }
  menu.core div.mail h3.all { background: url('../assets/mail-all-24.png') no-repeat 20px 50%, $purpleDark; }
  menu.core div.mail h3.outlook { background: url('../assets/mail-outlook-24.png') no-repeat 20px 50%, $purpleDark; }
  menu.core div.mail h3.gmail { background: url('../assets/mail-gmail-24.png') no-repeat 20px 50%, $purpleDark; }
  menu.core div.mail ul { margin: 0; padding: 0; }
  menu.core div.mail ul li { display: flex; height: 50px; list-style: none; color: rgba(0, 0, 0, 0.6); }
  menu.core div.mail ul li.active { background: #E8E8E8; }
  menu.core div.mail ul li:hover { background: #E8E8E8; cursor: pointer; }
  menu.core div.mail ul li h4 { margin: 0 auto 0 0; padding: 0; line-height: 50px; font-size: 16px; }
  menu.core div.mail ul li h5 { margin: 0 20px; padding: 0; line-height: 50px; font-size: 16px; }
  menu.core div.mail ul li i.material-icons { margin: 0 20px; line-height: 50px; font-size: 19px; }
  menu.core div.mail ul li:hover h4, menu.core div.mail ul li:hover h5, menu.core div.mail ul li:hover i.material-icons {  color: rgba(0, 0, 0, 0.8); }
  menu.core div.mail ul li.active h5 { color: $purpleDark; font-weight: 600; }
  menu.core div.mail ul li.active i.material-icons { color: $purpleDark; }

  @media (max-width: 1200px) {
    menu.core { position: fixed; top: 0; left: 0; border: 0; box-shadow: 0 1px 7px #000; }
    menu.core header { display: flex; }
  }
</style>
