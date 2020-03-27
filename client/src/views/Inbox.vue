<template>
  <div class="inbox">
    <header-core></header-core>
    <header-sub></header-sub>
    <div id="wrapper">
      <menu-core></menu-core>
      <router-view></router-view>
    </div>
    <button-add style="display: none;"></button-add>
    <mail-add></mail-add>
  </div>
</template>

<script>
import HeaderCore from '@/components/HeaderCore.vue'
import HeaderSub from '@/components/HeaderSub.vue'
import MenuCore from '@/components/MenuCore.vue'
import Box from '@/components/Box.vue'
import ButtonAdd from '@/components/ButtonAdd.vue'
import MailAdd from '@/components/MailAdd.vue'
import Alert from '@/components/Alert.vue'

export default {
  name: 'Inbox',
  components: {
    HeaderCore,
    HeaderSub,
    MenuCore,
    Box,
    ButtonAdd,
    MailAdd,
    Alert
  },
  data(){
    return{
      resizeOnce: 0,
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu;
    },
  },
  created(){
    window.addEventListener('resize', this.toggleMenuOnCreate);
    if(window.innerWidth <= 1200){
      this.$store.commit('toggleMenu', 0);
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.toggleMenuOnCreate);
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
  div#wrapper { display: flex; height: calc(100vh - 50px - 50px); background: #faf9f8; overflow-y: overlay;}

</style>
