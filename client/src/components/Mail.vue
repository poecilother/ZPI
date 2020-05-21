<template>
<div id="mail-wrapper">
  <div id="mail" v-for="m in mail" :key="m.messageId">
    <h4>{{ m.subject }}</h4>
    <div id="mail-container">
      <header>
        <h5>{{ m.from.name }} &lt;{{ m.from.address }}&gt;</h5>
        <h6>{{ changeDate(m.date) }}</h6>
      </header>
      <div id="mail-content" v-html="m.body">
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Mail',
  data(){
    return{
      mail: [],
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    readMailId(){
      return this.$store.state.readMailId;
    },
  },
  mounted(){
    this.getMail();
  },
  watch: {
    newToken(){
      if(this.newToken == -10){
        this.getMail();
      }
    },
    readMailId(){
      if(this.readMailId == 0){
        this.$router.push('/inbox')
      }
    },
  },
  methods: {
    getMail(){
      self = this;
      this.axios.get(this.api + 'mail/getmail', { params: { messageId: this.readMailId }, headers: {  Authorization: localStorage.access_token }})
      .then(function (response) {
        if(response.data.success == -1){
          self.$store.commit('getNewToken', 10);
        }else if(response.data.success == 1){
          self.$store.commit('getNewToken', 0);
          self.mail.push(response.data.mail);
        }
      });
    },
    changeDate(dateString){
      let date = dateString.substring(0, 10);
      let mailYear = date.substring(0, 4);
      let mailMonth = date.substring(5, 7);
      let mailDay = date.substring(8, 10);
      let mailTime = dateString.substring(11, 16);
      let today = new Date();
      let mailDate = new Date(date);
      let substract = new Date(Math.abs(mailDate - today));
      let substractDays = substract.getDate() - 1;
      if(substractDays == 0){
        return mailTime;
      }else if(substractDays == 1){
        return 'Wczoraj, ' + mailTime;
      }else if(substractDays > 1 && substractDays < 7){
        let days = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
        return days[mailDate.getDay()] + ', ' + mailTime;
      }else if(mailYear == today.getFullYear()){
        return mailDay + '-' + mailMonth + ' ' + mailTime
      }else{
        return date + ' ' + mailTime;
      }
    },
  }
}
</script>

<style lang="scss">
  div#mail-wrapper { width: calc(100% - 300px); overflow-y: overlay; }
  div#mail { width: 100%; color: #000; }
  div#mail h4 { margin: 20px; padding: 0; color: rgba(0, 0, 0, 0.7); font-weight: 600; font-size: 22px; }
  div#mail div#mail-container { margin: 10px; padding: 30px; background: #fff; border: 1px solid #edebe9; }
  div#mail div#mail-container header h5 { margin: 0; padding: 0; font-weight: 400; font-weight: 400; font-size: 18px; color: rgba(0, 0, 0, 0.7); }
  div#mail div#mail-container header h6 { margin: 0; padding: 0; font-weight: 400; color: rgba(0, 0, 0, 0.4); font-weight: 400; font-size: 14px; }
  div#mail div#mail-content { margin-top: 20px; }

  @media (max-width: 1200px) {
    div#mail-wrapper { width: 100%; }
  }
</style>
