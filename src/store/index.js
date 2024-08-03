import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import API from '@/api'
import iot from './iot'

/* 使用插件 */
const plugins = [
    createPersistedState({
        paths: ['history']
    })
]
const env = import.meta.env.MODE
if (env === 'development') plugins.push(createLogger())

/* 创建store */
const store = createStore({
    plugins,
    strict: true,
    state: {
        profile: null, //存储登录者信息 null未知、false未登录、Object已经登录
        //存储历史访问过的Menu项
        history: [{
            name: 'index-welcome',
            path: '/index/welcome',
            title: '首页'
        }],
        // 动态路由
        isActiveRoutes: false,
        routes: null
    },
    mutations: {
        setProfile(state, { profile }) {
            state.profile = profile
        },
        setHistory(state, { name, path, title }) {
            if (state.history.some(item => item.name === name)) return
            state.history.push({
                name,
                path,
                title
            })
        },
        removeHistory(state, { name, type }) {
            // type -> current/other/all
            state.history = state.history.filter(item => {
                if (item.name === 'index-welcome') return true
                if (type === 'all') return false
                if (type === 'current') return item.name !== name
                if (type === 'other') return item.name === name
            })
        },
        setIsActiveRoutes(state, flag = true) {
            state.isActiveRoutes = flag
        },
        setRoutes(state, routes) {
            state.routes = routes
        },
        // 把vuex中所有存储的信息都清除到最开始的状态
        clearVuex(state) {
            state.profile = null
            state.iot.iotType = null
            state.iot.dataType = null
            state.history = [{
                name: 'index-welcome',
                path: '/index/welcome',
                title: '首页'
            }]
        }
    },
    actions: {
        async setProfileAsync({ commit }) {
            let profile = null
            try {
                let { code, permissions, roles, user } = await API.getUserInfo()
                if (+code === 200) {
                    // 已经登录
                    profile = {
                        permissions,
                        roles,
                        user
                    }
                } else {
                    // 没有登录
                    profile = false
                }
            } catch (_) { }
            commit('setProfile', { profile })
            return profile
        }
    },
    modules: {
        iot
    }
})
export default store