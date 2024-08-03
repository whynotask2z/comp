import axios from "axios"
import { message } from "ant-design-vue"
import { storage } from '@/assets/utils'

const http = axios.create({
    baseURL: '',
    timeout: 60000
})

const safeURL = ['/captchaImage', '/login']
http.interceptors.request.use(config => {
    let url = config.url
    url = url.replace(/^\/[^\/]+/, '') //如果获取的地址带着前缀，我们则把前缀去掉
    if (safeURL.includes(url)) {
        // 不需要传递Token
        config.headers['isToken'] = 'false'
    } else {
        // 需要传递Token
        let token = storage.get('TK')
        if (token) {
            config.headers['Authorization'] = token
        }
    }
    return config
})

http.interceptors.response.use(response => {
    return response.data
}, reason => {
    message.error('当前网络繁忙，请稍后重试！')
    return Promise.reject(reason)
})

export default http