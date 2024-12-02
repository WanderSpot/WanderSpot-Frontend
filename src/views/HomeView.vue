<script setup>
import MainView from './MainView.vue'
import { useUserStore } from "@/stores/useUserStore";
import { usePlanStore } from "@/stores/usePlanStore";

const userStore = useUserStore();
const planStore = usePlanStore();

planStore.clearPlan();
</script>

<template>
  <div class="w-full h-full flex flex-row justify-center items-center">
    <div class="flex flex-col w-1/2 justify-center items-center">
      <p class="text-dark text-2xl font-bold">평범한 여행지 선택은 그만!</p>
      <p class="text-dark text-2xl font-bold">다트 던지기로 여행을 결정해 봐요!</p>
      <router-link v-if="userStore.user.userId === null" to="/login">
        <button class="bg-black text-white px-4 py-2 rounded-md hover:bg-main transition-all duration-300">로그인 하고 던지기</button>
      </router-link>
      <div v-else class="flex flex-col gap-4">
        <router-link to="/dart">
          <button 
            class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300" 
            style="width: 20rem;"
          >
            {{ userStore.user.userId }}님, 다트 던지러 가볼까요?
          </button>
        </router-link>
        <router-link to="/board">
          <button 
            class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300" 
            style="width: 20rem;"
          >
            다른 사람들의 여행 계획 보러가기
          </button>
        </router-link>
        <router-link to="/main">
          <button 
            class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hover:scale-105 transition-all duration-300" 
            style="width: 20rem;"
          >
            내 여행 계획 보러가기
          </button>
        </router-link>
      </div>
    </div>
    <div class="flex flex-col w-1/2 h-full justify-center items-center bg-light">
      <div>
        <div class="flex justify-center items-center">
          <img src="@/assets/icon/logo.svg" class="w-1/2 h-1/2" />
        </div>
      </div>
    </div>
  </div>
</template>
