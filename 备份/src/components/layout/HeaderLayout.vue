<script setup>
import NavLayout from './NavLayout.vue'
import MenuItem from './MenuItem.vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { storage } from '@/assets/utils'
import useBasicHook from '@/hook'
const { route, computed, store, router, message } = useBasicHook()

/* 接收属性 & 自定义事件 */
defineProps(['collapsed'])
const emit = defineEmits(['update:collapsed'])

/* 定义计算属性 */
const profile = computed(() => store.state.profile)
const routeList = computed(() => {
    return router.getRoutes().filter(item => {
        let { hidden, parentId, level } = item.meta
        return hidden === false && +level === 3 && parentId === 'index'
    })
})

/* 定义函数 */
const menuClick = ({ key }) => {
    if (key === 'logout') {
        // 点击的是退出登录：清除Token、清除Vuex中的信息、跳转到登录页、提示
        storage.remove('TK')
        store.commit('clearVuex')
        message.success('您已安全退出')
        router.replace({
            path: `/user/login`,
            query: {
                to: encodeURIComponent(route.fullPath)
            }
        })
        return
    }
    // 跳转路由
    key = '/' + key.replace('-', '/')
    if (route.path !== key) router.push(key)
}
</script>

<template>
    <a-layout-header>
        <div class="content">
            <div class="left">
                <menu-unfold-outlined v-if="collapsed" @click="emit('update:collapsed', false)" />
                <menu-fold-outlined v-else @click="emit('update:collapsed', true)" />

                <a-breadcrumb>
                    <template v-for="item in route.matched" :key="item.name">
                        <a-breadcrumb-item v-if="item.meta.title">
                            <router-link :to="item.path">
                                {{ item.meta.title }}
                            </router-link>
                        </a-breadcrumb-item>
                    </template>
                </a-breadcrumb>
            </div>
            <div class="right">
                <a-dropdown placement="bottomRight" v-if="profile">
                    <span class="ant-pro-account-avatar">
                        <a-avatar size="small" :src="`https://iot.wumei.live/prod-api${profile.user.avatar}`" />
                        <span>{{ profile.user.nickName }}</span>
                    </span>
                    <template #overlay>
                        <a-menu @click="menuClick">
                            <MenuItem :children="routeList" :ignore="true" />
                            <a-menu-divider />
                            <a-menu-item key="logout">
                                <template #icon><logout-outlined /></template>
                                退出登录
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <div class="nav scrollActive">
            <nav-layout />
        </div>
    </a-layout-header>
</template>

<style lang="less" scoped>
.ant-layout-header {
    padding: 0;
    height: 80px;
    background-color: #FFF;

    .content,
    .nav {
        box-sizing: border-box;
        overflow: hidden;
    }

    .content {
        padding: 0 15px;
        height: 50px;
        line-height: 50px;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
            display: flex;
            align-items: center;

            .anticon-menu-unfold,
            .anticon-menu-fold {
                font-size: 18px;
                margin-right: 20px;
            }
        }

        .right {
            display: flex;
            align-items: center;
        }
    }

    .nav {
        margin: 0 15px;
        padding-top: 4px;
        height: 30px;
        overflow-x: auto;
    }
}

.ant-pro-account-avatar {
    display: flex;
    align-items: center;

    .ant-avatar {
        margin-right: 5px;
        width: 30px;
        height: 30px;
    }
}
</style>