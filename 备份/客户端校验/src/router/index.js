import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import store from '@/store'
import { message } from 'ant-design-vue'
import loading from '@/components/Loading'

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const safeName = ['user-login', 'error']
let unloading = null
router.beforeEach(async (to, from, next) => {
    /* 登录态校验 */
    let profile = store.state.profile
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

    /* 权限校验 */
    if (to.meta.permission) {
        // 需要做权限校验
        let permissions = store.state.profile.permissions
        if (!permissions.includes(to.meta.permission)) {
            // 无权限访问：跳转到404
            next({ name: 'error', replace: true })
            return
        }
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