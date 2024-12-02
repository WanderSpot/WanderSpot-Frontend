<template> 
  <HeaderNav :tripDate="planStore.planDate" :members="planStore.joinMemberId" />
  <div v-if="data.length > 0" class="flex justify-center w-full">
    <div class="flex w-1/4">
      <div class="flex flex-col bg-light w-1/4">
        <button
          v-for="(item, index) in data"
          :key="item.id"
          @click="setPlanIndex(index)"
          :class="getButtonClass(index, planIndex)"
          class="m-2"
        >
          {{ item.location }}
        </button>
      </div>

      <div class="flex flex-col w-1/4 justify-center">
        <div class="flex flex-col h-full justify-between items-center">
          <div class="flex flex-col">
            <button
              :class="getDayButtonClass(0, planDateIndex)"
              @click="setPlanDateIndex(0)"
            >
              전체일정
            </button>
            <button
              v-for="(day, index) in planDateArray"
              :key="index"
              @click="setPlanDateIndex(day)"
              :class="getDayButtonClass(day, planDateIndex)"
            >
              {{ day }}
            </button>
          </div>
          <button @click="editPlan" class="bg-dark text-light p-3 w-5/6 text-sm">
            편집
          </button>
        </div>
      </div>

      <div class="w-2/4">
        <PlanList :planList="planList" :planDateIndex="planDateIndex"  />
      </div>
    </div>

    
    <KakaoMapPolylineContainer
      class="w-3/4"
      :markerList="markerList"
      :map="map"
      @getMap="getMap"
    />
    
  </div>
  <div v-else>
    <div class ="w-full flex flex-col justify-center items-center" style="height: 90vh;">
      <h1>생성된 플랜이 없습니다!</h1>
      <h1>다트를 던지러 가볼까요?</h1>
      <router-link to="/dart">
        <button class="bg-dark text-light p-3 mt-10 text-xl">다트 던지기</button>
      </router-link>
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
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { usePlanStore } from "@/stores/usePlanStore";
import { useRouter } from 'vue-router';
import InfoModal from '@/components/plan/InfoModal.vue';
import { listPlan, listJoinedPlan } from "@/api/plan";


import HeaderNav from '@/components/common/HeaderNav.vue'
import PlanList from '@/components/plan/PlanList.vue'
import KakaoMapPolylineContainer from '@/components/plan/KakaoMapPolylineContainer.vue'
import Dropdown from '@/components/item/Dropdown.vue'

// Pinia Store 사용
const planStore = usePlanStore()
const router = useRouter()
const data = ref([]) // 서버에서 가져온 데이터
const planIndex = ref(0)
const planDateIndex = ref(0)

const planDate = ref({ start: '', end: '' })
const planDateArray = ref([])
const markerList = ref([])
const map = ref(null)

const planList = ref({
  dayPlanList: [],
  dayHouseList: [],
})
// 여행일수에 따라 초기화된 planList
// const planList = computed(() => {
//   if (planDateIndex.value === 0) {
//     return planStore.plan?.planList?.dayPlanList || [];
//   }
//   return (
//     planStore.plan?.planList?.dayPlanList?.filter(
//       (item) => item.day === planDateIndex.value
//     ) || []
//   );
// });

// 버튼 스타일 계산
const getButtonClass = (index, activeIndex) =>
  index === activeIndex
    ? "border-2 border-main text-main font-bold p-2 rounded"
    : "border-2 border-gray-500 text-gray-500 p-2 rounded";

const getDayButtonClass = (index, activeIndex) =>
  index === activeIndex
    ? "selected-button"
    : "unselected-button";

// PlanIndex 변경
const setPlanIndex = (index) => {
  planIndex.value = index
  planDateIndex.value = 0
  console.log('setPlanIndex data.value[index]', data.value[index])

  initializeData(data.value[index])
}

// PlanDateIndex 변경
const setPlanDateIndex = (index) => {
  planDateIndex.value = index
  updateMarkers(index)
}

// 데이터 초기화
const initializeData = (selectedPlan) => {
  if (!selectedPlan) return

  const start = new Date(
    selectedPlan.planDate.start[0], // Year
    selectedPlan.planDate.start[1] - 1, // Month (0-based, so subtract 1)
    selectedPlan.planDate.start[2], // Day
    selectedPlan.planDate.start[3] || 0, // Hour
    selectedPlan.planDate.start[4] || 0, // Minute
    selectedPlan.planDate.start[5] || 0, // Second
    selectedPlan.planDate.start[6] || 0, // Millisecond
  )

  const end = new Date(
    selectedPlan.planDate.end[0], // Year
    selectedPlan.planDate.end[1] - 1, // Month (0-based, so subtract 1)
    selectedPlan.planDate.end[2], // Day
    selectedPlan.planDate.end[3] || 0, // Hour
    selectedPlan.planDate.end[4] || 0, // Minute
    selectedPlan.planDate.end[5] || 0, // Second
    selectedPlan.planDate.end[6] || 0, // Millisecond
  )

  planDate.value.start = start
  planDate.value.end = end
  console.log('initializeData start', start)
  console.log('initializeData end', end)
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  planDateArray.value = Array.from({ length: days }, (_, i) => i + 1)

  planStore.initializePlan(selectedPlan)

  planStore.content = selectedPlan.content;
  planStore.joinMemberId = selectedPlan.joinMemberIds;
  planStore.planDate = selectedPlan.planDate;
  planStore.location = selectedPlan.location;
  planStore.createUserId = selectedPlan.createUserId;
  planStore.dayPlanList = selectedPlan.dayPlanList;
  planStore.dayHouseList = selectedPlan.dayHouseList;
  planStore.id = selectedPlan.id;
  planStore.title = selectedPlan.title;
  planStore.updateUserId = selectedPlan.updateUserId;
  

  planList.value.dayPlanList = planStore.dayPlanList;
  planList.value.dayHouseList = planStore.dayHouseList;

  console.log('initializeData selectedPlan', selectedPlan, planStore.joinMemberIds);
  console.log("planList", planStore.dayPlanList);
  updateMarkers(planDateIndex.value);
};


