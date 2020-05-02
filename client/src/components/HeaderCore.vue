<template>
  <header class="core">
    <h1>C<span>lean</span>M<span>ail</span></h1>
    <div id="menu" v-b-tooltip.hover title="Menu" @click="showMenu()">
      <i class="material-icons">menu</i>
    </div>
    <nav>
      <ul>
        <li>
          <a href="javascript:;" v-b-tooltip.hover title="Dodaj nową skrzynkę pocztową" @click="showPopupAddMail()">
            <i class="material-icons">add_box</i>
          </a>
        </li>
        <li v-if="boxesCount != 0 || accountType == 1">
          <a href="javascript:;" v-b-tooltip.hover title="Ustawienia" @click="showPopupSettings()">
            <i class="material-icons">settings</i>
          </a>
        </li>
        <li>
          <a href="javascript:;" v-b-tooltip.hover title="Wyloguj" @click="logout()">
            <i class="material-icons">exit_to_app</i>
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderCore',
  computed: {
    boxesCount () {
      return this.$store.state.boxesCount;
    },
    accountType () {
      return this.$store.state.accountType;
    },
  },
  methods:{
    showMenu(){
      this.$store.commit('toggleMenu', 1);
    },
    showPopupAddMail(){
      this.$store.commit('togglePopupAddMail');
    },
    showPopupSettings(){
      this.$store.commit('togglePopupSettings');
    },
    logout(){
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      this.$store.commit('changeAccountType', -1);
      this.$store.commit('changeBoxesCount', -1);
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
  header.core { display: flex; justify-content: space-between; height: 50px; background: #58167a; 
    background: linear-gradient(315deg, rgba(50,38,148,1) 0%, rgba(87,23,120,1) 100%); }
  header.core h1 { display: block; width: 300px; margin: 0; padding: 0; color: rgba(255, 255, 255, 0.6); font-size: 24px; height: 200px; font-weight: 600; 
    letter-spacing: 5px; line-height: 50px; text-transform: uppercase; color: $purple; text-align: center; }
  header.core h1 span { font-size: 16px; font-weight: 700; }
  header.core div#menu { display: none; justify-content: center; align-items: center; width: 60px; height: 50px; cursor: pointer; }
  header.core div#menu:hover { background: $blue; }
  header.core div#menu i.material-icons { color: rgba(255, 255, 255, 0.9); font-size: 25px; }
  header.core nav ul { display: flex; margin: 0; padding: 0; }
  header.core nav ul li { list-style: none; }
  header.core nav ul li a { display: block; width: 60px; height: 50px; text-align: center; }
  header.core nav ul li a:hover { background: $purpleDark; }
  header.core nav ul li a i.material-icons { line-height: 50px; color: rgba(255, 255, 255, 0.9); font-size: 25px; }
  header.core nav ul li a:hover i.material-icons { color: #fff; }

  @media (max-width: 1200px) {
    header.core h1 { display: none; }
    header.core div#menu { display: flex; }
  }
</style>
