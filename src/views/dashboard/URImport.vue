<template>
    <div class="ur-import-container">
      <h2>UR Import</h2>
  
      <!-- Drag & Drop 영역 -->
      <div
        class="drop-zone"
        @dragover.prevent
        @dragenter.prevent
        @dragleave="isDragging = false"
        @dragover="isDragging = true"
        @drop.prevent="handleDrop"
      >
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept=".csv"
          style="display: none"
        />
        <p v-if="!file">Drag & Drop your CSV file here or</p>
        <p v-else>Selected file: {{ file.name }}</p>
        <button @click="triggerFileInput" class="browse-btn">
          Browse Files
        </button>
      </div>
  
      <!-- 미리보기 테이블 -->
      <div v-if="processedData.length" class="preview-table">
        <h3>Preview (First 10 Rows)</h3>
        <table>
          <thead>
            <tr>
              <th>REQ_UNO</th>
              <th>REQ_RNO</th>
              <th>DOM_KND</th>
              <th>REQ_TITLE</th>
              <th>REQ_STATUS</th>
              <th>PROGRAM_TYPE</th>
              <th>REQ_DT</th>
              <th>TOT_ESTM_TM</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in processedData.slice(0, 10)" :key="index">
              <td>{{ row.REQ_UNO }}</td>
              <td>{{ row.REQ_RNO }}</td>
              <td>{{ row.DOM_KND }}</td>
              <td>{{ row.REQ_TITLE }}</td>
              <td>{{ row.REQ_STATUS }}</td>
              <td>{{ row.PROGRAM_TYPE }}</td>
              <td>{{ row.REQ_DT }}</td>
              <td>{{ row.TOT_ESTM_TM }}</td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- 버튼 및 상태 메시지 -->
      <div class="action-buttons">
        <button @click="saveToFirestore" :disabled="!processedData.length">
          Save to Firestore
        </button>
        <button @click="deleteAllFirestoreData">
          Delete All Firestore Data
        </button>
      </div>
      <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import Papa from "papaparse";
  import { saveSRRequestsToFirestore, deleteAllDocuments } from "../../backend/firestoreService.js";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  
  // 상태 변수
  const file = ref(null);
  const isDragging = ref(false);
  const processedData = ref([]);
  const statusMessage = ref("");
  
  // 인증 상태 확인
  const auth = getAuth();
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ 현재 사용자:", user.uid);
        user.getIdTokenResult().then((idTokenResult) => {
          console.log("✅ 사용자 커스텀 클레임:", idTokenResult.claims);
        });
      } else {
        console.log("⚠️ 사용자가 로그인하지 않았습니다.");
      }
    });
  });
  
  // 파일 선택 트리거
  const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
  };
  
  // 파일 드롭 처리
  const handleDrop = (event) => {
    isDragging.value = false;
    const droppedFile = event.dataTransfer.files[0];
    processFile(droppedFile);
  };
  
  // 파일 선택 처리
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    processFile(selectedFile);
  };
  
  // 파일 처리
  const processFile = (selectedFile) => {
    if (!selectedFile) return;
  
    // 파일 확장자 검증
    const validExtensions = [".csv"];
    const fileExtension = selectedFile.name.slice(selectedFile.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      statusMessage.value = "Please upload a CSV file (.csv)";
      alert(statusMessage.value);
      return;
    }
  
    file.value = selectedFile;
    readCSV(selectedFile);
  };
  
  // CSV 파일 읽기 및 전처리
  const readCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        if (data.length === 0) {
          statusMessage.value = "No data found in the CSV file.";
          alert(statusMessage.value);
          return;
        }
  
        // CSV 컬럼명 디버깅
        console.log("✅ CSV Headers:", Object.keys(data[0]));
  
        // 데이터 전처리
        processedData.value = data.map((row) => {
          // REQ_DT를 YYYY-MM-DD 형식으로 변환
          let reqDate = row["REQ_DT"] || "";
          if (reqDate && reqDate.length === 8) { // 20240710 형식 가정
            reqDate = `${reqDate.slice(0, 4)}-${reqDate.slice(4, 6)}-${reqDate.slice(6, 8)}`;
          }
  
          // 숫자 필드 변환 및 소수점 한 자리로 반올림
          const totEstmTm = row["TOT_ESTM_TM"] ? Number(parseFloat(row["TOT_ESTM_TM"]).toFixed(1)) : 0;
          const webEstmTm = row["WEB_ESTM_TM"] ? Number(parseFloat(row["WEB_ESTM_TM"]).toFixed(1)) : 0;
          const iccEstmTm = row["ICC_ESTM_TM"] ? Number(parseFloat(row["ICC_ESTM_TM"]).toFixed(1)) : 0;
          const rpaEstmTm = row["RPA_ESTM_TM"] ? Number(parseFloat(row["RPA_ESTM_TM"]).toFixed(1)) : 0;
  
          // DOM_KND 전처리: 괄호와 그 안의 내용 제거 (예: "CC (Container)" -> "CC")
          let domKnd = row["DOM_KND"] || "";
          if (domKnd.includes("(")) {
            domKnd = domKnd.split("(")[0].trim();
          }
  
          // REQ_UNO가 존재하는지 확인
          if (!row["REQ_UNO"]) {
            console.warn("⚠️ REQ_UNO is missing in row:", row);
          }
  
          return {
            REQ_UNO: row["REQ_UNO"] ? String(row["REQ_UNO"]) : "", // 문자열로 변환
            REQ_RNO: row["REQ_RNO"] || "",
            DOM_KND: domKnd,
            REQ_TITLE: row["REQ_TITLE"] || "",
            REQ_STATUS: row["REQ_STATUS"] || "",
            PROGRAM_TYPE: row["PROGRAM_TYPE"] || "",
            REQ_DT: reqDate,
            TOT_ESTM_TM: totEstmTm,
            WEB_ESTM_TM: webEstmTm,
            ICC_ESTM_TM: iccEstmTm,
            RPA_ESTM_TM: rpaEstmTm,
            GRADE: row["GRADE"] || "",
            KND: row["KND"] || "",
            REMARK: row["REMARK"] || "",
            IT_REMARK: row["IT_REMARK"] || "",
            SME_REMARK: row["SME_REMARK"] || "",
          };
        });
  
        // 처리된 데이터 디버깅
        console.log("✅ Processed Data Sample:", processedData.value.slice(0, 3));
  
        statusMessage.value = `Processed ${processedData.value.length} rows.`;
        alert(statusMessage.value);
      },
      error: (error) => {
        statusMessage.value = `Error reading CSV file: ${error.message}`;
        alert(statusMessage.value);
      },
    });
  };
  
  // Firestore에 저장
  const saveToFirestore = async () => {
    if (!processedData.value.length) {
      statusMessage.value = "No data to save.";
      alert(statusMessage.value);
      return;
    }
  
    try {
      const success = await saveSRRequestsToFirestore(processedData.value);
      if (success) {
        statusMessage.value = "Data successfully saved to Firestore!";
        alert(statusMessage.value);
      } else {
        statusMessage.value = "Failed to save data to Firestore.";
        alert(statusMessage.value);
      }
    } catch (error) {
      statusMessage.value = `Error saving to Firestore: ${error.message}`;
      if (error.message.includes("Missing or insufficient permissions")) {
        statusMessage.value += " (Please ensure you are logged in with Manager role.)";
      }
      alert(statusMessage.value);
    }
  };
  
  // Firestore 데이터 삭제
  const deleteAllFirestoreData = async () => {
    try {
      console.log("✅ Starting Firestore data deletion for collections: sr_requests, sr_general_requests");
      const success = await Promise.all([
        deleteAllDocuments("sr_requests"),
        deleteAllDocuments("sr_general_requests"),
      ]);
      console.log("✅ Deletion Results:", success);
      if (success.every(result => result)) {
        statusMessage.value = "All Firestore data deleted successfully!";
        alert(statusMessage.value);
        processedData.value = [];
        file.value = null;
      } else {
        statusMessage.value = "Failed to delete some Firestore data.";
        alert(statusMessage.value);
      }
    } catch (error) {
      statusMessage.value = `Error deleting Firestore data: ${error.message}`;
      if (error.message.includes("Missing or insufficient permissions")) {
        statusMessage.value += " (Please ensure you are logged in with Manager role.)";
      }
      alert(statusMessage.value);
    }
  };
  </script>
  
  <style scoped>
  .ur-import-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .drop-zone {
    border: 2px dashed #ccc;
    padding: 40px;
    text-align: center;
    margin-bottom: 20px;
    background: #f9f9f9;
    transition: all 0.3s ease;
  }
  
  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: #007bff;
    background: #e6f0ff;
  }
  
  .browse-btn {
    margin-top: 10px;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .browse-btn:hover {
    background: #0056b3;
  }
  
  .preview-table {
    margin-top: 20px;
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background: #f1f1f1;
    font-weight: bold;
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: #28a745;
    color: white;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  button:nth-child(2) {
    background: #dc3545;
  }
  
  button:nth-child(2):hover:not(:disabled) {
    background: #c82333;
  }
  
  button:hover:not(:disabled) {
    background: #218838;
  }
  
  .status-message {
    text-align: center;
    margin-top: 20px;
    color: #333;
  }
  </style>