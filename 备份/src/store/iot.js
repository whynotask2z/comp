import API from "@/api"

const iot = {
    namespaced: true,
    state: {
        iotType: null,
        dataType: null
    },
    mutations: {
        setIotType(state, { list }) {
            state.iotType = list
        },
        setDataType(state, { list }) {
            state.dataType = list
        }
    },
    actions: {
        async setIotTypeAsync({ commit }) {
            let list = null
            try {
                let { code, data } = await API.iot.queryIotType()
                if (+code !== 200) data = []
                list = data.map(item => {
                    return {
                        label: item.dictLabel,
                        value: item.dictValue,
                        listClass: item.listClass
                    }
                })
                commit('setIotType', { list })
            } catch (_) { }
            return list
        },
        async setDataTypeAsync({ commit }) {
            let list = null
            try {
                let { code, data } = await API.iot.queryDataType()
                if (+code !== 200) data = []
                list = data.map(item => {
                    return {
                        label: item.dictLabel,
                        value: item.dictValue
                    }
                })
                commit('setDataType', { list })
            } catch (_) { }
            return list
        }
    }
}
export default iot