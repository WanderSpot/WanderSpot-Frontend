<template>
  <div class="flex justify-center items-center" style="height: 90vh;">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">마이페이지</h2>
      <div v-if="userInfo" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">아이디</label>
          <div class="text-gray-700">{{ userInfo.userId }}</div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">이름</label>
          <div class="text-gray-700">{{ userInfo.userName }}</div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">이메일</label>
          <div class="text-gray-700">{{ userInfo.emailId }}@{{ userInfo.emailDomain }}</div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">가입일</label>
          <div class="text-gray-700">{{ userInfo.joinDate }}</div>
        </div>
        <div class="flex justify-end mt-6">
          <router-link to="/main">
            <button class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">메인으로</button>
          </router-link>
          <router-link
            to="/user/update"
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            회원정보 수정
          </router-link>
        </div>
      </div>
      <div v-else class="text-center">로딩중...</div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { getUserInfo } from '@/api/user'
import axios from 'axios'
import HeaderNav from '@/components/common/HeaderNav.vue'
const router = useRouter()
const userStore = useUserStore()
const userInfo = ref(null)

onMounted(() => {
  console.log(userStore)
  if (!userStore.user.userId) {
    alert('로그인이 필요한 서비스입니다.')
    router.push('/login')
    return
  }
  getUserInfo(userStore.user["access-token"], (response) => {
    userInfo.value = response.data
    userStore.user.userId = response.data.userId
    userStore.user.userName = response.data.userName
    userStore.user.emailId = response.data.emailId 
    userStore.user.joinDate = response.data.joinDate
    userStore.user.emailDomain = response.data.emailDomain
  })
})
</script>