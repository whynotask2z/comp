import './Loading.less'
import { createVNode, render } from 'vue'
import { Spin } from 'ant-design-vue'

// 创建组件
const Loading = {
    name: 'Loading',
    setup() {
        return () => {
            return <div class="custom-global-loading">
                <Spin tip="奴家正在努力加载中，请稍后..." />
            </div>
        }
    }
}

// 动态渲染组件
let vnode = null
export default function loading() {
    if (!vnode) vnode = createVNode(Loading)
    let tempBox = document.getElementById('customGlobalLoading')
    if (!tempBox) {
        tempBox = document.createElement('div')
        tempBox.id = "customGlobalLoading"
        render(vnode, tempBox)
        document.body.appendChild(tempBox)
    }

    return function unloading() {
        document.body.removeChild(tempBox)
    }
}