import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import store from '../src/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './index.css'
// @ts-ignore
import fabric from 'fabric'

createApp(App)
    .use(router)
    .use(ElementPlus)
    .use(store)
    .use(fabric)
    .mount('#app')
