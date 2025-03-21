<template>
    <div class="ur-import-container">
      <h2>📂 UR Import</h2>
  
      <!-- 🔹 Drag & Drop 영역 -->
      <div 
        class="drop-zone" 
        @dragover.prevent 
        @dragenter.prevent 
        @drop="handleDrop"
      >
        <p>📤 Drag & Drop Excel 파일을 여기에 업로드</p>
        <input type="file" ref="fileInput" @change="handleFileUpload" hidden accept=".xlsx,.xls">
        <button @click="openFilePicker">파일 선택</button>
      </div>
  
      <p v-if="uploadedFileName" class="file-info">📁 {{ uploadedFileName }} 업로드 완료!</p>
  
      <button v-if="processedData.length" class="save-btn" @click="saveToFirestore">
        📡 Firestore에 저장
      </button>
  
      <button class="delete-btn" @click="deleteAllFirestoreData">
        🔥 Firestore 전체 삭제
      </button>
  
      <div v-if="deleteMessage" class="delete-message">
        <p>{{ deleteMessage }}</p>
      </div>
  
      <!-- 🔹 전처리된 데이터 미리보기 -->
      <div v-if="processedData.length">
        <h3>📊 전처리된 데이터 (미리보기)</h3>
        <table>
          <thead>
            <tr>
              <th>Ref No</th>
              <th>Domain</th>
              <th>Title</th>
              <th>Status</th>
              <th>Service Type</th>
              <th>Request Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in processedData.slice(0, 10)" :key="index">
              <td>{{ item.ref_no }}</td>
              <td>{{ item.domain }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.serviceType }}</td>
              <td>{{ item.requestDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import * as XLSX from "xlsx";
  import { saveSRRequestsToFirestore, deleteAllDocuments } from "../../backend/firestoreService.js";
  
  const fileInput = ref(null);
  const uploadedFileName = ref("");
  const processedData = ref([]);
  const deleteMessage = ref("");
  
  // ✅ 파일 선택 핸들러
  const openFilePicker = () => {
    fileInput.value.click();
  };
  
  // ✅ Drag & Drop 이벤트 처리
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    processFile(file);
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };
  
  // ✅ 파일 처리
  const processFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("❌ 엑셀 파일만 업로드 가능합니다!");
      return;
    }
    uploadedFileName.value = file.name;
    readExcel(file);
  };
  
  // ✅ Excel 데이터 읽기 & 전처리
  const readExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  
      // ✅ 필요한 컬럼만 추출 + Ref No 앞의 0 제거 + Domain에서 괄호 제거
      const transformedData = jsonData.map((row) => ({
        ref_no: row["Reference No"] ? row["Reference No"].toString().replace(/^0+/, '') : "",
        domain: row["Domain"] ? row["Domain"].split(" (")[0].trim() : "",
        title: row["Title"] || "",
        status: row["Status"] || "",
        serviceType: row["ICC/WEB"] || "",
        requestDate: row["Request Date"] || ""
      }));
  
      processedData.value = transformedData;
      console.log("✅ 전처리된 데이터:", transformedData);
    };
    reader.readAsArrayBuffer(file);
  };
  
  // ✅ Firestore에 데이터 저장
  const saveToFirestore = async () => {
    if (!processedData.value.length) {
      alert("🚨 전처리된 데이터가 없습니다!");
      return;
    }
    await saveSRRequestsToFirestore(processedData.value);
    alert("🎉 Firestore 저장 완료!");
  };
  
  // ✅ Firestore 전체 삭제
  const deleteAllFirestoreData = async () => {
    if (!confirm("⚠️ Firestore의 모든 데이터를 삭제하시겠습니까?")) return;
  
    deleteMessage.value = "삭제 중... ⏳";
    
    const success1 = await deleteAllDocuments("sr_requests");
    const success2 = await deleteAllDocuments("sr_general_requests");
  
    if (success1 && success2) {
      deleteMessage.value = "✅ Firestore 모든 데이터가 삭제되었습니다!";
    } else {
      deleteMessage.value = "❌ Firestore 데이터 삭제 중 오류 발생!";
    }
  };
  </script>
  
  <style scoped>
  .ur-import-container {
    text-align: center;
    padding: 20px;
  }
  
  .drop-zone {
    border: 2px dashed #3498db;
    padding: 40px;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }
  
  .drop-zone:hover {
    background: #f0f8ff;
  }
  
  .file-info {
    margin-top: 15px;
    font-weight: bold;
  }
  
  .save-btn {
    margin-top: 15px;
    padding: 10px 15px;
    background: #2ecc71;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .delete-btn {
    margin-top: 15px;
    padding: 10px 15px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .delete-message {
    margin-top: 10px;
    font-weight: bold;
    color: #3498db;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  th {
    background: #f8f9fa;
    font-weight: bold;
  }
  </style>
  