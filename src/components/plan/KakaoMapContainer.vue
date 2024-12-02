<template>
  <KakaoMap
    :width="'auto'"
    :height="'90vh'"
    :lat="37.566826"
    :lng="126.9786567"
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
import { ref } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

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
