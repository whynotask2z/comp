<script setup>
import MenuItem from './MenuItem.vue'
import MenuIcon from './MenuIcon'
import useBasicHook from '@/hook'
const { ref, router, route, computed, watch, store, onBeforeMount } = useBasicHook()

/* 定义状态 */
const selectedKeys = ref([]),
    openKeys = ref([])

/* 定义监听器 */
watch(
    route,
    () => {
        let name = route.name || 'index-welcome',
            suffix = name.split('-')[0]
        selectedKeys.value = [name]
        openKeys.value = suffix === 'index' ? [] : [suffix]
    },
    { immediate: true, deep: true }
)

/* 定义计算属性 */
onBeforeMount(() => {
    if (!store.state.routes) {
        store.commit('setRoutes', router.getRoutes())
    }
})
const routeList = computed(() => {
    const routes = store.state.routes || []
    return routes.filter(item => +item.meta.level === 2)
})

/* 定义方法 */
const menuChange = (keys) => {
    let len = keys.length
    if (len === 0) return
    openKeys.value = [keys[len - 1]]
}
const menuClick = ({ key }) => {
    key = '/' + key.replace('-', '/')
    if (route.path !== key) {
        router.push(key)
    }
}
</script>

<template>
    <a-menu theme="dark" mode="inline" @openChange="menuChange" @click="menuClick" :openKeys="openKeys"
        v-model:selectedKeys="selectedKeys">
        <!-- 外层循环是控制二级路由(或sub-menu) -->
        <template v-for="item in routeList" :key="item.name">
            <a-sub-menu :key="item.name" v-if="item.meta.hidden">
                <template #icon>
                    <MenuIcon :icon="item.meta.icon" />
                </template>
                <template #title>{{ item.meta.title }}</template>
                <!-- 里层循环是控制三级路由(或menu-item) -->
                <MenuItem :children="item.children" />
            </a-sub-menu>
            <template v-else>
                <MenuItem :children="item.children" />
            </template>
        </template>
    </a-menu>
</template>

<style lang="less" scoped>
.ant-menu {
    user-select: none;

    &.ant-menu-inline-collapsed {
        .ant-menu-item-icon {
            font-size: 18px;
        }
    }
}

.ant-menu-item-icon {
    font-size: 15px;
}
</style>