import AntdV from 'ant-design-vue'
import './assets/reset.min.css'
import 'ant-design-vue/dist/antd.css'
import ButtonAgain from './components/ButtonAgain'
import store from './store'

export default function global(app) {
    /* 注册全局组件 */
    app.use(AntdV)
    app.component('a-button-again', ButtonAgain)

    /* 注册全局自定义指令 */
    // v-power="`iot:template:list`" 权限校验的指令
    app.directive('power', {
        mounted(el, { value }) {
            if (!value) return //无需做权限校验
            let { permissions } = store.state.profile
            if (permissions.includes(value)) return //具备相关的权限
            // 没有此权限，则把渲染的元素从页面中移除掉
            if (el) el.parentNode.removeChild(el)
        }
    })
}