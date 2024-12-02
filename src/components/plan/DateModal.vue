<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-4 rounded-lg">
      <VDatePicker
        v-model.range="localTripDate"
        mode="date"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, watch,onMounted } from 'vue';
import { usePlanStore } from '@/stores/usePlanStore';
import { defineProps, defineEmits } from 'vue';

const planStore = usePlanStore();
// Props 선언
const props = defineProps({
  tripDate: { type: Object, required: true }, // tripDate는 객체여야 하며 필수
});

// Emits 선언
const emit = defineEmits(['updateTripDate']);

// 로컬 변수로 props 초기화
const localTripDate = ref(props.tripDate || null); // tripDate가 없을 경우 기본값 null

// 날짜를 배열로 변환하는 유틸리티 함수
function parseDateToArray(dateInput) {
  const date = new Date(dateInput); // Date 객체로 변환
  return [
    date.getFullYear(),    // 연도
    date.getMonth() + 1,   // 월 (0부터 시작하므로 +1)
    date.getDate(),        // 일
    date.getHours(),       // 시
    date.getMinutes(),     // 분
    date.getSeconds(),     // 초
  ];
}

watch(localTripDate, (newVal) => {
  if (!newVal) return; // newVal이 null이면 처리 중단
  console.log('newVal', newVal);

  // localTripDate의 start와 end를 배열로 변환
  const startArray = parseDateToArray(newVal.start);
  const endArray = parseDateToArray(newVal.end);

  console.log('startArray', startArray); // [YYYY, MM, DD, HH, mm, ss]
  console.log('endArray', endArray);     // [YYYY, MM, DD, HH, mm, ss]

  // 부모로 변환된 값 전달
  emit('updateTripDate', { start: startArray, end: endArray });
});



watch(props.tripDate, (newVal) => {
  console.log('dateModal watch', newVal);
});

watch(planStore.planDate, (newVal) => {
  console.log('dateModal watch', newVal);
});

onMounted(() => {
  console.log('dateModal onMounted', planStore.planDate);
});
</script>
