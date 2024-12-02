<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">회원 정보 수정</h2>
      <div v-if="userInfo" class="space-y-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">아이디</label>
          <input type="text" v-model="userId" class="text-gray-700" placeholder="아이디" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">이름</label>
          <input type="text" v-model="userName" class="text-gray-700" placeholder="이름"/>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">이메일</label>
          <input type="text" v-model="emailId" class="text-gray-700" placeholder="이메일" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">가입일</label>
          <div class="text-gray-700">{{ userInfo.userId }}</div>
        </div>
        <div class="flex justify-end mt-6">
          <router-link 
            to="/user/mypage" 
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            취소하기
          </router-link>
          <button
            @click="updateUser"
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            수정하기
          </button>
        </div>
      </div>
      <div v-else class="text-center">
        로딩중...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { updateUserInfo } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = ref(null)

const userId = ref(null)
const userName = ref(null)
const emailId = ref(null)


onMounted(() => {
  console.log(userStore)
  if (!userStore.user.userId) {
    alert('로그인이 필요한 서비스입니다.')
    router.push('/login')
    return
  }
  userInfo.value = userStore.user
  userId.value = userStore.user.userId
  userName.value = userStore.user.userName
  emailId.value = userStore.user.emailId
})

const updateUser = () => {
  console.log(userStore.user)
  userStore.user.userId = userId.value
  userStore.user.userName = userName.value
  userStore.user.emailId = emailId.value
  updateUserInfo({
    "access-token": userStore.user["access-token"], 
    user: userStore.user
  }, (response) => {
    console.log(response)
  })
  router.push('/user/mypage')
}
</script>
