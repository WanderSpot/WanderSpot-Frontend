import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: {
      userId: null,
      userName: '',
      userPassword: '',
      emailId: '',
      emailDomain: '',
      joinDate: null,
      refreshToken: null,
    },
  }),
  actions: {
    // 여행 계획 초기화
    initializeUser(userData) {
      this.user = { ...this.user, ...userData };
    },
    setUserId(userId) {
      this.user.userId = userId
    },
    setRefreshToken(refreshToken) {
      this.user.refreshToken = refreshToken
    },
  },
  persist: {
    storage: sessionStorage,
  },
});
