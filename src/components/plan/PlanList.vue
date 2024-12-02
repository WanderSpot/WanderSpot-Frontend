
<template>
  <div class="overflow-y-auto scrollbar-hidden" style="height: 90vh;">
    <div v-if="planDateIndex !== 0" class="scrollbar-hidden">
      <div v-if="planList.length === 0">추가된 여행지가 없습니다.</div>
      <div v-else>
        <!-- <div class="content">
          {{ planStore.content }}
        </div> -->
        <div v-for="(plan, i) in planList.dayPlanList" :key="i">
          <div v-if="i+1 === props.planDateIndex" >
            <p  @click="onClickDayPlanList(i)" class="selectedButton p-2 m-2">{{ i + 1 }}일차 여행지</p>
            <ResultPlaceBox
                v-for="(marker, j) in plan.placeList"
                :key="j"
                :i="i"
                :marker="marker"
            />
          </div>
        </div>
        <div v-for="(house, i) in planList.dayHouseList" :key="i">
          <div v-if="i+1 === props.planDateIndex" >
            <p  @click="onClickDayPlanList(i)" class="selectedButton p-2 m-2">{{ i + 1 }}일차 숙소</p>
            <ResultPlaceBox
                v-for="(marker, j) in house.placeList"
                :key="j"
                :i="i"
                :marker="marker"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="scrollbar-hidden">  
      <div v-for="(plan, i) in planList.dayPlanList" :key="i">
        <div >
          <p  @click="onClickDayPlanList(i)" class="selectedButton p-2 m-2">{{ i +1}}일차 여행지</p>
          <ResultPlaceBox
            v-for="(marker, j) in plan.placeList" 
            :key="j"
            :i="i"
            :marker="marker"
          />
        </div>
      </div>
      <div v-for="(house, i) in planList.dayHouseList" :key="i">
          <div >
            <p  @click="onClickDayPlanList(i)" class="selectedButton p-2 m-2">{{ i +1}}일차 숙소</p>
            <ResultPlaceBox
              v-for="(marker, j) in house.placeList" 
              :key="j"
              :i="i"
              :marker="marker"
            />
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>

import ResultPlaceBox from '@/components/plan/ResultPlaceBox.vue';

import { defineProps, defineEmits, watch, onMounted } from 'vue';

const props = defineProps({
  planList: { type: Array, required: true },
  planDateIndex: { type: Number, required: true }
});

console.log()

onMounted(() => {
  console.log('planList', props.planList);
});

const emit = defineEmits(['onClickSelectedPlaceBox', 'onClickDayPlanList']);

const onClickSelectedPlaceBox = (data, i) => {
  emit('onClickSelectedPlaceBox', data, i);
};

const onClickDayPlanList = (index) => {
  emit('onClickDayPlanList', index);
};

watch(() => props.planListIndex, (newVal) => {
});
</script>

<style scoped>
.selectedButton {
  @apply flex justify-center items-center  rounded-full shadow-md bg-main font-bold text-white;
}

.scrollbar-hidden {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}
</style>
