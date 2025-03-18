<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from '../../components/widgets/Button.vue';
import Modal from '../../components/widgets/Modal.vue';
import Modal2 from '../../components/widgets/Modal2.vue';

// ✅ 현재 라우터 정보 가져오기
const route = useRoute();

// ✅ 임시 리스트 데이터 (3개 추가)
const nameList = ref([
  { id: "2501", name: "25.01", description: "25년도 1월 개발 대상 목록 입니다." },
  { id: "2503", name: "25.03(후보)", description: "25년도 3월 개발 대상 후보 목록 입니다." },
  { id: "2504", name: "25.04(후보)", description: "25년도 4월 개발 대상 후보 목록 입니다." },
]);

// ✅ 현재 선택한 아이템 찾기
const selectedItem = computed(() => {
  return nameList.value.find(item => item.id === route.params.id) || { name: "목록 없음" };
});

// ✅ 모달 상태 관리
const isModal1Open = ref(false);
const isModal2Open = ref(false);

// ✅ 모달 닫기 함수
const closeModal1 = () => { isModal1Open.value = false; };
const closeModal2 = () => { isModal2Open.value = false; };
</script>

<template>
  <div class="development-container">
    <div class="header">
      <h2> S/R 요청 카드 리스트</h2>  <!-- ✅ 제목 변경됨 -->
      <Button label="+ NEW" type="primary" @click="isModal2Open = true" class="btn-class"/>
    </div>

    <!-- ✅ 리스트 출력 -->
    <div class="list-container">
      <div v-for="(item, index) in nameList" :key="index" class="list-item" @click="$router.push(`/development/${item.id}`)">
        <div class="content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
        </div>
        <div class="actions">
          <button class="edit-btn" @click.stop="isModal1Open = true">⚙️</button>
          <button class="delete-btn" @click.stop="nameList.splice(index, 1)">🗑️</button>
        </div>
      </div>
    </div>

    <!-- ✅ 개발 목록 추가 모달 (Modal1) -->
    <Modal v-if="isModal1Open" title="개발 목록 추가" @close="closeModal1" />

    <!-- ✅ 신규 목록 추가 모달 (Modal2) -->
    <Modal2 v-if="isModal2Open" title="신규 목록 추가" @close="closeModal2" />
  </div>
</template>

<style scoped>
.development-container {
  padding: 20px;
}


.list-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.chart-wrapper {
  width: 150px;
  height: 150px;
}

.summary-info {
  margin-left: 20px;
  text-align: right;
}
</style>
