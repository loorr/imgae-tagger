import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MainPage from "../pages/MainPage.vue";

const routes: Array<RouteRecordRaw> = [
    // {
    //     path: '/home',
    //     name: 'Home',
    //     component: () => import(/* webpackChunkName: "Home" */ '@/views/home.vue')
    // },
    { path: '/', component:MainPage}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
