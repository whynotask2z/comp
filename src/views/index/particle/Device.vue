<script setup>
import { BarChartOutlined, BarsOutlined, LineChartOutlined, DotChartOutlined, AlertOutlined, CalendarOutlined, HeatMapOutlined } from '@ant-design/icons-vue'
import useBasicHook from '@/hook'
const { ref, onBeforeMount, API } = useBasicHook()

const info = ref(null)
onBeforeMount(async () => {
    try {
        let { code, data } = await API.home.queryDeviceStatistic()
        if (+code === 200) {
            info.value = data
        }
    } catch (_) { }
})
</script>

<template>
    <div class="device-box">
        <h2 class="title">
            <bar-chart-outlined />
            设备统计
        </h2>
        <a-skeleton active v-if="!info" />
        <div class="content" v-else>
            <div class="item">
                <div class="icon"><bars-outlined /></div>
                <div class="text">
                    <span>设备数量</span>
                    <span>{{ info.deviceCount }}</span>
                </div>
            </div>
            <div class="item">
                <div class="icon"><line-chart-outlined /></div>
                <div class="text">
                    <span>监测数据</span>
                    <span>{{ info.monitorCount }}</span>
                </div>
            </div>
            <div class="item">
                <div class="icon"><dot-chart-outlined /></div>
                <div class="text">
                    <span>产品数量</span>
                    <span>{{ info.productCount }}</span>
                </div>
            </div>
            <div class="item">
                <div class="icon"><alert-outlined /></div>
                <div class="text">
                    <span>告警数量</span>
                    <span>{{ info.alertCount }}</span>
                </div>
            </div>
            <div class="item">
                <div class="icon"><calendar-outlined /></div>
                <div class="text">
                    <span>操作记录</span>
                    <span>{{ info.functionCount }}</span>
                </div>
            </div>
            <div class="item">
                <div class="icon"><heat-map-outlined /></div>
                <div class="text">
                    <span>上报事件</span>
                    <span>{{ info.eventCount }}</span>
                </div>
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
        box-sizing: border-box;
        flex-basis: calc((100% - 10px) / 2);
        height: 63px;
        padding: 0 10px;
        margin-bottom: 10px;
        border: 1px solid #F1F1F1;

        &:nth-last-child(1),
        &:nth-last-child(2) {
            margin-bottom: 0;
        }

        display: flex;
        justify-content: space-between;
        align-items: center;

        .icon {
            box-sizing: border-box;
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 26px;
            color: #36a3f7;
            transition: all .6s;
        }

        .text {
            span {
                display: block;
                line-height: 25px;
                text-align: right;
                font-size: 14px;
                color: #555;

                &:nth-child(2) {
                    font-weight: bold;
                    font-size: 16px;
                }
            }
        }

        &:nth-child(2n) {
            .icon {
                color: #f56c6c;
            }
        }

        &:hover {
            .icon {
                background: #36a3f7;
                color: #FFF;
            }

            &:nth-child(2n) {
                .icon {
                    background: #f56c6c;
                }
            }
        }
    }
}
</style>