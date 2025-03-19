<template>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
              <input type="email" v-model="email" required />
              <span class="icon">&#9993;</span>
            </div>
          </div>
          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              <input type="password" v-model="password" required />
              <span class="icon">&#128274;</span>
            </div>
          </div>
          <div class="options">
            <label>
              <input type="checkbox" v-model="rememberMe" /> Remember Me
            </label>
            <a href="#">Forget Password</a>
          </div>
          <Button label="Sign in" type="primary" fullWidth @click="handleLogin" />
        </form>
        <p>Don't have an account? <a href="#">Register</a></p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Button from '../../components/widgets/Button.vue';
  
  export default {
    components: { Button },
    setup() {
      const email = ref('');
      const password = ref('');
      const rememberMe = ref(false);
      const router = useRouter();
  
      const handleLogin = () => {
        if (email.value && password.value) {
          console.log('로그인 성공:', email.value);
          router.push('/priority');
        } else {
          alert('이메일과 비밀번호를 입력하세요.');
        }
      };
  
      return {
        email,
        password,
        rememberMe,
        handleLogin
      };
    }
  };
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background: url('/src/assets/login_img.webp') no-repeat center center/cover;
  }
  
  .login-box {
    background: rgba(0, 0, 0, 0.7);
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    width: 350px;
    color: white;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .input-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-wrapper input {
    width: 100%;
    padding: 10px;
    padding-right: 30px;
    border: none;
    border-bottom: 2px solid white;
    background: transparent;
    color: white;
    outline: none;
  }
  
  .input-wrapper .icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: white;
  }
  
  .options {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  .options a {
    color: white;
    text-decoration: none;
  }
  
  button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 20px;
    background: white;
    color: black;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
  }
  
  button:hover {
    background: lightgray;
  }
  
  p {
    margin-top: 15px;
    font-size: 14px;
  }
  
  p a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }
  </style>
  