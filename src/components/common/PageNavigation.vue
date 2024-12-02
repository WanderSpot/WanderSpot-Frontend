<script setup>
import { computed } from 'vue'

// 부모 컴포넌트로부터 현재 페이지와 총 페이지 수를 props로 전달받음
const props = defineProps({ currentPage: Number, totalPage: Number })
const emit = defineEmits(['pageChange'])

// 네비게이션 크기 (한 번에 표시할 페이지 수)
// VITE_ARTICLE_NAVIGATION_SIZE는 환경 변수로 설정됨
const navigationSize = parseInt(import.meta.env.VITE_ARTICLE_NAVIGATION_SIZE) || 5

// 시작 페이지 계산
const startPage = computed(() => {
  return Math.floor((props.currentPage - 1) / navigationSize) * navigationSize + 1
})

// 끝 페이지 계산
const endPage = computed(() => {
  const lastPage =
    Math.floor((props.currentPage - 1) / navigationSize) * navigationSize + navigationSize
  return props.totalPage < lastPage ? props.totalPage : lastPage
})

// 마지막 범위인지 확인 (현재 페이지가 네비게이션 크기 마지막 범위를 초과했는지 체크)
const isEndRange = computed(() => {
  return Math.floor((props.totalPage - 1) / navigationSize) * navigationSize < props.currentPage
})

// 특정 범위의 페이지 리스트 생성
function range(start, end) {
  const list = []
  for (let i = start; i <= end; i++) {
    list.push(i)
  }
  return list
}

// 페이지 변경 시 부모 컴포넌트로 이벤트 전달
function onPageChange(pg) {
  if (pg >= 1 && pg <= props.totalPage) {
    emit('pageChange', pg)
  }
}
</script>

<template>
  <div class="row">
    <ul class="pagination justify-content-center">
      <!-- 첫 페이지로 이동 -->
      <li class="page-item" :class="{ disabled: props.currentPage === 1 }">
        <a class="page-link" @click="onPageChange(1)">최신</a>
      </li>

      <!-- 이전 네비게이션 그룹으로 이동 -->
      <li class="page-item" :class="{ disabled: startPage === 1 }">
        <a class="page-link" @click="onPageChange(startPage === 1 ? 1 : startPage - 1)">이전</a>
      </li>

      <!-- 페이지 번호 목록 -->
      <template v-for="pg in range(startPage, endPage)" :key="pg">
        <li :class="['page-item', { active: props.currentPage === pg }]">
          <a class="page-link" @click="onPageChange(pg)">{{ pg }}</a>
        </li>
      </template>

      <!-- 다음 네비게이션 그룹으로 이동 -->
      <li class="page-item" :class="{ disabled: isEndRange }">
        <a class="page-link" @click="onPageChange(isEndRange ? props.totalPage : endPage + 1)">
          다음
        </a>
      </li>

      <!-- 마지막 페이지로 이동 -->
      <li class="page-item" :class="{ disabled: props.currentPage === props.totalPage }">
        <a class="page-link" @click="onPageChange(props.totalPage)">마지막</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
a {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
  pointer-events: none;
  color: #ccc;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
</style>
