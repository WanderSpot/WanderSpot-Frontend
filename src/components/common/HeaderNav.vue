<template>
  <div
    class="justify-between items-center header-nav w-100 bg-main text-black h-20 flex items-center"
  >
    <div class="flex items-center">
      <CategoryButton />
      <div class="flex flex-col">
        <div class="text-lg font-bold ml-5">새로운 {{ planStore.location }} 여행</div>
        <div
          v-if="tripDate2.start && tripDate2.end"
          class="ml-2 cursor-pointer bg-white rounded-full px-2 py-1"
          @click="resetTripDate"
        >
          {{ new Date(tripDate2.start).toLocaleString('ko-KR', options) }} ~
          {{ new Date(tripDate2.end).toLocaleString('ko-KR', options) }}
        </div>
        <div
          v-else
          class="ml-2 cursor-pointer bg-white rounded-full px-2 py-1"
          @click="resetTripDate"
        >
          날짜를 선택해주세요
        </div>
      </div>
      <div
        v-for="(member, i) in members"
        :key="i"
        class="flex bg-white items-center justify-center rounded-full w-10 h-10 ml-5"
        style="font-size: 0.8rem"
      >
        {{ member.substring(0, 4) }}
      </div>
      <button
        class="bg-sub rounded-full w-10 h-10 ml-5 justify-center items-center flex"
        @click="isModalOpen = true"
      >
        <img src="@/assets/icon/user-group-solid.svg" class="w-5 h-5" />
      </button>
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
import { defineProps, ref, onMounted, watch, defineEmits } from 'vue'
import { useUserStore } from '@/stores/useUserStore.js'
import { usePlanStore } from '@/stores/usePlanStore.js'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AddMemberModal from '@/components/plan/AddMemberModal.vue'
import CategoryButton from '@/components/common/CategoryButton.vue'
import Dropdown from '@/components/item/Dropdown.vue'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

const userStore = useUserStore()
const planStore = usePlanStore()
const router = useRouter()

const tripDate2 = ref({ start: null, end: null })
const selectedOption = ref('')
const isModalOpen = ref(false)

const props = defineProps({
  tripDate: {
    type: Object,
    required: true
  },
  members: {
    type: Array,
    required: true
  }
});

const closeModal = () => {
  isModalOpen.value = false
}

const resetTripDate = () => {
  emit('resetTripDate')
}

const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

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

// WebSocket 관련 코드
const client = ref(null)

const wsStomp = () => {
  client.value = new Client({
    webSocketFactory: () => new SockJS('http://localhost:80/ws'),
    debug: function (str) {
      console.log('Debug: ' + str)
    },
    onConnect: () => {
      console.log('STOMP 연결 성공')

      // 연결 후 바로 알림 요청
      client.value.publish({
        destination: '/app/sendNotification',
        body: userStore.user.userId, // 사용자 ID를 서버에 전달
      })

      // 알림 수신 구독
      client.value.subscribe(`/topic/notifications/${userStore.user.userId}`, ({ body }) => {
        const notification = JSON.parse(body)
        selectedOption.value = notification
        console.log('수신된 알림:', notification)
      })
    },
    onStompError: (frame) => {
      console.error('STOMP 오류:', frame.headers['message'])
    },
  })
  client.value.activate()
}

watch(
  () => planStore.planDate,
  (newVal) => {
    if (newVal.start && newVal.end) {
      tripDate2.value.start = new Date(...newVal.start)
      tripDate2.value.end = new Date(...newVal.end)
    }
  },
)

onMounted(() => {
  if (planStore.planDate) {
    tripDate2.value.start = new Date(...planStore.planDate.start)
    tripDate2.value.end = new Date(...planStore.planDate.end)
  }
  wsStomp()
})
</script>
