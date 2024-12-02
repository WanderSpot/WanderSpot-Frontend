<template>
  <HeaderNav :tripDate="planStore.planDate" :members="planStore.joinMemberId" />
  <!-- <DateModal :tripDate="tripDate" @updateTripDate="updateTripDate" /> -->

  <div class="flex w-full" style="height: 90vh;">
    <div id="menu_wrap" class="flex h-full w-1/4">
      <div class="flex flex-col h-full justify-between">
          <div class="flex flex-col ">
            <button type="button" :class="planListIndex === 0 ? 'selected-button' : 'unselected-button'" class="p-3" @click="planListIndex = 0">
              <p>전체 계획</p>
            </button>
          <button v-for="(plan, i) in planDate" :key="i" type="button" :class="planListIndex === i+1 ? 'selected-button' : 'unselected-button'" class="p-3"@click="planListIndex = i+1">
              <p>{{ i+1 }}일차</p>
            </button>
          </div>
          <div class="flex flex-col justify-center p-2">
            <button type="button" class="bg-sub text-light p-3 mb-2 w-5/6 text-sm" @click="editPlan">편집</button>
            <button type="button" class="bg-dark text-light p-3 w-5/6 text-sm" @click="createPlanModal">생성</button>
          </div>
      
      </div>
      <div v-if="planListIndex > 0" class="flex flex-col overflow-y-auto scrollbar-hidden">
          <div class="flex justify-center items-center mt-3 mb-3 w-30 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ planListIndex }}일차 여행지</div>
          <ResultPlaceBox v-if="allPlanList[planListIndex-1]" v-for="(p, i) in allPlanList[planListIndex-1].placeList" :key="i" :marker="p" :i="i" />
        
        
          <div class="flex justify-center items-center mt-3 mb-3 w-30 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ planListIndex }}일차 숙소</div>   
          <ResultPlaceBox v-if="allHouseList[planListIndex-1]" v-for="(p, i) in allHouseList[planListIndex-1].placeList" :key="i" :marker="p" :i="i" />
        
      </div>
      <div v-else class="flex flex-col overflow-y-auto scrollbar-hidden">
        <div v-for="(item, i) in allList.dayPlanList" :key="i">
          <div class="flex justify-center items-center mt-3 mb-3 w-30 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ i+1 }}일차 여행지</div>
          <ResultPlaceBox v-for="(p, i) in item.placeList" :key="i" :marker="p" :i="i" />
        </div>
        <div v-for="(item, i) in allList.dayHouseList" :key="i">
          <div class="flex justify-center items-center mt-3 mb-3 w-30 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ i+1 }}일차 숙소</div>
          <ResultPlaceBox v-if="item.placeList" v-for="(p, i) in item.placeList" :key="i" :marker="p" :i="i" />
        </div>
        <!-- <div  v-for="(plan, i) in allPlanList" :key="i">
          <div>{{ i+1 }}일차 여행지</div>
          <PlaceBox v-for="(p, i) in plan" :key="i" :marker="p" :i="i" />
        </div>
        <div v-for="(house, i) in allHouseList" :key="i">
          <div>{{ i+1 }}일차 숙소</div>
          <PlaceBox v-for="(p, i) in house" :key="i" :marker="p" :i="i" />
          </div> -->
      </div>
      <!-- <DayPlanList
        :planList="planList[planListIndex]"
        :planListIndex="planListIndexList[planListIndex]"
        :selectedMarkerList="selectedMarkerList"

        @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
        @onClickDayPlanList="onClickDayPlanList"

      /> -->
    </div>
    <div class="w-3/4 h-full">
      <KakaoMapPolylineContainer
        :markerList="markerList"
        @resetMarkerList="resetMarkerList"
        @getMap="getMap"
      />
    </div>
    <div>
      <CreatePlanModal :isModalOpen="isModalOpen" :closeModal="closeModal" @confirmCreate="confirmCreate" />
    </div>
  </div>
  <div class="fixed right-5 bottom-5 z-10">
    <div class="flex justify-center items-center">
      <button type="button" class="bg-dark text-light w-10 h-10 rounded-full" @click="openInfoModal">I</button>
    </div>
  </div>
  <InfoModal :isModalOpen="isInfoModalOpen" :closeModal="closeInfoModal" />
</template>

