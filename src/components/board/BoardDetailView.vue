<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detailArticle, deleteArticle } from '@/api/board'

const route = useRoute()
const router = useRouter()

const { articleno } = route.params

const article = ref({})

// 글 상세 데이터 로드
const getArticle = () => {
  console.log(`${articleno}번 글 얻으러 가자!!!`)
  detailArticle(
    articleno,
    (response) => {
      console.log('응답 데이터:', response.data)
      article.value = response.data // 서버에서 반환된 글 데이터를 저장
    },
    (error) => {
      console.error('글 상세 가져오기 오류:', error)
    },
  )
}

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  getArticle()
})

// 글 목록 페이지로 이동
function moveList() {
  router.push({ name: 'article-list' })
}

// 글 수정 페이지로 이동
function moveModify() {
  router.push({ name: 'article-modify', params: { articleno } })
}

// 글 삭제 처리
const onDeleteArticle = () => {
  console.log(`${articleno}번 글 삭제하러 가자!!!`)
  deleteArticle(
    articleno,
    (response) => {
      if (response.status === 200) {
        alert('글이 성공적으로 삭제되었습니다.')
        moveList() // 삭제 후 목록으로 이동
      }
    },
    (error) => {
      console.error('글 삭제 중 오류 발생:', error)
      alert('글 삭제 중 문제가 발생했습니다.')
    },
  )
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <h2 class="my-3 py-3 shadow-sm bg-light text-center">
          <mark class="sky">글보기</mark>
        </h2>
      </div>

      <!-- 로딩 또는 데이터 존재 여부 처리 -->
      <div v-if="article.articleNo" class="col-lg-10 text-start">
        <div class="row my-2">
          <h2 class="text-secondary px-5">{{ article.articleNo }}. {{ article.subject }}</h2>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="clearfix align-content-center">
              <img
                class="avatar me-2 float-md-start bg-light p-2"
                src="https://raw.githubusercontent.com/twbs/icons/main/icons/person-fill.svg"
              />
              <p>
                <span class="fw-bold">{{ article.userId }}</span> <br />
                <span class="text-secondary fw-light">
                  {{ article.registerTime }} 조회: {{ article.hit }}
                </span>
              </p>
            </div>
          </div>
          <div class="col-md-4 align-self-center text-end">
            댓글: {{ article.commentCount || 0 }}
          </div>
        </div>
        <div class="divider mb-3"></div>
        <div class="text-secondary">
          {{ article.content }}
        </div>
        <div class="divider mt-3 mb-3"></div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-outline-primary mb-3" @click="moveList">
            글목록
          </button>
          <button type="button" class="btn btn-outline-success mb-3 ms-1" @click="moveModify">
            글수정
          </button>
          <button type="button" class="btn btn-outline-danger mb-3 ms-1" @click="onDeleteArticle">
            글삭제
          </button>
        </div>
      </div>

      <!-- 로딩 중 상태 -->
      <div v-else class="text-center">
        <p>글을 불러오는 중입니다...</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
