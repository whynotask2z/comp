import http from "./http"
import home from "./home"
import iot from "./iot"
const BASIC_URL = import.meta.env.VITE_BASIC_URL
// const OTHER_URL = import.meta.env.VITE_OTHER_URL

// 获取验证码
const queryCaptchaImage = () => http.get(BASIC_URL + '/captchaImage')

// 用户登录
const userLogin = (data) => http.post(BASIC_URL + '/login', data)

// 获取登录者信息
const getUserInfo = () => http.get(BASIC_URL + '/getInfo')

/* 暴露API */
const API = {
    home,
    iot,
    queryCaptchaImage,
    userLogin,
    getUserInfo
}
export default API