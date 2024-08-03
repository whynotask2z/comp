import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import store from '@/store'
import { message } from 'ant-design-vue'
import loading from '@/components/Loading'
import { handleActiveRoutes } from './RouterViewPage'

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const safeName = ['user-login', 'error']
let unloading = null
router.beforeEach(async (to, from, next) => {
    /* 登录态校验 */
    let { profile, isActiveRoutes } = store.state
    if (!safeName.includes(to.name) && !profile) {
        if (profile === null) {
            unloading = loading()
            profile = await store.dispatch('setProfileAsync')
        }
        if (!profile) {
            // 确定没有登录
            message.warning('您还未登录，请您先登录！')
            next(`/user/login?to=${encodeURIComponent(to.fullPath)}`)
            return
        }
    }

    /* 权限校验：动态路由 */
    if (to.path !== '/user/login' && !isActiveRoutes) {
        if (!unloading) unloading = loading()
        await handleActiveRoutes(router)
        next({
            path: to.fullPath,
            replace: true
        })
        return
    }
    if (to.path === '/user/login') {
        // 进入登录页，就把之前新增的动态路由都移除
        ['iot', 'system'].forEach(name => {
            router.removeRoute(name)
        })
        store.commit('setIsActiveRoutes', false)
    }
    next()
})

router.afterEach((to, from) => {
    // 取消Loading
    if (unloading) {
        unloading()
        unloading = null
    }
    // 记录访问的历史记录
    if (+to.meta.level === 3) {
        store.commit('setHistory', {
            name: to.name,
            path: to.path,
            title: to.meta.title
        })
    }
    // 修改页面标题
    let title = to.meta.title
    document.title = title ? `${title} - FastBee物联网系统` : `FastBee物联网系统`
})

export default router