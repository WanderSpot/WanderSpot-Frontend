<template>
  <HeaderNav
    :tripDate="planStore.planDate"
    @resetTripDate="resetTripDate"
    :members="planStore.joinMemberId"
  />
  <DateModal
    v-if="
      planStore.planDate.start === null ||
      planStore.planDate.start.length === 0 ||
      planStore.planDate.end.length === 0
    "
    :tripDate="planStore.planDate"
    @updateTripDate="updateTripDate"
  />

  <div class="flex w-full">
    <div id="menu_wrap" class="flex h-full w-1/4 parent">
      <div class="flex flex-col h-full w-1/2" id="first-child" style="height: 90vh">
        <div class="flex flex-col justify-between h-full">
          <div class="flex flex-col">
            <button
              type="button"
              :class="planListIndex === 0 ? 'selected-button' : 'unselected-button'"
              class="p-3"
              @click="changePlanListIndex(0)"
            >
              <div>Step 1</div>
              <div>장소 선택</div>
            </button>
            <button
              type="button"
              :class="planListIndex === 1 ? 'selected-button' : 'unselected-button'"
              class="p-3"
              @click="changePlanListIndex(1)"
            >
              <div>Step 2</div>
              <div>숙소 선택</div>
            </button>
          </div>

          <div v-if="planListIndex === 0" class="flex justify-center">
            <button
              type="button"
              class="bg-dark text-light p-3 w-4/5 text-sm"
              @click="changePlanListIndex(1)"
            >
              다음
            </button>
          </div>
          <div v-else class="flex justify-center w-full">
            <router-link to="/plan/result" class="flex justify-center w-full">
              <button type="button" class="bg-dark text-light p-3 w-5/6 text-sm">결과 보기</button>
            </router-link>
          </div>
          
        </div>
      </div>
      <PlaceSearch
        class="relative child"
        id="second-child"
        :markerList="markerList"
        @onClickPlaceBox="onClickPlaceBox"
        @searchPlacesCB="searchPlacesCB"
      />
      <DayPlanList
        class="absolute child z-2 bg-white h-full flex scrollbar-hidden"
        id="third-child"
        :planList="planListIndex === 0 ? planStore.dayPlanList : planStore.dayHouseList"
        :planListIndex="planListIndexList[planListIndex]"
        :selectedMarkerList="selectedMarkerList"
        @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
        @onClickDayPlanList="onClickDayPlanList"
      />
    </div>
    <div class="w-3/4 h-full">
      <KakaoMapContainer
        :markerList="markerList"
        @resetMarkerList="resetMarkerList"
        @getMap="getMap"
      />
    </div>
  </div>
  <div class="fixed right-5 bottom-5 z-10">
    <div class="flex justify-center items-center">
      <button type="button" class="flex justify-center items-center border-2 border-dark bg-light text-light w-10 h-10 rounded-full" @click="openInfoModal">
        <img src="@/assets/icon/circle-info-solid.svg" class="w-5 h-5" />
      </button>
    </div>
  </div>
  <InfoModal :isModalOpen="isInfoModalOpen" :closeModal="closeInfoModal" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import HeaderNav from '@/components/common/HeaderNav.vue'
import DateModal from '@/components/plan/DateModal.vue'
import PlaceSearch from '@/components/plan/PlaceSearch.vue'
import DayPlanList from '@/components/plan/DayPlanList.vue'
import KakaoMapContainer from '@/components/plan/KakaoMapContainer.vue'
import { usePlanStore } from '@/stores/usePlanStore'
import { useUserStore } from '@/stores/useUserStore'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import Dropdown from '@/components/item/Dropdown.vue'
import InfoModal from '@/components/plan/InfoModal.vue'
const userStore = useUserStore()
console.log('🚑,userStore', userStore.user.userId)

