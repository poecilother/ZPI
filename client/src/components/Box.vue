<template>
  <section id="box">
    <ul>
      <li :class="{ unread: mail.unseen == 1 , checked: selectedMails.indexOf(mail.messageId) != -1 }" v-for="mail in mails" :key="mail.messageId" @click="open(mail.messageId, mail.unseen)">
        <div class="checkbox-field" @click.stop="select(mail.messageId, mail.unseen)"><div class="checkbox"><i class="material-icons">check</i></div></div>
        <div class="details">
          <h5>{{ shortSubject(mail.subject) }}</h5>
          <p>{{ shortFrom(mail.from) }}</p>
        </div>
        <h6>{{ changeDate(mail.date) }}</h6>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Box',
  data(){
    return{
      mails: [],
      unseenIds: [],
      callGetMails: 0,
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    activeInboxUser(){
      return this.$store.state.activeInboxUser;
    },
    activeInboxFolder(){
      return this.$store.state.activeInboxFolder;
    },
    selectedMails(){
      return this.$store.state.selectedMails;
    },
    subAction(){
      return this.$store.state.subAction;
    },
    downloadMails(){
      return this.$store.state.downloadMails;
    },
    reloadMails(){
      return this.$store.state.reloadMails;
    }
  },
  mounted(){
    this.getMails()
  },
  watch:{
    newToken(){
      if(this.newToken == -8){
        this.getMails();
      }else if(this.newToken == -17){
        this.changeUnseenApi();
      }
    },
    callGetMails(){
      if(this.callGetMails == 1){
        this.getMails();
        this.callGetMails = 0;
      }
    },
    reloadMails(){
      this.getMails();
    },
    activeInboxUser(){
      this.getMails();
    },
    activeInboxFolder(){
      this.getMails();
    },
    subAction(){
      switch(this.subAction){
        case 1:
          this.$store.commit('clearSelected');
          this.selectAll();
          this.$store.commit('changeSubAction', 0);
        break;
        case 2:
          this.$store.commit('clearSelected');
          this.$store.commit('changeSubAction', 0);
        break;
        case 3:
          let mailsArray = []
          for(let i = 0; i < this.mails.length; i++){
            mailsArray.push(this.mails[i].messageId)
          }
          this.changeUnseen(mailsArray);
          this.$store.commit('clearSelected');
          this.$store.commit('changeSubAction', 0);
        break;
        case 4:
          this.changeUnseen(this.selectedMails);
          this.$store.commit('clearSelected');
          this.$store.commit('changeSubAction', 0);
        break;
      }
    },
    downloadMails(){
      if(this.downloadMails == 1){
        this.getMails();
        this.$store.commit('changeDownloadMails');
      }
    }
  },
  methods:{
    select(id, unseen){
      this.$store.commit('selectMail', id);
      if(unseen){
        this.$store.commit('selectUnseenMails', id);
      }
    },
    open(id, unseen){
      this.$store.commit('changeReadMailId', id);
      this.$store.commit('changeReadMailUnseen', unseen);
      this.$router.push('/inbox/mail')
      if(unseen){
        this.changeUnseen([id]);
      }
    },
    shortSubject(value){
      if(value !== undefined && value.length >= 40){
        value = value.substring(0, 40);
        value += "..."
      }
      return value;
    },
    shortFrom(value){
      if(value.name != ""){
        value = value.name;
      }else{
        value = value.address;
      }
      if(value >= 34){
        value = value.substring(0, 34);
        value += "..."
      }
      return value;
    },
    changeDate(dateString){
      let date = dateString.substring(0, 10);
      let mailYear = date.substring(0, 4);
      let mailMonth = date.substring(5, 7);
      let mailDay = date.substring(8, 10);
      let mailTime = dateString.substring(11, 16);
      let today = new Date();
      let mailDate = new Date(date);
      let substract = new Date(Math.abs(today - mailDate));
      let substractDays = substract.getDate() - 1;
      if(substractDays == 0 && (today.getMonth() + 1) == parseInt(mailMonth) && today.getFullYear() == mailYear){
        return mailTime;
      }else if(substractDays == 1 && (today.getMonth() + 1) == parseInt(mailMonth) && today.getFullYear() == mailYear){
        return 'Wczoraj, ' + mailTime;
      }else if(substractDays > 1 && substractDays < 7 && ((today.getMonth() + 1) == parseInt(mailMonth) || (parseInt(today.getMonth())) == (mailMonth - 1))  && today.getFullYear() == mailYear){
        let days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
        return days[mailDate.getDay()] + ', ' + mailTime;
      }else if(mailYear == today.getFullYear()){
        return mailDay + '-' + mailMonth + ' ' + mailTime
      }else{
        return date + ' ' + mailTime;
      }
    },
    selectAll(){
      for(let i = 0; i < this.mails.length; i++){
        this.select(this.mails[i].messageId, this.mails[i].unseen);
      }
    },
    getMails(){
      self = this;
      this.axios.get(this.api + 'mail/getmails', { params: { user: this.activeInboxUser, folder: this.activeInboxFolder }, headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 8);
        }else if(response.data.success == 1){
          self.$store.commit('getNewToken', 0);
          self.$store.commit('clearSelected');
          self.mails = response.data.mails;
          self.$store.commit('changeAllMails', self.mails.length);
          let mailsUnseen = 0;
          for(let i = 0; i < self.mails.length; i++){
            if(self.mails[i].unseen == 1){
              mailsUnseen++;
            }      
          }
          self.$store.commit('changeUnseenMails', mailsUnseen);
        }
      });
    },
    changeUnseen(ids){
      this.unseenIds = ids;
      this.changeUnseenApi();
    },
    changeUnseenApi(){
      self = this;
      this.axios.put(this.api + 'mail/changeunseen', { messageId: this.unseenIds, unseen: 0 }, { headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 17);
        }else if(response.data.success == 1){
          self.callGetMails = 1;
          self.$store.commit('changeReloadMenuCore');
        }
      });
    }
  }
}
</script>

