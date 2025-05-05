<template>
  <div class="not-found-page bg-[#0a0a0a] min-h-screen">
    <Header />
    
    <div class="container mx-auto px-6 py-20">
      <div class="text-center">
        <h1 class="text-8xl md:text-9xl font-bold text-pink-500 mb-6">404</h1>
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Trang không tồn tại</h2>
        <p class="text-gray-400 mb-8">Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        
        <div class="flex flex-col md:flex-row justify-center gap-4">
          <router-link to="/">
            <a-button 
              type="primary"
              size="large"
              class="bg-gradient-to-r from-pink-500 to-purple-600 border-0"
            >
              Quay lại trang chủ
            </a-button>
          </router-link>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import Header from '../components/layout/Header.vue'
import Footer from '../components/layout/Footer.vue'
</script>