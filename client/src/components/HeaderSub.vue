<template>
  <header class="sub">
    <div class="container-button">
      <button @click="downloadEmails()">Pobierz pocztę</button>
    </div>
    <ul>
      <li v-if="back == 1" @click="action(8)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Powrót">arrow_back</i>
        <i class="material-icons desktop">arrow_back</i>
        <h5>Powrót</h5>
      </li>
      <li v-if="checkAll == 1" @click="action(1)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Zaznacz wszystkie">check</i>
        <i class="material-icons desktop">check</i>
        <h5>Zaznacz wszystkie</h5>
      </li>
      <li v-if="uncheckAll == 1" @click="action(2)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Odznacz wszystkie">close</i>
        <i class="material-icons desktop">close</i>
        <h5>Odznacz wszystkie</h5>
      </li>
      <li v-if="checkAllAsRed == 1" @click="action(3)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Oznacz wszystkie jako przeczytane">drafts</i>
        <i class="material-icons desktop">drafts</i>
        <h5>Oznacz wszystkie jako przeczytane</h5>
      </li>
      <li v-if="checkAsRed == 1" @click="action(4)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Oznacz jako przeczytane">drafts</i>
        <i class="material-icons desktop">drafts</i>
        <h5>Oznacz jako przeczytane</h5>
      </li>
      <li v-if="spam == 1" @click="action(5)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Wiadomość-śmieć">error_outline</i>
        <i class="material-icons desktop">error_outline</i>
        <h5>Spam</h5>
      </li>
      <li v-if="ham == 1" @click="action(6)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Nie spam">inbox</i>
        <i class="material-icons desktop">inbox</i>
        <h5>Nie spam</h5>
      </li>
      <li v-if="dele == 1" @click="action(7)">
        <i class="material-icons mobile" v-b-tooltip.hover title="Usuń">delete</i>
        <i class="material-icons desktop">delete</i>
        <h5>Usuń</h5>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'HeaderSub',
  data(){
    return{
      checkAll: 1,
      uncheckAll: 0,
      checkAllAsRed: 1,
      checkAsRed: 0,
      dele: 0,
      spam: 0,
      ham: 0,
      back: 0,
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    activeInboxFolder(){
      return this.$store.state.activeInboxFolder;
    },
    selectedMails(){
      return this.$store.state.selectedMails;
    },
    allMails(){
      return this.$store.state.allMails;
    },
    unseenMails(){
      return this.$store.state.unseenMails;
    },
    unseenSelectedMails(){
      return this.$store.state.unseenSelectedMails;
    },
    activeInboxUser(){
      return this.$store.state.activeInboxUser;
    },
    activeInboxFolder(){
      return this.$store.state.activeInboxFolder;
    },
    readMailId(){
      return this.$store.state.readMailId;
    },
    readMailUnseen(){
      return this.$store.state.readMailUnseen;
    },
  },
  mounted(){
    if(this.unseenMails == 0){
      this.checkAllAsRed = 0;
    }
    if(!this.allMails){
        this.checkAll = 0;
        this.uncheckAll = 0;
        this.checkAllAsRed = 0;
        this.checkAsRed = 0;
        this.dele = 0;
        this.spam = 0;
        this.ham = 0;
      }
  },
  watch: {
    newToken(){
      if(this.newToken == -9){
        this.getBoxesApi();
      }
    },
    readMailId(){
      if(this.readMailId != 0){
        this.back = 1;
        this.checkAll = 0;
        this.uncheckAll = 0;
        this.checkAllAsRed = 0;
        if(this.readMailUnseen){
          this.checkAsRed = 1;
        }else{
          this.checkAsRed = 0;
        }
      }else{
        this.back = 0;
        this.checkAsRed = 0;
        this.spam = 0;
        this.ham = 0;
        this.dele = 0;
        this.adjust();
      }
      if(this.activeInboxFolder == 1){
        this.spam = 1;
      }else{
        this.spam = 0;
      }
      if(this.activeInboxFolder == 2){
        this.ham = 1;
      }else{
        this.ham = 0;
      }
      if(this.activeInboxFolder == 3){
        this.dele = 0;
      }else{
        this.dele = 1;
      }
    },
    allMails(){
      if(this.allMails == 0){
        this.checkAll = 0;
        this.uncheckAll = 0;
        this.checkAllAsRed = 0;
        this.checkAsRed = 0;
        this.dele = 0;
        this.spam = 0;
        this.ham = 0;
      }
    },
    selectedMails(){
      this.adjust();
    },
    activeInboxUser(){
      this.adjust();
    },
    activeInboxFolder(){
      this.adjust();
    }
  },
  methods:{
    adjust(){
      if(this.selectedMails.length == 0){
        if(this.allMails == 0){
          this.checkAll = 0;
          this.uncheckAll = 0;
          this.checkAllAsRed = 0;
          this.checkAsRed = 0;
          this.dele = 0;
          this.spam = 0;
          this.ham = 0;
        }else{
          this.checkAll = 1;
          this.uncheckAll = 0;
          if(this.selectedMails.length != 0){
             this.checkAllAsRed = 1;
          }else{
             this.checkAllAsRed = 0;
          }
          this.checkAsRed = 0;
          this.dele = 0;
          this.spam = 0;
          this.ham = 0;
        }
      }else{
        if(this.selectedMails.length != this.allMails && this.unseenSelectedMails.length != 0){
          this.checkAll = 1;
        }else{
          this.checkAll = 0;
        }
        if(this.selectedMails.length != this.allMails && this.unseenSelectedMails.length != 0){
          this.checkAllAsRed = 1;
        }else{
          this.checkAllAsRed = 0;
        }
        this.uncheckAll = 1;
        if(this.unseenSelectedMails.length > 1){
          this.checkAsRed = 1;
        }else{
          this.checkAsRed = 0;
        }
        if(this.activeInboxFolder == 1){
          this.spam = 1;
        }else{
          this.spam = 0;
        }
        if(this.activeInboxFolder == 2){
          this.ham = 1;
        }else{
          this.ham = 0;
        }
        if(this.activeInboxFolder == 3){
          this.dele = 0;
        }else{
          this.dele = 1;
        }
      }
    },
    action(id){
      if(id != 8){
       this.$store.commit('changeSubAction', id);
      }else{
        this.$store.commit('changeReadMailId', 0);
        this.$router.push('/inbox');
      }
    },
    downloadEmails(){
      this.$store.commit('changeAlert', { type: 2, msg: 'Pobieranie...' });
      self = this;
      this.axios.get(this.api + 'mail/downloademails', { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 9);
        }else{
          self.$store.commit('changeAlert', { type: response.data.success, msg: response.data.msg });
        }
      });
    }
  }
}
</script>

