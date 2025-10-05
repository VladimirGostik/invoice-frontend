import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// CoreUI CSS
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// CoreUI Vue komponenty
import CoreuiVue from '@coreui/vue'

// Router a Pinia store
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CoreuiVue)

app.mount('#app')
