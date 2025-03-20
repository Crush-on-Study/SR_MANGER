import { db } from "./firebase.js";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// // ✅ Firestore에 Priority S/R 요청 추가 함수
// export const addPrioritySRRequest = async (srData) => {
//   try {
//     const srRef = doc(collection(db, "sr_requests"), srData.ref_no.toString()); // Priority는 sr_requests 컬렉션 사용
//     await setDoc(srRef, srData, { merge: true });
//     console.log("✅ Firestore에 Priority 데이터 추가 완료:", srData.ref_no);
//   } catch (error) {
//     console.error("❌ Firestore Priority 데이터 추가 실패:", error);
//   }
// };

// // ✅ Firestore에 General S/R 요청 추가 함수
// export const addGeneralSRRequest = async (srData) => {
//   try {
//     const srRef = doc(collection(db, "sr_general_requests"), srData.ref_no.toString()); // General은 sr_general_requests 컬렉션 사용
//     await setDoc(srRef, srData, { merge: true });
//     console.log("✅ Firestore에 General 데이터 추가 완료:", srData.ref_no);
//   } catch (error) {
//     console.error("❌ Firestore General 데이터 추가 실패:", error);
//   }
// };

// // ✅ Priority 데이터 Firestore에 업로드
// export const uploadPriorityDummyData = async () => {
//   const priorityData = [
//     { ref_no: 12345, domain: 'CC', title: 'VEP 제약 조건 추가의 건', status: 'Approved', serviceType: 'ICC', requestDate: '2025-03-11', estimatedHours: 17, mandatory: 'N', priority: 1 },
//     { ref_no: 15346, domain: 'SO', title: 'e-billing 확대', status: 'Request', serviceType: 'RPA', requestDate: '2025-02-09', estimatedHours: 58, mandatory: 'N', priority: 1 }
//   ];
//   for (const item of priorityData) {
//     await addPrioritySRRequest(item);
//   }
//   console.log("✅ 모든 Priority 더미 데이터 Firestore에 업로드 완료!");
// };

// // ✅ General 데이터 Firestore에 업로드
// export const uploadGeneralDummyData = async () => {
//   const generalData = [
//     { ref_no: 12345, domain: 'CS', title: '2025 G.BSC Request', status: 'Approved', serviceType: 'ICC', requestDate: '2025-03-11', estimatedHours: 17, importance: '비긴급 - 중요도 상', isChecked: false },
//     { ref_no: 15346, domain: 'ST', title: '공동 운항 정산 협력표', status: 'Request', serviceType: 'RPA', requestDate: '2025-02-09', estimatedHours: 58, importance: '비긴급 - 중요도 하', isChecked: false }
//   ];
//   for (const item of generalData) {
//     await addGeneralSRRequest(item);
//   }
//   console.log("✅ 모든 General 더미 데이터 Firestore에 업로드 완료!");
// };


// ✅ Firestore에서 Priority 데이터 가져오기
export const getPrioritySRRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "sr_requests"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,  // Firestore 문서 ID를 id 필드로 저장
      ...doc.data() // Firestore의 나머지 데이터 저장
    }));
  } catch (error) {
    console.error("❌ Firestore Priority 데이터 가져오기 실패:", error);
    return [];
  }
};

// ✅ Firestore에서 General 데이터 가져오기
export const getGeneralSRRequests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "sr_general_requests"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("❌ Firestore General 데이터 가져오기 실패:", error);
    return [];
  }
};