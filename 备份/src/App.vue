<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
</script>

<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>

<style lang="less">
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

/* 修改滚动条的样式 */
.scrollActive {

  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0);
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background: #96969748;
    }
  }
}

/* 修改气泡框样式 */
.tablist-popover {

  .ant-popover-content {
    border-radius: 5px;
  }

  .ant-popover-inner-content {
    padding: 5px 0;

    .ant-menu {
      border-right: none;
    }

    .ant-menu-item {
      margin: 0;
      padding: 0px 10px;
      height: 30px;
      line-height: 30px;
      font-size: 12px;

      .ant-menu-title-content {
        margin-left: 0px;
      }
    }
  }
}

/* 百度地图提示框 */
.map-device-info {
  p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 30px;
    font-size: 14px;
    margin-bottom: 0;

    span {
      color: #36a3f7;
    }
  }
}

.map-device-info {
  font-size: 16px;
}
</style>