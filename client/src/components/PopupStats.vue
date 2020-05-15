<template>
  <div id="popup-stats" class="popup" v-if="showPopup">
    <div class="shadow" @click="closePopup()"></div>
    <div class="container">
      <header>
        <h4>Statystyki</h4>
        <div class="icon-close" v-b-tooltip.hover title="Zamknij" @click="closePopup()">
          <i class="material-icons">close</i>
        </div>
      </header>
      <h5 class="section-header">Ogólne</h5>
      <section class="all">
        <div class="chart">
          <h6>Rozkład maili</h6>
          <apexchart width="340" height="220" type="donut" :options="mailCompositionOptions" :series="mailCompositionSeries"></apexchart>
        </div>
        <div class="chart">
          <h6>Filtr spamu</h6>
          <apexchart width="340" height="220" type="donut" :options="spamFilterOptions" :series="spamFilterSeries"></apexchart>
        </div>
        <div class="chart">
          <h6>Filtr spamu</h6>
          <apexchart width="340" height="220" type="donut" :options="spamFilter2Options" :series="spamFilter2Series"></apexchart>
        </div>
        <div class="chart">
          <h6>Filtr spamu</h6>
          <apexchart width="340" height="220" type="donut" :options="spamFilter3Options" :series="spamFilter3Series"></apexchart>
        </div>
        <div class="chart">
          <h6>Filtr spamu</h6>
          <apexchart width="680" height="440" type="area" :options="spamFilter4Options" :series="spamFilter4Series"></apexchart>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupStats',
  data() {
    return {
      mailCompositionOptions: {
        labels: ['Odebrane', 'Spam', 'Usunięte'],
        colors:['#00e396', '#ff4560', '#feb019']
      },
      mailCompositionSeries: [44, 55, 41],
      spamFilterOptions: {
        labels: ['Ham', 'Spam'],
        colors:['#00e396', '#ff4560',]
      },
      spamFilterSeries: [44, 55],
      spamFilter2Options: {
        labels: ['Algorytm', 'Blacklista słów', 'Blacklista maili'],
        colors:['#00e396', '#008ffb', '#775dd0']
      },
      spamFilter2Series: [44, 55, 45],
      spamFilter3Options: {
        labels: ['Tekst', 'Obrazki',],
        colors:['#008ffb', '#775dd0']
      },
      spamFilter3Series: [44, 55,],
      spamFilter4Options: {
        xaxis: {
          categories: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
        }
      },
      spamFilter4Series: [{
        name: 'Ham',
        data: [30, 40, 546, 43, 234, 233, 12]
      },{name: 'Spam',
        data: [57, 345, 453, 233, 543, 122, 81]
      },]
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
    newToken(){
      return this.$store.state.newToken;
    },
    showPopup(){
      return this.$store.state.popupStats;
    },
  },

  watch:{
  },
  methods: {
    closePopup(){
      this.$store.commit('togglePopupStats');
    },
  }
}
</script>

<style lang="scss">
  div#popup-stats div.container { width: calc(100% - 40px); max-width: 100%; height: calc(100% - 40px); overflow-y: overlay; top: 20px; left: 20px;  color: #000;  }
  div#popup-stats div.container h5.section-header { height: 35px; line-height: 35px; margin: 20px 40px; padding: 0 20px; color: rgba(0, 0, 0, 0.5); font-size: 18px; 
  font-weight: 400; border-left: 2px solid rgba(0, 0, 0, 0.1); }
  div#popup-stats div.container section { display: flex; flex-wrap: wrap; justify-content: center; }
  div#popup-stats div.container h6 { margin: 10px 0; padding: 0x; font-size: 18px; color: rgba(0, 0, 0, 0.7); }
  div#popup-stats div.container div.chart { margin: 40px 80px; }

  @media (max-width: 960px) {
    div#popup-stats div.container section { margin: 20px 40px; }
  }
</style>
