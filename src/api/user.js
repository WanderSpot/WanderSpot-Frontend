
import { localAxios } from '@/util/http-commons'

const local = localAxios()

// 로그인 API 함수
function login(param, success, fail) {
  local
    // .post(`/api/user/login`, null, { params: param })
    .post(`/api/user/login`, param, {
      headers: {
        'Content-Type': 'application/json', // JSON 형식 명시
      },
    })
    .then(success)
    .catch(fail)
}

function checkUserId(param, success, fail) {
  console.log(param)
  local
    .get(`/api/user/idcheck`, {
      params: { checkid: param }, // 쿼리 파라미터를 params로 전달
    })
    .then(success)
    .catch(fail)
}

function getUserInfo(param, success, fail) {
  console.log('Authorization Header:', `Bearer ${param}`)
  local
    .get(`/api/user/info`, {
      headers: {
        Authorization: `Bearer ${param}`,
      },
    })
    .then(success)
    .catch(fail)
}

function updateUserInfo(param, success, fail) {
  console.log(param)
  local.post(
    `/api/user/update`,
    param.user, // Send the user data directly
    {
      headers: {
        Authorization: `Bearer ${param["access-token"]}`, // Pass the token
      },
    }
  )
    .then(success) // Call the success callback on a successful response
    .catch(fail); // Call the fail callback on an error
}

function searchUser(param, success, fail) {
  local.get(`/api/user/search`, { params: { userId: param } })
    .then(success)
    .catch(fail)
}
export { login, checkUserId, getUserInfo, updateUserInfo, searchUser }

