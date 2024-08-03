<script setup>
import MenuIcon from './MenuIcon'
import useBasicHook from '@/hook'
const { store } = useBasicHook()
const props = defineProps(['children', 'ignore'])

const handle = (cur) => {
    let flag = props.ignore || cur.meta.hidden
    if (!flag) return flag  // 本身就属于不渲染的
    if (!cur.meta.permission) return true  // 无需做权限校验
    return store.state.profile.permissions.includes(cur.meta.permission)
}
</script>

<template>
    <template v-for="cur in children" :key="cur.name">
        <a-menu-item :key="cur.name" v-if="handle(cur)">
            <template #icon>
                <MenuIcon :icon="cur.meta.icon" />
            </template>
            {{ cur.meta.title }}
        </a-menu-item>
    </template>
</template>