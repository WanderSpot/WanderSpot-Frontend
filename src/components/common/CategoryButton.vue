<template>
  <div>
    <button @click="toggleSidebar" class="ml-5">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- 사이드바 -->
    <div 
      class="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20"
      :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
    >
      <div class="p-5">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">카테고리</h2>
          <button @click="toggleSidebar" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul class="space-y-4">
          <router-link to="/main" class="no-underline decoration-none text-dark" ><li class="cursor-pointer hover:bg-gray-100 p-2 rounded">내 계획</li></router-link>
          <router-link to="/dart" class="no-underline decoration-none text-dark"><li class="cursor-pointer hover:bg-gray-100 p-2 rounded">다트 던지기</li></router-link>
          <router-link to="/notice" class="no-underline decoration-none text-dark"><li class="cursor-pointer hover:bg-gray-100 p-2 rounded">공지 사항</li></router-link>
          <router-link to="/board" class="no-underline decoration-none text-dark"><li class="cursor-pointer hover:bg-gray-100 p-2 rounded">모두의 계획</li></router-link>
          <router-link to="/user/mypage" class="no-underline decoration-none text-dark"><li class="cursor-pointer hover:bg-gray-100 p-2 rounded">마이페이지</li></router-link>
          <li class="cursor-pointer hover:bg-gray-100 p-2 rounded no-underline decoration-none text-dark">Give me a coffee</li>
        </ul>
      </div>
    </div>

    <!-- 배경 흐림 효과 -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-10"
      @click="toggleSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
/* 사이드바 애니메이션 */
.transform {
  transform: translateX(0);
}
.-translate-x-full {
  transform: translateX(-100%);
}
</style>
