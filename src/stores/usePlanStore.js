import { defineStore } from 'pinia';

export const usePlanStore = defineStore('planStore', {
  state: () => ({
    dayPlanList: [], // 2차원 배열
    dayHouseList: [], // 2차원 배열
      id: null,
      title: '',
      location: '',
      planDate: {
        start: '',
        end: '',
      },
      createUserId: '',
      joinMemberId: [],
      updatedUserId:'',
      content: '',
  }),

  actions: {
    initializePlan(planData) {
      this.id = planData.id;
      this.title = planData.title;
      this.location = planData.location;
      this.planDate = planData.planDate;
      this.createUserId = planData.createUserId;
      this.joinMemberId = planData.joinMemberId;
      this.dayPlanList = planData.dayPlanList;
      this.dayHouseList = planData.dayHouseList;
      this.updatedUserId = planData.updatedUserId;
      this.content = planData.content;
    },
    addMember(email) {
      this.joinMemberId.push(email);
    },
    removeMember(email) {
      this.joinMemberId = this.joinMemberId.filter(id => id !== email);
    },
    addDayPlan(dayIndex, place) {
      console.log('addDayPlan');
      if (!this.dayPlanList[dayIndex].placeList) {
        console.log('empty placeList')
        this.dayPlanList[dayIndex] = { placeList :[place] };
      }
      else this.dayPlanList[dayIndex].placeList.push(place);
    },

    addDayHouse(dayIndex, place) {
      if (!this.dayHouseList[dayIndex].placeList) {
        this.dayHouseList[dayIndex]={placeList :[place]};
      }
      else this.dayHouseList[dayIndex].placeList.push(place);
    },

    setDayPlanList(dayPlanList) {
      console.log("setDayPlanList", dayPlanList);
      dayPlanList.forEach((dayPlan, index) => {
        this.dayPlanList[index] = dayPlan;
      });
    },

    setDayHouseList(dayHouseList) {
      console.log("setDayHouseList", dayHouseList);
      dayHouseList.forEach((dayHouse, index) => {
        this.dayHouseList[index] = dayHouse;
      });
    },

    setPlan(plan) {
      this.plan = plan;
    },

    removeDayPlan(dayIndex, placeId) {
      console.log("remove", this.dayPlanList[dayIndex]);
      console.log("placeId", placeId);
      if (this.dayPlanList[dayIndex]?.placeList) {
        // 새로운 배열 생성 후 재할당
        console.log("dayPlanList[dayIndex].placeList", this.dayPlanList[dayIndex].placeList);
        this.dayPlanList[dayIndex].placeList = this.dayPlanList[dayIndex].placeList.filter(
          (place) => place.id !== placeId
        );
        console.log("Updated dayPlanList:", this.dayPlanList[dayIndex].placeList);
      }
    },
    
    removeDayHouse(dayIndex, placeId) {
      console.log("remove", this.dayHouseList[dayIndex], placeId);
      if (this.dayHouseList[dayIndex]?.placeList) {
        // 새로운 배열 생성 후 재할당
        this.dayHouseList[dayIndex].placeList = this.dayHouseList[dayIndex].placeList.filter(
          (place) => place.id !== placeId
        );
        console.log("Updated dayHouseList:", this.dayHouseList[dayIndex].placeList);
      }
    },
    

    clearDayPlanList() {
      this.dayPlanList = [];
    },

    clearDayHouseList() {
      this.dayHouseList = [];
    },

    clearPlan() {
      this.id = -1;
      this.title = '';
      this.location = '';
      this.planDate.start = '';
      this.planDate.end = '';
      this.createUserId = '';
      this.joinMemberId = [];
      this.content = '';
    },
    clearPlanDate() {
      this.planDate.start = null;
      this.planDate.end = null;
    }
  },

  persist: {
    storage: sessionStorage,
  },
});
