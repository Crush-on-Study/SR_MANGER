 <template>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">X</button>
      <p class="text-date">{{ detailInfo.req_dt }} </p>
      <div class="text-xl font-bold mb-2"><strong>Ref.{{ detailInfo.ref_no }}</strong></div>
      <h2 class="text-xl font-bold mb-2">2025 G.BSC Request</h2>

      <div class="div-line"></div>
      
      <div class="flex justify-between items-center text-sm mb-4">
        <div>
          <span class="font-semibold mr-2">Label:     </span>
          <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">{{ detailInfo.kind }}</span>
          </div>
      </div>
      
      <div class="mb-4">
        <p>Applicant:     {{detailInfo.applicant}}</p>
        <p>Attachments:     <span class="text-blue-500 cursor-pointer">SR Request File</span></p>
      </div>

      <div class="mb-4">
        <p>Importance</p>
        <!-- !Remark: importance drop box 들어가야함 -->
      </div>

      <div class="div-line"></div>

      <div class="text-xl font-bold mb-2"><strong>Approval Comments</strong></div>

      <div class="mb-6 border border-gray-300 rounded-lg overflow-hidden">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-gray-200 border-b border-gray-300">
            <th class="border-r border-gray-300 p-2"></th>
            <th class="border-r border-gray-300 p-2"></th>
            <th class="border-r border-gray-300 p-2"></th>
            <th class="p-2"></th>
          </tr>
        </thead>
        <tbody>
          <!-- !Remark: v-for 문 처리 -->
          <tr class="border-b border-gray-300 text-center">
            <td class="border-r border-gray-300 p-2">Drafter</td>
            <td class="border-r border-gray-300 p-2">{{ detailInfo.aprv1 }}</td>
            <td class="border-r border-gray-300 p-2">Confirmed/Declined</td>
            <td class="p-2">{{ detailInfo.aprv1_rmk }}</td>
          </tr>
          <tr class="border-b border-gray-300 text-center">
            <td class="border-r border-gray-300 p-2">Team Leader</td>
            <td class="border-r border-gray-300 p-2">{{ detailInfo.aprv2 }}</td>
            <td class="border-r border-gray-300 p-2">Confirmed/Declined</td>
            <td class="p-2">{{ detailInfo.aprv2_rmk }}</td>
          </tr>
          <tr class="border-b border-gray-300 text-center">
            <td class="border-r border-gray-300 p-2">S/R admin</td>
            <td class="border-r border-gray-300 p-2">{{ detailInfo.aprv3 }}</td>
            <td class="border-r border-gray-300 p-2">Confirmed/Declined</td>
            <td class="p-2">{{ detailInfo.aprv3_rmk }}</td>
          </tr>
          <tr class="border-b border-gray-300 text-center">
            <td class="border-r border-gray-300 p-2">S/R Leader</td>
            <td class="border-r border-gray-300 p-2">{{ detailInfo.aprv4 }}</td>
            <td class="border-r border-gray-300 p-2">Confirmed/Declined</td>
            <td class="p-2">{{ detailInfo.aprv4_rmk }}</td>
          </tr>
        </tbody>
      </table>
    </div>
      
    <div class="div-line"></div>

      <div class="space-y-4">
        <div>
          <label class="block font-medium">Remark</label>
          <p><input type="text" class="w-full p-2 border rounded-md" placeholder="Input text" /></p>
        </div>
        <div>
          <label class="block font-medium">AMS Remark</label>
          <p><input type="text" class="w-full p-2 border rounded-md" placeholder="Input text" /></p>
        </div>
        <div>
          <label class="block font-medium">DT Remark</label>
          <span class="text-blue-500 cursor-pointer">📄 SR 보완 정리.pptx</span>
          <p><input type="text" class="w-full p-2 border rounded-md" placeholder="Input text" /></p>
        </div>
      </div>
      </div>
    </div>
  </template>

  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    detailInfo: Object,
  });

  </script>
  
  <style scoped>
  .text-date {
    font-size: 12px;
    color: #888686;
  }

  .div-line{
    border-top: 1px solid lightgray;
    margin: 30px 0;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 700px;
    position: relative;
  }
  
  /* ✅ 체크리스트 세로 정렬 */
  .checkbox-list {
    display: flex;
    flex-direction: column; /* 세로 정렬 */
    gap: 10px; /* 체크박스 간 간격 */
    margin: 15px 0;
  }
  
  /* ✅ 개별 체크박스 스타일 */
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    font-weight: bold;
  }
  
  .form-group input, .form-group textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .modal-footer {
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
  </style>