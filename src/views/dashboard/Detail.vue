<template>
    <div class="detail-container">
        <!-- ✅ 🔙 뒤로가기 버튼 -->
        <div class="back-button" @click="goBackToDevelopment">
        <span class="arrow">◀</span> 개발 목록 리스트
        </div>

        <h2>{{ selectedItem.name }} 개발 목록 리스트</h2>

        <!-- ✅ 2-(3) Service Type 별 Estimated Hours 집계 -->
        <div class="hours-summary">
            <span>ICC: {{ totalHours.ICC }} hours</span> |
            <span>E-KMTC: {{ totalHours.EKMTC }} hours</span> |
            <span>RPA: {{ totalHours.RPA }} hours</span>
        </div>

        <!-- ✅ 2-(5) Download & Commit 버튼 -->
        <div class="button-group">
            <Button label="📥 Download" type="secondary" @click="downloadExcel" />
            <Button label="✅ Commit" type="primary" @click="commitData" />
        </div>
        
            <!-- ✅ 스크롤 적용된 테이블 컨테이너 -->
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
            <!-- ✅ class 바인딩 적용 -->
            <tr v-for="(item, index) in mainTableData" :key="item.id" :class="getRowClass(item)">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.domain }}</td>
                <td>{{ item.serviceType }}</td>
                <td>{{ item.requestDate }}</td>
                <td>{{ item.estimatedHours }}</td>
                <td>{{ item.importance }}</td>
                <td><button @click="excludeItem(index)">🚫</button></td>
                <td><button @click="mainTableData.splice(index, 1)">🗑️</button></td>
            </tr>
            </tbody>
        </table>
        </div>
        
        <!-- ✅ Service Type별 테이블 -->
        <div v-for="(items, type) in serviceTypeTables" :key="type" class="service-type-section">
            <h3>{{ type }}</h3>
            <table>
            <thead>
                <tr>
                <th class="ref-no">Ref.no</th>
                <th class="title">Title</th>
                <th class="importance">중요도</th>
                <th class="estimated-hours">Est. Hours</th>
                <th class="action">추가</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.importance }}</td>
                <td>{{ item.estimatedHours }}</td>
                <td><button @click="restoreItem(type, index)">➕</button></td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../../components/widgets/Button.vue';

const nameList = ref([
  { id: "2501", name: "25.01", description: "25년도 1월 개발 대상 목록 입니다." },
  { id: "2503", name: "25.03(후보)", description: "25년도 3월 개발 대상 후보 목록 입니다." },
  { id: "2504", name: "25.04(후보)", description: "25년도 4월 개발 대상 후보 목록 입니다." },
]);

const route = useRoute();
const router = useRouter();  // ✅ 뒤로가기 기능 추가

// ✅ 뒤로가기 함수
const goBackToDevelopment = () => {
  router.push('/development'); // ✅ development 페이지로 이동
};

const selectedItem = computed(() => {
  return nameList.value.find(item => item.id === route.params.id) || { name: "목록 없음" };
});

