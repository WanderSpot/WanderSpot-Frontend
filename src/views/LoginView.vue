<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="userId"> 아이디 </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="userId"
            type="text"
            v-model="userId"
            placeholder="아이디를 입력하세요"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            비밀번호
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            로그인
          </button>
          <button
            class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            <router-link to="/signup">회원가입</router-link>
          </button>
          <a
            class="inline-block align-baseline font-bold text-sm text-gray-600 hover:text-gray-800"
            href="#"
          >
            비밀번호 찾기
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/user.js'
import { useUserStore } from '@/stores/useUserStore.js'

const router = useRouter()
const email = ref('')
const password = ref('')
const saveId = ref('')
const userStore = useUserStore()

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1]; // payload는 두 번째 부분
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                .join('')
        );
        return JSON.parse(jsonPayload); // JSON으로 변환
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

const handleLogin = async () => {
  if (!userId.value || !password.value) {
    alert('아이디와 비밀번호를 입력해주세요.')
    return
  }

  const param = {
    userId: userId.value,
    userPwd: password.value,
    // saveid: saveId.value ? "ok" : "",
  }
  console.log(param)

  login(
    param,
    (response) => {
      console.log(response.status)
      if (response.status === 201) {
        alert('로그인 성공!')
        router.push('/') // 성공 시 페이지 이동
        userStore.initializeUser(response.data)
        console.log(userStore.user, response.data)
        const decodedToken = decodeToken(response.data['refresh-token'])
        userStore.setRefreshToken(response.data['refresh-token'])
        userStore.setUserId(decodedToken.userId)
      }
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        alert('아이디 또는 비밀번호가 잘못되었습니다.')
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
      console.error(error)
    },
  )
}
</script>