<style lang="scss">
section#box { width: calc(100% - 300px); color: #000; overflow-y: overlay; }
section#box ul { margin: 0; padding: 0; }
section#box ul li { display: flex; flex-wrap: wrap; align-items: center; width: 100%; min-height: 50px; max-height: 80px; margin-left: -1px; padding: 0 20px 0 16px; padding: 0 20px 0 0px; list-style: none; 
border-bottom: 1px solid #f3f2f1; border-left: 5px solid #fff; background: #fff; cursor: pointer; }
section#box ul li:first-child { border-top: 1px solid #edebe9; }
section#box ul li:hover { background: #E8E8E8; border-left: 5px solid #E8E8E8; }
section#box ul li.checked { background: rgba(88, 22, 122, 0.4); background: linear-gradient(315deg, rgba(50,38,148,0.5) 0%, rgba(87,23,120,0.5) 100%); border: 0; 
   border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-left: 5px;}
section#box ul li.checked:first-child { border-top: 1px solid rgba(255, 255, 255, 0.1); }
section#box ul li.unread { border-left: 5px solid $blue; }
section#box ul li.unread.checked { padding-left: 0; }
section#box ul li.unread:hover { border-left: 5px solid $blue; }
section#box ul li.checked:hover { background: rgba(88, 22, 122, 0.5); }
section#box ul li div.checkbox-field { display: flex; justify-content: center; align-items: center; width: 50px; height: 50px; }
section#box ul li div.checkbox { display: flex; justify-content: center; align-items: center; width: 18px; height: 18px; border-radius: 50%; 
border: 1px solid rgba(0, 0, 0, 0.6); cursor: pointer; }
section#box ul li.checked div.checkbox { background: $purpleDark; border: 0;}
section#box ul li div.checkbox i.material-icons { display: none; font-size: 12px; color: rgba(0, 0, 0, 0.6); }
section#box ul li.checked div.checkbox i.material-icons { display: inline; color: #fff; }
section#box ul li div.checkbox-field:hover div.checkbox i.material-icons { display: inline; }
section#box ul li h5 { width: 500px; margin: 0; padding: 0; font-size: 15px; font-weight: 400; color: rgba(0, 0, 0, 0.8); }
section#box ul li.unread h5 { font-weight: 600; }
section#box ul li p { width: 300px; margin: 0 20px; padding: 0; font-size: 15px; color: rgba(0, 0, 0, 0.6); font-weight: 400; }
section#box ul li.unread p { color: $purpleDark; font-weight: 600; }
section#box ul li h6 { margin: 0 0 0 auto; padding: 0; font-size: 14px; color: rgba(0, 0, 0, 0.6); font-weight: 400; text-align: center; }
section#box ul li div.details { display: flex; }

@media (max-width: 1200px) {
  section#box { width: 100%; }
  section#box ul li { min-height: 110px; max-height: initial; }
  section#box ul li div.checkbox { width: 30px; height: 30px; }
  section#box ul li div.checkbox i.material-icons { font-size: 16px; }
  section#box ul li h5 { width: initial; font-size: 16px; }
  section#box ul li p { display: inline-block; margin: 0; }
  section#box ul li h6 { font-size: 13px; }
  section#box ul li div.details { display: block; margin-left: 20px; }
}

@media (max-width: 500px) {
  section#box ul li { flex-direction: column; padding: 10px 20px 10px 16px; }
  section#box ul li div.checkbox-field { margin-left: auto; }
  section#box ul li div.checkbox { width: 25px; height: 25px; }
  section#box ul li div.checkbox i.material-icons { font-size: 14px; }
  section#box ul li div.details { margin-left: 12.5px; align-self: flex-start;}
  section#box ul li h6 { margin-right: 12.5px; align-self: flex-end; }
}
</style>
