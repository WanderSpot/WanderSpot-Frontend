<template>
  <KakaoMap
    :width="'50vw'"
    :height="'100vh'"
    :lat="36.566826"
    :lng="127.9786567"
    @onLoadKakaoMap="onLoadKakaoMap"
  >
    <KakaoMapMarker
      v-for="(marker, index) in markerList"
      :key="index"
      :lat="marker.lat"
      :lng="marker.lng"
      :infoWindow="marker.infoWindow"
      :clickable="true"
      @onClickKakaoMapMarker="() => onClickMapMarker(marker)"
    />
  </KakaoMap>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

import { defineProps, defineEmits , defineExpose} from 'vue';

const map = ref(null);
const emit = defineEmits(['getMap']);

const props = defineProps({
  markerList: { type: Array, required: true },
  map: { type: Object, required: true },
  level: { type: Number, required: true },
});


const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  emit('getMap', mapRef);
  map.value.setLevel(12);
  //const ps = new kakao.maps.services.Places();
  //ps.keywordSearch('역삼역 맛집', placesSearchCB);
};

const resetMarkerList = () => {
  markerList.value = [];
};

// 지도 이동 및 줌 레벨 변경 함수
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const moveMap = async (markerList, level) => {
  //if (!map.value || markerList.length === 0) return;

  console.log('moveMap started');

  // 첫 번째 작업: 줌 레벨 초기화
  await delay(500); // 10초 대기
  map.value.setLevel(12);
  console.log('Zoom level set to 12');

  // 두 번째 작업: 지도 이동
  map.value.panTo(
    new kakao.maps.LatLng(markerList[0].lat, markerList[0].lng)
  );
  console.log('Map panned to first marker');

  // 세 번째 작업: 줌 레벨 변경
  await delay(1000); // 1초 대기
  let curLevel = map.value.getLevel();
  while(curLevel-- > level){
    map.value.setLevel(curLevel);
    await delay(300);
  }
  map.value.setLevel(level);
  console.log('Zoom level set to:', level);

  console.log('moveMap completed');
};

// 부모에서 moveMap 함수를 호출할 수 있도록 노출
defineExpose({
  moveMap,
});


</script>
