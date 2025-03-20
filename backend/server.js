import { uploadDummyData } from "./firestoreService.js";

// ✅ Firestore에 더미 데이터 업로드 실행
uploadDummyData().then(() => {
  console.log("✅ Firestore에 데이터 업로드 완료! 서버 종료.");
  process.exit(0); // Node 프로세스 종료
}).catch(error => {
  console.error("❌ Firestore 데이터 업로드 중 오류 발생:", error);
  process.exit(1); // 오류 발생 시 종료
});
