import { createApp } from 'vue'
import global from './global'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
global(app)
app.use(router)
app.use(store)
app.mount('#app')

