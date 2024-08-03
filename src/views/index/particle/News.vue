<script setup>
import { FieldTimeOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { formatTime } from '@/assets/utils'
import useBasicHook from '@/hook'
const { ref, onBeforeMount, API } = useBasicHook()

const noticeList = ref(null)
onBeforeMount(async () => {
    try {
        let { code, rows } = await API.home.queryNoticeList()
        if (+code === 200) {
            noticeList.value = rows
        }
    } catch (_) { }
})
</script>

<template>
    <div class="news-box">
        <h2 class="title">
            <field-time-outlined />
            最新信息
        </h2>
        <a-skeleton active v-if="!noticeList" />
        <div class="content" v-else>
            <div class="item" v-for="item in noticeList" :key="item.noticeId">
                <p class="title">
                    <a-tag :color="+item.noticeType === 2 ? 'orange' : 'blue'">
                        {{ +item.noticeType === 2 ? '公告' : '信息' }}
                    </a-tag>
                    {{ item.noticeTitle }}
                </p>
                <p class="time">
                    <clock-circle-outlined />
                    {{ formatTime(item.createTime, '{0}/{1}/{2}') }}
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.title {
    margin-bottom: 0;
    font-size: 18px;
    line-height: 50px;

    .anticon {
        font-size: 20px;
    }
}

.content {
    .item {
        display: flex;

        .title,
        .time {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            height: 52.5px;
            line-height: 52.5px;
        }

        .title {
            flex-basis: calc(100% - 120px);
            font-size: 15px;
        }

        .time {
            margin-left: 10px;
            margin-bottom: 0;
            flex-basis: 110px;
            text-align: right;
        }
    }
}
</style>