<style lang="scss">
  header.sub { display: flex; height: 50px; background: $grey; }
  header.sub div.container-button { display: flex; justify-content: center; align-items: center; width: 300px; }
  header.sub div.container-button button { display: block; height: 35px; padding: 0 25px; background: $blue; border: 0; color: #fff; border-radius: 3px; font-size: 14px; }
  header.sub div.container-button button:hover { background: $blueDark; }
  header.sub ul { display: flex; align-items: center; margin: 0; padding: 0; }
  header.sub ul li { display: flex; max-height: 50px; padding: 7px 10px; list-style: none; color: rgba(0, 0, 0, 0.5); cursor: pointer; overflow: hidden; }
  header.sub ul li:hover { background: #edebe9; color: rgba(0, 0, 0, 0.7); }
  header.sub ul li i.material-icons { font-size: 22px; }
  header.sub ul li i.material-icons.desktop { display: block; }
  header.sub ul li i.material-icons.mobile { display: none; }
  header.sub ul li h5 { display: block; margin: 0 0 0 10px; padding: 0; font-size: 15px; }

  @media (max-width: 1200px) {
    header.sub div.container-button { display: none; }
    header.sub ul li i.material-icons.desktop { display: none; }
    header.sub ul li i.material-icons.mobile { display: inline; }
    header.sub ul li h5 { display: none; }
  }
</style>