import AddMemberModal from '@/components/plan/AddMemberModal.vue'
// 공통 로직 작성
// 여행 날짜 관련 변수
const tripDate = ref(null)
const planDate = ref({ start: null, end: null })
// 여행 장소 관련 변수
const markerList = ref([])
const selectedMarkerList = ref([])
// 여행 일정 관련 리스트
const planList = ref([])
const planListIndexList = ref([])
const planListIndex = ref(0)

planList.value = Array.from({ length: 2 }, (_, i) => [])
planListIndexList.value = Array.from({ length: 2 }, (_, i) => 0)

const dayPlanList = ref([])
const dayPlanListIndex = ref(0)
// 숙소 관련 리스트
const dayHouseList = ref([])
const dayHouseListIndex = ref(0)
// 지도 관련 변수
const map = ref(null)

const isInfoModalOpen = ref(false)
const openInfoModal = () => {
  isInfoModalOpen.value = !isInfoModalOpen.value;
};

const closeInfoModal = () => {
  console.log('closeInfoModal', isInfoModalOpen.value);
  isInfoModalOpen.value = !isInfoModalOpen.value;
};

const planStore = usePlanStore()
// 여행 계획 초기화
const initializePlan = () => {
  let initialData = null

  if (planStore.id === null) {
    initialData = planStore
    planStore.initializePlan(initialData)
  } else {
    initialData = planStore
    console.log('피니아에 저장된 계획 불러오기', initialData)
    const start = new Date(
      initialData.planDate.start[0], // Year
      initialData.planDate.start[1] - 1, // Month (0-based, so subtract 1)
      initialData.planDate.start[2], // Day
      initialData.planDate.start[3] || 0, // Hour
      initialData.planDate.start[4] || 0, // Minute
      initialData.planDate.start[5] || 0, // Second
      initialData.planDate.start[6] || 0, // Millisecond
    )

    const end = new Date(
      initialData.planDate.end[0], // Year
      initialData.planDate.end[1] - 1, // Month (0-based, so subtract 1)
      initialData.planDate.end[2], // Day
      initialData.planDate.end[3] || 0, // Hour
      initialData.planDate.end[4] || 0, // Minute
      initialData.planDate.end[5] || 0, // Second
      initialData.planDate.end[6] || 0, // Millisecond
    )

    initialData.joinMemberId = []
    planDate.value.start = start
    planDate.value.end = end

    planList.value[0] = planStore.dayPlanList
    planList.value[1] = planStore.dayHouseList

    planList.value[0] = planStore.dayPlanList
    planList.value[1] = planStore.dayHouseList

    planListIndexList.value.forEach((index, i) => {
      planListIndexList.value[i] = 0
    })

    planListIndex.value = 0

    console.log('initializePlan planView PLANLIST', planList.value)
  }
}
const adjustThirdChildPosition = () => {
  const firstChild = document.getElementById('first-child')
  const secondChild = document.getElementById('second-child')
  const thirdChild = document.getElementById('third-child')

  const firstChildPosition = firstChild.getBoundingClientRect()
  const secondChildPosition = secondChild.getBoundingClientRect()
  console.log('adjustThirdChildPosition', firstChildPosition, secondChildPosition)
  thirdChild.style.left = `${secondChildPosition.width + firstChildPosition.width}px`
}

// const client = ref(null)
// const wsStomp = () => {
//   client.value = new Client({
//     webSocketFactory: () => new SockJS('http://localhost:80/ws'),
//     debug: function (str) {
//       console.log('Debug: ' + str)
//     },
//     onConnect: () => {
//       console.log('STOMP 연결 성공')
//       // 연결 후 바로 알림 요청
//       client.value.publish({
//         destination: '/app/sendNotification',
//         body: userStore.user.userId, // 사용자 ID를 서버에 전달
//       })

//       // 알림 수신 구독
//       client.value.subscribe(`/topic/notifications/${userStore.user.userId}`, ({ body }) => {
//         const notification = JSON.parse(body)
//         console.log('수신된 알림:', notification)
//       })
//     },
//     onStompError: (frame) => {
//       console.error('STOMP 오류:', frame.headers['message'])
//     },
//   })
//   client.value.activate()
// }

