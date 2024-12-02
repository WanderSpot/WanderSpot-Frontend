<template>
  <div
    v-if="props.isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <!-- 모달 창 -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4 text-center">생성 확인</h2>
      <p class="text-gray-700 text-center mb-6">
        정말로 생성을 진행하시겠습니까?
      </p>
      <!-- 버튼 영역 -->
      <div class="flex justify-center gap-4">
        <button
          @click="props.closeModal"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
        >
          취소
        </button>
        <button
          @click="handleConfirm"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          생성
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  closeModal: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['confirmCreate']);

const handleConfirm = async () => {
  await emit('confirmCreate');
  props.closeModal();
};
</script>

<style scoped>
/* 스크롤 방지 */
body {
  overflow: hidden;
}
</style>
