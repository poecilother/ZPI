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
      <h3 class="outlook">242999</h3>
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
    <div class="mail">
      <h3 class="gmail">suchyy</h3>
      <ul>
        <li>
          <i class="material-icons">inbox</i>
          <h4>Skrzynka odbiorcza</h4>
        </li>
        <li>
          <i class="material-icons">report</i>
          <h4>Spam</h4>
        </li>
        <li>
          <i class="material-icons">delete</i>
          <h4>Usunięte</h4>
        </li>
      </ul>
    </div>
  </menu>
</template>

<script>
export default {
  name: 'MenuCore',
  computed: {
    menu () {
      return this.$store.state.menu;
    },
  },
  methods:{
    closeMenu(){
      this.$store.commit('toggleMenu', 0);
    },
  }
}
</script>

<style lang="scss">
menu.core { display: block; width: 300px; height: 100%; margin: 0; padding: 0; overflow-y: overlay; border-right: 1px solid #edebe9; background: #f3f2f1; }
menu.core::-webkit-scrollbar { display: none; }
menu.core header { display: none; justify-content: space-between; height: 50px; }
menu.core header div { display: flex; justify-content: center; align-items: center; width: 60px; height: 50px; cursor: pointer; }
menu.core header div:hover { background: #322694; }
menu.core header div i.material-icons { color: rgba(255, 255, 255, 0.9); font-size: 25px; color: rgba(0, 0, 0, 0.8); }
menu.core header div:hover i.material-icons { color: #fff; }
menu.core div.mail h3 { height: 50px; margin: 0; padding: 0 0 0 64px; line-height: 50px; color: rgba(255, 255, 255, 0.9); font-size: 18px; font-weight: 400; }
menu.core div.mail h3.outlook { background: url('../assets/mail-outlook-24.png') no-repeat 20px 50%, #58167a; }
menu.core div.mail h3.gmail { background: url('../assets/mail-gmail-24.png') no-repeat 20px 50%, #58167a; }
menu.core div.mail ul { margin: 0; padding: 0; }
menu.core div.mail ul li { display: flex; height: 50px; list-style: none; color: rgba(0, 0, 0, 0.6); }
menu.core div.mail ul li.active { background: #E8E8E8; }
menu.core div.mail ul li:hover { background: #E8E8E8; cursor: pointer; }
menu.core div.mail ul li h4 { margin: 0 auto 0 0; padding: 0; line-height: 50px; font-size: 17px; }
menu.core div.mail ul li h5 { margin: 0 20px; padding: 0; line-height: 50px; font-size: 17px; }
menu.core div.mail ul li i.material-icons { margin: 0 20px; line-height: 50px; font-size: 19px; }
menu.core div.mail ul li:hover h4, menu.core div.mail ul li:hover h5, menu.core div.mail ul li:hover i.material-icons {  color: rgba(0, 0, 0, 0.8); }
menu.core div.mail ul li.active h5 { color: #58167a; font-weight: 600; }
menu.core div.mail ul li.active i.material-icons { color: #58167a; }

@media (max-width: 1200px) {
  menu.core { position: fixed; top: 0; left: 0; border: 0; box-shadow: 0 1px 7px #000; }
  menu.core header { display: flex; }
}
</style>
