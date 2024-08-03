<script setup>
import { UserOutlined, LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons-vue'
import { storage } from '@/assets/utils'
import useBasicHook from '@/hook'
const { reactive, ref, onBeforeMount, store, router, route, message, API } = useBasicHook()

// 定义状态
let seatChar = '********'
let originPassword = ''
const formIns = ref(null)
const state = reactive({
    customActiveKey: 'account',
    formData: {
        account: '',
        password: '',
        captcha: '',
        remember: true
    },
    formRules: {
        account: [{ required: true, message: '账号是必填项' }],
        password: [{
            validator: (_, value) => {
                if (value.length === 0) return Promise.reject('密码是必填项')
                if (value === seatChar) return Promise.resolve()
                let reg = /^.{6,16}$/
                if (!reg.test(value)) return Promise.reject('密码长度是6~16位')
                return Promise.resolve()
            }
        }],
        captcha: [{
            validator: (_, value) => {
                if (value.length === 0) {
                    return Promise.reject('验证码是必填项')
                }
                return Promise.resolve()
            }
        }]
    },
    image: {
        url: '',
        uuid: '',
        loading: false
    }
})

// 获取验证码
const captchaImg = async () => {
    if (state.image.loading) return
    state.image.loading = true
    try {
        let { code, img, uuid } = await API.queryCaptchaImage()
        if (+code === 200) {
            state.image.uuid = uuid
            state.image.url = `data:image/gif;base64,${img}`
        } else {
            message.error('获取验证码失败，请稍后再试')
        }
    } catch (_) { }
    state.image.loading = false
}
onBeforeMount(captchaImg)

// 处理记住的账号和密码
onBeforeMount(() => {
    let remember = storage.get('remember')
    if (!remember) return
    state.formData.account = remember.account
    state.formData.password = seatChar
    originPassword = remember.password
})

// 表单提交
const submit = async () => {
    try {
        // 手动触发表单校验
        await formIns.value.validate()

        let { formData: { account, password, captcha, remember }, image: { uuid } } = state
        if (password === seatChar) {
            // 密码框存储的是占位符：用户没有改过密码，把之前本地记录的，经过加密的密码传递给服务器
            password = originPassword
        } else {
            // 用户自己修改过密码：把用户自己输入的密码，经过MD5加密传递给服务器（此项目不需要）
        }
        // 向服务器发送请求
        let { code, token } = await API.userLogin({
            username: account,
            password,
            code: captcha,
            uuid
        })
        if (+code !== 200) {
            // 登录失败：清除验证码 & 重新生成验证码
            message.error('本次登录失败，请检查您的账号密码及验证码！')
            state.formData.captcha = ''
            captchaImg()
        } else {
            // 登录成功：存储Token && 把登录者信息存储到vuex中「登录态校验」&& 记住账号/密码 && 提示 && 跳转
            storage.set('TK', token)
            await store.dispatch('setProfileAsync')
            if (remember) {
                // 记住账号
                storage.set('remember', {
                    account,
                    password
                })
            } else {
                // 移除记住的账号
                storage.remove('remember')
            }
            message.success('恭喜您，登录成功！')
            let to = route.query.to
            to ? router.replace(decodeURIComponent(to)) : router.push('/')
        }
    } catch (_) { }
}
</script>

<template>
    <div class="main">
        <a-form :model="state.formData" :rules="state.formRules" ref="formIns" validateTrigger="blur"
            class="user-layout-login">
            <a-tabs :activeKey="state.customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
                <a-tab-pane key="account" tab="账号密码登录">
                    <a-form-item name="account">
                        <a-input v-model:value.trim="state.formData.account" size="large" type="text" placeholder="请输入账号">
                            <template #prefix><user-outlined /></template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input-password v-model:value.trim="state.formData.password" size="large" placeholder="请输入密码">
                            <template #prefix><lock-outlined /></template>
                        </a-input-password>
                    </a-form-item>
                    <a-row :gutter="16">
                        <a-col :span="16">
                            <a-form-item name="captcha">
                                <a-input v-model:value.trim="state.formData.captcha" size="large" type="text"
                                    placeholder="请输入验证码">
                                    <template #prefix><mail-outlined /></template>
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <div class="captcha" @click="captchaImg">
                                <img v-if="state.image.url" :src="state.image.url" alt="">
                                <a-spin size="small" tip="加载中..." v-if="state.image.loading" />
                            </div>
                        </a-col>
                    </a-row>
                </a-tab-pane>

                <a-tab-pane key="phone" tab="手机号登录">
                    <a-form-item>
                        <a-input size="large" type="text" placeholder="请输入手机号">
                            <template #prefix><mobile-outlined /></template>
                        </a-input>
                    </a-form-item>
                    <a-row :gutter="16">
                        <a-col :span="16">
                            <a-form-item>
                                <a-input size="large" type="text" placeholder="请输入验证码">
                                    <template #prefix><mail-outlined /></template>
                                </a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-button class="getCaptcha">发送验证码</a-button>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>

            <a-form-item name="remember">
                <a-checkbox v-model:checked="state.formData.remember">记住密码</a-checkbox>
            </a-form-item>
            <a-form-item style="margin-top:24px">
                <a-button-again size="large" type="primary" class="login-button" @click="submit">
                    登录
                </a-button-again>
            </a-form-item>
        </a-form>
    </div>
</template>

<style lang="less" scoped>
.main {
    min-width: 260px;
    width: 368px;
    margin: 0 auto;
}

.user-layout-login {
    label {
        font-size: 14px;
    }

    .getCaptcha {
        display: block;
        width: 100%;
        height: 40px;
    }

    button.login-button {
        padding: 0 15px;
        font-size: 16px;
        height: 40px;
        width: 100%;
    }

    :deep(.ant-input-prefix) {
        color: rgba(0, 0, 0, .25);
    }

    .captcha {
        position: relative;
        height: 40px;
        background: #DDD;

        .ant-spin {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 10;
            transform: translate(-50%, -50%);

            :deep(.ant-spin-text) {
                font-size: 12px;
            }
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}

:deep(.ant-tabs-nav-list) {
    .ant-tabs-tab:nth-of-type(2) {
        color: #BBB;
        cursor: default;
    }
}
</style>
