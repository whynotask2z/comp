import http from "./http"
const B = import.meta.env.VITE_BASIC_URL

// 获取物模型类别
const queryIotType = () => http.get(B + '/system/dict/data/type/iot_things_type')

// 获取数据类型
const queryDataType = () => http.get(B + '/system/dict/data/type/iot_data_type')

// 获取数据列表「带搜索和分页」
const queryIotList = (pageNum, pageSize, templateName, type) => {
    type = +type
    let params = {
        pageNum,
        pageSize
    }
    if (templateName) params.templateName = templateName
    if (!isNaN(type) && type !== 0) params.type = type
    return http.get(B + '/iot/template/list', {
        params
    })
}

// 获取某条数据的详细信息
const queryIotInfo = (templateId) => http.get(B + `/iot/template/${templateId}`)

// 新增物模型信息
const defaultBody = {
    templateId: null,
    templateName: "",
    identifier: "",
    modelOrder: 0,
    type: "1",
    isChart: 1,
    isMonitor: 1,
    isReadonly: 1,
    isHistory: 1,
    datatype: "integer",
    createBy: "fastbee",
    specs: '{"type":"integer","min":1,"max":10,"unit":"","step":1}',
    isSys: null,
    userId: null,
    userName: null,
    tenantId: null,
    tenantName: null,
    delFlag: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
}
const insertTemplate = (body) => {
    body = Object.assign(defaultBody, body)
    return http.post(B + `/iot/template`, body)
}

// 修改物模型信息「无权限」
const updateTemplate = (body) => {
    body = Object.assign(defaultBody, body)
    return http.put(B + `/iot/template`, body)
}

// 删除物模型信息「瞎猜的」
const removeTemplate = (ids) => {
    if (!Array.isArray(ids)) ids = [ids]
    return http.delete(B + `/iot/template`, {
        data: {
            ids
        }
    })
}

export default {
    queryIotType,
    queryDataType,
    queryIotList,
    queryIotInfo,
    insertTemplate,
    updateTemplate,
    removeTemplate
}