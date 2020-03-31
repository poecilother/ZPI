<template>
  <div id="popup-add-mail" class="popup" v-if="showPopup">
    <div class="shadow" @click="closePopup()"></div>
    <div class="container">
      <header>
        <h4>Dodaj skrzynkę</h4>
        <div class="icon-close" v-b-tooltip.hover title="Zamknij" @click="closePopup()">
          <i class="material-icons">close</i>
        </div>
      </header>
      <section class="mailboxes">
        <ul>
          <li class="outlook" :class="{ active: mailbox == 0 }" v-b-tooltip.hover title="Outlook" @click="changeMailbox(0)">Outlook</li>
          <li class="gmail" :class="{ active: mailbox == 1 }" v-b-tooltip.hover title="Gmail" @click="changeMailbox(1)">Google</li>
          <li class="other" :class="{ active: mailbox == 2 }" v-b-tooltip.hover title="Inne" @click="changeMailbox(2)">Outlook</li>
        </ul>
      </section>
      <section class="protocols">
        <button :class="{ active: protocol == 0 }" v-b-tooltip.hover title="Wybierz protokół" @click="changeProtocol(0)">imap</button>
        <button :class="{ active: protocol == 1 }" v-b-tooltip.hover title="Wybierz protokół" @click="changeProtocol(1)">pop3</button>
      </section>
      <section class="auth">
        <input class="default" type="text" placeholder="Adres serwera" v-model="address" v-if="addressShow">
        <input class="default" type="text" placeholder="Email" v-model="email">
        <input class="default" type="password" placeholder="Hasło" v-model="password">
        <button class="default">dodaj<i class="material-icons">keyboard_arrow_right</i></button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupAddMail',
  data(){
    return{
      mailbox: 0,
      protocol: 0,
      addressShow: 0,
      address: '',
      email: '',
      password: ''
    }
  },
  computed:{
    showPopup(){
      return this.$store.state.popupAddMail;
    }
  },
  methods: {
    closePopup(){
      this.$store.commit('togglePopupAddMail');
    },
    changeMailbox(id){
      this.mailbox = id;
      if(id == 2){
        this.addressShow = 1;
      }else{
        this.addressShow = 0;
      }
    },
    changeProtocol(id){
      this.protocol = id;
    }
  }
}
</script>

<style lang="scss">
  div#popup-add-mail div.container section.mailboxes { padding: 20px 50px; }
  div#popup-add-mail div.container section.mailboxes ul { display: flex; margin: 0; padding: 0; }
  div#popup-add-mail div.container section.mailboxes ul li { width: 98px; height: 98px; margin: 0; padding: 0; list-style: none; text-indent: -999px; cursor: pointer; 
    border: 1px solid #fff; }
  div#popup-add-mail div.container section.mailboxes ul li.outlook { background: url('../assets/mail-outlook-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.outlook:hover { background: rgba(0, 0, 0, 0.1) url('../assets/mail-outlook-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.outlook.active { background: rgba(0, 0, 0, 0.1) url('../assets/mail-outlook-32.png') no-repeat 50% 50%;  }
  div#popup-add-mail div.container section.mailboxes ul li.gmail { background: url('../assets/mail-gmail-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.gmail:hover { background: rgba(0, 0, 0, 0.1) url('../assets/mail-gmail-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.gmail.active{ background: rgba(0, 0, 0, 0.1) url('../assets/mail-gmail-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.other { background: url('../assets/mail-other-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.other:hover { background: rgba(0, 0, 0, 0.1) url('../assets/mail-other-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.mailboxes ul li.other.active { background: rgba(0, 0, 0, 0.1) url('../assets/mail-other-32.png') no-repeat 50% 50%; }
  div#popup-add-mail div.container section.protocols { display: flex; padding: 20px 50px; }
  div#popup-add-mail div.container section.protocols button { display: block; height: 40px; color: rgba(0, 0, 0, 0.5); width: 50%; border: 0; text-transform: uppercase; 
    font-size: 14px; letter-spacing: 4px; background: rgba(0, 0, 0, 0.05); }
  div#popup-add-mail div.container section.protocols button:focus { outline: 0; }
  div#popup-add-mail div.container section.protocols button:hover { color: rgba(0, 0, 0, 0.9); background: rgba(0, 0, 0, 0.2); }
  div#popup-add-mail div.container section.protocols button.active:first-child { color: rgba(255, 255, 255, 0.7); 
    background: linear-gradient(90deg, rgba(132,83,198,1) 0%, rgba(232,49,203,1) 100%); }
  div#popup-add-mail div.container section.protocols button.active:last-child { color: rgba(255, 255, 255, 0.7); 
    background: linear-gradient(90deg,rgba(232,49,203,1) 0%, rgba(132,83,198,1) 100%,); }
  div#popup-add-mail div.container section.auth { padding: 20px 50px; }
  div#popup-add-mail div.container section.auth button { margin-top: 40px; }

  @media (max-width: 500px) {
    div#popup-add-mail div.container { width: calc(100% - 40px); top: 20px; left: 20px; }
    div#popup-add-mail div.container section.mailboxes ul { justify-content: space-between; }
  }
</style>
