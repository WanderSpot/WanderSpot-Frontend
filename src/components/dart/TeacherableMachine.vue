<template>
  <div>
    <!-- <button type="button" @click="startModel" :disabled="isRunning.value">Start</button>
    <button type="button" @click="restartModel" >Restart</button> -->
    <div class="fixed-camera-box">
      <div class="pl-3 pr-3 pb-3 bg-main rounded-xl"><canvas id="canvas"></canvas></div>
      <div id="label-container"></div>
      <!-- <p>Highest Average Prediction: {{ highestPrediction }}</p>
      <p>Target Number: {{ targetNumber }}</p>
      <p>Random Coordinates: {{ randomCoordinates }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { init, getPrediction, stop } from '@/util/pose-model'
import { ref, watch , defineProps, onMounted, defineEmits, onUnmounted } from 'vue'

const props = defineProps({
  isDartStart: {
    type: Boolean,
    required: true
  }
});

const prediction = ref([])
const highestPrediction = ref('')
const isRunning = ref(false)
const targetNumber = ref(-1)
const randomCoordinates = ref({})

const emit = defineEmits(['randomCoordinates', 'restartModel'])

let updateInterval = null // setInterval 변수 저장
let timeout = null // setTimeout 변수 저장

const startModel = async () => {
  if (isRunning.value) return // 이미 실행 중인 경우 중복 실행 방지

  isRunning.value = true
  prediction.value = []
  highestPrediction.value = ''
  
  const collectedPredictions = []

  
  // 주기적으로 getPrediction 호출하여 prediction 업데이트
  updateInterval = setInterval(() => {
    const currentPrediction = getPrediction()
    if (currentPrediction) {
      prediction.value = currentPrediction
      // prediction 값을 수집
      collectedPredictions.push(currentPrediction)
    }
  }, 100) // 100ms마다 업데이트
  
  // 3초 후 계산 및 종료
  timeout = setTimeout(() => {
    clearInterval(updateInterval) // Interval 종료
    updateInterval = null

    // 각 속성별 평균 계산
    const averages = {}
    collectedPredictions.forEach(predictionArray => {
      predictionArray.forEach(({ className, probability }) => {
        if (!averages[className]) {
          averages[className] = { total: 0, count: 0 }
        }
        averages[className].total += probability
        averages[className].count += 1
      })
    })
    
    // 평균 계산
    for (const className in averages) {
      averages[className].average = averages[className].total / averages[className].count
    }

    // 가장 높은 평균값을 가진 속성 찾기
    const highest = Object.entries(averages).reduce((prev, curr) => {
      return curr[1].average > prev[1].average ? curr : prev
    }, ['', { average: 0 }]) // 초기값 설정

    highestPrediction.value = highest[0] // className 저장
    console.log(`Highest Average Prediction: ${highest[0]}`)
    
    // 모델 실행 상태를 false로 설정
    isRunning.value = false
  }, 1000) // 3초 후 실행
}

// 다시하기 버튼 동작
const restartModel = () => {
  emit('restartModel');
  // 현재 실행 중인 Interval과 Timeout 정리
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  
  // 상태 초기화 후 모델 재시작
  isRunning.value = false
  prediction.value = []
  highestPrediction.value = ''
  startModel()
}

// 사각형 범위 데이터
const rectangles = [
  { lat: [37.68896196733788, 36.650910024621645], lng: [126.65132417550879, 127.2923799807556] },
  { lat: [37.86234153266533, 36.83825888646051], lng: [127.2923799807556, 127.93343578600242] },
  { lat: [38.035721097992784, 37.02560774829937], lng: [127.93343578600242, 128.57449159124923] },
  { lat: [36.650910024621645, 35.612858081905415], lng: [126.63420614295256, 127.33751591903365] },
  { lat: [36.83825888646051, 35.814176240255684], lng: [127.33751591903365, 128.04082569511473] },
  { lat: [37.02560774829937, 36.01549439860596], lng: [128.04082569511473, 128.74413547119582] },
  { lat: [35.612858081905415, 34.57480613918918], lng: [126.61708811039632, 127.3826518573117] },
  { lat: [35.814176240255684, 34.79009359405086], lng: [127.3826518573117, 128.14821560422706] },
  { lat: [36.01549439860596, 35.00538104891255], lng: [128.14821560422706, 128.91377935114244] },
];


// 랜덤 값 추출 함수
const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

// 사각형 범위 내 랜덤 위도와 경도 추출 함수
const getRandomCoordinates = (targetNumber) => {
  if (targetNumber < 1 || targetNumber > 9) {
    throw new Error("targetNumber는 1에서 9 사이여야 합니다.");
  }

  // 선택한 사각형의 범위
  const { lat, lng } = rectangles[targetNumber - 1];

  // 랜덤 위도와 경도 계산
  const randomLat = getRandomInRange(lat[0], lat[1]);
  const randomLng = getRandomInRange(lng[0], lng[1]);

  return { lat: randomLat, lng: randomLng };
};

// 예제 실행
try {
  randomCoordinates.value = getRandomCoordinates(targetNumber.value);
  console.log(`사각형 ${targetNumber.value}의 랜덤 좌표:`, randomCoordinates.value);
} catch (error) {
  console.error(error.message);
}


watch(() => props.isDartStart, async (newVal) => {
  if(newVal === false){
    console.log('startModel');
    await startModel();
  }
});

watch(() => highestPrediction.value, (newVal) => {
  if(newVal === '좌상단'){
    targetNumber.value = 0;
  }else if(newVal === '우상단'){
    targetNumber.value = 1;
  }else if(newVal === '중좌상단'){
    targetNumber.value = 2;
  }else if(newVal === '중우상단'){
    targetNumber.value = 3;
  }else if(newVal === '중단'){
    targetNumber.value = 4;
  }else if(newVal === '중좌하단'){
    targetNumber.value = 5;
  }else if(newVal === '중우하단'){
    targetNumber.value = 6;
  }else if(newVal === '좌하단'){
    targetNumber.value = 7;
  }else {
    targetNumber.value = 8;
  }

});

watch(()=>targetNumber.value, (newVal) => {
  console.log('targetNumber.value', newVal);
  randomCoordinates.value = getRandomCoordinates(newVal+1);
  console.log(randomCoordinates.value);
  emit('randomCoordinates', randomCoordinates.value);
});

onMounted(async () => {
  await init()
});

onUnmounted(() => {
  stop()
});
</script>

<style scoped>
.fixed-camera-box {
  position: fixed;
  top: 0; /* 맨 위에 위치 */
  left: 50%; /* 가로축의 50%로 이동 */
  transform: translateX(-50%); /* 가로축 중심으로 정렬 */
  z-index: 100; /* 다른 요소보다 앞에 위치 */
}

</style>