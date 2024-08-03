import { useAttrs, useSlots, ref } from 'vue'
const filter = (attrs) => {
    let props = {}
    Reflect.ownKeys(attrs).forEach(key => {
        if (key === 'loading' || key === 'onClick') return
        props[key] = attrs[key]
    })
    return props
}
const ButtonAgain = {
    name: 'ButtonAgain',
    inheritAttrs: false,
    setup() {
        const loading = ref(false)
        const attrs = useAttrs()
        const slots = useSlots()
        const props = filter(attrs)
        const handle = async () => {
            loading.value = true
            if (attrs.onClick) {
                try {
                    await attrs.onClick()
                } catch (_) { }
            }
            loading.value = false
        }
        return () => {
            return <a-button {...props}
                loading={loading.value}
                onClick={handle}>
                {slots}
            </a-button>
        }
    }
}
export default ButtonAgain

/* 
import { useAttrs, useSlots } from 'vue'

const filter = (attrs) => {
    let props = {}
    Reflect.ownKeys(attrs).forEach(key => {
        if (key === 'loading' || key === 'onClick') return
        props[key] = attrs[key]
    })
    return props
}

const ButtonAgain = {
    name: 'ButtonAgain',
    inheritAttrs: false,
    data() {
        return {
            loading: false
        }
    },
    render() {
        const attrs = useAttrs()
        const slots = useSlots()
        const props = filter(attrs)

        const handle = async () => {
            this.loading = true
            if (attrs.onClick) {
                try {
                    await attrs.onClick()
                } catch (_) { }
            }
            this.loading = false
        }

        return <a-button {...props}
            loading={this.loading}
            onClick={handle}>
            {slots}
        </a-button>
    }
}
export default ButtonAgain 
*/