<template>
  <KakaoMap
    :width="'80vw'"
    :height="'90vh'"
    :lat="37.566826"
    :lng="126.9786567"
    @onLoadKakaoMap="onLoadKakaoMap"
  >
    <KakaoMapMarkerPolyline
    :markerList="markerList"
    :showMarkerOrder="true"
          strokeColor="#C74C5E"
      :strokeOpacity="1"
      strokeStyle="shortdot"
    />
  </KakaoMap>
</template>

<script setup>
import { ref } from 'vue';
import { KakaoMap, KakaoMapMarkerPolyline } from 'vue3-kakao-maps';

import { defineProps, defineEmits } from 'vue';

const map = ref(null);
const emit = defineEmits(['getMap']);

const props = defineProps({
  markerList: { type: Array, required: true },
  map: { type: Object, required: true },
});


const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  emit('getMap', mapRef);
  //const ps = new kakao.maps.services.Places();
  //ps.keywordSearch('역삼역 맛집', placesSearchCB);
};

const resetMarkerList = () => {
  markerList.value = [];
};
</script>
