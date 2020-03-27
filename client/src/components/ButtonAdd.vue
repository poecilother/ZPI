<template>
  <a href="#" id="add-inbox">
    <h2>Nowa skrzynka pocztowa</h2>
    <i class="material-icons">add</i>
  </a>
</template>

<script>
export default {
  name: 'ButtonAdd',
}
</script>

<style lang="scss">
  a#add-inbox { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 600px; height: 400px; text-decoration: none;
  position: absolute; top: calc(50% - 200px); left: calc(50% - 300px); color: rgba(0, 0, 0, 0.1); }
  a#add-inbox:hover { color: rgba(0, 0, 0, 0.3);  }
  a#add-inbox h2 { margin: 20px 0; padding: 0; font-size: 40px; }
  a#add-inbox i.material-icons { font-size: 45px; }

  @media (max-width: 600px) {
    a#add-inbox { width: 100%; height: calc(100% - 50px); top: 50px; left: 0; }
    a#add-inbox h2 { margin: 20px 0; padding: 0; font-size: 35px; }
    a#add-inbox i.material-icons { font-size: 40px; }
  }
</style>
