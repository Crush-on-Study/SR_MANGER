import { db } from "./firebase.js";
import { collection, getDocs, doc, setDoc, deleteDoc, addDoc, writeBatch } from "firebase/firestore";

// ✅ Firestore에 Priority S/R 요청 추가 함수 (CC, SO 도메인만)
export const addPrioritySRRequest = async (srData) => {
  try {
    // REQ_UNO 검증
    if (!srData.REQ_UNO || typeof srData.REQ_UNO !== "string") {
      throw new Error(`Invalid REQ_UNO: ${srData.REQ_UNO}`);
    }

    console.log("✅ Adding Priority SR Data:", srData); // 디버깅 로그 추가

    const srRef = doc(collection(db, "sr_requests"), srData.REQ_UNO);
    await setDoc(srRef, {
      REQ_UNO: srData.REQ_UNO,
      REQ_RNO: srData.REQ_RNO,
      DOM_KND: srData.DOM_KND,
      REQ_TITLE: srData.REQ_TITLE,
      REQ_STATUS: srData.REQ_STATUS,
      PROGRAM_TYPE: srData.PROGRAM_TYPE,
      REQ_DT: srData.REQ_DT,
      TOT_ESTM_TM: srData.TOT_ESTM_TM,
      WEB_ESTM_TM: srData.WEB_ESTM_TM,
      ICC_ESTM_TM: srData.ICC_ESTM_TM,
      RPA_ESTM_TM: srData.RPA_ESTM_TM,
      GRADE: srData.GRADE,
      KND: srData.KND,
      REMARK: srData.REMARK,
      IT_REMARK: srData.IT_REMARK,
      SME_REMARK: srData.SME_REMARK,
    }, { merge: true });
    console.log("✅ Firestore에 Priority 데이터 추가 완료:", srData.REQ_UNO);
  } catch (error) {
    console.error("❌ Firestore Priority 데이터 추가 실패:", error.message);
    throw error;
  }
};

// ✅ Firestore에 General S/R 요청 추가 함수 (나머지 도메인)
export const addGeneralSRRequest = async (srData) => {
  try {
    // REQ_UNO 검증
    if (!srData.REQ_UNO || typeof srData.REQ_UNO !== "string") {
      throw new Error(`Invalid REQ_UNO: ${srData.REQ_UNO}`);
    }

    console.log("✅ Adding General SR Data:", srData); // 디버깅 로그 추가

    const srRef = doc(collection(db, "sr_general_requests"), srData.REQ_UNO);
    await setDoc(srRef, {
      REQ_UNO: srData.REQ_UNO,
      REQ_RNO: srData.REQ_RNO,
      DOM_KND: srData.DOM_KND,
      REQ_TITLE: srData.REQ_TITLE,
      REQ_STATUS: srData.REQ_STATUS,
      PROGRAM_TYPE: srData.PROGRAM_TYPE,
      REQ_DT: srData.REQ_DT,
      TOT_ESTM_TM: srData.TOT_ESTM_TM,
      WEB_ESTM_TM: srData.WEB_ESTM_TM,
      ICC_ESTM_TM: srData.ICC_ESTM_TM,
      RPA_ESTM_TM: srData.RPA_ESTM_TM,
      GRADE: srData.GRADE,
      KND: srData.KND,
      REMARK: srData.REMARK,
      IT_REMARK: srData.IT_REMARK,
      SME_REMARK: srData.SME_REMARK,
    }, { merge: true });
    console.log("✅ Firestore에 General 데이터 추가 완료:", srData.REQ_UNO);
  } catch (error) {
    console.error("❌ Firestore General 데이터 추가 실패:", error.message);
    throw error;
  }
};

