<template>
  <div class="auth">
    <div id="tab">
      <section id="info">
        <h1>c<span>lean</span>m<span>ail</span></h1>
        <h2>Uwolnij się od spamu!</h2>
        <hgroup>
          <h3>Outlook</h3>
          <h3>Gmail</h3>
          <h3>WP</h3>
          <h3>Onet</h3>
          <h3>Interia</h3>
        </hgroup>
      </section>
      <section id="auth">
        <h2>{{ authTitle }}</h2>
        <div class="auth-login" v-if="auth == 1">
          <input class="default" type="text" placeholder="Login" v-model="loginUsername">
          <input class="default" type="password" placeholder="Hasło" v-model="loginPassword" v-on:keyup.enter="action()">
        </div>
        <div class="auth-register" v-if="auth == 2">
          <input class="default" type="text" placeholder="Login" v-model="registerUsername">
          <input class="default" type="text" placeholder="Email" v-model="registerEmail">
          <input class="default" type="password" placeholder="Hasło" v-model="registerPassword1">
          <input class="default" type="password" placeholder="Powtórz hasło" v-model="registerPassword2" v-on:keyup.enter="action()">
        </div>
        <div class="auth-password" v-if="auth == 3">
          <input class="default" type="text" placeholder="Email">
        </div>
        <button class="default" @click="action()">{{ authButton }}<i class="material-icons">keyboard_arrow_right</i></button>
        <nav id="auth-links">
          <ul>
            <li>
              <a href="#" @click="changeAuth(1)">{{ link1 }}</a>
            </li>
            <li style="display: none">
              <a href="#" @click="changeAuth(2)">{{ link2 }}</a>
            </li>
          </ul>
        </nav>
        <button class="outer" @click="google()">zaloguj się przez google</button>
      </section>
    </div>
    <alert></alert>
  </div>
</template>

<script>
import Alert from '@/components/Alert.vue'

export default {
  name: 'Auth',
  components: {
    Alert
  },
  data(){
    return{
      auth: 1,
      authTitle: '',
      authButton: '',
      textLogin: 'Logowanie',
      textRegister: 'Rejestracja',
      textRemember: 'Przypomnienie hasła',
      textButtonLogin: 'zaloguj',
      textButtonRegister: 'zarejestruj',
      textButtonRemember: 'przypomnij',
      link1: '',
      link2: '',
      route: '',
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerEmail: '',
      registerPassword1: '',
      registerPassword2: '',
      params: '',
    }
  },
  computed:{
    api(){
      return this.$store.state.api;
    },
  },
  created(){
    this.authTitle = this.textLogin;
    this.authButton = this.textButtonLogin;
    this.link1 = this.textRegister;
    this.link2 = this.textRemember;
  },
  methods:{
    changeAuth(id){
      if(id == 1){
        if(this.auth == 1){
          this.auth = 2;
          this.authTitle = this.textRegister;
          this.authButton = this.textButtonRegister;
          this.link1 = this.textLogin;
          this.link2 = this.textRemember;
        }else if(this.auth == 2){
          this.auth = 1;
          this.authTitle = this.textLogin;
          this.authButton = this.textButtonLogin;
          this.link1 = this.textRegister;
          this.link2 = this.textRemember;
        }else{
          this.auth = 1;
          this.authTitle = this.textLogin;
          this.authButton = this.textButtonLogin;
          this.link1 = this.textRegister;
          this.link2 = this.textRemember;
        }
      }else{
        if(this.auth == 1){
          this.auth = 3;
          this.authTitle = this.textRemember;
          this.authButton = this.textButtonRemember;
          this.link1 = this.textLogin;
          this.link2 = this.textRegister;
        }else if(this.auth == 2){
          this.auth = 3;
          this.authTitle = this.textRemember;
          this.authButton = this.textButtonRemember;
          this.link1 = this.textLogin;
          this.link2 = this.textRegister;
        }else{
          this.auth = 2;
          this.authTitle = this.textRegister;
          this.authButton = this.textButtonRegister;
          this.link1 = this.textLogin;
          this.link2 = this.textRemember;
        }
      }
    },
    action(){
      let matchPasswords = 1;
      if(this.auth == 1){
        this.route = this.api + 'users/signin';
        this.params = {
          username: this.loginUsername,
          password: this.loginPassword,
        }
      }else if(this.auth == 2){
        this.route = this.api + 'users/signup';
        this.params = {
          username: this.registerUsername,
          email: this.registerEmail,
          password: this.registerPassword1,
        }
        if(this.registerPassword1 != this.registerPassword2){
          matchPasswords = 0;
        }
      }else{
        this.route = this.api + '';
      }
      if(matchPasswords){
        let self = this;
        this.axios.post(this.route, self.params)
        .then(function (response) {
          if(self.auth == 2 || (self.auth == 1 && response.data.success == 0)){
            self.$store.commit('changeAlert', { type: response.data.success, msg: response.data.msg });
          }
          if(self.auth == 1 && response.data.success == 1){
            localStorage.setItem('access_token', response.data.token);
            localStorage.setItem('refresh_token', response.data.refToken);
            self.$router.push('/inbox')
          }
          if(response.data.success && self.auth == 2){
            self.registerUsername = '';
            self.registerEmail = '';
            self.registerPassword1 = '';
            self.registerPassword2 = '';
            self.changeAuth(1);
          }
        })
        .catch(function (error) {
          self.$store.commit('changeAlert', { type: 0, msg: 'Brak połączenia z API. Spróbuj później.' });
        })
      }else{
        this.$store.commit('changeAlert', { type: 0, msg: 'Podane hasła nie są ze sobą zgodne' });
      }
    },
    async google(){
      const googleUser = await this.$gAuth.signIn()
      let idToken = await googleUser.getAuthResponse().id_token;
      let self = this;
      let response = await this.axios.post(this.api + 'users/oauth/google', { idtoken: idToken })
      .then(function (response) {
        console.log(response.data.refToken)
        if(response.data.success == 1){
            localStorage.setItem('access_token', response.data.token);
            localStorage.setItem('refresh_token', response.data.refToken);
            self.$router.push('/inbox')
          }
      })
      .catch(function (error) {
        self.$store.commit('changeAlert', { type: 0, msg: 'Brak autoryzacji Google. Spróbuj później.' });
      })
    }
  }
}
</script>

