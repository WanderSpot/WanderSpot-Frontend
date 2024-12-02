<template>
  <div class="fixed inset-0 flex items-center justify-center bg-light bg-opacity-50 z-50">
    <div class="w-full justify-center flex flex-col">
      <div class="flex flex-col align-center justify-center">
        <div class="flex justify-center"><p class="selected-location p-1">{{ planStore.location }}</p><p class="text p-1">에 당첨되었어요!</p></div>
        <div class="text-center" style="font-size:1.5rem">여행할까요?</div>
      </div>
      <div class="flex justify-center w-full">
        <button @click="selectLocation" type="button" class="bg-primary btn-circle wave-button">선택</button>
        <button @click="resetLocation"type="button" class="bg-sub btn-circle wave-button">다시</button>
      </div>
    </div>
  </div>

  <!-- <div
    v-if="props.tripDate === null || localTripDate === null"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-4 rounded-lg">
      <VDatePicker
        v-model.range="localTripDate"
        mode="date"
      />
    </div>
  </div> -->
</template>

<script setup>
import { usePlanStore } from "@/stores/usePlanStore";
import { ref , defineEmits} from "vue";

const planStore = usePlanStore();
const emit = defineEmits('reset-location','select-location');

const selectLocation = () => {
  emit('select-location');
}

const resetLocation = () => {
  emit('reset-location');
}

</script>

<style>
.btn-circle{
  width:10vw;
  height: 10vw;
  border-radius: 100%;
  color: white;
  font-size:1.5rem;
  margin:1rem;
}

.selected-location{
  color: red;
  background-color: lightgray;
  border-radius: 10%;
  font-size:1.5rem;
}

.text{
  font-size:1.5rem;
}

.wave-button {
  position: relative;
  display: inline-block;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.8s ease;
}

.wave-button:hover {
  animation: wave 3s ease infinite;
}

@keyframes wave {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05) translateY(-5px);
  }
  50% {
    transform: scale(1) /*translateY(5px); */
  }
  75% {
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    transform: scale(1);
  }
}

</style>