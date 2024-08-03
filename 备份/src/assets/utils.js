/* 设定具备有效期的localStorage存储方案 */
export const storage = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify({
            time: +new Date(),
            value
        }));
    },
    get(key, cycle = 2592000000) {
        cycle = +cycle;
        if (isNaN(cycle)) cycle = 2592000000;
        let data = localStorage.getItem(key);
        if (!data) return null;
        let { time, value } = JSON.parse(data);
        if ((+new Date() - time) > cycle) {
            storage.remove(key);
            return null;
        }
        return value;
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

/* 日期格式化 */
export const formatTime = function formatTime(time, template) {
    try {
        if (typeof time !== "string") {
            time = new Date().toLocaleString('zh-CN', { hour12: false });
        }
        if (typeof template !== "string") {
            template = "{0}年{1}月{2}日 {3}:{4}:{5}";
        }
        let arr = [];
        if (/^\d{8}$/.test(time)) {
            let [, $1, $2, $3] = /^(\d{4})(\d{2})(\d{2})$/.exec(time);
            arr.push($1, $2, $3);
        } else {
            arr = time.match(/\d+/g);
        }
        return template.replace(/\{(\d+)\}/g, (_, $1) => {
            let item = arr[$1] || "00";
            if (item.length < 2) item = "0" + item;
            return item;
        });
    } catch (_) {
        return ''
    }
};

/* 导出API */
const utils = {
    storage,
    formatTime
};
export default utils;