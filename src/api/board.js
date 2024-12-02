import { localAxios } from '@/util/http-commons'
import { useUserStore } from '@/stores/useUserStore'
const local = localAxios()

function listArticle(param, success, fail) {
  local.get(`api/board`, { params: param }).then(success).catch(fail)
}

function detailArticle(articleno, success, fail) {
  local.get(`api/board/${articleno}`).then(success).catch(fail)
}

function registArticle(article, success, fail) {
  const userStore = useUserStore()
  local
    .post(`api/board`, JSON.stringify(article), {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    })
    .then(success)
    .catch(fail)
}

function getModifyArticle(articleno, success, fail) {
  const userStore = useUserStore()
  console.log('토큰 확인', userStore.user['access-token'])
  local
    .get(`api/board/modify/${articleno}`, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    })
    .then(success)
    .catch(fail)
}

function modifyArticle(article, success, fail) {
  const userStore = useUserStore()
  console.log('토큰 확인2323', userStore.user['access-token'])
  local
    .put(`api/board`, JSON.stringify(article), {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    })
    .then(success)
    .catch(fail)
}

function deleteArticle(articleno, success, fail) {
  const userStore = useUserStore()
  local
    .delete(`api/board/${articleno}`, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    })
    .then(success)
    .catch(fail)
}
function listTravelPlans(param, success, fail) {
  local.get('/api/board/planList', { params: param }).then(success).catch(fail)
}

export {
  listArticle,
  detailArticle,
  registArticle,
  getModifyArticle,
  modifyArticle,
  deleteArticle,
  listTravelPlans,
}
