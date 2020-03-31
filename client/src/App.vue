<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  html { height: 100vh; }
  body { height: 100vh; font-family: 'rawline', sans-serif; color: #fff; }
  div#app { height: 100vh; }
  h1, h2, h3, h4, h5, h6 { line-height: normal; }

  div.popup { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); position: absolute; top: 0; left: 0; }
  div.popup div.shadow { width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); position: absolute; top: 0; left: 0; }
  div.popup div.container { width: 400px; height: 600px; margin: 0; padding: 0; background: #fff; position: absolute; top: calc(50% - 300px); left: calc(50% - 200px); 
  border-radius: 15px; overflow-y: overlay; box-sizing: border-box; max-width: 100%;  }
  div.popup div.container header { display: flex; align-items: center; height: 70px; padding: 0 10px; }
  div.popup div.container header div.icon-close { display: flex; justify-content: center; align-items: center; width: 50px; height: 50px; margin-left: auto; 
  cursor: pointer; }
  div.popup div.container header div.icon-close i.material-icons { color: rgba(0, 0, 0, 0.5); font-size: 28px; }
  div.popup div.container header div.icon-close:hover i.material-icons { color: rgba(0, 0, 0, 0.8); }
  div.popup div.container header h4 { margin: 0 0 0 13px; padding: 0; color: rgba(0, 0, 0, 0.5); font-size: 20px; line-height: 50px; font-weight: 400; }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-button { width: 0px; height: 0px; }
  ::-webkit-scrollbar-thumb { background: #58167a; border: 0px none #faf9f8; border-radius: 100px; }
  ::-webkit-scrollbar-thumb:hover { background: #58167a; }
  ::-webkit-scrollbar-thumb:active { background: #322694; }
  ::-webkit-scrollbar-track { background: transparent; border: 0px none #faf9f8; border-radius: 100px; }
  ::-webkit-scrollbar-track:hover { background: transparent; }
  ::-webkit-scrollbar-track:active { background: transparent; }
  ::-webkit-scrollbar-corner { background: transparent; }
</style>
