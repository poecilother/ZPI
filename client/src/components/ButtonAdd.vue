<template>
  <div id="add-inbox" @click="showPopupAddMail()">
    <h2>Nowa skrzynka pocztowa</h2>
    <i class="material-icons">add</i>
  </div>
</template>

<script>
export default {
  name: 'ButtonAdd',
  methods:{
    showPopupAddMail(){
      this.$store.commit('togglePopupAddMail');
    },
  }
}
</script>

<style lang="scss">
  div#add-inbox { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 600px; height: 400px; text-decoration: none;
  position: absolute; top: calc(50% - 200px); left: calc(50% - 300px); color: rgba(0, 0, 0, 0.1); cursor: pointer; }
  div#add-inbox:hover { color: rgba(0, 0, 0, 0.3);  }
  div#add-inbox h2 { margin: 20px 0; padding: 0; font-size: 40px; }
  div#add-inbox i.material-icons { font-size: 45px; }

  @media (max-width: 600px) {
    div#add-inbox { width: 100%; height: calc(100% - 50px); top: 50px; left: 0; }
    div#add-inbox h2 { margin: 20px 0; padding: 0; font-size: 35px; }
    div#add-inbox i.material-icons { font-size: 40px; }
  }
</style>
