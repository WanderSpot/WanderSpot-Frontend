
<template>
  <div class="">
    <!-- <div v-if="planList.length > 0"> -->
      <div v-if="!(planList.every(plan => Array.isArray(plan.placeList) && plan.placeList.every(item => !item || item.length === 0)))" class="pl-3 pr-3 w-80">
        <div v-for="(plan, i) in planList" :key="i">
          <div v-if="i === props.planListIndex" class="flex flex-col items-center" >
          
            <button  @click="onClickDayPlanList(i)" class="mt-3 mb-3 w-10 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ i + 1 }}</button>
            <!-- <div v-for="(marker, j) in plan" :key="j">
              <p>{{ marker.place_name }}</p>
            </div> -->
            <!-- //{{plan}} -->
            <SelectedPlaceBox
                v-for="(marker, j) in plan.placeList"
                :key="j"
                :i="i"
                :marker="marker"
                @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
            />
          </div>
          <div v-else class="flex flex-col items-center">
            <button  @click="onClickDayPlanList(i)" class="mt-3 mb-3 w-10 h-10 rounded-full shadow-md bg-gray-100 text-bold text-dark">{{ i + 1 }}</button>
            <SelectedPlaceBox
                v-for="(marker, j) in plan.placeList"
                :key="j"
                :i="i"
                :marker="marker"
                @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
            />
          </div>
        </div>
      </div>
      <div v-else class=" pl-3 pr-3" >
        <div v-for="(plan, i) in planList" :key="i">
          <div v-if="i === props.planListIndex" class="flex flex-col items-center" >
            <button  @click="onClickDayPlanList(i)" class="mt-3 mb-3 w-10 h-10 rounded-full shadow-md bg-main text-bold text-white">{{ i + 1 }}</button>
            <!-- <div v-for="(marker, j) in plan" :key="j">
              <p>{{ marker.place_name }}</p>
            </div> -->
            <!-- //{{plan}} -->
            <SelectedPlaceBox
                v-for="(marker, j) in plan.placeList"
                :key="j"
                :i="i"
                :marker="marker"
                @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
            />
          </div>
          <div v-else class="flex flex-col items-center">
            <button  @click="onClickDayPlanList(i)" class="mt-3 mb-3 w-10 h-10 rounded-full shadow-md bg-gray-100 text-bold text-dark">{{ i + 1 }}</button>
            <SelectedPlaceBox
                v-for="(marker, j) in plan.placeList"
                :key="j"
                :i="i"
                :marker="marker"
                @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
            />
          </div>
        </div>
      </div>
    <!-- </div> -->
    <!-- <div class="absolute w-[24px] h-[40px] bg-white top-1/2 md:left-[530px] xl:left-[580px] 2xl:left-[630px] duration-500 z-[1] rounded-r-md flex justify-center items-center cursor-pointer">
      <button type="button" >줄이기</button>
    </div>
    <div class="absolute w-[24px] h-[40px] bg-white top-1/2 md:left-[850px] xl:left-[900px] 2xl:left-[950px] duration-500 z-[1] rounded-r-md flex justify-center items-center cursor-pointer">
      <button type="button" >줄이기</button>
    </div> -->
  </div>
</template>

<script setup>

import SelectedPlaceBox from '@/components/plan/SelectedPlaceBox.vue';

import { defineProps, defineEmits, watch, onMounted } from 'vue';
const props = defineProps({
  planList: { type: Array, required: true },
  planListIndex: { type: Number, required: true },
  selectedMarkerList: { type: Array, required: true },
});

const emit = defineEmits(['onClickSelectedPlaceBox', 'onClickDayPlanList']);

const onClickSelectedPlaceBox = (data, i) => {
  console.log('dayPlanList onClickSelectedPlaceBox', data, i);
  emit('onClickSelectedPlaceBox', data, i);
};

const onClickDayPlanList = (index) => {
  emit('onClickDayPlanList', index);
};

watch(() => props.planListIndex, (newVal) => {
  console.log('planListIndex watch', newVal);
  console.log('planListIndex type', typeof props.planListIndex);
});

watch(() => props.planList, (newVal) => {
  console.log('planList watch', newVal.every(plan => Array.isArray(plan.placeList) && plan.placeList.every(item => !item || item.length === 0)));
});
</script>
