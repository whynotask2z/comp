import AntdV from 'ant-design-vue'
import './assets/reset.min.css'
import 'ant-design-vue/dist/antd.css'
import ButtonAgain from './components/ButtonAgain'

export default function global(app) {
    /* 注册全局组件 */
    app.use(AntdV)
    app.component('a-button-again', ButtonAgain)
}