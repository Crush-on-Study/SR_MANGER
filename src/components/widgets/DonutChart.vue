<!-- src/components/widgets/DonutChart.vue -->
<template>
    <div class="donut-chart-container">
      <canvas ref="chartCanvas"></canvas>
      <div class="chart-label">{{ totalHours }}h</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import Chart from 'chart.js/auto';

  const chartCanvas = ref(null);
  const totalHours = ref(0);
  let chartInstance = null;
  
  onMounted(() => {
    updateChart();
  });
  
  watch(() => props.serviceData, updateChart, { deep: true });

  const props = defineProps({
    serviceData: Object, // { ICC: 40, 'E-KMTC': 30, RPA: 30 }
  });
  
  const updateChart = () => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    const labels = Object.keys(props.serviceData);
    const dataValues = Object.values(props.serviceData);
    totalHours.value = dataValues.reduce((acc, val) => acc + val, 0);
  
    chartInstance = new Chart(chartCanvas.value, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataValues,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // 색상 커스텀 가능
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
          },
        },
      },
    });
  };
  </script>
  
  <style scoped>
  .donut-chart-container {
    position: relative;
    width: 120px;
    height: 120px;
  }
  
  .chart-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  </style>
  