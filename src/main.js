import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// CoreUI CSS
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// CoreUI Vue komponenty
import CoreuiVue from '@coreui/vue'

// CoreUI Icons - PRIDAJ TOTO
import { CIcon } from '@coreui/icons-vue'
import * as icons from '@coreui/icons'

// Router
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CoreuiVue)

// Registruj CIcon globálne - PRIDAJ TOTO
app.component('CIcon', CIcon)
app.provide('icons', icons)

app.mount('#app')