// 마커 업데이트
const updateMarkers = (index) => {
  markerList.value = []
  console.log('updateMarkers planList', planStore.dayPlanList)

  const image = {
      imageSrc: 'https://vue3-kakao-maps.netlify.app/images/redMarker.png',
      imageWidth: 48,
      imageHeight: 48
    };
  //0번이면 전체일정, 0번이아니면 해당일정
    markerList.value = []

  if (index === 0) {


    for (let i = 0; i < planStore.dayPlanList.length; i++) {
      if (planStore.dayPlanList[i] !== undefined)
        planStore.dayPlanList[i].placeList.forEach((place,_i) => {
          const marker = {
            lat: place.lat,
            lng: place.lng,
            place_name: place.place_name ? place.place_name : place.placeName,
            road_address_name: place.road_address_name ? place.road_address_name : place.addressName,
            address_name: place.address_name ? place.address_name : place.addressName,
            category_group_name: place.category_group_name ? place.category_group_name : place.categoryName,
            phone: place.phone ? place.phone : '',
            infoWindow: {
              content: place.place_name,
              visible: false,
            },
            image: image,
            id: place.kakaoMapId ? place.kakaoMapId : place.id,
            isSelected: false,
            orderBottomMargin:'37px',
          }
          markerList.value.push(marker)
        })
      if (planStore.dayHouseList[i] !== undefined)
        planStore.dayHouseList[i].placeList.forEach((place,_i) => {
          const marker = {
            lat: place.lat,
            lng: place.lng,
            place_name: place.place_name ? place.place_name : place.placeName,
            road_address_name: place.road_address_name ? place.road_address_name : place.addressName,
            address_name: place.address_name ? place.address_name : place.addressName,
            category_group_name: place.category_group_name ? place.category_group_name : place.categoryName,
            phone: place.phone ? place.phone : '',
            infoWindow: {
              content: place.place_name,
              visible: false,
            },
            image: image,
            id: place.kakaoMapId ? place.kakaoMapId : place.id,
            isSelected: false,
            orderBottomMargin:'37px',
          }
          markerList.value.push(marker)
        })
    }

  } else if(index > 0 && planStore.dayPlanList[index-1] !== undefined) {
    console.log('updateMarkers index', index);


    console.log('updateMarkers planStore.dayPlanList[index-1]', planStore.dayPlanList[index-1]);
    planStore.dayPlanList[index - 1].placeList.forEach((place,_i) => {
      const marker = {
        lat: place.lat,
        lng: place.lng,
        place_name: place.place_name ? place.place_name : place.placeName,
        road_address_name: place.road_address_name ? place.road_address_name : place.addressName,
        address_name: place.address_name ? place.address_name : place.addressName,
        category_group_name: place.category_group_name ? place.category_group_name : place.categoryName,
        phone: place.phone ? place.phone : '',
    infoWindow: {
      content: place.place_name,
      visible: false,
    },
    image: image,
    
    id: place.kakaoMapId ? place.kakaoMapId : place.id,
    isSelected: false,
        orderBottomMargin:'37px',
      }
      markerList.value.push(marker);
    });
    planStore.dayHouseList[index - 1].placeList.forEach((place,_i) => {
      const marker = {
        lat: place.lat,
        lng: place.lng,
        place_name: place.place_name ? place.place_name : place.placeName,
        road_address_name: place.road_address_name ? place.road_address_name : place.addressName,
        address_name: place.address_name ? place.address_name : place.addressName,
        category_group_name: place.category_group_name ? place.category_group_name : place.categoryName,
        phone: place.phone ? place.phone : '',
    infoWindow: {
      content: place.place_name,
      visible: false,
        },
        image: image,
        
        id: place.kakaoMapId ? place.kakaoMapId : place.id,
        isSelected: false,
        orderBottomMargin:'37px',
      }
      markerList.value.push(marker);
    });


  }
  markerList.value[0].order = '출발'
  console.log('updateMarkers markerList', markerList.value)
  getMap(map.value)
}

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

// Plan 편집
const editPlan = () => {
  console.log('편집', planStore)
  router.push({name:'plan'})
}

const isInfoModalOpen = ref(false);
const openInfoModal = () => {
  isInfoModalOpen.value = !isInfoModalOpen.value;
};
const closeInfoModal = () => {
  isInfoModalOpen.value = false;
};

watch(data, (newData) => {
  if (newData.length > 0) {
    setPlanIndex(0); // 첫 번째 플랜 초기화
  }
});



// 데이터 초기화
onMounted(async () => {
  try {

    let myData = await listPlan(); // 데이터를 비동기적으로 가져옴
    let joinedData = await listJoinedPlan();
    data.value = [...myData, ...joinedData];
    
    console.log("data", data.value);

    planStore.initializePlan(data.value[0]); // 첫 번째 플랜 초기화

    await nextTick(); // DOM 업데이트를 기다림
    setPlanIndex(0); // 인덱스 설정
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});

</script>

<style scoped>
.selected-button {
  @apply text-main p-2 m-2;
  font-weight: bold;
}
.unselected-button {
  @apply text-gray-500 text-sm p-2 m-2;
}

.parent:nth-child(){
  background-color: red;
}

</style>