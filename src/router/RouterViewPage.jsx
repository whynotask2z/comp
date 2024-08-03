import { KeepAlive } from 'vue'
import { RouterView } from 'vue-router'
import API from '@/api'
import store from '@/store'

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
export default RouterViewPage

/* 动态路由处理 */
const deep = (routes) => {
    routes.forEach(item => {
        let { component, children } = item
        if (component === 'RouterViewPage') {
            item.component = RouterViewPage
        } else {
            item.component = () => import(component.replace('@', '..'))
        }
        if (children) item.children = deep(children)
    })
    return routes
}
export const handleActiveRoutes = async function handleActiveRoutes(router) {
    // 获取动态路由信息
    let routeList = []
    try {
        let { code, routes } = await API.queryActiveRoutes()
        if (+code === 200) {
            routeList = deep(routes)
        }
    } catch (_) { }

    // 动态增加首页的二级路由信息
    routeList.forEach(item => {
        router.addRoute('home', item)
    })

    // 派发任务
    store.commit('setIsActiveRoutes')
    store.commit('setRoutes', router.getRoutes())
}