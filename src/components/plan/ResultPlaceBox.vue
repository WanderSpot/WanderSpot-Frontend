<template>
  <li class="flex space-x-4 p-1 border-b border-gray-200 w-full" style="height: 5.5rem">
    <div class="image w-1/5">
      <div v-if="marker.categoryGroupName" class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.categoryGroupName }}
      </div>
      <div v-else class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.categoryName }}
      </div>
      <div v-if="marker.category_group_name" class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.category_group_name }}
      </div>
    </div>
    <div class="info w-3/5 flex-col">
      <h5 v-if="marker.placeName" class="font-semibold text-sm h-1/2">{{ marker.placeName }}</h5>
      <h5 v-else class="font-semibold text-sm h-1/2">{{ marker.place_name }}</h5>
      <span v-if="marker.addressName" class="block h-1/2" style="font-size: 12px">
        {{ marker.addressName }}
      </span>
      <span v-else class="block h-1/2" style="font-size: 12px">{{ marker.address_name }}</span>
      <!-- <span class="tel block text-blue-500">{{ marker.phone }}</span> -->
    </div>
  </li>
</template>

<script setup>
import { defineEmits, defineProps, onMounted } from 'vue'
const emit = defineEmits(['onClickPlaceBox'])

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

onMounted(() => {
})

const onClickPlaceBox = () => {
  if(!props.marker.isSelected){
    emit('onClickPlaceBox', props.marker)
  }
}
</script>

<style scoped>
.image-box {
  width: 5rem;
  height: 5rem;
}
</style>
