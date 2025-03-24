// import dotenv from "dotenv";
// dotenv.config();  // ✅ 환경 변수 로드
// 더미데이터 작업할때는 import.meta 빼고 process로 할것

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,  // ✅ Vue 환경 변수 방식
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("📌 Firestore 환경 변수 확인:", firebaseConfig);  // ✅ 디버깅용 로그 추가

const app = initializeApp(firebaseConfig); // 초기화
const db = getFirestore(app); // DB 인스턴스
const auth = getAuth(app); // 계정 인스턴스

export { db, auth };
