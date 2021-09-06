import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import store from '../src/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
    .use(router)
    .use(ElementPlus)
    .use(store)
    .mount('#app')
