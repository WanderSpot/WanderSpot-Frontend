import './assets/main.css'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersisted from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { useKakao } from 'vue3-kakao-maps/@utils'

useKakao('API_KEY', ['services', 'clusterer', 'drawing'])

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
//import { all } from '@awesome.me/kit-KIT_CODE/icons'

/* add icons to the library */
library

const app = createApp(App)
const pinia = createPinia()
app.component('font-awesome-icon', FontAwesomeIcon)

pinia.use(piniaPersisted)

app.use(setupCalendar, {})
app.use(pinia)
app.use(router)

app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.mount('#app')
