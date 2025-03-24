// 더미 데이터들 처리하는곳
import { uploadPriorityDummyData, uploadGeneralDummyData, createDummyAccounts } from "./firestoreService.js";

// ✅ 더미 데이터 업로드 및 계정 생성을 순차적으로 실행
const initializeData = async () => {
  try {
    console.log("📌 [server.js] Priority 더미 데이터 업로드 시작");
    await uploadPriorityDummyData();
    console.log("✅ [server.js] Priority 더미 데이터 업로드 완료");

    console.log("📌 [server.js] General 더미 데이터 업로드 시작");
    await uploadGeneralDummyData();
    console.log("✅ [server.js] General 더미 데이터 업로드 완료");

    console.log("📌 [server.js] 더미 계정 생성 시작");
    await createDummyAccounts();
    console.log("✅ [server.js] 더미 계정 생성 완료");
  } catch (error) {
    console.error("❌ [server.js] 더미 데이터 업로드 또는 계정 생성 중 에러 발생:", error);
  }
};

// 초기화 함수 실행
initializeData();