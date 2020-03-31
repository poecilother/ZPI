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
      <h5 class="section-header">Zarządzanie skrzynkami</h5>
      <section class="mailboxes">
        <div class="mailbox outlook">
          <button class="delete"><i class="material-icons">delete</i></button>
          <h3>suchyy</h3>
          <div class="spam-level" v-b-tooltip.hover title="Poziom filtrowania spamu">
            <button class="active">easy</button>
            <button>medium</button>
            <button>hard</button>
          </div>
          <h5>Outlook</h5>
        </div>
        <div class="mailbox outlook">
          <button class="delete"><i class="material-icons">delete</i></button>
          <h3>suchyy</h3>
          <div class="spam-level" v-b-tooltip.hover title="Poziom filtrowania spamu">
            <button>easy</button>
            <button class="active">medium</button>
            <button>hard</button>
          </div>
          <h5>Outlook</h5>
        </div>
        <div class="mailbox outlook">
          <button class="delete"><i class="material-icons">delete</i></button>
          <h3>suchyy</h3>
          <div class="spam-level" v-b-tooltip.hover title="Poziom filtrowania spamu">
            <button>easy</button>
            <button>medium</button>
            <button class="active">hard</button>
          </div>
          <h5>Outlook</h5>
        </div>
        <div class="mailbox outlook">
          <button class="delete"><i class="material-icons">delete</i></button>
          <h3>suchyy</h3>
          <div class="spam-level" v-b-tooltip.hover title="Poziom filtrowania spamu">
            <button class="active">easy</button>
            <button>medium</button>
            <button>hard</button>
          </div>
          <h5>Outlook</h5>
        </div>
        <div class="mailbox outlook">
          <button class="delete"><i class="material-icons">delete</i></button>
          <h3>suchyy</h3>
          <div class="spam-level" v-b-tooltip.hover title="Poziom filtrowania spamu">
            <button class="active">easy</button>
            <button>medium</button>
            <button>hard</button>
          </div>
          <h5>Outlook</h5>
        </div>
      </section>
      <h5 class="section-header">Zmiana hasła</h5>
      <section class="password">
        <input class="default" type="password" placeholder="Nowe hasło">
        <input class="default" type="password" placeholder="Powtórz hasło">
        <button class="default">zmień<i class="material-icons">edit</i></button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupSettings',
  data(){
    return{
    }
  },
  computed:{
    showPopup(){
      return this.$store.state.popupSettings;
    }
  },
  methods: {
    closePopup(){
      this.$store.commit('togglePopupSettings');
    },
  }
}
</script>

<style lang="scss">
  div#popup-settings div.container { width: calc(100% - 40px); max-width: 100%; height: calc(100% - 40px); overflow-y: overlay; top: 20px; left: 20px;  color: #000;  }
  div#popup-settings div.container h5.section-header { height: 35px; line-height: 35px; margin: 20px 0 20px 40px; padding: 0 20px; color: rgba(0, 0, 0, 0.5); font-size: 18px; 
  font-weight: 400; border-left: 2px solid rgba(0, 0, 0, 0.1); }
  div#popup-settings div.container section.mailboxes { display: flex; flex-wrap: wrap; padding: 0; }
  div#popup-settings div.container section.mailboxes button:focus { outline: 0; }
  div#popup-settings div.container section.mailboxes div.mailbox { display: flex; flex-direction: column; width: 200px; height: 175px; margin: 20px 0 40px 40px; padding: 10px; 
  background: rgba(0, 0, 0, 0.2); border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.05); }
  div#popup-settings div.container section.mailboxes div.mailbox.outlook { background: url('../assets/mail-outlook-24.png') no-repeat 10px 10px; border: 1px solid rgba(0, 0, 0, 0.05); }
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
  div#popup-settings div.container section.mailboxes h5 { margin: 10px 0 0 0; padding: 0; text-align: right; font-size: 11px; color: rgba(0, 0, 0, 0.2); }
  div#popup-settings div.container section.password { padding: 20px 40px; }
  div#popup-settings div.container section.password input, div#popup-settings div.container section.password button { width: 300px; }


  @media (max-width: 520px) {
    div#popup-settings div.container section.mailboxes { justify-content: center; }
    div#popup-settings div.container section.password input, div#popup-settings div.container section.password button { width: 100%; }
  }
</style>
