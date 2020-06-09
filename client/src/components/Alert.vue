<template>
  <div id="alert" :class="{ info: type == 2, success: type == 1, error: type == 0 }" v-if="show">
    <h6>{{ msg }}</h6>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data(){
    return{
      show: 0,
      timer: 0,
    }
  },
  computed:{
    type(){
      return this.$store.state.alertType;
    },
    msg(){
      return this.$store.state.alertMsg;
    },
  },
  watch:{
    type(){
      if(this.type != -1 && this.type != 2){
        this.show = 1;
        let self = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(function(){
          self.show = 0;
          self.$store.commit('changeAlert', { type: -1, msg: '' });
        }, 3000);
      }else if(this.type == 2){
        clearTimeout(this.timer);
        this.show = 1;
      }
    }
  }
}
</script>

<style lang="scss">
  div#alert { position: fixed; left: 0; bottom: 0; width: 100%; min-height: 35px; max-height: 70px; }
  div#alert.success { background: rgb(82,255,66); background: linear-gradient(90deg, rgba(50,38,148,1) 0%, rgba(82,255,66,1) 100%); }
  div#alert.error { background: rgb(50,38,148); background: linear-gradient(90deg, rgba(50,38,148,1) 0%, rgba(148,41,38,1) 100%); }
  div#alert.info { background: rgb(50,38,148); background: linear-gradient(90deg, rgba(50,38,148,1) 0%, rgb(92,159,255) 100%); }
  div#alert h6 { margin: 0; padding: 0; text-align: center; line-height: 35px; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 400; }
</style>