const answer = ref(null)

//여행 날짜 초기화
const resetTripDate = () => {
  tripDate.value = null
  planDate.value = null
  planStore.clearPlanDate()
  console.log('resetTripDate planView', planStore.planDate)
}

// 여행 날짜 업데이트
const updateTripDate = (newVal) => {
  console.log('updateTripDate planView', newVal)
  tripDate.value = newVal
  planStore.planDate = tripDate.value
  let dateDiff = parseDate(newVal.end).getTime() - parseDate(newVal.start).getTime()
  planDate.value = dateDiff / (1000 * 60 * 60 * 24)

  planList.value.forEach((plan, i) => {
    planList.value[i] = Array.from({ length: planDate.value + 1 }, (_, j) => [])
  })

  planStore.planDate = tripDate.value

  planStore.dayPlanList = Array.from({ length: planDate.value + 1 }, (_, j) => ({ placeList: [] }))
  planStore.dayHouseList = Array.from({ length: planDate.value + 1 }, (_, j) => ({ placeList: [] }))

  //planListIndexList 초기화
  //0 : 여행 일정, 1 : 숙소
  planListIndexList.value.forEach((index, i) => {
    planListIndexList.value[i] = 0
  })

  //planListIndex 초기화
  //0 : 여행 일정, 1 : 숙소
  planListIndex.value = 0
  //console.log(' updateTripDate planView dayPlanList', dayPlanList);
}

// 여행 장소 선택 시 실행
const onClickPlaceBox = (data) => {
  console.log(
    'planView onClickPlaceBox',
    planList.value[planListIndex.value],
    planListIndexList.value[planListIndex.value],
    data,
  )
  //planList.value[planListIndex.value][planListIndexList.value[planListIndex.value]].placeList.push(data);
  if (planListIndex.value === 0) {
    console.log('addDayPlan')
    planStore.addDayPlan(planListIndexList.value[planListIndex.value], data)
  } else {
    planStore.addDayHouse(planListIndexList.value[planListIndex.value], data)
  }

  markerList.value.forEach((marker) => {
    if (marker.id === data.id) {
      marker.isSelected = true
    }
  })
}

// 여행 장소 선택 시 실행
const onClickSelectedPlaceBox = (data, _i) => {
  console.log('planView onClickSelectedPlaceBox', data, _i)
  console.log(planList)
  // 선택된 장소를 제외하는 필터 로직
  // planList.value[planListIndex.value][_i].placeList =
  //   planList.value[planListIndex.value][_i].placeList.filter(marker => marker.id !== data.id);

  // Pinia 스토어에서 데이터 제거
  if (planListIndex.value === 0) {
    console.log('removeDayPlan', _i, data.id)
    planStore.removeDayPlan(_i, data.id)
  } else {
    console.log('removeDayHouse', _i, data.id)
    planStore.removeDayHouse(_i, data.id)
  }

  markerList.value.forEach((marker) => {
    if (marker.id === data.id) {
      marker.isSelected = false
    }
  })
}

// 지도 초기화
const getMap = (mapRef) => {
  map.value = mapRef
}

const searchPlacesCB = (data) => {
  const image = {
    imageSrc: 'https://vue3-kakao-maps.netlify.app/images/redMarker.png',
    imageWidth: 48,
    imageHeight: 48,
  }

  console.log('planView searchPlacesCB', data)
  markerList.value = []
  markerList.value = data.map((marker, i) => ({
    lat: marker.y,
    lng: marker.x,
    place_name: marker.place_name,
    road_address_name: marker.road_address_name,
    address_name: marker.address_name,
    category_group_name: marker.category_group_name ? marker.category_group_name : '기타',
    phone: marker.phone,
    infoWindow: {
      content: marker.place_name,
      visible: false,
    },
    image: image,
    id: marker.id,
    isSelected: false,
    orderBottomMargin: '37px',
  }))

  let bounds = new kakao.maps.LatLngBounds()
  markerList.value.forEach((marker) => {
    bounds.extend(new kakao.maps.LatLng(Number(marker.lat), Number(marker.lng)))
  })

  if (map.value) {
    map.value.setBounds(bounds)
  }

  markerList.value = [...markerList.value]
}

