<!-- src/components/layout/Footer.vue -->
<template>
    <footer class="footer">
      <div class="footer-content">
        <p>Copyright © KMTC Digital Strategy Team</p>
        <p>Developer: HyunBin Kang</p>
        <p>Version 1.0</p>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .footer {
    background-color: #f8f9fa;
    padding: 20px;
    text-align: center;
    border-top: 1px solid #e9ecef;
    position: relative;
    bottom: 0;
    width: 100%;
  }
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-content p {
    margin: 5px 0;
    color: #6c757d;
    font-size: 14px;
  }
  </style>