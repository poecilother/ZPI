<template>
  <div class="inbox">
    <div class="loaded" v-if="!loader">
      <header-core></header-core>
      <header-sub v-if="boxesCount > 0"></header-sub>
      <div id="wrapper" v-if="boxesCount > 0">
        <menu-core></menu-core>
        <router-view></router-view>
      </div>
      <button-add v-if="boxesCount == 0"></button-add>
    </div>
    <popup-add-mail></popup-add-mail>
    <popup-settings></popup-settings>
    <popup-stats></popup-stats>
    <alert></alert>
    <div class="spinner" v-if="loader">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
  </div>
</template>

<script>
import HeaderCore from '@/components/HeaderCore.vue'
import HeaderSub from '@/components/HeaderSub.vue'
import MenuCore from '@/components/MenuCore.vue'
import Box from '@/components/Box.vue'
import ButtonAdd from '@/components/ButtonAdd.vue'
import PopupAddMail from '@/components/PopupAddMail.vue'
import PopupSettings from '@/components/PopupSettings.vue'
import PopupStats from '@/components/PopupStats.vue'
import Alert from '@/components/Alert.vue'

export default {
  name: 'Inbox',
  components: {
    HeaderCore,
    HeaderSub,
    MenuCore,
    Box,
    ButtonAdd,
    PopupAddMail,
    PopupSettings,
    PopupStats,
    Alert
  },
  data(){
    return{
      resizeOnce: 0,
      loader: 1,
      loaded: 0,
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu;
    },
    boxesCount () {
      return this.$store.state.boxesCount;
    },
    accountType () {
      return this.$store.state.accountType;
    },
  },
  created(){
    this.toggleMenuOnCreate();
    window.addEventListener('resize', this.toggleMenuOnCreate);
    if(window.innerWidth <= 1200){
      this.$store.commit('toggleMenu', 0);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.toggleMenuOnCreate);
  },
  watch:{
    boxesCount(){
      if(this.laoded != 2){
        this.loaded += 1;
      }
    },
    accountType(){
      if(this.laoded != 2){
        this.loaded += 1;
      }
    },
    loaded(){
      if(this.loaded == 2){
        self = this;
        setTimeout(function(){
          self.loader = 0;
        }, 500);
      }
    }
  },
  methods:{
    toggleMenuOnCreate(){
      if(window.innerWidth <= 1200){
        if(!this.resizeOnce){
          this.resizeOnce = 1;
          this.$store.commit('toggleMenu', 0);
        }
      }else{
        if(!this.menu){
          this.resizeOnce = 0;
          this.$store.commit('toggleMenu', 1);
        }
      }
    },
  }
}
</script>

<style lang="scss">
  div.inbox { height: 100vh; }
  div#wrapper { display: flex; height: calc(100vh - 50px - 50px); background: #faf9f8; }

  .spinner {
    position: absolute;
    top: 50%;
    left: calc(50% - 35px);
    width: 70px;
    text-align: center;
  }

  .spinner > div {
    width: 18px;
    height: 18px;
    background: #58167a; 
    background: linear-gradient(315deg, rgba(50,38,148,1) 0%, rgba(87,23,120,1) 100%);

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }

  @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% { 
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
</style>
