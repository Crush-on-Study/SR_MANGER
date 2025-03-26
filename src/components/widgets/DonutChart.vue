<template>
    <div class="donut-chart">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from "vue";
  import { Pie } from "vue-chartjs";
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  // ✅ Service Type 데이터 받기
  const props = defineProps({
    data: Object,
  });
  
  // ✅ 차트 데이터 변환
  const chartData = computed(() => ({
    labels: Object.keys(props.data),
    datasets: [
      {
        data: Object.values(props.data),
        backgroundColor: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71"], // ICC, RPA, EKMTC, ICC+E-KMTC 색상 지정
        hoverOffset: 4,
      },
    ],
  }));
  
  // ✅ 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };
  </script>
  
  <style scoped>
  .donut-chart {
    width: 80px;
    height: 80px;
  }
  </style>