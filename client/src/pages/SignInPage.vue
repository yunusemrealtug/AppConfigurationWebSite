<template>
  <div class="sign-in-page">
    <img src="@/assets/icon.png" alt="Icon" class="icon" />
    <h2 class="sign-in-text">Please sign in</h2>
    <form @submit.prevent="handleSubmit" class="sign-in-form">
      <div class="form-group">
        <input type="email" id="email" v-model="email" required class="top-input" placeholder="E-mail address" />
      </div>
      <div class="form-group">
        <input type="password" id="password" v-model="password" required class="bottom-input" placeholder="Password" />
      </div>
      <button type="submit" class="submit-button">Sign in</button>
    </form>
    <p class="footer-text">Codeway @ 2021</p> 
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './SignInPage.css';

export default {
  name: 'SignInPage',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async handleSubmit() {
      console.log(process.env.VUE_APP_FIREBASE_API_KEY);
      const auth = getAuth(); 
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        localStorage.setItem('idToken', idToken);
        this.$router.push('/');
        
        console.log('User logged in:', user);

        
      } catch (error) {
        console.error('Login failed:', error.message);
        alert('Login failed. Please check your credentials and try again.');
      }
    }
  }
}
</script>
