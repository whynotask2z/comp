<script setup>
import MenuLayout from './layout/MenuLayout.vue'
import HeaderLayout from './layout/HeaderLayout.vue';
import { ref } from 'vue'

const collapsed = ref(true)
</script>

<template>
    <a-layout class="container">
        <a-layout-sider collapsible :collapsed="collapsed" :trigger="null">
            <router-link to="/" :class="{ logo: true, hidden: collapsed }">
                <img src="~@/assets/images/logo.gif" alt="">
                <span>FastBee</span>
            </router-link>
            <menu-layout />
        </a-layout-sider>
        <a-layout>
            <header-layout v-model:collapsed="collapsed" />
            <a-layout-content class="scrollActive">
                <router-view />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<style lang="less" scoped>
.container {
    height: 100%;
    overflow: hidden;

    .logo {
        display: block;
        box-sizing: border-box;
        padding: 5px 15px;
        height: 50px;
        line-height: 40px;
        overflow: hidden;

        &.hidden {
            text-align: center;

            img {
                margin-right: 0;
            }

            span {
                display: none;
            }
        }

        img {
            margin-right: 5px;
            vertical-align: middle;
            width: 40px;
            height: 40px;
        }

        span {
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            font-weight: lighter;
            color: #FFF;
            letter-spacing: 2px;
        }
    }
}

.ant-layout-content {
    box-sizing: border-box;
    margin: 10px;
    height: calc(100vh - 100px);
    overflow-x: hidden;
    overflow-y: auto;
}
</style>