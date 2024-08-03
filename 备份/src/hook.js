/* 自定义Hook「代替Vue2中的mixin」 */
import * as vue from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import API from '@/api'

export const useBasicHook = function useBasicHook() {
    const store = useStore(),
        route = useRoute(),
        router = useRouter()
    return {
        ...vue,
        store,
        route,
        router,
        API,
        message
    }
}
export default useBasicHook