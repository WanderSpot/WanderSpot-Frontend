import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DartView from '@/views/dart/DartView.vue'
import MainView from '@/views/MainView.vue'
import PlanView from '@/views/plan/PlanView.vue'
import BoardView from '@/views/BoardView.vue'
import BoardListView from '@/components/board/BoardListView.vue'
import BoardWriteView from '@/components/board/BoardWriteView.vue'
import BoardDetailView from '@/components/board/BoardDetailView.vue'
import BoardEditView from '@/components/board/BoardEditView.vue'
import PlanResultView from '@/views/plan/PlanResultView.vue'
import UserView from '@/views/user/UserView.vue'
import MypageView from '@/views/user/MypageView.vue'
import UserUpdateView from '@/views/user/UserUpdateView.vue'
import NoticeView from '@/views/NoticeView.vue'
import NoticeListView from '@/components/board/NoticeListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/dart',
      name: 'dart',
      component: DartView,
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,  
    },
    {
      path: '/plan',
      name: 'plan',
      component: PlanView,
    },
    {
      path: '/plan/result',
      name: 'plan-result',
      component: PlanResultView,
    },
    {
      path:'/user',
      name:'user',
      component: UserView,
      children: [
        {
          path: 'mypage',
          name: 'mypage',
          component: MypageView,
        },
        {
          path:'update',
          name:'update',
          component: UserUpdateView,
        }
      ],
    },
    {
      path: '/board',
      name: 'board',
      // component: TheBoardView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/BoardView.vue'),
      redirect: { name: 'article-list' },
      children: [
        {
          path: 'list',
          name: 'article-list',
          component: () => import('@/components/board/BoardListView.vue'),
        },
        
      ],
    },
    {
      path: '/notice',
      name: 'notice',
      // component: TheBoardView,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/NoticeView.vue'),
      redirect: { name: 'notice-list' },
      children: [
        {
          path: 'list',
          name: 'notice-list',
          component: () => import('@/components/board/NoticeListView.vue'),
        },
        {
          path: 'view/:articleno',
          name: 'notice-view',
          component: () => import('@/components/board/BoardDetailView.vue'),
        },
        {
          path: 'write',
          name: 'notice-write',
          component: () => import('@/components/board/BoardWriteView.vue'),
        },
        {
          path: 'modify/:articleno',
          name: 'notice-modify',
          component: () => import('@/components/board/BoardEditView.vue'),
        },
      ],
    },
  ],
})

export default router