// ✅ 첫 번째 메인 테이블 데이터 (기본 리스트 + 추가 데이터)
const mainTableData = ref([
  { id: 481384, title: "ICC 분석", domain: "CM", serviceType: "ICC", requestDate: "2024.12.31", estimatedHours: 170, importance: "필수 개발 대상" },
  { id: 15346, title: "Audinga API 연경", domain: "CM", serviceType: "API", requestDate: "2025.02.09", estimatedHours: 58, importance: "긴급 중요도 상" },
  { id: 731205, title: "부산 터미널 × eBilling", domain: "SO", serviceType: "RPA", requestDate: "2025.01.23", estimatedHours: 41, importance: "긴급 중요도 하" },
  { id: 12345, title: "2025 G.BSC Request", domain: "CS", serviceType: "ICC", requestDate: "2025.03.11", estimatedHours: 17, importance: "비긴급 중요도 상" },
  { id: 428215, title: "unplanned report 정리 개선", domain: "PN", serviceType: "ICC", requestDate: "2024.10.29", estimatedHours: 23, importance: "비긴급 중요도 상" },
  { id: 731484, title: "TAX Report Upgrade", domain: "FN", serviceType: "EKMTC", requestDate: "2024.10.22", estimatedHours: 30, importance: "비긴급 중요도 하" },
  // ✅ 추가된 더미 데이터
  { id: 981234, title: "서버 성능 최적화", domain: "VO", serviceType: "ICC+EKMTC", requestDate: "2025.06.12", estimatedHours: 45, importance: "필수 개발 대상" },
  { id: 762345, title: "클라우드 마이그레이션", domain: "CS", serviceType: "RPA", requestDate: "2025.07.22", estimatedHours: 62, importance: "긴급 중요도 상" },
  { id: 612309, title: "데이터 백업 솔루션 개선", domain: "CC", serviceType: "EKMTC", requestDate: "2025.08.14", estimatedHours: 38, importance: "비긴급 중요도 상" },
  { id: 872019, title: "보안 강화 패치 적용", domain: "CC", serviceType: "ICC", requestDate: "2025.09.01", estimatedHours: 29, importance: "비긴급 중요도 하" },
  { id: 432198, title: "UI/UX 개편 프로젝트", domain: "VO", serviceType: "API", requestDate: "2025.10.05", estimatedHours: 55, importance: "긴급 중요도 하" },
  { id: 123789, title: "실시간 로그 모니터링 구축", domain: "SA", serviceType: "RPA", requestDate: "2025.11.23", estimatedHours: 48, importance: "비긴급 중요도 중" }
]);

// ✅ Service Type 별 Estimated Hours 총합 계산 (정확한 분류 적용)
const totalHours = computed(() => {
  let hours = { ICC: 0, EKMTC: 0, RPA: 0 };

  mainTableData.value.forEach((item) => {
    // Service Type이 여러 개일 경우 분할해서 각각 합산
    item.serviceType.split("+").forEach((type) => {
      const trimmedType = type.trim(); // 앞뒤 공백 제거
      if (hours[trimmedType] !== undefined) {
        hours[trimmedType] += item.estimatedHours;
      }
    });
  });

  return hours;
});

// ✅ 자동 변환 함수 (api, edi로 들어오는 애들은 icc로 보내셈)
const normalizeServiceType = (serviceType) => {
  if (["API", "EDI"].includes(serviceType)) {
    return "ICC";  // API와 EDI는 ICC로 통합
  }
  return serviceType;
};

// ✅ 데이터 정제 (mainTableData에 적용)
mainTableData.value = mainTableData.value.map(item => ({
  ...item,
  serviceType: normalizeServiceType(item.serviceType)
}));

// ✅ CSS 클래스 동적 적용
const getRowClass = (item) => {
  return item.serviceType.includes("+") ? "highlight-row" : "";
};


// ✅ 엑셀 다운로드 기능 (더미 구현)
const downloadExcel = () => {
  console.log("📥 Excel 다운로드 실행");
};

// ✅ Commit 기능 (더미 구현)
const commitData = () => {
  console.log("✅ 데이터 커밋 실행", mainTableData.value);
};

const serviceTypeTables = ref({
  ICC: [],
  EKMTC: [],
  RPA: []
});


const excludeItem = (index) => {
  const item = mainTableData.value[index];
  const types = item.serviceType.split("+").map(type => type.trim());

  types.forEach(type => {
    if (serviceTypeTables.value[type]) {
      serviceTypeTables.value[type].push({ ...item, serviceType: type });
    }
  });

  mainTableData.value.splice(index, 1); // ✅ 원본 테이블에서 제거
};

const restoreItem = (serviceType, index) => {
  const item = serviceTypeTables.value[serviceType][index];

  // ✅ 원래 데이터에서 복합 Type이었는지 확인
  const originalItem = mainTableData.value.find(row => row.id === item.id);
  const isComposite = originalItem && originalItem.serviceType.includes("+");

  if (isComposite) {
    mainTableData.value.push({
      ...item,
      serviceType: originalItem.serviceType // ✅ 원래 복합 Type 유지
    });
  } else {
    mainTableData.value.push(item);
  }

  serviceTypeTables.value[serviceType].splice(index, 1);
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
