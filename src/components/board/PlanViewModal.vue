<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <!-- 모달 창 -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-1/2 h-5/6 overflow-y-auto">
      <div v-if="travelPlan">
        <div class="flex flex-col">
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
            <h3 class="flex justify-start">{{ travelPlan.title }}</h3>
              <div class="text-xs">{{ parseDate(travelPlan.planDate.start).toLocaleDateString() }} ~ {{ parseDate(travelPlan.planDate.end).toLocaleDateString() }} / {{ travelPlan.location }}</div>  
            </div>
            <button @click="close">닫기</button>
          </div>
          <div class="flex justify-start p-1 text-dark">{{ travelPlan.createUserId }}</div>
        </div>
        <hr/>
        <div class="text-xl flex justify-start mt-2">{{ travelPlan.content }}</div>
        <div>
          <h3>일정</h3>
          <div class="flex m-2">
            <button v-for="day in dateDiff + 1" :key="day" 
            :class="day === planIndex ? 'w-10 h-10 bg-main rounded-md m-1' : 'w-10 h-10 bg-light rounded-md m-1' "
            @click="setPlanDateIndex(day)"
            > {{ day }} </button>
          </div>
          <KakaoMapPolylineContainerForModal :markerList="markerList" :map="map" @getMap="getMap" />
          <div class="flex flex-col mt-3">
            <ResultPlaceBox v-if="modalDayPlanList[planIndex - 1]
" v-for="marker in modalDayPlanList[planIndex-1].placeList" :key="marker.id" :i="marker.id" :marker="marker" />
            <ResultPlaceBox v-if="modalDayHouseList[planIndex - 1]
" v-for="marker in modalDayHouseList[planIndex-1].placeList" :key="marker.id" :i="marker.id" :marker="marker" />
          </div>
        </div>
      </div>
      <div v-else>
        로딩중...
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
import { debounce } from 'lodash';
import { searchUser } from '@/api/user';
import { usePlanStore } from '@/stores/usePlanStore.js'
import { useUserStore } from '@/stores/useUserStore.js'
import { getTravelPlan } from '@/api/plan';
import ResultPlaceBox from '@/components/plan/ResultPlaceBox.vue';
import KakaoMapPolylineContainerForModal from './KakaoMapPolylineContainerForModal.vue';
const planStore = usePlanStore()
const userStore = useUserStore()
const map = ref(null);
const markerList = ref([]);
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  closeModal: {
    type: Function,
    required: true,
  },
  planId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['sendEmail']);

