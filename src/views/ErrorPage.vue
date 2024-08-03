<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
    <a-result status="404" title="404" sub-title="非常抱歉，您访问的页面不存在！">
        <template #extra>
            <a-button type="primary" @click="router.push('/')">首页</a-button>
            <a-button @click="router.go(-1)">上一页</a-button>
        </template>
    </a-result>
</template>

<style lang="less" scoped></style>