<!-- src/views/auth/Login2.vue -->
<template>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
              <input type="email" v-model="email" required />
              <span class="icon">✉</span>
            </div>
          </div>
          <div class="input-group">
            <label>Password</label>
            <div class="input-wrapper">
              <input type="password" v-model="password" required />
              <span class="icon">🔒</span>
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
  
  <script setup>
  import { ref, provide } from 'vue';
  import { useRouter } from 'vue-router';
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../../backend/firebase.js';
  import Button from '../../components/widgets/Button.vue';
  
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const router = useRouter();
  const user = ref(null);
  
  // provide를 사용하여 사용자 정보를 하위 컴포넌트에 전달
  provide('user', user);
  
  const handleLogin = async () => {
    try {
      console.log('📌 [Login2.vue] 로그인 시도:', email.value);
  
      // Firebase Authentication으로 로그인 (관리자인 내가 콘솔에서 직접 등록해줘야 함.)
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const firebaseUser = userCredential.user;
      console.log('✅ [Login2.vue] 로그인 성공, UID:', firebaseUser.uid);
  
      // Firestore에서 사용자 정보 가져오기
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('✅ [Login2.vue] 사용자 정보 가져오기 성공:', userData);
  
        // 사용자 정보 저장
        user.value = {
          uid: firebaseUser.uid,
          email: userData.email,
          name: userData.name,
          department: userData.department,
          role: userData.role,
        };
  
        // localStorage에 사용자 정보 저장 (로그인 상태 유지)
        localStorage.setItem('user', JSON.stringify(user.value));
      } else {
        console.error('❌ [Login2.vue] 사용자 정보가 Firestore에 존재하지 않음, UID:', firebaseUser.uid);
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }
  
      // 로그인 성공 시 리다이렉트
      router.push('/priority');
    } catch (error) {
      console.error('❌ [Login2.vue] 로그인 실패:', error.message);
      alert('로그인 실패: ' + error.message);
    }
  };
  </script>
  
  <style scoped>
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