<script setup>
import { usePlanStore } from '@/stores/usePlanStore';
import { onMounted, ref, watch, computed } from 'vue';
import HeaderNav from '@/components/common/HeaderNav.vue';
import PlaceBox from '@/components/plan/PlaceBox.vue';
import KakaoMapPolylineContainer from '@/components/plan/KakaoMapPolylineContainer.vue';
import { useRouter } from 'vue-router';
import CreatePlanModal from '@/components/plan/CreatePlanModal.vue';
import ResultPlaceBox from "@/components/plan/ResultPlaceBox.vue";
import { createPlan, updatePlan } from '@/api/plan';
import InfoModal from '@/components/plan/InfoModal.vue';
import { useUserStore } from '@/stores/useUserStore.js'
const router = useRouter();
const planStore = usePlanStore();
const userStore = useUserStore();
const tripDate = ref('');
const planDate = ref(0);
const planList = ref([]);
const planListIndex = ref(0);
const allPlanList = ref([]);
const allHouseList = ref([]);
const allList = ref([]);
const markerList = ref([]);
const map = ref(null);
const isInfoModalOpen = ref(false);
const mergedList = ref([]);

const isModalOpen = ref(false);
onMounted(() => {
  console.log('planResultView onMounted', planStore);
  tripDate.value = planStore.planDate;
  let dateDiff = parseDate(tripDate.value.end).getTime() - parseDate(tripDate.value.start).getTime();
  planDate.value = dateDiff / (1000 * 60 * 60 * 24) + 1;

  planList.value = planStore.planList;
  allPlanList.value = Array.from({ length: planDate.value+1 }, (_, i) => []);
  allHouseList.value = Array.from({ length: planDate.value+1 }, (_, i) => []);

  allPlanList.value = planStore.dayPlanList;
  allHouseList.value = planStore.dayHouseList;

  allList.value = {
    dayPlanList: allPlanList.value,
    dayHouseList: allHouseList.value,
  }
  
  console.log('all plan list', allPlanList);
  console.log('all house list', allHouseList);
  console.log('all list', allList);
  //getMap();
});

watch(planListIndex, (newVal) => {
  markerList.value = [];
  if (newVal > 0) {
    planStore.dayPlanList.forEach((plan,i) => {
      if(i+1 === newVal) {
        plan.placeList.forEach((p) => {
          markerList.value.push(p);
        });
      }
    });
    planStore.dayHouseList.forEach((house,i) => {
      if(i+1 === newVal) {
        house.placeList.forEach((p) => {
          markerList.value.push(p);
        });
      }
    });
  } else {
    planStore.dayPlanList.forEach((plan) => {
      plan.placeList.forEach((p) => {
        markerList.value.push(p);
      });
    });
    planStore.dayHouseList.forEach((house) => {
      house.placeList.forEach((p) => {
        markerList.value.push(p); 
      });
    });
  }

  let bounds = new kakao.maps.LatLngBounds()
  markerList.value.forEach((marker) => {
    bounds.extend(new kakao.maps.LatLng(Number(marker.lat), Number(marker.lng)))
  })

  markerList.value[0].order = '출발';

  if (map.value) {
    map.value.setBounds(bounds)
  }
});

mergedList.value = computed(() => {
  // 여행지 데이터에 type 추가
  const places = planStore.dayPlanList
    .map((plan) => ({ ...plan, type: 'place' }));

  // 숙소 데이터에 type 추가
  const houses = planStore.dayHouseList
    .map((house) => ({ ...house, type: 'house' }));

  // 두 배열을 합치고 day 기준으로 정렬
  return [...places, ...houses].sort((a, b) => a.day - b.day);
});

watch(mergedList, (newVal) => {
  console.log('mergedList', newVal);
});

const resetTripDate = () => {
  //tripDate.value = null;
};

const editPlan = () => {
  router.push({name:'plan'});
};

const createPlanModal = () => {
  isModalOpen.value = true;
};

const openInfoModal = () => {
  isInfoModalOpen.value = !isInfoModalOpen.value;
};

const closeInfoModal = () => {
  console.log('closeInfoModal', isInfoModalOpen.value);
  isInfoModalOpen.value = !isInfoModalOpen.value;
};

