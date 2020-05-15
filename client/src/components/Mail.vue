<template>
  <div id="mail">
    <h4>Example Title</h4>
    <div id="mail-container">
      <header>
        <h5>Odbiorca &lt;example@example.com&gt;</h5>
        <h6>Poniedziałek, 23.03.2020 17:18</h6>
      </header>
      <div id="mail-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed semper tellus urna, a sagittis nunc cursus quis. Etiam sit amet tortor vel odio hendrerit aliquet. Etiam sit amet mattis metus. Fusce blandit massa aliquam, vestibulum odio euismod, blandit est. Nulla facilisi. Suspendisse blandit varius gravida. Morbi lectus velit, hendrerit in purus at, sodales commodo dui. Sed vel commodo tellus. In aliquam in tellus eu auctor. Proin purus enim, condimentum sed accumsan vitae, faucibus vel dolor. Vestibulum a tristique nibh. Sed ullamcorper sem id eros cursus ullamcorper.

Nulla vitae dictum justo. Pellentesque rutrum massa euismod, varius magna eget, facilisis massa. Donec nec iaculis massa. Integer mattis est nulla, in lobortis lectus dapibus dapibus. Pellentesque orci leo, egestas sed tincidunt in, dapibus quis ipsum. Sed semper dui augue, at fermentum mauris congue non. Phasellus porta nibh vitae malesuada hendrerit. Etiam convallis felis vel libero malesuada, nec varius lorem pharetra. Nam blandit ultrices nulla a vehicula. Integer egestas molestie nibh, non pulvinar metus iaculis at. Vestibulum eget hendrerit ipsum.

Etiam urna dui, volutpat a pretium in, auctor vitae leo. Vivamus vel cursus turpis. Aliquam congue massa scelerisque lacus venenatis, sit amet viverra odio commodo. Vestibulum eget aliquam mauris. Phasellus sit amet tristique nunc. Fusce in scelerisque dolor. Cras vulputate turpis ultrices condimentum tempor. Nam quis mollis ex, in sodales neque. Maecenas facilisis nisl libero, eget fermentum felis consectetur eu. Vivamus pulvinar velit congue euismod venenatis. Pellentesque non porttitor purus. In dictum nulla quam, sed interdum ante tincidunt nec.

Maecenas sed eleifend lorem. Vestibulum aliquet vehicula elit vitae varius. Maecenas vitae tristique metus, eget dapibus lacus. Donec aliquam dolor lorem, a imperdiet ante aliquet a. Suspendisse accumsan purus ut velit volutpat sagittis. Nullam neque quam, maximus id tempor ac, pretium id neque. Ut a lacus non est varius luctus. Aenean a pellentesque lacus, id tristique neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempus ultricies enim, ac accumsan ante porta ac. Proin lacinia quam urna, tempus tincidunt massa mattis eget. Nulla facilisi. Maecenas tristique felis massa, volutpat ultricies diam pretium eu.

Vestibulum sed lacus et arcu luctus sodales sed ut tellus. Nulla venenatis euismod odio bibendum convallis. Cras lacus ante, maximus sagittis ante a, accumsan facilisis justo. Phasellus tincidunt tempus ornare. Vestibulum id fringilla lacus. Cras ultricies pulvinar tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis luctus suscipit purus sed lacinia. Cras accumsan facilisis erat a condimentum. Nullam id justo odio. Sed ipsum mi, malesuada ut nulla ac, tincidunt scelerisque leo. Nulla gravida orci sit amet nibh facilisis, et congue purus elementum. Praesent ac ipsum a mi porttitor auctor ut a orci. Aenean suscipit eget tellus quis consequat.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mail',
  computed:{
    readMailId(){
      return this.$store.state.readMailId;
    },
  },
  watch: {
    readMailId(){
      if(!this.readMailId){
        this.$router.push('/inbox')
      }
    }
  }
}
</script>

<style lang="scss">
  div#mail { width: calc(100% - 300px); color: #000; }
  div#mail h4 { margin: 20px; padding: 0; color: rgba(0, 0, 0, 0.7); font-weight: 600; font-size: 22px; }
  div#mail div#mail-container { margin: 10px; padding: 30px; background: #fff; border: 1px solid #edebe9; }
  div#mail div#mail-container header h5 { margin: 0; padding: 0; font-weight: 400; font-weight: 400; font-size: 18px; color: rgba(0, 0, 0, 0.7); }
  div#mail div#mail-container header h6 { margin: 0; padding: 0; font-weight: 400; color: rgba(0, 0, 0, 0.4); font-weight: 400; font-size: 14px; }
  div#mail div#mail-content { margin-top: 20px; }

  @media (max-width: 1200px) {
    div#mail { width: 100%; }
  }
</style>
