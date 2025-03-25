import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, writeBatch } from "firebase/firestore";

// ✅ Firestore에 Priority S/R 요청 추가 함수 (CC, SO 도메인만)
export const addPrioritySRRequest = async (srData) => {
  try {
    const srRef = doc(collection(db, "sr_requests"), srData.ref_no.toString());
    await setDoc(srRef, srData, { merge: true });
    console.log("✅ Firestore에 Priority 데이터 추가 완료:") //, srData.ref_no);
  } catch (error) {
    console.error("❌ Firestore Priority 데이터 추가 실패:", error);
  }
};

// ✅ Firestore에 General S/R 요청 추가 함수 (나머지 도메인)
export const addGeneralSRRequest = async (srData) => {
  try {
    const srRef = doc(collection(db, "sr_general_requests"), srData.ref_no.toString());
    await setDoc(srRef, srData, { merge: true });
    console.log("✅ Firestore에 General 데이터 추가 완료:") //, srData.ref_no);
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

// ✅ Firestore에서 개발 카드 목록 가져오기
export const getDevelopmentCards = async () => {
  try {
    const cardCollectionRef = collection(db, "development_cards");
    const querySnapshot = await getDocs(cardCollectionRef);

    let data = [];
    for (const docSnap of querySnapshot.docs) {
      const cardData = docSnap.data();

      // 🔥 서브컬렉션의 총 공수시간 계산을 위해 가져옴
      const srCollectionRef = collection(db, `development_cards/${docSnap.id}/sr_requests`);
      const srSnapshot = await getDocs(srCollectionRef);
      const srList = srSnapshot.docs.map((doc) => doc.data());

      // 🔥 필수 개발 대상 개수 & 총 공수시간 계산
      const priorityCount = srList.filter((sr) => sr.mandatory === "Y").length;
      const priorityHours = srList.reduce((sum, sr) => sum + sr.estimatedHours, 0);

      // 🔥 카드 데이터에 serviceTypes 포함
      let serviceTypes = { ICC: 0, EKMTC: 0, RPA: 0 };
      srList.forEach((sr) => {
        if (serviceTypes[sr.serviceType] !== undefined) {
          serviceTypes[sr.serviceType] += sr.estimatedHours;
        }
      });

      data.push({
        id: docSnap.id,
        name: cardData.name,
        description: cardData.description,
        priorityCount,
        priorityHours,
        serviceTypes, // 🔥 도넛 차트용 데이터
      });
    }

    console.log("📌 Firestore에서 가져온 개발 카드 목록:", data);
    return data;
  } catch (error) {
    console.error("❌ Firestore에서 개발 카드 목록 가져오기 실패:", error);
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
    console.log(`📌 [addSRToCard] 카드(${cardId})에 추가할 SR 리스트:`, srList);

    const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests");

    for (const sr of srList) {
      const docRef = await addDoc(srCollectionRef, sr);
      console.log(`✅ Firestore에 SR 추가됨 (ID: ${docRef.id})`, sr);
    }

    console.log("🎉 모든 SR이 Firestore에 정상적으로 추가됨!");
    return true;
  } catch (error) {
    console.error("❌ Firestore에 SR 추가 실패:", error);
    return false;
  }
};

// ✅ 특정 카드의 SR 요청 목록 가져오기
export const getCardSRRequests = async (cardId) => {
  try {
    const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests"); // ✅ 서브컬렉션 가져오기
    const srSnapshot = await getDocs(srCollectionRef);

    const srList = srSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // console.log(`📌 Firestore에서 카드(${cardId})의 SR 요청 불러옴:`, srList);
    return srList;
  } catch (error) {
    // console.error("❌ Firestore에서 카드의 SR 요청 불러오기 실패:", error);
    return [];
  }
};

// ✅ 특정 카드에서 SR 요청 삭제
export const deleteSRFromCard = async (cardId, srId) => {
  try {
    const srRef = doc(db, "development_cards", cardId, "sr_requests", srId); // 수정: 경로를 "development_cards"로 변경
    await deleteDoc(srRef);
    // console.log(`✅ Firestore에서 카드 [${cardId}]의 SR 요청 [${srId}] 삭제 완료`);
    return true;
  } catch (error) {
    // console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srId}] 삭제 실패:`, error);
    return false;
  }
};

// ✅ 특정 카드에서 모든 SR 요청 삭제 (신규 기능)
export const deleteAllSRFromCard = async (cardId) => {
  try {
    const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests");
    const srSnapshot = await getDocs(srCollectionRef);

    if (srSnapshot.empty) {
    //   console.log(`✅ 카드 [${cardId}]에 삭제할 SR 요청이 없습니다.`);
      return true;
    }

    // Firestore Batch를 사용하여 일괄 삭제
    const batch = writeBatch(db);
    srSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    // console.log(`✅ Firestore에서 카드 [${cardId}]의 모든 SR 요청 삭제 완료`);
    return true;
  } catch (error) {
    // console.error(`❌ Firestore 카드 [${cardId}]의 모든 SR 요청 삭제 실패:`, error);
    return false;
  }
};

// ✅ 특정 카드에서 SR 요청 제외 (제외된 목록으로 이동)
export const excludeSRFromCard = async (cardId, srData) => {
  try {
    const excludeRef = doc(db, "development_cards", cardId, "excluded_requests", srData.id.toString());
    await setDoc(excludeRef, srData);
    
    // ✅ 기존 목록에서 제거
    await deleteSRFromCard(cardId, srData.id);
    
    // console.log(`✅ Firestore에서 카드 [${cardId}]의 SR 요청 [${srData.id}] 제외 완료`);
    return true;
  } catch (error) {
    // console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srData.id}] 제외 실패:`, error);
    return false;
  }
};

// ✅ Firestore에 새로운 개발 카드 생성
export const createDevelopmentCard = async (cardData) => {
  try {
    const cardRef = doc(collection(db, "development_cards"), cardData.id);
    await setDoc(cardRef, {
      name: cardData.name,
      description: cardData.description,
      serviceTypes: { ICC: 0, EKMTC: 0, RPA: 0 },
    });
    // console.log("✅ 개발 카드 생성 완료:", cardData);
    return cardData.id; // 카드 ID 반환
  } catch (error) {
    // console.error("❌ 개발 카드 생성 실패:", error);
    return null;
  }
};

// ✅ Firestore에 SR 요청을 해당 카드의 서브컬렉션으로 저장
export const addSRRequestsToCard = async (cardId, srRequests) => {
  try {
    if (!cardId || srRequests.length === 0) {
      console.error("❌ 카드 ID가 없거나 SR 요청이 비어 있음:", cardId, srRequests);
      return;
    }

    const cardRef = doc(db, "development_cards", cardId);
    const srCollectionRef = collection(cardRef, "sr_requests");

    for (const sr of srRequests) {
      // 🔹 문서 ID로 ref_no 사용 (없으면 새로 생성)
      const srRef = doc(srCollectionRef, sr.ref_no?.toString() || addDoc(srCollectionRef));
      await setDoc(srRef, sr, { merge: true });
    }

    console.log(`🔥 Firestore 카드 [${cardId}]에 SR 요청 추가 완료!`);
  } catch (error) {
    console.error(`❌ Firestore 카드 [${cardId}]에 SR 요청 추가 실패:`, error);
  }
};

// ✅ Firestore에서 특정 개발 카드의 SR 요청 가져오기
export const getSRRequestsForCard = async (cardId) => {
  try {
    const cardRef = doc(db, "development_cards", cardId);
    const srCollectionRef = collection(cardRef, "sr_requests");
    const querySnapshot = await getDocs(srCollectionRef);

    let srRequests = [];
    querySnapshot.forEach((doc) => {
      srRequests.push(doc.data());
    });

    console.log(`📌 카드 [${cardId}]의 SR 요청 가져오기 완료:`, srRequests);
    return srRequests;
  } catch (error) {
    console.error(`❌ 카드 [${cardId}]의 SR 요청 가져오기 실패:`, error);
    return [];
  }
};