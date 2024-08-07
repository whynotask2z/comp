<template>
    <div id="app">
        <div>
            <h2>第一部分：数据列表</h2>
            <ul>
                <li v-for="item in firstData" :key="item.index" @click="fetchSecondData(item.index)">
                    {{ item.result }} <!-- 显示 result 字段 -->
                </li>
            </ul>
        </div>

        <div>
            <h2>第二部分：选择数据</h2>
            <el-checkbox-group v-model="selectedItems" @change="updateSelectedItems">
                <el-checkbox v-for="item in secondData" :key="item.id" :label="item">
                    {{ item.name }}
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <div>
            <h2>第三部分：已选择数据</h2>
            <ul>
                <li v-for="item in selectedItems" :key="item.id">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    setup() {
        const firstData = ref([]);
        const secondData = ref([]);
        const selectedItems = ref([]);

        // 加载第一个 div 的数据
        const fetchFirstData = async () => {
            try {
                const response = await axios.get('你的接口地址');
                firstData.value = response.data; // 假设返回的格式是数组
            } catch (error) {
                console.error(error);
            }
        };

        // 根据第一部分的数据请求第二部分的数据
        const fetchSecondData = async (index) => {
            try {
                const response = await axios.get(`你的第二部分接口/${index}`);
                secondData.value = response.data; // 假设返回的格式是数组
                selectedItems.value = []; // 清空已选择的项
            } catch (error) {
                console.error(error);
            }
        };

        // 更新已选择项目
        const updateSelectedItems = (value) => {
            selectedItems.value = value;
        };

        onMounted(fetchFirstData);

        return {
            firstData,
            secondData,
            selectedItems,
            fetchSecondData,
            updateSelectedItems,
        };
    }
};


const backendData = [
    { parentID: 1, result: { id: 1, key: 2, name: "3" } },
    { parentID: 2, result: { id: 1, key: 2, name: "3" } },
    { parentID: 5, result: { id: 2, key: 2, name: "9" } }
];

// 手上的数据
const myData = [
    { id: 1, key: 2, name: "3" },
    { id: 1, key: 2, name: "3" }
];

// 创建一个结果数组
const result = myData.map(item => {
    // 找到与当前项name匹配的backendData中的项
    const foundItem = backendData.find(data => data.result.name === item.name);

    // 如果找到了，就添加parentID属性
    if (foundItem) {
        return { ...item, parentID: foundItem.parentID };
    }

    // 如果没有找到，返回原始项
    return item;
});

// 输出结果
console.log(result);




//---------------


// 扁平化数据并将parentID赋值给result
const flattenedData = backendData.map(item => {
    // 创建一个新的对象，将parentID和result合并
    return {
        ...item.result,
        parentID: item.parentID
    };
});

// 输出结果
console.log(flattenedData);
</script>
  
<style>
/* 可以根据需要添加样式 */
</style>