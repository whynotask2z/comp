// 基于JSX快速渲染出二级路由页面
import { KeepAlive } from 'vue'
import { RouterView } from 'vue-router'

/* 渲染三级路由组件的RouterView */
const RouterViewPage = {
    name: 'RouterViewPage',
    render: () => {
        return <RouterView>
            {{
                default: ({ Component }) => {
                    return <KeepAlive include="IndexWelcome">
                        <Component />
                    </KeepAlive>
                }
            }}
        </RouterView>
    }
}

// 首页的子集
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

// 设备管理的子集
const iotRoutes = [{
    path: 'template',
    name: 'iot-template',
    meta: {
        title: '通用物模型',
        icon: 'compass-outlined',
        hidden: true,
        level: 3,
        id: 'iot-template',
        parentId: 'iot'
    },
    component: () => import(/* webpackChunkName:'iot' */'@/views/iot/Template.vue')
}, {
    path: 'category',
    name: 'iot-category',
    meta: {
        title: '产品分类',
        icon: 'cluster-outlined',
        hidden: true,
        level: 3,
        id: 'iot-category',
        parentId: 'iot'
    },
    component: () => import(/* webpackChunkName:'iot' */'@/views/iot/Category.vue')
}, {
    path: 'product',
    name: 'iot-product',
    meta: {
        title: '产品管理',
        icon: 'disconnect-outlined',
        hidden: true,
        level: 3,
        id: 'iot-product',
        parentId: 'iot'
    },
    component: () => import(/* webpackChunkName:'iot' */'@/views/iot/Product.vue')
}]

// 系统管理的子集
const systemRoutes = [{
    path: 'user',
    name: 'system-user',
    meta: {
        title: '用户管理',
        icon: 'usergroup-delete-outlined',
        hidden: true,
        level: 3,
        id: 'system-user',
        parentId: 'system'
    },
    component: () => import(/* webpackChunkName:'system' */'@/views/system/User.vue')
}, {
    path: 'menu',
    name: 'system-menu',
    meta: {
        title: '菜单管理',
        icon: 'menu-outlined',
        hidden: true,
        level: 3,
        id: 'system-menu',
        parentId: 'system'
    },
    component: () => import(/* webpackChunkName:'system' */'@/views/system/Menu.vue')
}]

/* 主页的各种子集路由 */
const childRoutes = [
    // 首页
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
    },
    // 设备管理
    {
        path: '/iot',
        name: 'iot',
        meta: {
            title: '设备管理',
            icon: 'dashboard-outlined',
            hidden: true,
            level: 2,
            id: 'iot',
            parentId: 'home'
        },
        component: RouterViewPage,
        redirect: '/iot/template',
        children: iotRoutes
    },
    // 系统管理
    {
        path: '/system',
        name: 'system',
        meta: {
            title: '系统管理',
            icon: 'appstore-outlined',
            hidden: true,
            level: 2,
            id: 'system',
            parentId: 'home'
        },
        component: RouterViewPage,
        redirect: '/system/user',
        children: systemRoutes
    }
]
export default childRoutes