<template>
  <header class="sub">
    <div class="container-button">
      <button>Pobierz pocztę</button>
    </div>
    <ul>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Zaznacz wszystkie">check</i>
        <i class="material-icons desktop">check</i>
        <h5>Zaznacz wszystkie</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Odznacz wszystkie">close</i>
        <i class="material-icons desktop">close</i>
        <h5>Odznacz wszystkie</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Oznacz wszystkie jako przeczytane">drafts</i>
        <i class="material-icons desktop">drafts</i>
        <h5>Oznacz wszystkie jako przeczytane</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Oznacz jako przeczytane">drafts</i>
        <i class="material-icons desktop">drafts</i>
        <h5>Oznacz jako przeczytane</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Usuń">delete</i>
        <i class="material-icons desktop">delete</i>
        <h5>Usuń</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Wiadomość-śmieć">error_outline</i>
        <i class="material-icons desktop">error_outline</i>
        <h5>Wiadomość-śmieć</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Nie spam">inbox</i>
        <i class="material-icons desktop">inbox</i>
        <h5>Nie spam</h5>
      </li>
      <li>
        <i class="material-icons mobile" v-b-tooltip.hover title="Powrót">arrow_back</i>
        <i class="material-icons desktop">arrow_back</i>
        <h5>Powrót</h5>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'HeaderSub',
}
</script>

<style lang="scss">
  header.sub { display: flex; height: 50px; background: $grey; }
  header.sub div.container-button { display: flex; justify-content: center; align-items: center; width: 300px; }
  header.sub div.container-button button { display: block; height: 35px; padding: 0 25px; background: $blue; border: 0; color: #fff; border-radius: 3px; font-size: 14px; }
  header.sub div.container-button button:hover { background: $blueDark; }
  header.sub ul { display: flex; align-items: center; margin: 0; padding: 0; }
  header.sub ul li { display: flex; padding: 7px 10px; list-style: none; color: rgba(0, 0, 0, 0.5); cursor: pointer; }
  header.sub ul li:hover  { background: #edebe9; color: rgba(0, 0, 0, 0.7); }
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
