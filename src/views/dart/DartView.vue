<template>
  <DartStart v-if="isDartStart" @start-dart="startDart" />
  <DartResult v-if="isDartDone" @reset-location="resetLocation" @select-location="selectLocation" />
  <div>
    <div class="dart-view">
    </div>
    <div class="dart-view-content">
      <div class="dart-view-content-header">
        <TeacherableMachine :isDartStart="isDartStart" @randomCoordinates="randomCoordinates" @restartModel="restartModel"/>
      </div>
      <div class="dart-view-content-body flex justify-center items-center">
        <!-- <button class="bg-blue-500 text-white p-2 rounded" @click="seoul">서울</button>
        <button class="bg-blue-500 text-white p-2 rounded" @click="busan">부산</button>
        <button class="bg-blue-500 text-white p-2 rounded" @click="restartModel">다시</button> -->
        <KakaoMapForKorea ref="kakaoMapForKoreaRef" :markerList="markerList" :map="map" @getMap="getMap" :level="targetLevel"/>
      </div>
    </div>
    <!-- <button @click="reset">다시</button>
    <router-link :to="{ name: 'plan' }">선택</router-link> -->
  </div>
</template>

<script setup>
import { ref ,watch, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import TeacherableMachine from '@/components/dart/TeacherableMachine.vue'
import KakaoMapForKorea from '@/components/dart/KakaoMapForKorea.vue'
import DartStart from '@/components/dart/DartStart.vue'
import { getCandidate } from '@/api/dart'
import { usePlanStore } from '@/stores/usePlanStore.js'
import { useUserStore } from "@/stores/useUserStore"
import DartResult from "@/components/dart/DartResult.vue";
const router = useRouter()
const planStore = usePlanStore()
const userStore = useUserStore();

const markerList = ref([{lat: 36.566826, lng: 127.9786567}])
const map = ref(null)
const targetLevel = ref(12)
const kakaoMapForKoreaRef = ref(null)
const tripLocation = ref(null);
const isDartDone = ref(false);
const isDartStart = ref(true);

const getMap = (mapRef) => {
  map.value = mapRef
}

const reset = () => {
  console.log('reset')
}
const next = () => {
  console.log('next')
}

const seoul = () => {
  markerList.value = [{ lat: 37.566826, lng: 126.9786567 }]
  tripLocation.value = '서울'
  moveMapFluently('서울')
}

const moveMapFluently = async (location) => {
  console.log(location);
  targetLevel.value = 9;
  planStore.location = location;
  if(kakaoMapForKoreaRef.value){
    await kakaoMapForKoreaRef.value.moveMap(markerList.value, 10)
    isDartDone.value = true;
  }
}

const resetLocation = () => {
  markerList.value = [{lat: 36.566826, lng: 127.9786567}]
  targetLevel.value = 12
  planStore.location = null;
  isDartDone.value = false;
  isDartStart.value = true;


 if(kakaoMapForKoreaRef.value){
    kakaoMapForKoreaRef.value.moveMap(markerList.value, 12)
  }
}

const restartModel = () => {
  resetLocation();
}

const selectLocation = () => {
  planStore.createUserId = userStore.user.userId;
  planStore.clearDayHouseList();
  planStore.clearDayPlanList();
  planStore.location = tripLocation.value;
  planStore.id = 1;
  router.push({ name:'plan'})
}

const startDart = () => {
  isDartStart.value = false;
}

const randomCoordinates = async (coordinates) => {
  console.log(coordinates);
  const candidate = await getCandidate(coordinates);
  console.log(candidate);
  markerList.value = [];

  if(candidate.length > 0){
    markerList.value.push(candidate[0]);
    console.log(markerList.value[0]);
    tripLocation.value = candidate[0].addr.split(' ')[0] + ' ' + candidate[0].addr.split(' ')[1];
    moveMapFluently(tripLocation);
  }else{
    markerList.value.push(coordinates);
    let geocoder = new kakao.maps.services.Geocoder();
    await geocoder.coord2Address(coordinates.lng, coordinates.lat, async (result, status) => {
      console.log(result);
      if (status === kakao.maps.services.Status.OK) {
        console.log(result[0].address.address_name);
        tripLocation.value = result[0].address.address_name.split(' ')[0] + ' ' + result[0].address.address_name.split(' ')[1];
        moveMapFluently(tripLocation);
      }
    });
  }
}

watch(planStore.location, (newVal) => {
  if (newVal !== null) {
    isDartDone.value = true;
  } else {  
    isDartDone.value = false;
  }
})

onMounted(() => {
  planStore.clearDayHouseList();
  planStore.clearDayPlanList();
  planStore.clearPlan();
});
</script>
