<template>
  <div class="option" style="width: 350px;">
    <form @submit.prevent="searchPlaces" class="flex justify-center shadow-md rounded-md border-2 m-3 pt-2 pb-2 justify-between">
      <input class="ml-2 w-full" type="text" v-model="keyword" placeholder="검색어를 입력하세요" />
      <img src="@/assets/icon/magnifying-glass-solid.svg" alt="검색" class="w-5 h-5 mr-2" />
    </form>
    <hr />
    <ul id="placesList" class="overflow-y-auto h-[calc(100vh-200px)] scrollbar-hidden">
      <PlaceBox
        class="mb-2"
        v-for="(marker, i) in markerList"
        :key="marker.id"
        :i="i"
        :marker="marker"
        @onClickPlaceBox="onClickPlaceBox"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import PlaceBox from '@/components/plan/PlaceBox.vue';


import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  markerList: { type: Array, required: true },
});

const emit = defineEmits(['onClickPlaceBox', 'searchPlacesCB']);

const onClickPlaceBox = (data) => {
  console.log('PlaceSearch onClickPlaceBox', data);
  emit('onClickPlaceBox', data);
};

const keyword = ref('');

const searchPlaces = () => {
  if (!keyword.value.trim()) {
    alert('키워드를 입력해주세요!');
    return;
  }

  const ps = new kakao.maps.services.Places();
  ps.keywordSearch(keyword.value, placesSearchCB);
};

const placesSearchCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    emit('searchPlacesCB', data);
    //this.$forceUpdate();
  }
};

onMounted(() => {
  console.log("rerender")
});
</script>

<style scoped>
.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>
