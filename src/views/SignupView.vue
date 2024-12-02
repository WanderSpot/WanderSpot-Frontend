<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">회원가입</h2>
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="userId">아이디</label>
          <div class="flex w-full justify-between">
            <input
              class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="userId"
              type="text"
              v-model="userId"
              placeholder="아이디를 입력하세요"
              required
            />
            <button
              class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              @click="checkId"
            >
              확인
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="userName">이름</label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userName"
            type="text"
            v-model="userName"
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">비밀번호</label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="passwordConfirm"
            >비밀번호 확인</label
          >
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="passwordConfirm"
            type="password"
            v-model="passwordConfirm"
            placeholder="비밀번호를 다시 입력하세요"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">이메일</label>
          <div class="flex space-x-2">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="emailId"
              type="text"
              v-model="emailId"
              placeholder="이메일 ID"
              required
            />
            <span>@</span>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="emailDomain"
              type="text"
              v-model="emailDomain"
              placeholder="도메인"
              required
            />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            가입하기
          </button>
          <router-link
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            to="/login"
          >
            로그인으로 돌아가기
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { checkUserId } from '@/api/user'
const userId = ref('')
const userName = ref('')
const password = ref('')
const passwordConfirm = ref('')
const emailId = ref('')
const emailDomain = ref('')
const router = useRouter()

const handleSignup = async () => {
  if (password.value !== passwordConfirm.value) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  const memberDto = {
    userId: userId.value,
    userName: userName.value,
    userPwd: password.value,
    emailId: emailId.value,
    emailDomain: emailDomain.value,
  }

  try {
    const response = await axios.post('http://localhost:80/api/user/join', memberDto)

    if (response.status === 201) {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.')
      router.push('/login')
    } else {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error)
    alert('서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.')
  }
}

const checkId = async () => {
  checkUserId(
    userId.value,
    (response) => {
      const res = response.data.split(',')
      if (response.status == 200) {
        alert('사용 가능한 아이디입니다.')
      } else {
        alert('이미 사용중인 아이디입니다.')
      }
    },
    (error) => {
      console.error('중복확인 중 오류 발생:', error)
    },
  )
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
