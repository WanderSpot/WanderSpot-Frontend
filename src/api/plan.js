import { localAxios } from '@/util/http-commons'
import { useUserStore } from '@/stores/useUserStore'
const local = localAxios()

async function listPlan() {
  const userStore = useUserStore(); // 사용자 상태 가져오기
  try {
    const response = await local.get(`api/travel-plan/created`, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    });
    return response.data; // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error in listPlan:", error); // 에러 로깅
    throw error; // 호출자에게 에러 전달
  }
}

async function createPlan(plan, success, fail) {
  const userStore = useUserStore(); // 사용자 상태 가져오기
  try {
    const response = await local.post(`api/travel-plan`, plan, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    });
    success(response); // 성공 콜백 호출
  } catch (error) {
    fail(error); // 실패 콜백 호출
  }
}

async function updatePlan(plan, success, fail) {
  const userStore = useUserStore(); // 사용자 상태 가져오기
  try {
    const response = await local.put(`api/travel-plan/${plan.id}`, plan, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    });
    success(response); // 성공 콜백 호출
  } catch (error) {
    fail(error); // 실패 콜백 호출
  }
}

async function getTravelPlan(planId) {
  const userStore = useUserStore(); // 사용자 상태 가져오기
  try {
    const response = await local.get(`/api/travel-plan/search?id=${planId}`, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    });
    // 성공 콜백 호출
    return response.data;
  } catch (error) {
    throw error; // 실패 콜백 호출
  }
}

async function listJoinedPlan(){
  const userStore = useUserStore(); // 사용자 상태 가져오기
  try {
    const response = await local.get(`api/travel-plan/joined`, {
      headers: {
        Authorization: `Bearer ${userStore.user['access-token']}`,
      },
    });
    return response.data; // 성공적으로 데이터를 반환
  } catch (error) {
    console.error("Error in listPlan:", error); // 에러 로깅
    throw error; // 호출자에게 에러 전달
  }
}

export { listPlan, createPlan, updatePlan, getTravelPlan, listJoinedPlan }