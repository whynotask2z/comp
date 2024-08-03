import http from "./http"
const B = import.meta.env.VITE_BASIC_URL

// 获取地图标注信息
const queryDeviceAll = () => http.get(B + '/iot/device/all')

// 获取设备统计信息
const queryDeviceStatistic = () => http.get(B + '/iot/device/statistic')

// 获取信息栏的数据
const queryNoticeList = (pageNum = 1, pageSize = 4) => {
    return http.get(B + '/system/notice/list', {
        params: {
            pageNum,
            pageSize
        }
    })
}

// 获取Mqtt统计数据
const queryBashBoard = () => http.get(B + '/bashBoard/stats')

// 获取饼状图的统计数据
const queryMonitor = () => http.get(B + '/monitor/server')

export default {
    queryDeviceAll,
    queryDeviceStatistic,
    queryNoticeList,
    queryBashBoard,
    queryMonitor
}