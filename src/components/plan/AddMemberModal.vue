<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <!-- 모달 창 -->
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4 text-center">동료 추가</h2>
      <p class="text-gray-700 text-center mb-6">
        동료의 이메일을 입력하고 전송 버튼을 클릭하세요.
      </p>

      <!-- 이메일 입력 -->
      <div class="relative">
        <input
          type="email"
          v-model="email"
          placeholder="이메일 입력"
          @input="handleInput"
          class="w-full px-4 py-2 border rounded-md mb-4"
        />
        <!-- 로딩 표시 -->
        <div v-if="isLoading" class="absolute top-full left-0 w-full bg-white p-2 text-center border">
          로딩 중...
        </div>
        <!-- 드롭다운 -->
        <ul v-if="suggestions.length > 0" class="absolute top-full left-0 w-full bg-white border rounded-md">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(suggestion)"
            class="p-2 hover:bg-gray-100 cursor-pointer"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>

      <!-- 버튼 영역 -->
      <div class="flex justify-center gap-4">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
        >
          취소
        </button>
        <button
          @click="handleSend"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          전송
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { debounce } from 'lodash';
import { searchUser } from '@/api/user';
import { usePlanStore } from '@/stores/usePlanStore.js'
import { useUserStore } from '@/stores/useUserStore.js'
const planStore = usePlanStore()
const userStore = useUserStore()
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

const emit = defineEmits(['sendEmail']);

// 데이터
const email = ref('');
const isLoading = ref(false);
const suggestions = ref([]);

// 이메일 검색 API 호출
const fetchSuggestions = async (query) => {
  isLoading.value = true;
  suggestions.value = []; // 기존 추천 초기화

  try {
    const response = await fetch(`/api/emails?query=${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    suggestions.value = data.filter(user => user !== userStore.user.userId); // 추천 결과 업데이트
    console.log('suggestions', suggestions.value);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  } finally {
    isLoading.value = false; // 로딩 상태 해제
  }
};


// 디바운스를 적용하여 검색 호출 제한
const handleInput = debounce(async (e) => {
  const query = e.target.value.trim();
  if (query) {
    console.log('query', query);
    await searchUser(query, (res) => {
      console.log('res', res);
      suggestions.value = res.data;
    });
    console.log('suggestions', suggestions.value);
  } else {
    suggestions.value = []; // 입력값 없으면 초기화
  }
}, 300); // 300ms 지연

// 추천 선택
const selectSuggestion = (suggestion) => {
  if(suggestion === userStore.user.userId) {
    alert('자기 자신을 추가할 수 없습니다.');
    return;
  }
  email.value = suggestion; // 선택한 추천값으로 설정
  suggestions.value = []; // 드롭다운 숨기기
};

// 이메일 전송
const handleSend = () => {
  if (email.value.trim() === '') {
    alert('이메일을 입력해주세요.');
    return;
  }

  emit('sendEmail', email.value);
  planStore.addMember(email.value);
  email.value = ''; // 입력 필드 초기화
  props.closeModal();
};

// 모달 닫기
const closeModal = () => {
  props.closeModal();
};
</script>
