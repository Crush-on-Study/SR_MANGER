<!-- src/views/auth/Login.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../../components/widgets/Button.vue';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = () => {
  if (email.value && password.value) {
    console.log('로그인 성공:', email.value);
    router.push('/priority');
  } else {
    alert('이메일과 비밀번호를 입력하세요.');
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Log In</h2>

      <div class="input-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="mail address" />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="password" />
      </div>

      <Button label="Sign in" type="primary" fullWidth @click="login" />

      <footer>
        <span>Privacy • Terms • Sitemap</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* 화면 전체 확장 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

/* 로그인 박스 */
.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 450px;
}

/* 로고 */
.logo {
  width: 120px;
  margin-bottom: 15px;
}

/* 입력 필드 */
.input-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 20px;
}

input {
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  outline: none;
  transition: all 0.2s ease-in-out;
  background: white; /* 입력 필드 배경 흰색 */
  color: #333; /* 입력 글자 검은색 */
}

/* 입력 필드 placeholder 색상 조정 */
input::placeholder {
  color: #888;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0px 0px 5px rgba(99, 102, 241, 0.5);
}

/* 버튼 간격 추가 */
button {
  margin-top: 25px;
}

/* 하단 텍스트 */
footer {
  margin-top: 30px;
  font-size: 12px;
  color: gray;
}
</style>
