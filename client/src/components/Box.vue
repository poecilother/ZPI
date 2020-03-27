<template>
  <section id="box">
    <ul>
      <li class="unread">
        <div class="checkbox" v-b-tooltip.hover title="Zaznacz / Odznacz"><i class="material-icons">check</i></div>
        <h5>Example Title</h5>
        <p>Lorem ipsum sit dolem</p>
        <h6>16:21</h6>
      </li>
      <li class="unread">
        <div class="checkbox" v-b-tooltip.hover title="Zaznacz / Odznacz"><i class="material-icons">check</i></div>
        <h5>Example Title</h5>
        <p>Lorem ipsum sit dolem</p>
        <h6>16:21</h6>
      </li>
      <li class="unread checked">
        <div class="checkbox" v-b-tooltip.hover title="Zaznacz / Odznacz"><i class="material-icons">check</i></div>
        <h5>Example Title</h5>
        <p>Lorem ipsum sit dolem</p>
        <h6>16:21</h6>
      </li>
      <li>
        <div class="checkbox" v-b-tooltip.hover title="Zaznacz / Odznacz"><i class="material-icons">check</i></div>
        <h5>Example Title</h5>
        <p>Lorem ipsum sit dolem</p>
        <h6>16:21</h6>
      </li>
      <li>
        <div class="checkbox" v-b-tooltip.hover title="Zaznacz / Odznacz"><i class="material-icons">check</i></div>
        <h5>Example Title</h5>
        <p>Lorem ipsum sit dolem</p>
        <h6>16:21</h6>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'Box',
}
</script>

<style lang="scss">
section#box { width: calc(100% - 300px); color: #000; }
section#box ul { margin: 0; padding: 0; }
section#box ul li { display: flex; align-items: center; width: 100%; height: 50px; margin-left: -1px; padding: 0 20px 0 16px; list-style: none; border-bottom: 1px solid #f3f2f1;
border-left: 5px solid #fff; background: #fff; }
section#box ul li:first-child { border-top: 1px solid #edebe9; }
section#box ul li.checked { background: rgba(88, 22, 122, 0.4); background: linear-gradient(315deg, rgba(50,38,148,0.5) 0%, rgba(87,23,120,0.5) 100%); border: 0; }
section#box ul li.unread { border-left: 5px solid #322694; }
section#box ul li:hover { background: #E8E8E8; border-left: 5px solid #E8E8E8; }
section#box ul li.unread:hover { border-left: 5px solid #322694; }
section#box ul li.checked:hover { background: rgba(88, 22, 122, 0.5); }
section#box ul li div.checkbox { display: flex; justify-content: center; align-items: center; width: 18px; height: 18px; margin-right: 20px; border-radius: 50%; 
border: 1px solid rgba(0, 0, 0, 0.6); cursor: pointer; }
section#box ul li.checked div.checkbox { background: #58167a; border: 0;}
section#box ul li div.checkbox i.material-icons { display: none; font-size: 12px; color: rgba(0, 0, 0, 0.6); }
section#box ul li.checked div.checkbox i.material-icons { display: inline; color: #fff; }
section#box ul li div.checkbox:hover i.material-icons { display: inline; }
section#box ul li h5 { width: 300px; margin: 0; padding: 0; font-size: 15px; font-weight: 400; color: rgba(0, 0, 0, 0.8); }
section#box ul li.unread h5 { font-weight: 600; }
section#box ul li p { margin: 0 20px; padding: 0; font-size: 15px; color: rgba(0, 0, 0, 0.6); font-weight: 400; }
section#box ul li.unread p { color: #58167a; font-weight: 600; }
section#box ul li h6 { margin: 0 0 0 auto; padding: 0; font-size: 14px; color: rgba(0, 0, 0, 0.6); font-weight: 400; text-align: center; }

@media (max-width: 1200px) {
  section#box { width: 100%; }
}
</style>
