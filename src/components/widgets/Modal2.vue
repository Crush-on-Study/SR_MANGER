<!-- src/components/widgets/Modal2.vue -->
<template>
  <div class="modal-overlay" v-if="isOpen">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close-button" @click="closeModal">✖</button>
      </div>
      <div class="modal-body">
        <!-- Name 입력 -->
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" placeholder="Name" />
        </div>

        <!-- Description 입력 -->
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="formData.description" placeholder="Description"></textarea>
        </div>

        <!-- Applying Month 입력 -->
        <div class="form-group">
          <label for="applyingMonth">Applying Month</label>
          <input type="date" id="applyingMonth" v-model="formData.applyingMonth" />
        </div>

        <!-- ICC, E-KMTC, RPA 입력 -->
        <div class="form-group input-group">
          <div class="input-item">
            <label for="icc">ICC</label>
            <input type="number" id="icc" v-model.number="formData.serviceHours.ICC" min="0" placeholder="0" />
          </div>
          <div class="input-item">
            <label for="ekmtc">EKMTC</label>
            <input type="number" id="ekmtc" v-model.number="formData.serviceHours.EKMTC" min="0" placeholder="0" />
          </div>
          <div class="input-item">
            <label for="rpa">RPA</label>
            <input type="number" id="rpa" v-model.number="formData.serviceHours.RPA" min="0" placeholder="0" />
          </div>
        </div>

        <!-- 프로젝트 정비 입력 버튼 -->
        <div class="form-group">
          <button class="project-input-button" @click="handleProjectInput">
            + 프로젝트 정비 입력
          </button>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="modal-footer">
        <Button label="Cancel" type="secondary" @click="closeModal" />
        <Button label="Create" type="primary" @click="createCard" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "./Button.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "create"]);

const formData = ref({
  name: "",
  description: "",
  applyingMonth: "",
  serviceHours: {
    ICC: 0,
    EKMTC: 0,
    RPA: 0,
  },
});

// 모달 닫기
const closeModal = () => {
  emit("close");
  resetForm();
};

// 폼 초기화
const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    applyingMonth: "",
    serviceHours: {
      ICC: 0,
      EKMTC: 0,
      RPA: 0,
    },
  };
};

// 프로젝트 정비 입력 (더미 기능)
const handleProjectInput = () => {
  console.log("프로젝트 정비 입력 클릭");
};

// Create 버튼 클릭 시
const createCard = () => {
  if (!formData.value.name) {
    alert("Name은 필수 입력 항목입니다.");
    return;
  }
  if (!formData.value.applyingMonth) {
    alert("Applying Month는 필수 입력 항목입니다.");
    return;
  }

  // 서비스 타입과 공수 시간을 배열로 변환
  const serviceTypes = [];
  if (formData.value.serviceHours.ICC > 0) serviceTypes.push("ICC");
  if (formData.value.serviceHours.EKMTC > 0) serviceTypes.push("E-KMTC");
  if (formData.value.serviceHours.RPA > 0) serviceTypes.push("RPA");

  if (serviceTypes.length === 0) {
    alert("최소 하나의 Service Type에 공수 시간을 입력해야 합니다.");
    return;
  }

  emit("create", {
    name: formData.value.name,
    description: formData.value.description,
    applyingMonth: formData.value.applyingMonth,
    serviceTypes: serviceTypes,
    serviceHours: formData.value.serviceHours,
  });
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group textarea {
  height: 80px;
  resize: none;
}

.input-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-item {
  flex: 1;
}

.input-item input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.project-input-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>