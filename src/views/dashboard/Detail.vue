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
  
      <!-- ✅ Download & Commit 버튼 -->
      <div class="button-group">
        <Button label="📥 Download" type="secondary" @click="downloadExcel" />
        <Button label="✅ Commit" type="primary" @click="commitData" />
      </div>
  
      <!-- ✅ 테이블 -->
      <div class="table-wrapper">
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
            <tr v-for="(item, index) in mainTableData" :key="item.id">
              <td>{{ item.id }}</td>
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
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import Button from "../../components/widgets/Button.vue";
  import { getCardSRRequests, deleteSRFromCard, excludeSRFromCard } from "../../backend/firestoreService.js";
  
  const route = useRoute();
  const router = useRouter();
  
  // ✅ 선택한 카드 정보
  const selectedItem = ref({ name: "목록 없음" });
  
  // ✅ Firestore에서 가져온 SR 데이터 저장
  const mainTableData = ref([]);
  
  // ✅ Firestore에서 데이터 가져오기
  const fetchSRRequests = async () => {
    const cardId = route.params.id;
    mainTableData.value = await getCardSRRequests(cardId);
    console.log(`📌 Firestore에서 카드 ${cardId}의 SR 요청 불러옴:`, mainTableData.value);
  };
  
  // ✅ 컴포넌트 마운트 시 Firestore 데이터 로드
  onMounted(fetchSRRequests);
  
  // ✅ 뒤로가기 기능
  const goBackToDevelopment = () => {
    router.push("/development");
  };
  
  // ✅ Service Type별 총합 계산
  const totalHours = computed(() => {
    let hours = { ICC: 0, EKMTC: 0, RPA: 0 };
    mainTableData.value.forEach((item) => {
      item.serviceType.split("+").forEach((type) => {
        if (hours[type.trim()] !== undefined) {
          hours[type.trim()] += item.estimatedHours;
        }
      });
    });
    return hours;
  });
  
  // ✅ SR 제외 (Firestore 이동)
  const excludeItem = async (index, item) => {
    const cardId = route.params.id;
    const success = await excludeSRFromCard(cardId, item);
  
    if (success) {
      mainTableData.value.splice(index, 1);
    }
  };
  
  // ✅ SR 삭제 (Firestore에서 삭제)
  const deleteItem = async (index, srId) => {
    const cardId = route.params.id;
    const success = await deleteSRFromCard(cardId, srId);
  
    if (success) {
      mainTableData.value.splice(index, 1);
    }
  };
  
  // ✅ Excel 다운로드 (더미 기능)
  const downloadExcel = () => {
    console.log("📥 Excel 다운로드 실행");
  };
  
  // ✅ Commit 기능 (더미 기능)
  const commitData = () => {
    console.log("✅ 데이터 커밋 실행", mainTableData.value);
  };
  </script>
  
    

<style scoped>
/* ✅ 테이블 컨테이너 스타일 */
.table-wrapper {
max-height: 400px; /* ✅ 최대 10개가 보이도록 제한 */
overflow-y: auto;  /* ✅ 아래로 스크롤 가능하게 설정 */
border: 1px solid #ddd; /* ✅ 테두리 추가 */
border-radius: 8px; /* ✅ 둥근 모서리 */
}

/* ✅ 뒤로가기 버튼 스타일 */
.back-button {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #3498db;
  cursor: pointer;
  margin-bottom: 15px;
  transition: color 0.2s ease-in-out;
}

/* ✅ 2-(3) Service Type 별 총합 스타일 */
.hours-summary {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 15px;
}

/* ✅ 2-(5) 버튼 그룹 스타일 */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

/* ✅ 복합 Service Type을 위한 하이라이트 색상 */
.highlight-row {
  background-color: #e0f7ff !important; /* 밝은 하늘색 */
}

.back-button:hover {
  color: #1d6fa5;
}

.arrow {
  font-size: 18px;
  margin-right: 5px;
}

.detail-container {
padding: 20px;
}

.main-table,
table {
width: 100%;
border-collapse: collapse;
margin-bottom: 20px;
}

th, td {
border: 1px solid #ddd;
padding: 10px;
text-align: center;
}

th {
background: #f4f4f4;
}

.service-type-section {
margin-top: 30px;
}
</style>
