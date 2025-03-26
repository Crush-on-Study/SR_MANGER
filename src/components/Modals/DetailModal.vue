<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>S/R Request Details</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <!-- S/R 요청 세부 정보 -->
          <div class="detail-row">
            <span class="label">Reference No:</span>
            <span class="value">{{ srData.REQ_UNO }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Domain:</span>
            <span class="value">{{ srData.DOM_KND }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Title:</span>
            <span class="value">{{ srData.REQ_TITLE }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value">{{ srData.REQ_STATUS }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Service Type:</span>
            <span class="value">{{ srData.PROGRAM_TYPE }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Request Date:</span>
            <span class="value">{{ srData.REQ_DT }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Estimated Hours:</span>
            <span class="value">{{ srData.TOT_ESTM_TM }}</span>
          </div>
  
          <!-- Remark 필드 -->
          <div class="remark-section">
            <h4>Remarks</h4>
            <div class="remark-field">
              <label>General Remark:</label>
              <textarea v-model="remarks.REMARK" rows="3" placeholder="Enter general remark"></textarea>
            </div>
            <div class="remark-field">
              <label>IT Remark:</label>
              <textarea v-model="remarks.IT_REMARK" rows="3" placeholder="Enter IT remark"></textarea>
            </div>
            <div class="remark-field">
              <label>SME Remark:</label>
              <textarea v-model="remarks.SME_REMARK" rows="3" placeholder="Enter SME remark"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="save-btn" @click="saveRemarks">Save Remarks</button>
          <button class="cancel-btn" @click="closeModal">Cancel</button>
        </div>
        <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { updateSRRemarks } from "../../backend/firestoreService.js";
  
  // Props
  const props = defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    srData: {
      type: Object,
      required: true,
    },
    collectionName: {
      type: String,
      required: true, // "sr_requests" 또는 "sr_general_requests"
    },
  });
  
  // Emits
  const emit = defineEmits(["update:isOpen"]);
  
  // 상태 변수
  const remarks = ref({
    REMARK: "",
    IT_REMARK: "",
    SME_REMARK: "",
  });
  const statusMessage = ref("");
  
  // srData가 변경될 때 remarks 초기화
  watch(
    () => props.srData,
    (newData) => {
      remarks.value = {
        REMARK: newData.REMARK || "",
        IT_REMARK: newData.IT_REMARK || "",
        SME_REMARK: newData.SME_REMARK || "",
      };
    },
    { immediate: true }
  );
  
  // 모달 닫기
  const closeModal = () => {
    emit("update:isOpen", false);
    statusMessage.value = "";
  };
  
  // Remark 저장
  const saveRemarks = async () => {
    try {
      const success = await updateSRRemarks(props.collectionName, props.srData.REQ_UNO, remarks.value);
      if (success) {
        statusMessage.value = "Remarks updated successfully!";
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        statusMessage.value = "Failed to update remarks.";
      }
    } catch (error) {
      statusMessage.value = `Error updating remarks: ${error.message}`;
      if (error.message.includes("Missing or insufficient permissions")) {
        statusMessage.value += " (Please ensure you are logged in with Manager role.)";
      }
    }
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
    width: 600px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .modal-header h3 {
    margin: 0;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .modal-body {
    margin-bottom: 20px;
  }
  
  .detail-row {
    display: flex;
    margin-bottom: 10px;
  }
  
  .label {
    font-weight: bold;
    width: 150px;
    color: #333;
  }
  
  .value {
    flex: 1;
    color: #666;
  }
  
  .remark-section {
    margin-top: 20px;
  }
  
  .remark-section h4 {
    margin-bottom: 10px;
    color: #333;
  }
  
  .remark-field {
    margin-bottom: 15px;
  }
  
  .remark-field label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
  }
  
  .remark-field textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-size: 14px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-top: 1px solid #ddd;
    padding-top: 10px;
  }
  
  .save-btn {
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .save-btn:hover {
    background: #218838;
  }
  
  .cancel-btn {
    padding: 10px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .cancel-btn:hover {
    background: #c82333;
  }
  
  .status-message {
    text-align: center;
    margin-top: 10px;
    color: #333;
  }
  </style>