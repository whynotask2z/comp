<script setup>
import { PlusOutlined, MinusOutlined, DownloadOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import * as XLSX from 'xlsx'
import { formatTime } from '@/assets/utils'
import TemplateType from './TemplateType'
import cloneDeep from 'lodash/cloneDeep'
import useBasicHook from '@/hook'
const { computed, store, onBeforeMount, reactive, API, ref, message } = useBasicHook()
// test git?
/* 表格列的配置项 */
const columns = [{
    title: '名称',
    width: '8%',
    align: 'center',
    dataIndex: 'templateName',
    ellipsis: true
}, {
    title: '标识符',
    width: '8%',
    align: 'center',
    dataIndex: 'identifier',
    ellipsis: true
}, {
    title: '图表展示',
    width: '8%',
    align: 'center',
    dataIndex: 'isChart',
    ellipsis: true,
    customRender: ({ text }) => +text === 1 ? '是' : '否'
}, {
    title: '实时监测',
    width: '8%',
    align: 'center',
    dataIndex: 'isMonitor',
    ellipsis: true,
    customRender: ({ text }) => +text === 1 ? '是' : '否'
}, {
    title: '只读',
    width: '6%',
    align: 'center',
    dataIndex: 'isReadonly',
    ellipsis: true,
    customRender: ({ text }) => +text === 1 ? '是' : '否'
}, {
    title: '物模型识别',
    width: '10%',
    align: 'center',
    key: 'type',
    ellipsis: true
}, {
    title: '数据类型',
    width: '8%',
    align: 'center',
    dataIndex: 'datatype',
    ellipsis: true,
    customRender: ({ text }) => {
        let item = dataTypeOptions.value.find(item => item.value === text)
        return item ? item.label : ''
    }
}, {
    title: '数据定义',
    width: '14%',
    key: 'specs',
    ellipsis: true
}, {
    title: '排序',
    width: '6%',
    align: 'center',
    dataIndex: 'modelOrder',
    ellipsis: true
}, {
    title: '创建时间',
    width: '10%',
    dataIndex: 'createTime',
    ellipsis: true,
    customRender: ({ text }) => formatTime(text, '{0}/{1}/{2}')
}, {
    title: '操作',
    key: 'action'
}]

/* 表格相关的业务逻辑 */
const initTable = async () => {
    // 向服务器发送请求，获取Table表格需要的数据
    stateTable.loading = true
    try {
        let { pagination: { current, pageSize }, templateName, type } = stateTable
        let { code, rows, total } = await API.iot.queryIotList(current, pageSize, templateName, type)
        if (+code !== 200) {
            stateTable.dataSource = []
        } else {
            stateTable.pagination.total = +total
            stateTable.dataSource = rows.map(item => {
                try {
                    item.specs = JSON.parse(item.specs)
                } catch (_) {
                    item.specs = { max: 0, min: 0, step: 0, unit: '' }
                }
                item.key = +item.templateId //用于全选的操作
                return item
            })
        }
    } catch (_) { }
    stateTable.loading = false
}
const templateInputEnter = () => {
    // 搜索框按下Enter键开始搜索
    stateTable.pagination.current = 1
    initTable()
}
const iotTypeChange = () => {
    // 模型类别下拉框选择改变后开始搜索
    stateTable.pagination.current = 1
    initTable()
}
const paginationSizeChange = (_, size) => {
    // 每页展示条数发生改变
    stateTable.pagination.current = 1
    stateTable.pagination.pageSize = +size
    initTable()
}
const paginationChange = (page) => {
    // 展示的页码发生改变
    if (stateTable.loading) return
    stateTable.pagination.current = +page
    initTable()
}
const selectionChange = (selectedRowKeys) => {
    // 全选和非全选
    stateTable.selection.selectedRowKeys = selectedRowKeys
}
const handleDeleteRequest = async (ids) => {
    try {
        let { code } = await API.iot.removeTemplate(ids)
        if (+code === 200) {
            message.success('恭喜您，删除成功')
            initTable()
        } else {
            message.error('很遗憾，删除失败，请稍后再试')
        }
    } catch (_) { }
}
const handleDelateAll = () => {
    // 批量删除
    let { selectedRowKeys } = stateTable.selection
    if (selectedRowKeys.length === 0) {
        message.warning('请您至少选择一项要操作的数据')
        return
    }
    Modal.confirm({
        title: `您确定要删除这 ${selectedRowKeys.length} 项记录吗？`,
        onOk: () => {
            handleDeleteRequest(selectedRowKeys)
        }
    })
}
const handleDelete = (record) => {
    if (!store.state.profile.permissions.includes('iot:template:delete')) {
        // 没有操作的权限
        message.warning('您无此操作权限，请联系管理员')
        return
    }
    // 点击某一项的删除
    handleDeleteRequest(record.templateId)
}
const handleDownloadExcel = () => {
    // 下载为Excel
    let { selectedRowKeys } = stateTable.selection
    if (selectedRowKeys.length === 0) {
        message.warning('请您至少选择一项要操作的数据')
        return
    }
    Modal.confirm({
        title: `您确定要下载这 ${selectedRowKeys.length} 项记录吗？`,
        onOk: () => {
            let rows = stateTable.dataSource.filter(item => {
                return selectedRowKeys.includes(+item.templateId)
            }).map(item => {
                return [
                    item.templateId,
                    item.templateName,
                    item.identifier
                ]
            })
            let data = [
                ['编号', '名称', '标识符'],
                ...rows
            ]
            const worksheet = XLSX.utils.aoa_to_sheet(data)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
            XLSX.writeFile(workbook, `wumei-template-${+new Date()}.xlsx`);
        }
    })
}
const handleUpdate = async (record) => {
    let { templateId, templateName, identifier, modelOrder, type, isChart, isHistory, isMonitor, isReadonly, datatype, specs } = record
    // 点击某一项的修改
    stateForm.visible = true
    stateForm.templateId = templateId
    // 把本条记录的详细信息，填充到各个表单中
    /* 
    try {
        let { code, data } = await API.iot.queryIotInfo(record.templateId)
        if (+code === 200) {
            record = data;
        }
    } catch (_) { } 
    */
    stateForm.data.templateName = templateName
    stateForm.data.identifier = identifier
    stateForm.data.modelOrder = modelOrder
    stateForm.data.type = String(type)
    radioGroupChange(String(type))
    let feature = []
    if (+isChart === 1) feature.push('isChart')
    if (+isHistory === 1) feature.push('isHistory')
    if (+isMonitor === 1) feature.push('isMonitor')
    if (+isReadonly === 1) feature.push('isReadonly')
    stateForm.data.feature = feature
    stateForm.data.datatype = datatype
    stateForm.data.min = specs.min
    stateForm.data.max = specs.max
    stateForm.data.unit = specs.unit
    stateForm.data.step = specs.step
}
const stateTable = reactive({
    templateName: '',
    type: '0',
    dataSource: [],
    loading: false,
    // 全选的配置项
    selection: {
        selectedRowKeys: [],
        onChange: selectionChange
    },
    // 分页的配置项
    pagination: {
        size: 'small',
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        pageSize: 10,
        current: 1,
        onShowSizeChange: paginationSizeChange,
        onChange: paginationChange
    }
})
const iotTypeOptions = computed(() => {
    let arr = store.state.iot.iotType
    if (!arr) arr = []
    arr = [...arr]
    arr.unshift({ label: '全部', value: '0' })
    return arr
})
const dataTypeOptions = computed(() => (store.state.iot.dataType || []))
onBeforeMount(async () => {
    // 判断Vuex中是否存储相应的type数据「如果没有则派发」
    let { iotType, dataType } = store.state.iot
    if (!iotType) store.dispatch('iot/setIotTypeAsync')
    if (!dataType) store.dispatch('iot/setDataTypeAsync')
    // 向服务器发送请求，获取数据
    initTable()
})

/* 表单相关的业务逻辑 */
const defaultFeature = [{
    label: '图表展示',
    value: 'isChart',
    disabled: false
}, {
    label: '实时监测',
    value: 'isMonitor',
    disabled: false
}, {
    label: '只读数据',
    value: 'isReadonly',
    disabled: false
}, {
    label: '历史存储',
    value: 'isHistory',
    disabled: false
}]
const closeModal = () => {
    // 关闭Modal层
    stateForm.visible = false
    stateForm.confirmLoading = false
    stateForm.templateId = ''
    formIns.value.resetFields() //只用它清除校验信息即可
    stateForm.data = { //手动清除到我们认为的初始信息
        templateName: '',
        identifier: '',
        modelOrder: 0,
        type: '1',
        feature: ['isChart', 'isMonitor', 'isReadonly', 'isHistory'],
        datatype: 'integer',
        min: 0,
        max: 100,
        unit: '',
        step: 1
    }
}
const submit = async () => {
    try {
        await formIns.value.validate()
        stateForm.confirmLoading = true
        // 获取请求主体的信息
        let body = {
            templateName: stateForm.data.templateName,
            identifier: stateForm.data.identifier,
            modelOrder: stateForm.data.modelOrder,
            type: stateForm.data.type,
            datatype: stateForm.data.datatype,
            createBy: store.state.profile.user.userName
        }
        let feature = stateForm.data.feature
        body.isChart = feature.includes('isChart') ? 1 : 0
        body.isMonitor = feature.includes('isMonitor') ? 1 : 0
        body.isReadonly = feature.includes('isReadonly') ? 1 : 0
        body.isHistory = feature.includes('isHistory') ? 1 : 0
        body.specs = JSON.stringify({
            type: stateForm.data.datatype,
            min: stateForm.data.min,
            max: stateForm.data.max,
            step: stateForm.data.step,
            unit: stateForm.data.unit
        })
        // 区分新增还是修改
        let callback = API.iot.insertTemplate
        if (stateForm.templateId) {
            body.templateId = stateForm.templateId
            callback = API.iot.updateTemplate
        }
        // 向服务器发送请求
        let { code } = await callback(body)
        if (+code === 200) {
            message.success('恭喜您，当前操作成功')
            closeModal()
            if (!stateForm.templateId) {
                // 如果是新增，一切从头开始获取
                stateTable.templateName = ''
                stateTable.type = '0'
                stateTable.pagination.current = 1
            }
            initTable()
        } else {
            message.error('很遗憾，当前操作失败，请稍后再试')
        }
    } catch (_) { }
    stateForm.confirmLoading = false
}
const radioGroupChange = (e) => {
    let value = typeof e === 'string' ? e : e.target.value
    if (value === '1') {
        stateForm.featureOptions = defaultFeature
        if (!stateForm.templateId) {
            stateForm.data.feature = ['isChart', 'isMonitor', 'isReadonly', 'isHistory']
        }
        return
    }
    if (value === '2') {
        if (!stateForm.templateId) {
            stateForm.data.feature = ['isHistory']
        }
        stateForm.featureOptions = defaultFeature.filter(item => {
            return item.value === 'isReadonly' || item.value === 'isHistory'
        })
        return
    }
    if (value === '3') {
        if (!stateForm.templateId) {
            stateForm.data.feature = ['isReadonly', 'isHistory']
        }
        stateForm.featureOptions = cloneDeep(defaultFeature)
            .filter(item => {
                return item.value === 'isReadonly' || item.value === 'isHistory'
            })
            .map(item => {
                if (item.value === 'isReadonly') {
                    item.disabled = true
                }
                return item
            })
        return
    }
}
const formIns = ref(null)
const stateForm = reactive({
    visible: false,
    confirmLoading: false,
    templateId: '', //空:新增  不为空:修改
    featureOptions: defaultFeature,
    data: {
        templateName: '',
        identifier: '',
        modelOrder: 0,
        type: '1',
        feature: ['isChart', 'isMonitor', 'isReadonly', 'isHistory'],
        datatype: 'integer',
        min: 0,
        max: 100,
        unit: '',
        step: 1
    },
    rules: {
        templateName: [{ required: true, message: '模型名称是必填项' }],
        identifier: [{ required: true, message: '模型标识是必填项' }],
        modelOrder: [{ required: true, message: '模型排序是必填项' }]
    }
})

</script>

<template>
    <div class="filter-box">
        <div class="filter">
            <div class="form-item">
                <label>名称</label>
                <a-input placeholder="请输入物模型名称" @pressEnter="templateInputEnter"
                    v-model:value.trim="stateTable.templateName" />
            </div>
            <div class="form-item">
                <label>类别</label>
                <a-select :options="iotTypeOptions" v-model:value="stateTable.type" @change="iotTypeChange" />
            </div>
        </div>
        <div class="handler">
            <a-button type="primary" ghost @click="stateForm.visible = true" v-power="`iot:template:add`">
                <template #icon><plus-outlined /></template>
                新增
            </a-button>
            <a-button type="primary" ghost danger @click="handleDelateAll" v-power="`iot:template:delete`">
                <template #icon><minus-outlined /></template>
                删除
            </a-button>
            <a-button type="primary" ghost class="download" @click="handleDownloadExcel">
                <template #icon><download-outlined /></template>
                下载
            </a-button>
        </div>
    </div>

    <div class="table-box">
        <a-table :columns="columns" :dataSource="stateTable.dataSource" :loading="stateTable.loading"
            :pagination="stateTable.pagination" :row-selection="stateTable.selection">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'type'">
                    <TemplateType :type="record.type" :arr="iotTypeOptions" />
                </template>
                <template v-if="column.key === 'specs'">
                    <div class="specs-box">
                        <p class="specs-item">
                            <span>最大值:</span>
                            <span>{{ record.specs.max }}</span>
                        </p>
                        <p class="specs-item">
                            <span>步长:</span>
                            <span>{{ record.specs.step }}</span>
                        </p>
                        <p class="specs-item">
                            <span>最小值:</span>
                            <span>{{ record.specs.min }}</span>
                        </p>
                        <p class="specs-item">
                            <span>单位:</span>
                            <span>{{ record.specs.unit }}</span>
                        </p>
                    </div>
                </template>
                <template v-if="column.key === 'action'">
                    <a-button type="link" @click="handleUpdate(record)">修改</a-button>
                    <a-popconfirm title="您确定要删除这一项吗？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                        <a-button type="link" danger>删除</a-button>
                    </a-popconfirm>
                </template>
            </template>
        </a-table>
    </div>

    <a-modal centered okText="确认提交" :keyboard="false" :maskClosable="false" :visible="stateForm.visible"
        :title="`${stateForm.templateId ? '编辑' : '新增'}通用物模型`" :confirmLoading="stateForm.confirmLoading"
        :afterClose="closeModal" @ok="submit" @cancel="closeModal">

        <a-form :model="stateForm.data" :rules="stateForm.rules" ref="formIns" :labelCol="{ span: 4 }"
            validateTrigger="blur">
            <a-form-item label="模型名称" name="templateName">
                <a-input v-model:value.trim="stateForm.data.templateName" placeholder="请输入物模型名称，例如：温度" />
            </a-form-item>
            <a-form-item label="模型标识" name="identifier">
                <a-input v-model:value.trim="stateForm.data.identifier" placeholder="请输入标识符，例如：temperature" />
            </a-form-item>
            <a-form-item label="模型排序" name="modelOrder">
                <a-input-number v-model:value="stateForm.data.modelOrder" :min="0" />
            </a-form-item>
            <a-form-item label="模型类别">
                <a-radio-group v-model:value="stateForm.data.type" @change="radioGroupChange">
                    <template v-for="item in iotTypeOptions" :key="item.value">
                        <a-radio-button v-if="item.value !== '0'" :value="item.value">
                            {{ item.label }}
                        </a-radio-button>
                    </template>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="模型特性">
                <a-checkbox-group v-model:value="stateForm.data.feature" name="feature"
                    :options="stateForm.featureOptions" />
            </a-form-item>
            <a-divider />
            <a-form-item label="数据类型">
                <a-select v-model:value="stateForm.data.datatype" :options="dataTypeOptions" style="width: 40%;"></a-select>
            </a-form-item>
            <a-form-item label="取值范围">
                <a-input-number v-model:value="stateForm.data.min" :min="0" :max="100" placeholder="最小值" />
                &nbsp; 到 &nbsp;
                <a-input-number v-model:value="stateForm.data.max" :min="0" :max="100" placeholder="最大值" />
            </a-form-item>
            <a-form-item label="单位">
                <a-input v-model:value.trim="stateForm.data.unit" placeholder="请输入单位，例如：米" style="width: 40%;" />
            </a-form-item>
            <a-form-item label="步长">
                <a-input-number v-model:value="stateForm.data.step" placeholder="请输入步长" style="width: 40%;" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style lang="less" scoped>
.filter-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #FFF;

    .handler {
        display: flex;

        .ant-btn {
            margin-left: 10px;
        }

        .download {
            color: #52C41A;
            border-color: #52C41A;

            &:hover,
            &:focus {
                color: lighten(#52C41A, 3%);
                border-color: lighten(#52C41A, 3%);
            }
        }
    }

    .filter {
        display: flex;
        flex-wrap: wrap;

        .form-item {
            display: flex;
            align-items: center;
            margin-right: 20px;
            height: 40px;

            label {
                padding: 0 10px;
                width: auto;
            }

            .ant-input {
                width: 240px;
            }

            .ant-select {
                width: 150px;
            }
        }
    }
}

.table-box {
    margin-top: 10px;
    padding: 15px;
    background: #FFF;

    .ant-btn-link {
        padding: 0 3px;
    }

    :deep(.ant-table-cell) {
        padding: 10px;
    }
}

.specs-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .specs-item {
        margin-bottom: 0;
        width: 62%;
        line-height: 20px;
        font-size: 12px;

        &:nth-child(2n) {
            width: 34%;
        }

        span {
            &:nth-child(2) {
                color: #F56C6C;
            }
        }
    }
}

@media all and (max-width: 1100px) {
    .filter-box {
        display: block;

        .handler {
            margin-top: 10px;
        }
    }
}
</style>