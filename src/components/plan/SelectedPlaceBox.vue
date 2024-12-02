<template>
  <li class="flex space-x-4 p-1 border-b border-gray-200 w-full" style="height: 5.5rem">
    <div class="image w-1/5">
      <div v-if="marker.category_group_name" class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.category_group_name }}
      </div>
      <div v-else class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.categoryName }}
      </div>
    </div>
    <div class="info w-3/5 flex-col">
      <h5 v-if="marker.place_name" class="font-semibold text-sm h-1/2">{{ marker.place_name }}</h5>
      <h5 v-else class="font-semibold text-sm h-1/2">{{ marker.placeName }}</h5>
      <span v-if="marker.road_address_name" class="block h-1/2" style="font-size: 12px">
        {{ marker.road_address_name }}
      </span>
      <span v-if="!marker.road_address_name && !marker.address_name" class="block h-1/2" style="font-size: 12px">{{ marker.addressName }}</span>
      <span v-if="!marker.road_address_name && !marker.road_address_name" class="block h-1/2" style="font-size: 12px">{{ marker.address_name }}</span>
      <!-- <span class="tel block text-blue-500">{{ marker.phone }}</span> -->
    </div>
    <div class="w-1/5 items-center text-center">
      <button
        type="button"
        class="h-full align-right bg-sub hover:text-white rounded-md p-1"
        @click="onClickSelectedPlaceBox"
      >
        <img src="@/assets/icon/xmark-solid.svg" alt="삭제" class="w-5 h-5 fill-current text-light" />
      </button>
    </div>
  </li>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'
const emit = defineEmits(['onClickSelectedPlaceBox'])

const props = defineProps({
  i: {
    type: Number,
    required: true,
  },
  marker: {
    type: Object,
    required: true,
  },
})

const onClickSelectedPlaceBox = () => {
  console.log('selectedPlaceBox onClickSelectedPlaceBox', props.marker, props.i);
  emit('onClickSelectedPlaceBox', props.marker,props.i)
}
</script>

<style scoped>
.image-box {
  width: 5rem;
  height: 5rem;
}
</style>