// ✅ UR Import에서 전처리된 데이터를 Firestore로 저장하는 함수
export const saveSRRequestsToFirestore = async (processedData) => {
  try {
    for (const item of processedData) {
      if (["CC", "SO"].includes(item.DOM_KND)) {
        await addPrioritySRRequest(item); // ✅ Priority 컬렉션 저장
      } else {
        await addGeneralSRRequest(item); // ✅ General 컬렉션 저장
      }
    }
    console.log("🔥 모든 데이터 Firestore 업로드 완료!");
    return true;
  } catch (error) {
    console.error("❌ Firestore 데이터 저장 중 오류 발생:", error.message);
    throw error;
  }
};

// ✅ Firestore에서 Priority 데이터 가져오기 (CC, SO 도메인만)
export const getPrioritySRRequests = async () => {
  try {
    const srCollection = collection(db, "sr_requests");
    const querySnapshot = await getDocs(srCollection);
    
    let data = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      // 이전 필드명을 새로운 필드명으로 매핑
      data.push({
        REQ_UNO: docData.REQ_UNO || docData.ref_no || "",
        REQ_RNO: docData.REQ_RNO || "",
        DOM_KND: docData.DOM_KND || docData.domain || "",
        REQ_TITLE: docData.REQ_TITLE || docData.title || "",
        REQ_STATUS: docData.REQ_STATUS || docData.status || "",
        PROGRAM_TYPE: docData.PROGRAM_TYPE || docData.serviceType || "",
        REQ_DT: docData.REQ_DT || docData.requestDate || "",
        TOT_ESTM_TM: docData.TOT_ESTM_TM || docData.estimatedHours || 0,
        WEB_ESTM_TM: docData.WEB_ESTM_TM || 0,
        ICC_ESTM_TM: docData.ICC_ESTM_TM || 0,
        RPA_ESTM_TM: docData.RPA_ESTM_TM || 0,
        GRADE: docData.GRADE || "",
        KND: docData.KND || "",
        REMARK: docData.REMARK || "",
        IT_REMARK: docData.IT_REMARK || "",
        SME_REMARK: docData.SME_REMARK || "",
      });
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
      const docData = doc.data();
      // 이전 필드명을 새로운 필드명으로 매핑
      data.push({
        REQ_UNO: docData.REQ_UNO || docData.ref_no || "",
        REQ_RNO: docData.REQ_RNO || "",
        DOM_KND: docData.DOM_KND || docData.domain || "",
        REQ_TITLE: docData.REQ_TITLE || docData.title || "",
        REQ_STATUS: docData.REQ_STATUS || docData.status || "",
        PROGRAM_TYPE: docData.PROGRAM_TYPE || docData.serviceType || "",
        REQ_DT: docData.REQ_DT || docData.requestDate || "",
        TOT_ESTM_TM: docData.TOT_ESTM_TM || docData.estimatedHours || 0,
        WEB_ESTM_TM: docData.WEB_ESTM_TM || 0,
        ICC_ESTM_TM: docData.ICC_ESTM_TM || 0,
        RPA_ESTM_TM: docData.RPA_ESTM_TM || 0,
        GRADE: docData.GRADE || "",
        KND: docData.KND || "",
        REMARK: docData.REMARK || "",
        IT_REMARK: docData.IT_REMARK || "",
        SME_REMARK: docData.SME_REMARK || "",
      });
    });

    console.log("📌 Firestore에서 가져온 General 데이터:", data);
    return data;
  } catch (error) {
    console.error("❌ Firestore General 데이터 가져오기 실패:", error);
    return [];
  }
};

