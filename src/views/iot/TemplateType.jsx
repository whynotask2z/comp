import { Tag } from 'ant-design-vue'
const TemplateType = (props) => {
    let { type, arr } = props
    let item = arr.find(item => +item.value === +type)
    if (!item) return null
    let color = item.listClass
    if (color === 'primary') color = 'processing'
    return <Tag color={color}>
        {item.label}
    </Tag>
}
export default TemplateType