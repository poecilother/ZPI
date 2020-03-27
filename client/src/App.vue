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
