
<template>
    <div>
      <div v-if="planList.length > 0">
        <div v-if="planList.length === 0">여행지를 추가해주세요!</div>
        <div v-else>
          <div v-for="(plan, i) in planList" :key="i">
            <div v-if="i === props.planListIndex" >
              <p  @click="onClickDayPlanList(i)" class="bg-primary text-white">{{ i + 1 }}일차</p>
              <!-- <div v-for="(marker, j) in plan" :key="j">
                <p>{{ marker.place_name }}</p>
              </div> -->
              <SelectedPlaceBox
                  v-for="(marker, j) in planList[i]"
                  :key="j"
                  :i="j"
                  :marker="marker"
                  @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
              />
            </div>
            <div v-else >
              <p @click="onClickDayPlanList(i)">{{ i + 1 }}일차</p>
              <SelectedPlaceBox
                  v-for="(marker, j) in planList[i]"
                  :key="j"
                  :i="j"
                  :marker="marker"
                  @onClickSelectedPlaceBox="onClickSelectedPlaceBox"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  
  import SelectedPlaceBox from '@/components/plan/SelectedPlaceBox.vue';
  
  import { defineProps, defineEmits, watch } from 'vue';
  
  const props = defineProps({
    planList: { type: Array, required: true },
    planListIndex: { type: Number, required: true },
    selectedMarkerList: { type: Array, required: true },
  });
  
  const emit = defineEmits(['onClickSelectedPlaceBox', 'onClickDayPlanList']);
  
  const onClickSelectedPlaceBox = (data) => {
    console.log('dayPlanList onClickSelectedPlaceBox', data);
    emit('onClickSelectedPlaceBox', data);
  };
  
  const onClickDayPlanList = (index) => {
    emit('onClickDayPlanList', index);
  };
  
  watch(() => props.planListIndex, (newVal) => {
    console.log('planListIndex watch', newVal);
    console.log('planListIndex type', typeof props.planListIndex);
  });
  </script>
  