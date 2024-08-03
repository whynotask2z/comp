import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginImp from 'vite-plugin-imp'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  /* 返回的是VITE的配置项 */
  return {
    /* 使用插件 */
    plugins: [
      vue(),
      vueJsx(),
      vitePluginImp({
        libList: [
          {
            libName: 'lodash',
            libDirectory: '',
            camel2DashComponentName: false
          }
        ]
      })
    ],
    /* 基础配置 */
    base: './',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    /* 服务配置 */
    server: {
      host: '127.0.0.1',
      open: true,
      proxy: {
        [env.VITE_BASIC_URL]: {
          target: 'https://iot.wumei.live/prod-api',
          changeOrigin: true,
          rewrite: (path) => {
            let reg = new RegExp(`^${env.VITE_BASIC_URL}`)
            return path.replace(reg, '')
          }
        }
      }
    },
    /* 构建选项 */
    build: {
      assetsInlineLimit: 1024 * 10,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      },
      reportCompressedSize: false
    },
    /* CSS样式的处理 */
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {

          }
        }
      }
    }
  }
})
