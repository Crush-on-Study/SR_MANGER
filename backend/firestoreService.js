import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// ✅ Firestore에 SR 요청 추가 함수
export const addSRRequest = async (srData) => {
  try {
    const srRef = doc(collection(db, "sr_requests"), srData.ref_no.toString()); // ref_no를 문서 ID로 설정
    await setDoc(srRef, srData, { merge: true });

    console.log("✅ Firestore에 데이터 추가 완료:", srData.ref_no);
  } catch (error) {
    console.error("❌ Firestore 데이터 추가 실패:", error);
  }
};

// ✅ 더미 데이터 Firestore에 업로드
export const uploadDummyData = async () => {
  const dummyData = [
    { ref_no: 12345, domain: 'CC', title: 'VEP 제약 조건 추가의 건', status: 'Approved', serviceType: 'ICC', requestDate: '2025-03-11', estimatedHours: 17, priority: 1, mandatory: 'N' },
    { ref_no: 15346, domain: 'SO', title: 'e-billing 확대', status: 'Request', serviceType: 'RPA', requestDate: '2025-02-09', estimatedHours: 58, priority: 1, mandatory: 'N' },
    { ref_no: 17890, domain: 'VO', title: '클라우드 보안 정책 강화', status: 'In Progress', serviceType: 'E-KMTC', requestDate: '2025-04-15', estimatedHours: 40, priority: 2, mandatory: 'Y' },
    { ref_no: 18901, domain: 'CS', title: '데이터 정합성 점검 시스템 구축', status: 'Approved', serviceType: 'ICC', requestDate: '2025-05-20', estimatedHours: 30, priority: 3, mandatory: 'N' },
    { ref_no: 19876, domain: 'SC', title: '모바일 UI/UX 개선', status: 'Finished', serviceType: 'RPA', requestDate: '2025-06-01', estimatedHours: 50, priority: 2, mandatory: 'N' },
    { ref_no: 20987, domain: 'SA', title: '실시간 모니터링 시스템 구축', status: 'Rejected', serviceType: 'E-KMTC', requestDate: '2025-07-13', estimatedHours: 22, priority: 4, mandatory: 'Y' },
    { ref_no: 21543, domain: 'ST', title: '사내 커뮤니케이션 툴 개선', status: 'Request', serviceType: 'ICC', requestDate: '2025-08-25', estimatedHours: 35, priority: 1, mandatory: 'N' },
    { ref_no: 22654, domain: 'CM', title: '자동화 테스트 프레임워크 구축', status: 'In Progress', serviceType: 'RPA', requestDate: '2025-09-10', estimatedHours: 28, priority: 3, mandatory: 'Y' },
    { ref_no: 23456, domain: 'VO', title: 'API 성능 최적화 프로젝트', status: 'Finished', serviceType: 'E-KMTC', requestDate: '2025-10-05', estimatedHours: 45, priority: 2, mandatory: 'N' }
  ];

  for (const item of dummyData) {
    await addSRRequest(item);
  }
  console.log("✅ 모든 더미 데이터 Firestore에 업로드 완료!");
};

// ✅ 실행 (Node.js 환경에서 실행 가능)
uploadDummyData();
