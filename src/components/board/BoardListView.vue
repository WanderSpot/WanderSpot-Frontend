<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listTravelPlans } from '@/api/board.js'
import PlanViewModal from '@/components/board/PlanViewModal.vue'
import VSelect from '@/components/common/VSelect.vue'
import PageNavigation from '@/components/common/PageNavigation.vue'

const router = useRouter()

// 검색 조건 옵션
const selectOption = ref([
  { text: '검색조건', value: '' },
  { text: '제목', value: 'title' },
  { text: '작성자 ID', value: 'createUserId' },
])

// 여행 계획 데이터와 페이지 관련 상태
const travelPlans = ref([]) // 여행 계획 목록
const currentPage = ref(1) // 현재 페이지
const totalPage = ref(0) // 총 페이지 수
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env // 환경변수로 페이지 크기 설정
const planId = ref(0)
const isModalOpen = ref(false)
const param = ref({
  page: currentPage.value - 1, // Spring에서 사용하는 0-based page index
  size: VITE_ARTICLE_LIST_SIZE || 10, // 기본 페이지 크기
  key: '', // 검색 키워드 조건
  word: '', // 검색어
})

// 날짜 포맷팅 함수
function formatDate(localDateTime) {
  if (!localDateTime) return 'N/A'
  console.log('localDateTime is', localDateTime)
  // const date = new Date(localDateTime)
  // const isoDateTime = localDateTime.replace(' ', 'T')
  const date = new Date(localDateTime)
  console.log('date is', date) // ISO-8601 형식 데이터를 Date 객체로 변환
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('ko-KR', options)
}

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchTravelPlans()
})

// 검색 조건 변경 핸들러
const changeKey = (val) => {
  param.value.key = val
}

// 여행 계획 목록 가져오기
const fetchTravelPlans = () => {
  console.log('Fetching travel plans with params:', param.value)
  listTravelPlans(
    param.value,
    ({ data }) => {
      console.log('API Response:', data)
      travelPlans.value = data.content // 여행 계획 리스트
      currentPage.value = data.pageable.pageNumber + 1 // 0-based -> 1-based
      totalPage.value = data.totalPages // 총 페이지 수
      console.log('travelPlans:', travelPlans.value)
    },
    (error) => {
      console.error('API Error:', error)
    },
  )
}

// 검색 실행
const searchTravelPlans = () => {
  param.value.page = 0 // 검색 시 첫 페이지로 이동
  fetchTravelPlans()
}

// 페이지 변경 시 처리
const onPageChange = (val) => {
  currentPage.value = val
  param.value.page = val - 1 // 1-based -> 0-based
  fetchTravelPlans()
}

// 글 작성 페이지로 이동
const moveWrite = () => {
  router.push({ name: 'travel-plan-write' })
}

// 모달 열기
const openModal = () => {
  isModalOpen.value = true;
};

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

// 글 보기 페이지로 이동
const moveView = (id) => {
  planId.value = id
  openModal()
};
</script>

<template>
  <div class="container">
    <h2 class="title">여행 계획 목록</h2>
    <div class="search-bar">
      <VSelect :selectOption="selectOption" @onKeySelect="changeKey" />
      <input v-model="param.word" class="search-input" placeholder="검색어 입력..." />
      <button class="search-button" @click="searchTravelPlans">검색</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>제목</th>
          <th>위치</th>
          <th>작성자 ID</th>
          <th>날짜</th>
          <th>보기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="plan in travelPlans" :key="plan.id">
          <td>{{ plan.title }}</td>
          <td>{{ plan.location }}</td>
          <td>{{ plan.createUserId }}</td>
          <td>{{ formatDate(plan.planDate.start) }} ~ {{ formatDate(plan.planDate.end) }}</td>
          <td><button @click="moveView(plan.id)">보기</button></td>
        </tr>
      </tbody>
    </table>
    <PageNavigation
      :current-page="currentPage"
      :total-page="totalPage"
      @pageChange="onPageChange"
    />
  </div>
  <PlanViewModal :planId="planId" :isModalOpen="isModalOpen" :closeModal="closeModal" />
</template>

<style scoped>
.container {
  margin: 20px auto;
  max-width: 800px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  margin-left: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-button {
  margin-left: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #007bff;
  color: white;
  text-transform: uppercase;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #e6f7ff;
}

td {
  text-align: center;
}

.page-navigation {
  margin-top: 20px;
  text-align: center;
}
</style>
