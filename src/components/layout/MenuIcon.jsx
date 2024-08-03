import * as antvIcon from '@ant-design/icons-vue'
import { h } from 'vue'
export default function MenuIcon(props) {
    let icon = props.icon
    icon = icon.split('-').map(item => {
        return item.substr(0, 1).toUpperCase() + item.substr(1)
    }).join('')
    return antvIcon[icon] && h(antvIcon[icon])
}