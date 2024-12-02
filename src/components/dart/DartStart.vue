<template>
  <div class="fixed inset-0 flex items-center justify-center bg-light z-50">
    <div class="w-full justify-center flex flex-col">
      <div class="text-center" style="font-size:1.5rem">
        <span v-if="countdown > 0">3초 뒤에 다트를 던져주세요!</span>
        <span v-else>시작 버튼을 누르면 3초 카운트 다운 시작합니다!</span>
      </div>
      <div class="flex justify-center w-full mt-4">
        <div v-if="countdown > 0" style="font-size: 2rem; font-weight: bold;">
          {{ countdown }}
        </div>
      </div>
      <div class="flex justify-center w-full mt-4">
        <button
          @click="startCountdown"
        v-if="!isCounting"
        class="btn-circle bg-blue-500 hover:bg-blue-600"
      >
          시작
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref ,defineProps, defineEmits, watch} from 'vue';

defineProps({
  isDartStart: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['start-dart']);

const countdown = ref(0); // 카운트다운 값을 저장
const isCounting = ref(false); // 카운트다운 진행 여부
const isCameraAccess = ref(false); // 카메라 접근 여부

const startCountdown = async () => {
  if (isCounting.value) return; // 이미 진행 중이면 무시
  isCounting.value = true; // 진행 상태로 변경
  countdown.value = 3; // 3초로 초기화

  await requestCameraAccess();

  if(isCameraAccess.value){
  const interval = setInterval(() => {
      countdown.value -= 1; // 매 초마다 감소
      if (countdown.value === 0) {
        clearInterval(interval); // 카운트다운 종료
        changeScreen(); // 화면 전환
      }
    }, 1000); // 1초 간격
  }
};

const changeScreen = () => {
  console.log('화면 전환 로직 실행'); // 여기에 화면 전환 로직 추가
  isCounting.value = false; // 카운트다운 초기화
  emit('start-dart');
};

// 카메라 접근 요청 함수
const requestCameraAccess = async () => {
  try {
    // 카메라 접근 요청
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("카메라 접근 허용됨");
    isCameraAccess.value = true;
    // // 카메라 스트림 처리 (예: 비디오 엘리먼트에 출력)
    // const videoElement = document.querySelector("#video");
    // if (videoElement) {
    //   videoElement.srcObject = stream;
    // }
  } catch (err) {
    if (err.name === "NotAllowedError") {
      console.log("카메라 접근이 거부됨");
    } else if (err.name === "NotFoundError") {
      console.log("카메라를 찾을 수 없음");
    } else {
      console.log("카메라 접근 중 알 수 없는 에러:", err);
    }
  }
};

// 버튼 이벤트 리스너
//document.querySelector("#cameraButton").addEventListener("click", requestCameraAccess);


</script>
<style>
.btn-circle {
  width: 10vw;
  height: 10vw;
  border-radius: 100%;
  color: white;
  font-size: 1.5rem;
  margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  font-size: 1.5rem;
}
</style>
