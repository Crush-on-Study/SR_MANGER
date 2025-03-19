<template>
  <button :class="['btn', type, { full: fullWidth }]">
    {{ label }}
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'primary' // 기본 스타일
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
/* 기본 버튼 스타일 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  font-weight: bold;
}

/* 버튼 스타일 - 그라데이션 적용 */
.primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}

.primary:hover {
  filter: brightness(1.2);
}

/* 보조 버튼 */
.secondary {
  background: linear-gradient(135deg, #ddd, #bbb);
  color: black;
}

.secondary:hover {
  filter: brightness(1.2);
}

/* 위험 버튼 (Logout) */
.danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.danger:hover {
  filter: brightness(1.2);
}

/* 전체 너비 버튼 */
.full {
  width: 100%;
}
</style>