// 데이터
const email = ref('');
const isLoading = ref(false);
const suggestions = ref([]);
const travelPlan = ref(null);
const dateDiff = ref(0);
const planIndex = ref(0);
const modalDayPlanList = ref([]);
const modalDayHouseList = ref([]);
// 이메일 검색 API 호출
const fetchSuggestions = async (query) => {
  isLoading.value = true;
  suggestions.value = []; // 기존 추천 초기화

  try {
    const response = await fetch(`/api/emails?query=${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    suggestions.value = data.filter(user => user !== userStore.user.userId); // 추천 결과 업데이트
    console.log('suggestions', suggestions.value);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  } finally {
    isLoading.value = false; // 로딩 상태 해제
  }
};


// 디바운스를 적용하여 검색 호출 제한
const handleInput = debounce(async (e) => {
  const query = e.target.value.trim();
  if (query) {
    console.log('query', query);
    await searchUser(query, (res) => {
      console.log('res', res);
      suggestions.value = res.data;
    });
    console.log('suggestions', suggestions.value);
  } else {
    suggestions.value = []; // 입력값 없으면 초기화
  }
}, 300); // 300ms 지연

// 추천 선택
const selectSuggestion = (suggestion) => {
  if(suggestion === userStore.user.userId) {
    alert('자기 자신을 추가할 수 없습니다.');
    return;
  }
  email.value = suggestion; // 선택한 추천값으로 설정
  suggestions.value = []; // 드롭다운 숨기기
};

// 모달 닫기
const close = () => {
  markerList.value = [];
  map.value = null;
  planIndex.value = 0;

  props.closeModal();
}; 

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

const setPlanDateIndex = (day) => {
  console.log('day', day);
  planIndex.value = day;
  updateMarkers(day);
}

const updateMarkers = (index) => {
  markerList.value = [];

  const image = {
    imageSrc: 'https://vue3-kakao-maps.netlify.app/images/redMarker.png',
    imageWidth: 48,
    imageHeight: 48,
  };

  // 공통 함수: 마커 생성 및 추가
  const addMarkers = (placeList) => {
    placeList.forEach((place) => {
      
      const marker = {
        lat: place.lat,
        lng: place.lng,
        place_name: place.place_name ?? place.placeName,
        road_address_name: place.road_address_name ?? place.addressName,
        address_name: place.address_name ?? place.addressName,
        category_group_name: place.category_group_name ?? place.categoryName,
        phone: place.phone ?? '',
        infoWindow: {
          content: place.place_name,
          visible: false,
        },
        image: image,
        id: place.kakaoMapId ?? place.id,
        isSelected: false,
        orderBottomMargin: '37px',
      };
      markerList.value.push(marker);
    });
  };

  // 전체 일정(0번) 처리
  if (index === 0) {
    for (let i = 0; i < travelPlan.value.dayPlanList.length; i++) {
      if (travelPlan.value.dayPlanList[i]?.placeList) {
        addMarkers(travelPlan.value.dayPlanList[i].placeList);
      }
      if (travelPlan.value.dayHouseList[i]?.placeList) {
        addMarkers(travelPlan.value.dayHouseList[i].placeList);
      }
    }
  }
  // 특정 일정(index > 0) 처리
  else if (index > 0) {
    const dayPlan = travelPlan.value.dayPlanList[index - 1];
    const dayHouse = travelPlan.value.dayHouseList[index - 1];
    console.log('dayPlan', dayPlan);
    console.log('dayHouse', dayHouse);
    if (dayPlan?.placeList) {
      addMarkers(dayPlan.placeList);
    }
    if (dayHouse?.placeList) {
      addMarkers(dayHouse.placeList);
    }
  }

  // 첫 번째 마커의 '출발' 설정
  if (markerList.value.length > 0) {
    markerList.value[0].order = '출발';
  }

  console.log('updateMarkers markerList', markerList.value);
  getMap(map.value);
};

// 지도 업데이트
const getMap = (mapRef) => {
  console.log('getMap markerList', markerList.value)
  map.value = mapRef

  if (!map.value) return

  if (!markerList.value.length) {
    markerList.value = [{ lat: 35.1585232170784, lng: 129.159854668484 }]
  }

  const bounds = new kakao.maps.LatLngBounds()

  markerList.value.forEach((marker) => {
    bounds.extend(new kakao.maps.LatLng(Number(marker.lat), Number(marker.lng)))
  })

  map.value.setBounds(bounds)
}

watch(()=>travelPlan.value, (newVal) => {
  //일정 기간 구하기
  const startDate = parseDate(newVal.planDate.start);
  const endDate = parseDate(newVal.planDate.end);
  dateDiff.value = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  modalDayPlanList.value = newVal.dayPlanList;
  modalDayHouseList.value = newVal.dayHouseList;
})

// watch에 올바른 경로 지정 
watch(() => props.isModalOpen, async (newVal) => {
  try{  
    travelPlan.value = await getTravelPlan(props.planId);
    console.log('travelPlan', travelPlan.value);
  } catch (error) {
    console.error('Error fetching travel plan:', error);
  }
});
//watch(()=>travelPlan.value, (newVal) => {
onMounted(async () => {
  try{  
    travelPlan.value = await getTravelPlan(props.planId);
    console.log('travelPlan', travelPlan.value);
  } catch (error) {
    console.error('Error fetching travel plan:', error);
  }
});
</script>
