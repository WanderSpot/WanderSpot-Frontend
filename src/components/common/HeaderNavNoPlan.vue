<template>
  <div class="justify-between items-center header-nav w-100 bg-main text-black h-20 flex items-center">
    <div class="flex ">
      <CategoryButton />
    </div>
    <div class="flex items-center">
      <Dropdown class="z-2" :selectedOption="selectedOption" />
      <div class="flex items-center">
        <router-link to="/user/mypage"
          ><img src="@/assets/icon/user-solid.svg" class="w-10 h-10 mr-3 bg-light rounded-full"
        /></router-link>
        <!-- 로그아웃 버튼 -->
        <button class="flex mr-2 justify-center items-center  bg-light text-light w-10 h-10 rounded-full" @click="logout">
          <img src="@/assets/icon/right-from-bracket-solid.svg" class="w-5 h-5" /></button>
      </div>
    </div>
  </div>
  <AddMemberModal :isModalOpen="isModalOpen" :closeModal="closeModal" />
</template>

<script setup>
import { defineProps, ref } from 'vue';
import AddMemberModal from '@/components/plan/AddMemberModal.vue';
import { useUserStore } from '@/stores/useUserStore.js'
import CategoryButton from '@/components/common/CategoryButton.vue'
import Dropdown from '@/components/item/Dropdown.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const props = defineProps({
  tripDate: {
    type: String,
    required: true,
  },
  resetTripDate: {
    type: Function,
    required: true,
  }, 
  members: {
    type: Array,
    required: true,
  }
});

const isModalOpen = ref(false);
const closeModal = () => {
  isModalOpen.value = false;
};

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

// 로그아웃 함수
const logout = async () => {
  try {
    // 로그아웃 API 호출
    await axios.get(`http://localhost:80/api/user/logout/${userStore.user.userId}`, {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`,
      },
    })

    // Pinia에서 토큰 삭제
    userStore.$reset()

    // 로그인 페이지로 이동
    router.push('/')
  } catch (error) {
    console.error('로그아웃 실패:', error)
  }
}
</script>
