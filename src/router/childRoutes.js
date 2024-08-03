import RouterViewPage from './RouterViewPage'

// 首页的三级路由
const indexRoutes = [{
    path: 'welcome',
    name: 'index-welcome',
    meta: {
        title: '首页',
        icon: 'home-outlined',
        hidden: true,
        level: 3,
        id: 'index-welcome',
        parentId: 'index'
    },
    component: () => import(/* webpackChunkName:'index' */ '@/views/index/Welcome.vue')
}, {
    path: 'personal',
    name: 'index-personal',
    meta: {
        title: '个人中心',
        icon: 'user-outlined',
        hidden: false,
        level: 3,
        id: 'index-personal',
        parentId: 'index'
    },
    component: () => import(/* webpackChunkName:'index' */ '@/views/index/Personal.vue')
}, {
    path: 'setting',
    name: 'index-setting',
    meta: {
        title: '个人设置',
        icon: 'setting-outlined',
        hidden: false,
        level: 3,
        id: 'index-setting',
        parentId: 'index'
    },
    component: () => import(/* webpackChunkName:'index' */ '@/views/index/Setting.vue')
}]

/* 主页二级路由 */
const childRoutes = [
    {
        path: '/index',
        name: 'index',
        meta: {
            title: '',
            icon: '',
            hidden: false,
            level: 2,
            id: 'index',
            parentId: 'home'
        },
        component: RouterViewPage,
        redirect: '/index/welcome',
        children: indexRoutes
    }
]
export default childRoutes