<template>
    <div class="detail-container">
      <!-- ✅ 🔙 뒤로가기 버튼 -->
      <div class="back-button" @click="goBackToDevelopment">
        <span class="arrow">◀</span> 개발 목록 리스트
      </div>
  
      <h2>{{ selectedItem.name }} 개발 목록 리스트</h2>
  
      <!-- ✅ Service Type 별 Estimated Hours 집계 -->
      <div class="hours-summary">
        <span>ICC: {{ totalHours.ICC }} hours</span> |
        <span>E-KMTC: {{ totalHours.EKMTC }} hours</span> |
        <span>RPA: {{ totalHours.RPA }} hours</span>
      </div>
  
      <!-- ✅ Download & Commit & 전체 삭제 버튼 -->
      <div class="button-group">
        <Button label="📥 Download" type="secondary" @click="downloadExcel" />
        <Button label="✅ Commit" type="primary" @click="commitData" />
        <Button label="🗑️ 전체 삭제" type="danger" @click="deleteAllItems" />
      </div>
  
      <!-- ✅ 메인 테이블 -->
      <div class="table-wrapper">
        <h3>메인 테이블</h3>
        <table class="main-table">
          <thead>
            <tr>
              <th>Ref.no</th>
              <th>Title</th>
              <th>Domain</th>
              <th>Service Type</th>
              <th>Request Date</th>
              <th>Estimated Hours</th>
              <th>중요도</th>
              <th>제외</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in mainTableData" :key="item.id" :class="{ 'composite-type': item.isComposite }">
              <td>{{ item.ref_no || 'N/A' }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.serviceType }}</td>
              <td>{{ item.requestDate }}</td>
              <td>{{ item.estimatedHours }}</td>
              <td>{{ item.importance }}</td>
              <td><button @click="excludeItem(index, item)">🚫</button></td>
              <td><button @click="deleteItem(index, item.id)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- ✅ 서브테이블: ICC -->
      <div class="table-wrapper">
        <h3>ICC</h3>
        <table class="sub-table">
          <thead>
            <tr>
              <th>Ref.no</th>
              <th>Title</th>
              <th>Domain</th>
              <th>Service Type</th>
              <th>Request Date</th>
              <th>Estimated Hours</th>
              <th>중요도</th>
              <th>추가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in iccTableData" :key="item.id" :class="{ 'composite-type': item.isComposite }">
              <td>{{ item.ref_no || 'N/A' }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.serviceType }}</td>
              <td>{{ item.requestDate }}</td>
              <td>{{ item.estimatedHours }}</td>
              <td>{{ item.importance }}</td>
              <td><button @click="addToMain(index, item, 'icc')">➕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- ✅ 서브테이블: E-KMTC -->
      <div class="table-wrapper">
        <h3>E-KMTC</h3>
        <table class="sub-table">
          <thead>
            <tr>
              <th>Ref.no</th>
              <th>Title</th>
              <th>Domain</th>
              <th>Service Type</th>
              <th>Request Date</th>
              <th>Estimated Hours</th>
              <th>중요도</th>
              <th>추가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in ekmtcTableData" :key="item.id" :class="{ 'composite-type': item.isComposite }">
              <td>{{ item.ref_no || 'N/A' }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.serviceType }}</td>
              <td>{{ item.requestDate }}</td>
              <td>{{ item.estimatedHours }}</td>
              <td>{{ item.importance }}</td>
              <td><button @click="addToMain(index, item, 'ekmtc')">➕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- ✅ 서브테이블: RPA -->
      <div class="table-wrapper">
        <h3>RPA</h3>
        <table class="sub-table">
          <thead>
            <tr>
              <th>Ref.no</th>
              <th>Title</th>
              <th>Domain</th>
              <th>Service Type</th>
              <th>Request Date</th>
              <th>Estimated Hours</th>
              <th>중요도</th>
              <th>추가</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in rpaTableData" :key="item.id" :class="{ 'composite-type': item.isComposite }">
              <td>{{ item.ref_no || 'N/A' }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.serviceType }}</td>
              <td>{{ item.requestDate }}</td>
              <td>{{ item.estimatedHours }}</td>
              <td>{{ item.importance }}</td>
              <td><button @click="addToMain(index, item, 'rpa')">➕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import Button from "../../components/widgets/Button.vue";
  import { getCardSRRequests, deleteSRFromCard, getDevelopmentCards, deleteAllSRFromCard } from "../../backend/firestoreService.js";
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";
  
  const route = useRoute();
  const router = useRouter();
  const cardId = route.params.id; // URL에서 카드 ID 가져오기
  
  // ✅ 선택한 카드 정보
  const selectedItem = ref({ name: "목록 없음" });
  
  // ✅ 테이블 데이터
  const mainTableData = ref([]);
  const iccTableData = ref([]);
  const ekmtcTableData = ref([]);
  const rpaTableData = ref([]);
  
  // ✅ 카드 이름 가져오기
  const fetchCardDetails = async () => {
    const cards = await getDevelopmentCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
      selectedItem.value = { name: card.name };
    }
  };
  
  // ✅ Firestore에서 데이터 가져오기
  const fetchSRRequests = async () => {
    const data = await getCardSRRequests(cardId);
  
    // 디버깅: 가져온 데이터 확인
    console.log("📌 Firestore에서 가져온 원본 데이터:", data);
  
    // 초기 데이터는 모두 메인 테이블에 표시
    mainTableData.value = data
      .filter(item => item && typeof item === "object") // 유효한 객체만 필터링
      .map(item => {
        const serviceType = item.PROGRAM_TYPE || ""; // Firestore 필드 이름에 맞게 수정
        return {
          id: item.id, // Firestore 문서 ID
          ref_no: item.REQ_UNO || "N/A", // Firestore 필드 이름에 맞게 수정
          title: item.REQ_TITLE || "",
          domain: item.DOM_KND || "",
          serviceType: item.PROGRAM_TYPE || "",
          requestDate: item.REQ_DT || "",
          estimatedHours: item.TOT_ESTM_TM || 0,
          importance: item.MANDATORY || "",
          isComposite: serviceType ? serviceType.includes("+") : false, // 복합 타입 여부 체크
        };
      });
  
    // 서브 테이블은 처음에는 비어 있음
    iccTableData.value = [];
    ekmtcTableData.value = [];
    rpaTableData.value = [];
  
    console.log(`📌 Firestore에서 카드 ${cardId}의 SR 요청 불러옴:`, {
      mainTableData: mainTableData.value,
      iccTableData: iccTableData.value,
      ekmtcTableData: ekmtcTableData.value,
      rpaTableData: rpaTableData.value,
    });
  };
  
  // ✅ 컴포넌트 마운트 시 Firestore 데이터 로드
  onMounted(() => {
    fetchCardDetails();
    fetchSRRequests();
  });
  
  // ✅ 뒤로가기 기능
  const goBackToDevelopment = () => {
    router.push("/development");
  };
  
  // ✅ Service Type별 총합 계산
  const totalHours = computed(() => {
    let hours = { ICC: 0, EKMTC: 0, RPA: 0 };
    mainTableData.value.forEach((item) => {
      item.serviceType.split("+").forEach((type) => {
        const trimmedType = type.trim();
        if (trimmedType === "ICC") hours.ICC += item.estimatedHours;
        if (trimmedType === "E-KMTC") hours.EKMTC += item.estimatedHours;
        if (trimmedType === "RPA") hours.RPA += item.estimatedHours;
      });
    });
    return hours;
  });
  
  // ✅ 중복 체크 함수
  const isDuplicate = (table, refNo) => {
    return table.some(item => item.ref_no === refNo);
  };
  
  // ✅ SR 제외 (메인 테이블에서 서브테이블로 이동)
  const excludeItem = (index, item) => {
    const excludedItem = { ...item };
    mainTableData.value.splice(index, 1);
  
    // 복합 타입 처리
    const types = item.serviceType.split("+").map(type => type.trim());
    types.forEach(type => {
      const itemCopy = { ...excludedItem, serviceType: type }; // 각 타입별로 복사본 생성
      if (type === "ICC" && !isDuplicate(iccTableData.value, itemCopy.ref_no)) {
        iccTableData.value.push(itemCopy);
      }
      if (type === "E-KMTC" && !isDuplicate(ekmtcTableData.value, itemCopy.ref_no)) {
        ekmtcTableData.value.push(itemCopy);
      }
      if (type === "RPA" && !isDuplicate(rpaTableData.value, itemCopy.ref_no)) {
        rpaTableData.value.push(itemCopy);
      }
    });
  };
  
  // ✅ 서브테이블에서 메인 테이블로 추가
  const addToMain = (index, item, tableType) => {
    // 메인 테이블에 이미 존재하는지 확인
    if (isDuplicate(mainTableData.value, item.ref_no)) {
      alert("이미 메인 테이블에 존재하는 항목입니다.");
      return;
    }
  
    // 복합 타입인 경우, 동일한 ref_no를 가진 모든 항목을 찾아 원래 serviceType으로 복원
    let originalItem = { ...item };
    if (item.isComposite) {
      const refNo = item.ref_no;
      const relatedItems = [];
  
      // 모든 서브테이블에서 동일한 ref_no를 가진 항목 수집
      iccTableData.value = iccTableData.value.filter(i => {
        if (i.ref_no === refNo) {
          relatedItems.push(i);
          return false;
        }
        return true;
      });
      ekmtcTableData.value = ekmtcTableData.value.filter(i => {
        if (i.ref_no === refNo) {
          relatedItems.push(i);
          return false;
        }
        return true;
      });
      rpaTableData.value = rpaTableData.value.filter(i => {
        if (i.ref_no === refNo) {
          relatedItems.push(i);
          return false;
        }
        return true;
      });
  
      // 원래 serviceType 복원
      const originalServiceType = relatedItems.map(i => i.serviceType).join("+");
      originalItem = { ...relatedItems[0], serviceType: originalServiceType };
    } else {
      // 단일 타입인 경우, 해당 테이블에서만 제거
      if (tableType === "icc") iccTableData.value.splice(index, 1);
      if (tableType === "ekmtc") ekmtcTableData.value.splice(index, 1);
      if (tableType === "rpa") rpaTableData.value.splice(index, 1);
    }
  
    // 메인 테이블에 추가
    mainTableData.value.push(originalItem);
  };
  
  // ✅ SR 삭제 (Firestore에서 삭제)
  const deleteItem = async (index, srId) => {
    const cardId = route.params.id;
    const success = await deleteSRFromCard(cardId, srId);
  
    if (success) {
      // Firestore에서 삭제 성공 시, 클라이언트 상태 업데이트
      mainTableData.value.splice(index, 1);
      // Firestore와 동기화하기 위해 데이터 새로고침
      await fetchSRRequests();
    } else {
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  // ✅ 전체 SR 삭제 (Firestore에서 모든 SR 삭제)
  const deleteAllItems = async () => {
    if (mainTableData.value.length === 0) {
      alert("삭제할 데이터가 없습니다.");
      return;
    }
  
    // 사용자에게 삭제 확인 메시지 표시
    const confirmDelete = confirm("모든 SR 요청 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmDelete) return;
  
    try {
      const success = await deleteAllSRFromCard(cardId);
      if (success) {
        // Firestore에서 삭제 성공 시, 클라이언트 상태 업데이트
        mainTableData.value = [];
        // Firestore와 동기화하기 위해 데이터 새로고침
        await fetchSRRequests();
        alert("모든 SR 요청 데이터가 삭제되었습니다.");
      } else {
        alert("전체 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ 전체 삭제 중 오류 발생:", error);
      alert("전체 삭제 중 오류가 발생했습니다.");
    }
  };
  
  // ✅ Excel 다운로드
  const downloadExcel = () => {
    // 메인 테이블 데이터를 Excel 형식으로 변환
    const excelData = mainTableData.value.map(item => ({
      "Ref.no": item.ref_no || "N/A",
      "Title": item.title,
      "Domain": item.domain,
      "Service Type": item.serviceType,
      "Request Date": item.requestDate,
      "Estimated Hours": item.estimatedHours,
      "중요도": item.importance,
    }));
  
    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Main Table");
  
    // Excel 파일 생성
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // 파일 다운로드
    saveAs(data, `${selectedItem.value.name}_MainTable.xlsx`);
  };
  
  // ✅ Commit 기능 (더미 기능)
  const commitData = () => {
    console.log("✅ 데이터 커밋 실행", mainTableData.value);
  };
  </script>
  
  <style scoped>
  .detail-container {
    padding: 20px;
  }
  
  .back-button {
    cursor: pointer;
    color: #007bff;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  
  .arrow {
    margin-right: 5px;
  }
  
  .hours-summary {
    margin-bottom: 20px;
    font-size: 16px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .table-wrapper {
    margin-bottom: 30px;
  }
  
  .main-table, .sub-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .main-table th, .sub-table th {
    background: #f1f3f5;
    padding: 10px;
    text-align: left;
    font-weight: 600;
  }
  
  .main-table td, .sub-table td {
    padding: 10px;
    border-bottom: 1px solid #e9ecef;
  }
  
  .composite-type {
    background-color: #e6f0fa; /* 밝은 파란색 */
  }
  
  button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
  }
  </style>