<style lang="scss">
  div.auth { width: 100%; height: 100%; background: #8d51c2; background: linear-gradient(315deg, rgba(230,82,204,1) 0%, rgba(155,103,203,1) 100%); }
  div#tab { display: flex; width: 900px; height: 600px; position: absolute; top: calc(50% - 300px); left: calc(50% - 450px); box-shadow: 0px 0px 3px #58167a; border-radius: 15px; }
  div#tab section#info { display: flex; flex-direction: column; justify-content: space-between; width: 55%; background: #58167a; 
  background: linear-gradient(315deg, rgba(50,38,148,1) 0%, rgba(87,23,120,1) 100%); border-top-left-radius: 15px;  border-bottom-left-radius: 15px; }
  div#tab section#info h1 { margin: 0; padding: 25px; color: rgba(255, 255, 255, 0.6); color: #8453c6; font-size: 24px; height: 200px; text-transform: uppercase; font-weight: 600; 
  letter-spacing: 5px; }
  div#tab section#info h1 span { font-size: 16px; font-weight: 700;  }
  div#tab section#info h2 { margin: 0; padding: 0; color: #fff; font-size: 34px; height: 200px; text-align: center; line-height: 200px; font-weight: 400;}
  div#tab section#info hgroup { display: flex; height: 200px; padding: 25px; justify-content: center; align-items: flex-end; }
  div#tab section#info hgroup h3 { margin: 0 5px; padding: 0; font-size: 16px; color: rgba(255, 255, 255, 0.1); }
  div#tab section#auth { width: 45%; padding: 50px; background: #fff; border-top-right-radius: 15px; border-bottom-right-radius: 15px; }
  div#tab section#auth h2 { margin: 0 0 35px 0; padding: 0; font-size: 28px; font-weight: 700; color: #424242; }
  div#tab section#auth nav#auth-links ul { margin: 35px 0; padding: 0; }
  div#tab section#auth nav#auth-links ul li { list-style: none; text-align: center; }
  div#tab section#auth nav#auth-links ul li a { text-decoration: none; color: #BDBDBD; font-weight: 600; font-size: 12px; }
  div#tab section#auth nav#auth-links ul li a:hover { color: #9E9E9E; }
  div#tab section#auth button.outer { display: block; width: 100%; height: 40px; margin: 35px 0; padding: 0 0 0 60px; text-transform: capitalize; border: 0; font-size: 12px; 
  background: #8d51c2; background: url('../assets/google-icon.png') no-repeat 25px 50%, linear-gradient(90deg, rgba(50,38,148,1) 0%, rgba(132,83,198,1) 100%);
  text-align: left; color: rgba(255, 255, 255, 0.8); font-weight: 600; }
  div#tab section#auth button.outer:focus { outline: 0; }
  div#tab section#auth button.outer:hover { color: #fff; }

  @media (max-width: 900px) {
    div#tab { width: 405px; left: calc(50% - 202.5px); }
    div#tab section#info { display: none; }
    div#tab section#auth { width: 100%; border-radius: 15px; }
  }

  @media (max-width: 405px) {
    div#tab { width: 100%; left: 0; }
  }
</style>
