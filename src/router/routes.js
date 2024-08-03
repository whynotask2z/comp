import BasicLayout from '@/components/BasicLayout.vue'
import UserLayout from '@/components/UserLayout.vue'
import childRoutes from './childRoutes'

/* 基础路由 */
const routes = [
    {
        path: '/user',
        name: 'user',
        meta: {
            hidden: false,
            level: 1,
            id: 'user',
            parentId: null
        },
        component: UserLayout,
        redirect: '/user/login',
        children: [{
            path: 'login',
            name: 'user-login',
            meta: {
                title: '用户登录',
                hidden: false,
                level: 2,
                id: 'user-login',
                parentId: 'user'
            },
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login.vue')
        }]
    },
    {
        path: '/',
        name: 'home',
        meta: {
            hidden: false,
            level: 1,
            id: 'home',
            parentId: null
        },
        component: BasicLayout,
        redirect: '/index/welcome',
        children: childRoutes
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'error',
        meta: {
            title: '404',
            hidden: false,
            level: 1,
            id: 'error',
            parentId: null
        },
        component: () => import(/* webpackChunkName: "error" */ '@/views/ErrorPage.vue')
    }
]
export default routes