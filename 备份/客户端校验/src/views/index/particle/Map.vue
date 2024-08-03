<script setup>
// https://lbsyun.baidu.com/index.php
import useBasicHook from '@/hook'
const { ref, onMounted, onBeforeMount, API } = useBasicHook()

let map = null
const mapBox = ref(null)
const createPoint = (map, { lan, lat, item }) => {
    // 绘制坐标点
    let point = new BMapGL.Point(lan, lat)
    let marker = new BMapGL.Marker3D(point, 0, {
        size: 18,
        shape: 1,
        fillColor: '#34bfa3',
        fillOpacity: .8
    })
    map.addOverlay(marker)
    // 详细信息
    let info = new BMapGL.InfoWindow(`<div class="map-device-info">
            <p>设备名称：<span>${item.deviceName}</span></p>
            <p>设备编号：${item.serialNumber}</p>
            <p>所在地址：${item.networkAddress}</p>
        </div>`, {
        width: 200,
        height: 100,
        title: `<h2 class="map-device-info">设备详细信息</h2>`
    })
    marker.addEventListener("click", () => map.openInfoWindow(info, point))
}

// 第一次加载完毕，直接把地图先画出来
onMounted(() => {
    if (!mapBox.value) return
    map = new BMapGL.Map(mapBox.value)  // 创建地图实例 
    let point = new BMapGL.Point(103.38861, 35.86166)  // 创建点坐标 
    map.centerAndZoom(point, 5) // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true)  //开启鼠标滚轮缩放    
})

// 第一次渲染之前，从服务器获取标注点的数据
onBeforeMount(async () => {
    try {
        let { code, rows } = await API.home.queryDeviceAll()
        if (+code === 200 && map) {
            // 按照获取的数据，循环创建标注点
            rows.forEach(item => {
                createPoint(map, {
                    lan: item.longitude,
                    lat: item.latitude,
                    item
                })
            })
        }
    } catch (_) { }
})
</script>

<template>
    <div class="map-box" ref="mapBox"></div>
</template>

<style lang="less" scoped></style>