const confirmCreate = async () => {
  console.log('confirmCreate JSON', JSON.parse(JSON.stringify(planStore)));

  let transformedData = transformPlanData(JSON.parse(JSON.stringify(planStore)));
  console.log('transformedData', transformedData);
  if(transformedData.id === -1) {
    await createPlan(transformedData, (data) => {
      console.log('createPlan success', data);
      router.push({ name: 'main' });
    }, (error) => {
      console.error('createPlan error', error);
    });
  } else {
    await updatePlan(transformedData, (data) => {
      console.log('updatePlan success', data);
      router.push({ name: 'main' });
    }, (error) => {
      console.error('updatePlan error', error);
    });
  }
  //createPlan();
};

const closeModal = () => {
  isModalOpen.value = false;
};

// 지도 초기화
const getMap = (mapRef) => {
  map.value = mapRef;
  markerList.value = [];
  planStore.dayPlanList.forEach((plan) => {
    markerList.value = [...markerList.value, ...plan.placeList];
  });
  planStore.dayHouseList.forEach((house) => {
    markerList.value = [...markerList.value, ...house.placeList];
  });
  
  console.log('getMap', markerList.value);
  let bounds = new kakao.maps.LatLngBounds()
  markerList.value.forEach((marker) => {
    bounds.extend(new kakao.maps.LatLng(Number(marker.lat), Number(marker.lng)))
  })

  if (map.value) {
    map.value.setBounds(bounds)
  }
};

const searchPlacesCB = (data) => {
  console.log('planView searchPlacesCB', data);
  markerList.value = [];
    const image = {
  imageSrc: 'https://vue3-kakao-maps.netlify.app/images/redMarker.png',
  imageWidth: 48,
    imageHeight: 48
  };

  console.log('planView searchPlacesCB', data);
  markerList.value = [];
  markerList.value = data.map((marker, i) => ({
    lat: marker.y,
    lng: marker.x,
    place_name: marker.place_name ? marker.place_name : marker.placeName,
    road_address_name: marker.road_address_name ? marker.road_address_name : marker.addressName,
    address_name: marker.address_name ? marker.address_name : marker.addressName,
    category_group_name: marker.category_group_name ? marker.category_group_name : marker.categoryName,
    phone: marker.phone ? marker.phone : '',
    infoWindow: {
      content: marker.place_name,
      visible: false,
    },
    image: image,
    
    id: marker.kakaoMapId ? marker.kakaoMapId : marker.id,
    isSelected: false,
    orderBottomMargin:'37px',
  }));

  let bounds = new kakao.maps.LatLngBounds()
  markerList.value.forEach((marker) => {
    bounds.extend(new kakao.maps.LatLng(Number(marker.lat), Number(marker.lng)))
  })

  if (map.value) {
    map.value.setBounds(bounds)
  }
};

const onLoadKakaoMap = () => {
  console.log('planView onLoadKakaoMap');
};

const onClickMapMarker = (data) => {
  console.log('planView onClickMapMarker', data);
};
const parseDate = (date) => {
  return new Date(
    date[0],
    date[1] - 1,
    date[2],
    date[3] || 0,
    date[4] || 0,
    date[5] || 0,
    date[6] || 0
  );
};

// 변환 함수
function transformPlanData(input) {
  const transformPlaceList = (placeList) =>
    placeList.map((place) => ({
      id: parseInt(place.id, 10) || 1001, // id를 숫자로 변환, 기본값 설정
      kakaoMapId: place.id,
      addressName: place.address_name ? place.address_name : place.addressName,
      placeName: place.place_name ? place.place_name : place.placeName,
      categoryName: place.category_group_name ? place.category_group_name : place.categoryName,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lng),
      city: place.address_name ? place.address_name.split(" ")[0] : place.addressName.split(" ")[0]
    }));

  return {
    id: input.id === -1 ? -1 : input.id, // 새로운 ID
    title: input.title,
    location: input.location,
    content: input.content,
    planDate: {
      start: new Date(parseDate(input.planDate.start)).toISOString(),
      end: new Date(parseDate(input.planDate.end)).toISOString(),
    },
    createUserId: input.createUserId,
    updateUserId: userStore.user.userId,
    joinMemberIds: input.joinMemberId || [],
    dayPlanList: input.dayPlanList.map((day) => ({
      placeList: transformPlaceList(day.placeList)
    })),
    dayHouseList: input.dayHouseList.map((day) => ({
      placeList: transformPlaceList(day.placeList)
    }))
  };
}

</script>

<style scoped>.selected-button {
  @apply text-main;
  font-weight: bold;
}
.unselected-button {
  @apply text-gray-500 text-sm;
}
</style>

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>

