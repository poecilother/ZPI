<template>
  <div id="alert" class="error">
    <h6>Podano błędny login lub hasło</h6>
  </div>
</template>

<script>
export default {
  name: 'Alert',

}
</script>

<style lang="scss">
  div#alert { position: fixed; left: 0; bottom: 0; width: 100%; min-height: 35px; max-height: 70px; }
  div#alert.success { background: rgb(82,255,66); background: linear-gradient(90deg, rgba(50,38,148,1) 0%, rgba(82,255,66,1) 100%); }
  div#alert.error { background: rgb(50,38,148); background: linear-gradient(90deg, rgba(50,38,148,1) 0%, rgba(148,41,38,1) 100%); }
  div#alert h6 { margin: 0; padding: 0; text-align: center; line-height: 35px; color: rgba(255, 255, 255, 0.8); font-size: 16px; font-weight: 400; }
</style>
