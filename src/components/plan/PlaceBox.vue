<template>
  <li class="flex space-x-4 p-1 border-b border-gray-200 w-full" style="height: 5.5rem">
    <div class="image w-1/5">
      <div v-if="marker.category_group_name" class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.category_group_name }}
      </div>
      <div v-else class="bg-white flex items-center justify-center text-xs font-bold">
        {{ marker.category_name }}
      </div>
    </div>
    <div class="info w-3/5 flex-col">
      <h5 class="font-semibold text-sm h-1/2">{{ marker.place_name }}</h5>
      <span v-if="marker.road_address_name" class="block h-1/2" style="font-size: 12px">
        {{ marker.road_address_name }}
      </span>
      <span v-else class="block h-1/2" style="font-size: 12px">{{ marker.address_name }}</span>
    </div>
    <div class="w-1/5 items-center text-center">
      <button
  type="button"
  :class="marker.isSelected || isSelected 
    ? 'h-full align-right bg-main hover:text-white rounded-md p-1' 
    : 'h-full align-right bg-gray-100 hover:text-white rounded-md p-1'"
  @click="marker.isSelected || isSelected ? '' : onClickPlaceBox()"
>
  <img
    v-if="marker.isSelected || isSelected"
    src="@/assets/icon/check-solid.svg"
    alt="삭제"
    class="w-5 h-5 fill-current text-light"
  />
  <img
    v-else
    src="@/assets/icon/plus-solid.svg"
    alt="추가"
    class="w-5 h-5"
  />
</button>

    </div>
  </li>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch, onMounted } from 'vue'
import { usePlanStore } from '@/stores/usePlanStore'

const planStore = usePlanStore()
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

// 로컬 상태로 isSelected 관리
const isSelected = ref(false)

const onClickPlaceBox = () => {
  if (!isSelected.value) {
    emit('onClickPlaceBox', props.marker)
  }
}

// marker.isSelected 변경을 감지하도록 watch 추가
watch(
  () => isSelected,
  (newVal) => {
    //isSelected.value = newVal
  },
  { immediate: true } // 컴포넌트 초기 로드 시에도 실행
)

onMounted(() => {
  // 초기 로드 시 planStore를 통해 선택 상태 설정
  planStore.dayPlanList.forEach((dayPlan) => {
    dayPlan.placeList.forEach((place) => {
      if (props.marker.id === place.id) {
        isSelected.value = true
      }
      if(props.marker.kakaoMapId === "kakaoMap"+place.id){
        isSelected.value = true
      }
    })
  })
})
</script>

<style scoped>
.image-box {
  width: 5rem;
  height: 5rem;
}
</style>
