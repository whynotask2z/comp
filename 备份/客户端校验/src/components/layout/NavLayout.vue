<script setup>
import { CloseCircleOutlined, LeftCircleOutlined } from '@ant-design/icons-vue'
import useBasicHook from '@/hook'
const { store, router, route } = useBasicHook()

const handle = (item, type) => {
    store.commit('removeHistory', {
        name: item.name,
        type
    })
    // 如果是全部关闭，直接回到首页
    if (type === 'all' && item.name !== 'index-welcome') {
        return router.push('/index/welcome')
    }
    // 如果是关闭当前，但是当前这一项正好是选中的，则路由跳转到上一项
    if (type === 'current' && item.name === route.name) {
        return router.push('/index/welcome')
    }
    // 如果是关闭其他，但是这一项并没有被选中，则选中这一项
    if (type === 'other' && item.name !== route.name) {
        return router.push(item.path)
    }
}
</script>

<template>
    <div class="tablist-box">
        <template v-for="(item, index) in store.state.history" :key="item.name">
            <a-popover overlayClassName="tablist-popover" trigger="contextmenu" placement="bottom">
                <template #content>
                    <a-menu>
                        <a-menu-item key="current" @click.native="handle(item, 'current')" v-if="index !== 0">
                            <template #icon><close-circle-outlined /></template>
                            关闭当前
                        </a-menu-item>
                        <a-menu-item key="other" @click.native="handle(item, 'other')">
                            <template #icon><left-circle-outlined /></template>
                            关闭其它
                        </a-menu-item>
                        <a-menu-item key="all" @click.native="handle(item, 'all')">
                            <template #icon><close-circle-outlined /></template>
                            全部关闭
                        </a-menu-item>
                    </a-menu>
                </template>
                <a-tag :color="item.name === route.name ? `processing` : ``" :closable="index !== 0"
                    @click.native="router.push(item.path)" @close="handle(item, 'current')">
                    {{ item.title }}
                </a-tag>
            </a-popover>
        </template>
    </div>
</template>

<style lang="less" scoped>
.tablist-box {
    display: flex;
    align-items: center;
    height: 100%;

    .ant-tag {
        cursor: pointer;
    }
}
</style>