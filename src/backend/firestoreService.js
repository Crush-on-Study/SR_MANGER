import { db } from "./firebase.js";
import { collection, getDocs, query, doc, setDoc , deleteDoc, addDoc } from "firebase/firestore";

// ✅ Firestore에 Priority S/R 요청 추가 함수 (CC, SO 도메인만)
export const addPrioritySRRequest = async (srData) => {
  try {
    const srRef = doc(collection(db, "sr_requests"), srData.ref_no.toString());
    await setDoc(srRef, srData, { merge: true });
    console.log("✅ Firestore에 Priority 데이터 추가 완료:", srData.ref_no);
  } catch (error) {
    console.error("❌ Firestore Priority 데이터 추가 실패:", error);
  }
};

// ✅ Firestore에 General S/R 요청 추가 함수 (나머지 도메인)
export const addGeneralSRRequest = async (srData) => {
  try {
    const srRef = doc(collection(db, "sr_general_requests"), srData.ref_no.toString());
    await setDoc(srRef, srData, { merge: true });
    console.log("✅ Firestore에 General 데이터 추가 완료:", srData.ref_no);
  } catch (error) {
    console.error("❌ Firestore General 데이터 추가 실패:", error);
  }
};

// ✅ UR Import에서 전처리된 데이터를 Firestore로 저장하는 함수
export const saveSRRequestsToFirestore = async (processedData) => {
  try {
    for (const item of processedData) {
      if (["CC", "SO"].includes(item.domain)) {
        await addPrioritySRRequest(item); // ✅ Priority 컬렉션 저장
      } else {
        await addGeneralSRRequest(item); // ✅ General 컬렉션 저장
      }
    }
    console.log("🔥 모든 데이터 Firestore 업로드 완료!");
  } catch (error) {
    console.error("❌ Firestore 데이터 저장 중 오류 발생:", error);
  }
};


// ✅ Firestore에서 Priority 데이터 가져오기 (CC, SO 도메인만)
export const getPrioritySRRequests = async () => {
    try {
      const srCollection = collection(db, "sr_requests");
      const querySnapshot = await getDocs(srCollection);
      
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
  
      console.log("📌 Firestore에서 가져온 Priority 데이터:", data);
      return data;
    } catch (error) {
      console.error("❌ Firestore Priority 데이터 가져오기 실패:", error);
      return [];
    }
  };
  
  // ✅ Firestore에서 General 데이터 가져오기 (나머지 도메인)
  export const getGeneralSRRequests = async () => {
    try {
      const srCollection = collection(db, "sr_general_requests");
      const querySnapshot = await getDocs(srCollection);
      
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
  
      console.log("📌 Firestore에서 가져온 General 데이터:", data);
      return data;
    } catch (error) {
      console.error("❌ Firestore General 데이터 가져오기 실패:", error);
      return [];
    }
  };


  // ✅ Firestore의 전체 문서를 삭제하는 함수 (Spark 요금제 쓰고 있어서... Export 마치면 지워줘야해 ㅠㅠ 엉엉)
export const deleteAllDocuments = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
  
      let deletePromises = [];
      querySnapshot.forEach((docItem) => {
        deletePromises.push(deleteDoc(doc(db, collectionName, docItem.id)));
      });
  
      await Promise.all(deletePromises);
      console.log(`✅ Firestore 컬렉션 [${collectionName}] 전체 데이터 삭제 완료!`);
      return true;
    } catch (error) {
      console.error(`❌ Firestore 컬렉션 [${collectionName}] 데이터 삭제 실패:`, error);
      return false;
    }
  };

  // ✅ Firestore에 새로운 개발 목록 추가 (Development.vue)
export const addDevelopmentCard = async (name, description) => {
    try {
      const newCardRef = doc(collection(db, "development_cards"));
      const cardData = { name, description, serviceTypes: { ICC: 0, RPA: 0, EKMTC: 0 } };
      await setDoc(newCardRef, cardData);
      console.log("✅ Firestore에 개발 목록 추가 완료:", name);
      return { id: newCardRef.id, ...cardData };
    } catch (error) {
      console.error("❌ Firestore 개발 목록 추가 실패:", error);
      return null;
    }
  };
  
  // ✅ Firestore에서 개발 목록 가져오기
  export const getDevelopmentCards = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "development_cards"));
      let cards = [];
      querySnapshot.forEach((doc) => {
        cards.push({ id: doc.id, ...doc.data() });
      });
      console.log("📌 Firestore에서 가져온 개발 목록:", cards);
      return cards;
    } catch (error) {
      console.error("❌ Firestore 개발 목록 가져오기 실패:", error);
      return [];
    }
  };
  
  // ✅ Firestore에서 특정 카드 삭제
  export const deleteDevelopmentCard = async (cardId) => {
    try {
      await deleteDoc(doc(db, "development_cards", cardId));
      console.log(`🗑️ Firestore에서 카드 삭제 완료: ${cardId}`);
    } catch (error) {
      console.error(`❌ Firestore 카드 삭제 실패:`, error);
    }
  };
  
  // ✅ Firestore에 선택된 SR을 특정 카드에 추가
  export const addSRToCard = async (cardId, srList) => {
    try {
      const cardRef = doc(db, "development_cards", cardId);
      const srCollectionRef = collection(cardRef, "sr_items");
  
      for (const sr of srList) {
        await setDoc(doc(srCollectionRef, sr.ref_no.toString()), sr, { merge: true });
      }
  
      console.log(`✅ Firestore에 카드 (${cardId})에 SR 추가 완료!`);
    } catch (error) {
      console.error(`❌ Firestore 카드 (${cardId})에 SR 추가 실패:`, error);
    }
  };

  // ✅ 특정 카드의 SR 요청 목록 가져오기
export const getCardSRRequests = async (cardId) => {
    try {
      const cardRef = collection(db, "sr_cards", cardId, "sr_requests");
      const querySnapshot = await getDocs(cardRef);
  
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
  
      console.log(`📌 Firestore에서 카드 [${cardId}]의 SR 요청 목록 불러오기 성공:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Firestore 카드 [${cardId}] SR 요청 불러오기 실패:`, error);
      return [];
    }
  };

  // ✅ 특정 카드에서 SR 요청 삭제
export const deleteSRFromCard = async (cardId, srId) => {
    try {
      const srRef = doc(db, "sr_cards", cardId, "sr_requests", srId);
      await deleteDoc(srRef);
      console.log(`✅ Firestore에서 카드 [${cardId}]의 SR 요청 [${srId}] 삭제 완료`);
      return true;
    } catch (error) {
      console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srId}] 삭제 실패:`, error);
      return false;
    }
  };

  // ✅ 특정 카드에서 SR 요청 제외 (제외된 목록으로 이동)
export const excludeSRFromCard = async (cardId, srData) => {
    try {
      const excludeRef = doc(db, "sr_cards", cardId, "excluded_requests", srData.id.toString());
      await setDoc(excludeRef, srData);
      
      // ✅ 기존 목록에서 제거
      await deleteSRFromCard(cardId, srData.id);
      
      console.log(`✅ Firestore에서 카드 [${cardId}]의 SR 요청 [${srData.id}] 제외 완료`);
      return true;
    } catch (error) {
      console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srData.id}] 제외 실패:`, error);
      return false;
    }
  };
  
  