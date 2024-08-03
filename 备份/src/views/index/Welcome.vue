<script setup>
import MapBaidu from './particle/Map.vue'
import Device from './particle/Device.vue'
import News from './particle/News.vue'
import * as echarts from 'echarts'
import useBasicHook from '@/hook'
const { ref, API, onBeforeMount } = useBasicHook()

const mqttBox = ref(null),
    cupRateBox = ref(null),
    memoryRateBox = ref(null),
    systemRateBox = ref(null)

// 获取柱状图数据
const substr = (num) => +String(num).substring(0, 3)
const optionsMqttBar = ({ retain_count, retain_total, subscription_count, subscription_total, session_count, session_total, connection_count, connection_total }) => {
    retain_total = substr(retain_total)
    subscription_total = substr(subscription_total)
    session_total = substr(session_total)
    connection_total = substr(connection_total)
    // 配置项
    let options = {
        title: {
            text: 'MQTT状态数据'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        yAxis: {
            type: 'value'
        },
        xAxis: {
            type: 'category',
            data: ['保留消息', '路由数量', '订阅数量', '会话数量', '连接数量']
        },
        toolbox: {
            show: true,
            feature: {
                magicType: { type: ['line', 'bar'] }
            }
        },
        series: [
            {
                name: '当前数量',
                type: 'bar',
                data: [retain_count, retain_count, subscription_count, session_count, connection_count]
            },
            {
                name: '累计总数',
                type: 'bar',
                data: [retain_total, retain_total, subscription_total, session_total, connection_total]
            }
        ]
    }
    return options
}
onBeforeMount(async () => {
    try {
        let { code, data } = await API.home.queryBashBoard()
        if (+code === 200) {
            let chart = echarts.init(mqttBox.value)
            chart.setOption(optionsMqttBar(data))
        }
    } catch (_) { }
})

// 获取饼状图的数据
const optionsPie = (title, data) => {
    let option = {
        title: {
            text: title
        },
        legend: {
            right: 0,
            orient: 'vertical'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/> {b} : {c}%'
        },
        series: [{
            name: title,
            type: 'pie',
            radius: [10, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 10
            },
            data: data
        }]
    }
    return option
}
onBeforeMount(async () => {
    try {
        let { code, data } = await API.home.queryMonitor()
        if (+code === 200) {
            let { cpu, mem } = data

            let chart1 = echarts.init(cupRateBox.value)
            chart1.setOption(optionsPie(
                'CPU使用率',
                [
                    { value: cpu.used, name: '用户' },
                    { value: cpu.sys, name: '系统' },
                    { value: cpu.free, name: '空闲' }
                ]
            ))

            let chart2 = echarts.init(memoryRateBox.value)
            chart2.setOption(optionsPie(
                '内存使用率',
                [
                    { value: mem.used, name: '已用' },
                    { value: mem.free, name: '剩余' }
                ]
            ))

            let chart3 = echarts.init(systemRateBox.value)
            chart3.setOption(optionsPie(
                '系统盘使用率',
                [
                    { value: 30.7, name: '已用' },
                    { value: 28.3, name: '可用' }
                ]
            ))
        }
    } catch (_) { }
})
</script>

<script>
export default {
    name: 'IndexWelcome'
}
</script>

<template>
    <div class="content">
        <MapBaidu class="map" />
        <div class="statistics">
            <Device class="device" />
            <News class="news" />
        </div>
    </div>
    <div class="echarts-box">
        <div class="mqtt" ref="mqttBox"></div>
        <div class="cup-rate" ref="cupRateBox"></div>
        <div class="memory-rate" ref="memoryRateBox"></div>
        <div class="system-rate" ref="systemRateBox"></div>
        <div class="seat"></div>
    </div>
</template>

<style lang="less" scoped>
.content {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .map {
        box-sizing: border-box;
        margin-right: 20px;
        width: calc((100% - 20px) / 2);
        height: 600px;
        background: url('@/assets/images/Loading_icon.gif') no-repeat center center #FFF;
        background-size: 30px 30px;
        border: 2px solid #FFF;
    }

    .statistics {
        box-sizing: border-box;
        width: calc((100% - 20px) / 2);

        .device,
        .news {
            box-sizing: border-box;
            padding: 15px;
            height: 290px;
            background: #FFF;
            overflow: hidden;
        }

        .news {
            margin-top: 20px;
        }
    }
}

.echarts-box {
    margin-top: 20px;
    padding: 20px 15px;
    padding-bottom: 0;
    background: #FFF;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    @w: calc((100% - 40px) / 3);

    &>div {
        flex-basis: @w;
        height: 350px;
        margin-bottom: 20px;
        background: url('@/assets/images/Loading_icon.gif') no-repeat center center #f9f9f9;
        background-size: 30px 30px;

        :deep(div) {
            background: #FFF;
        }

        &.mqtt {
            flex-basis: calc(@w * 2 + 20px);
        }

        &.seat {
            background: #FFF;
        }
    }
}
</style>