// ✅ Firestore의 전체 문서를 삭제하는 함수
export const deleteAllDocuments = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    if (querySnapshot.empty) {
      console.log(`✅ Firestore 컬렉션 [${collectionName}]에 데이터가 없습니다.`);
      return true;
    }

    console.log(`✅ Firestore 컬렉션 [${collectionName}]에서 삭제할 문서 수: ${querySnapshot.size}`); // 디버깅 로그 추가

    let deletePromises = [];
    querySnapshot.forEach((docItem) => {
      console.log(`✅ 삭제할 문서 ID: ${docItem.id}, 데이터:`, docItem.data()); // 디버깅 로그 추가
      deletePromises.push(deleteDoc(doc(db, collectionName, docItem.id)));
    });

    await Promise.all(deletePromises);
    console.log(`✅ Firestore 컬렉션 [${collectionName}] 전체 데이터 삭제 완료!`);
    return true;
  } catch (error) {
    console.error(`❌ Firestore 컬렉션 [${collectionName}] 데이터 삭제 실패:`, error.message);
    throw error;
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
      const priorityHours = srList.reduce((sum, sr) => sum + (sr.TOT_ESTM_TM || 0), 0);

      // 🔥 카드 데이터에 serviceTypes 포함
      let serviceTypes = { ICC: 0, EKMTC: 0, RPA: 0 };
      srList.forEach((sr) => {
        if (sr.PROGRAM_TYPE === "ICC") {
          serviceTypes.ICC += sr.ICC_ESTM_TM || 0;
        } else if (sr.PROGRAM_TYPE === "RPA") {
          serviceTypes.RPA += sr.RPA_ESTM_TM || 0;
        } else if (sr.PROGRAM_TYPE === "E-KMTC") {
          serviceTypes.EKMTC += sr.TOT_ESTM_TM || 0;
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
      // 입력 검증
      if (!cardId || typeof cardId !== "string") {
        throw new Error("유효하지 않은 cardId: " + cardId);
      }
      if (!Array.isArray(srList)) {
        throw new Error("srList는 배열이어야 합니다: " + JSON.stringify(srList));
      }
      if (srList.length === 0) {
        throw new Error("srList가 비어 있습니다.");
      }
  
      console.log(`📌 [addSRToCard] 카드(${cardId})에 추가할 SR 리스트:`, srList);
  
      const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests");
  
      for (const sr of srList) {
        // 필수 필드 검증 및 기본값 설정
        const srData = {
          REQ_UNO: sr.REQ_UNO || "",
          REQ_RNO: sr.REQ_RNO || "",
          DOM_KND: sr.DOM_KND || "",
          REQ_TITLE: sr.REQ_TITLE || "",
          REQ_STATUS: sr.REQ_STATUS || "",
          PROGRAM_TYPE: sr.PROGRAM_TYPE || "",
          REQ_DT: sr.REQ_DT || "",
          TOT_ESTM_TM: sr.TOT_ESTM_TM || 0,
          WEB_ESTM_TM: sr.WEB_ESTM_TM || 0,
          ICC_ESTM_TM: sr.ICC_ESTM_TM || 0,
          RPA_ESTM_TM: sr.RPA_ESTM_TM || 0,
          GRADE: sr.GRADE || "",
          KND: sr.KND || "",
          REMARK: sr.REMARK || "",
          IT_REMARK: sr.IT_REMARK || "",
          SME_REMARK: sr.SME_REMARK || "",
          mandatory: sr.mandatory || "N", // Priority.vue에서 사용
        };
  
        const docRef = await addDoc(srCollectionRef, srData);
        console.log(`✅ Firestore에 SR 추가됨 (ID: ${docRef.id})`, srData);
      }
  
      console.log("🎉 모든 SR이 Firestore에 정상적으로 추가됨!");
      return true;
    } catch (error) {
      console.error("❌ Firestore에 SR 추가 실패:", error.message);
      throw error; // 상위 호출자에게 오류 전달
    }
  };

// ✅ 특정 카드의 SR 요청 목록 가져오기
export const getCardSRRequests = async (cardId) => {
  try {
    const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests");
    const srSnapshot = await getDocs(srCollectionRef);

    const srList = srSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return srList;
  } catch (error) {
    console.error("❌ Firestore에서 카드의 SR 요청 불러오기 실패:", error);
    return [];
  }
};

// ✅ 특정 카드에서 SR 요청 삭제
export const deleteSRFromCard = async (cardId, srId) => {
  try {
    const srRef = doc(db, "development_cards", cardId, "sr_requests", srId);
    await deleteDoc(srRef);
    return true;
  } catch (error) {
    console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srId}] 삭제 실패:`, error);
    return false;
  }
};

// ✅ 특정 카드에서 모든 SR 요청 삭제
export const deleteAllSRFromCard = async (cardId) => {
  try {
    const srCollectionRef = collection(db, "development_cards", cardId, "sr_requests");
    const srSnapshot = await getDocs(srCollectionRef);

    if (srSnapshot.empty) {
      return true;
    }

    const batch = writeBatch(db);
    srSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return true;
  } catch (error) {
    console.error(`❌ Firestore 카드 [${cardId}]의 모든 SR 요청 삭제 실패:`, error);
    return false;
  }
};

// ✅ 특정 카드에서 SR 요청 제외 (제외된 목록으로 이동)
export const excludeSRFromCard = async (cardId, srData) => {
  try {
    const excludeRef = doc(db, "development_cards", cardId, "excluded_requests", srData.id.toString());
    await setDoc(excludeRef, srData);
    
    await deleteSRFromCard(cardId, srData.id);
    
    return true;
  } catch (error) {
    console.error(`❌ Firestore 카드 [${cardId}] SR 요청 [${srData.id}] 제외 실패:`, error);
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
    return cardData.id;
  } catch (error) {
    console.error("❌ 개발 카드 생성 실패:", error);
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
      const srRef = doc(srCollectionRef, sr.REQ_UNO?.toString() || addDoc(srCollectionRef));
      await setDoc(srRef, {
        REQ_UNO: sr.REQ_UNO,
        REQ_RNO: sr.REQ_RNO,
        DOM_KND: sr.DOM_KND,
        REQ_TITLE: sr.REQ_TITLE,
        REQ_STATUS: sr.REQ_STATUS,
        PROGRAM_TYPE: sr.PROGRAM_TYPE,
        REQ_DT: sr.REQ_DT,
        TOT_ESTM_TM: sr.TOT_ESTM_TM,
        WEB_ESTM_TM: sr.WEB_ESTM_TM,
        ICC_ESTM_TM: sr.ICC_ESTM_TM,
        RPA_ESTM_TM: sr.RPA_ESTM_TM,
        GRADE: sr.GRADE,
        KND: sr.KND,
        REMARK: sr.REMARK,
        IT_REMARK: sr.IT_REMARK,
        SME_REMARK: sr.SME_REMARK,
        mandatory: sr.mandatory || "N",
      }, { merge: true });
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

// ✅ Firestore에서 SR 데이터 업데이트
export const updateSR = async (srId, updatedData) => {
  try {
    const srDocRef = doc(db, "sr_requests", srId);
    await updateDoc(srDocRef, updatedData);
    console.log(`✅ SR(${srId}) 업데이트 성공:`, updatedData);
    return true;
  } catch (error) {
    console.error(`❌ SR(${srId}) 업데이트 실패:`, error);
    return false;
  }
};

// ✅ SR의 Remark 업데이트 함수 (DetailModal.vue에서 사용)
export const updateSRRemarks = async (collectionName, reqUno, remarks) => {
  try {
    const srRef = doc(db, collectionName, reqUno.toString());
    await setDoc(srRef, {
      REMARK: remarks.REMARK,
      IT_REMARK: remarks.IT_REMARK,
      SME_REMARK: remarks.SME_REMARK,
    }, { merge: true });
    console.log(`✅ Firestore에서 SR [${reqUno}]의 Remarks 업데이트 완료`);
    return true;
  } catch (error) {
    console.error(`❌ Firestore에서 SR [${reqUno}]의 Remarks 업데이트 실패:`, error);
    return false;
  }
};