const onLoadKakaoMap = () => {
  console.log('planView onLoadKakaoMap')
}

const onClickMapMarker = (data) => {
  console.log('planView onClickMapMarker', data)
}

// 여행 일정 요일 클릭 시 실행
const onClickDayPlanList = (index) => {
  console.log('planView onClickDayPlanList', index)
  planListIndexList.value[planListIndex.value] = index
  console.log('planView planListIndexList', planListIndexList.value)
}

const changePlanListIndex = (index) => {
  if (index === 0 && planListIndex.value === 1) {
    const ps = new kakao.maps.services.Places()
    ps.keywordSearch(`${planStore.location} 관광지`, searchPlacesCB)
    planListIndex.value = index
  } else if (index === 1 && planListIndex.value === 0) {
    const ps = new kakao.maps.services.Places()
    ps.keywordSearch(`${planStore.location} 숙소`, searchPlacesCB)
    planListIndex.value = index
  }
}

const parseDate = (date) => {
  return new Date(
    date[0],
    date[1] - 1,
    date[2],
    date[3] || 0,
    date[4] || 0,
    date[5] || 0,
    date[6] || 0,
  )
}

const loadKakaoMaps = () => {
  return new Promise((resolve) => {
    if (!window.kakao) {
      const script = document.createElement('script')
      script.src =
        'https://dapi.kakao.com/v2/maps/sdk.js?appkey=61a782bfa96c63717e66c772d4f8917f&libraries=services'
      script.onload = () => resolve(window.kakao)
      document.head.appendChild(script)
    } else {
      resolve(window.kakao)
    }
  })
}

// 기타 로직 (watch, markerList 관리 등)
watch(
  () => markerList.value,
  (newVal) => {
    adjustThirdChildPosition()
  },
)
onMounted(async () => {
  console.log('🚑,onMounted planView')
  // wsStomp()

  if (
    planStore.planDate.start === null ||
    planStore.planDate.start.length === 0 ||
    planStore.planDate.end.length === 0
  ) {
    // 서버에서 데이터를 불러오는 로직이 필요하면 여기에 추가
    console.log('피니아를 불러오는데 문제가 있습니다.')
    const defaultPlan = {
      planDate: { start: null, end: null },
      dayPlanList: [{ placeList: [] }],
      dayHouseList: [{ placeList: [] }],
      location: planStore.location,
      joinMemberId: [],
      id: -1,
      createUserId: null,
    }
    planStore.initializePlan(defaultPlan)
  } else {
    console.log('피니아를 불러옵니다.')
    initializePlan()
  }

  if (planStore.planDate.start) {
    planDate.value.start = parseDate(planStore.planDate.start)
  }
  if (planStore.planDate.end) {
    planDate.value.end = parseDate(planStore.planDate.end)
  }

  window.addEventListener('resize', adjustThirdChildPosition)
  adjustThirdChildPosition()
  try {
    const kakao = await loadKakaoMaps()
    console.log('Kakao Maps SDK 로드 완료:', kakao)

    // Kakao Maps 관련 로직
    const ps = new kakao.maps.services.Places()
    console.log('Places 객체:', ps)
    ps.keywordSearch(`${planStore.location} 관광지`, searchPlacesCB)
  } catch (error) {
    console.error('Kakao Maps 로드 오류:', error)
  }

  console.log('adjustThirdChildPosition 실행')

  //console.log('kakao', kakao);

  // 초기 위치 설정

  // 윈도우 리사이즈 이벤트 리스너 추가
})
</script>

<style scoped>
.selected-button {
  @apply text-main;
  font-weight: bold;
}
.unselected-button {
  @apply text-gray-500 text-sm;
}

.parent:nth-child() {
  background-color: red;
}
/* tailwind.css 또는 추가된 CSS 파일 */
.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>
