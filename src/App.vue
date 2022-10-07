<!-- CloudMusic -->
<template>
  <!-- 布局 -->
  <Layout />
  <!-- 消息 -->
  <Message />
  <!-- 私信 -->
  <PrivateMsg />
  <!-- 歌曲详情 -->
  <SongDetail />
  <!-- 播放列表 -->
  <PlayList />
</template>

<script setup lang="ts">
import Layout from "@/layout/index.vue";
import Message from "@/pages/drawer/message/message.vue";
import PlayList from "@/pages/drawer/playList/playList.vue";
import SongDetail from "@/pages/drawer/songDetail/songDetail.vue";
import PrivateMsg from "@/pages/drawer/privateMsg/privateMsg.vue";
import { useThrottleFn } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { useMainStore } from "store";
import { onMounted } from "vue";
import { SongAPI } from "api";
const store = useMainStore();

let getLikeSongList = async () => {
  try {
    if (!store.likeList.length) {
      let { code, ids }: any = await SongAPI.getLikeList(store.accountInfo.id);
      if (code == 200) store.likeList.push(...ids);
    }
  } catch (err: any) {
    ElMessage.error("加载喜欢音乐列表失败!");
  }
}

onMounted(() => {
  // 生产模式下强制升级http请求为https
  if (import.meta.env.MODE == "production") {
    let Meta = document.createElement("meta");
    Meta.httpEquiv = "Content-Security-Policy";
    Meta.content = "upgrade-insecure-requests";
    document.getElementsByTagName("head")[0].appendChild(Meta);
  }
  // 初始化主题
  document.documentElement.style.setProperty("--theme-color", store.themeColor);
  // 初始化 --100vh 高度
  document.documentElement.style.setProperty("--100vh", `${window.innerHeight}px`);
  // 初始化 is640px 值
  store.is640px = window.innerWidth < 640 ? true : false;
  // 监听窗口变化
  window.addEventListener("resize", useThrottleFn(() => {
    let { innerHeight: height, innerWidth: width } = window;
    document.documentElement.style.setProperty("--100vh", `${height}px`);
    store.is640px = width < 640 ? true : false;
  }, 300));
  // 如果已登陆,请求喜欢音乐列表
  if (store.accountInfo.id) getLikeSongList();
});
</script>

<!-- 原生样式修改 -->
<style lang="scss">
:root {
  /* 主题色 */
  --theme-color: #ff3f34;
  /* 字体颜色 */
  --font-color: #34495e;
  /* plyr主题色 */
  --plyr-color-main: var(--theme-color);
  /* 顶部导航栏高度 */
  --topNavBarHeight: 49px;
  /* 播放控件高度 */
  --playBarHeight: 52px;
  /* 侧边导航栏宽度 */
  --sideNavBarWidth: 230px;
  /* 100vh */
  --100vh: 0px;
  /* element ui primary color */
  --el-color-primary: var(--theme-color);
}

// 暗黑模式下的变量
.dark:root {
  --plyr-color-main: #fb923c;
}

body {
  color: var(--font-color);
  font-family: "Noto Sans SC", serif;
}

p {
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0px;
  font-weight: 400;
}

html,
body,
ul,
li,
div,
button,
article,
header,
section,
nav,
main,
footer,
aside {
  box-sizing: border-box;
  color: var(--font-color);
  -webkit-tap-highlight-color: transparent;
}

img {
  -webkit-user-drag: none;
}
</style>
<!-- element-plus -->
<style lang="scss">
// dark模式下
.dark {

  /* 修改elementui v-loading */
  .el-loading-mask {
    --theme-color: #fb923c;
  }

  /* 修改elementui el-pagination */
  .el-pagination {
    --theme-color: #fb923c;
  }

  /* 修改elementui tabs */
  .el-tabs {
    --theme-color: #fb923c;
  }

  /* 修改elementui skeleton  */
  .el-skeleton {
    @apply brightness-90;
  }
}

/* 修改elementui v-loading */
.el-loading-mask {
  z-index: 50 !important;
  margin-top: 1px;

  svg circle {
    stroke: var(--theme-color) !important;
  }

  .el-loading-text {
    color: var(--theme-color) !important;
  }
}

/* 修改elementui el-pagination */
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .is-active:focus {
    outline: transparent;
  }
}

/* 修改elementui tabs */
.el-tabs {
  .el-tabs__header {
    margin: 0px;
  }

  .el-tabs__nav {
    .el-tabs__item {
      color: var(--font-color);
    }

    .el-tabs__item.is-active {
      color: var(--theme-color);
    }

    .el-tabs__active-bar {
      background-color: var(--theme-color);
    }
  }
}

/* 修改elementui popover */
.el-popover {
  @apply important-p-0 dark-bg-gray-300 dark-border-none;

  .el-popper__arrow::before {
    @apply dark-bg-gray-300 dark-border-none;
  }
}

/* 修改elementui drawer */
.el-drawer.rtl {
  overflow: hidden;
  box-sizing: border-box;
  margin-top: var(--topNavBarHeight);
  max-height: calc(101% - var(--topNavBarHeight) - var(--playBarHeight));
  background-color: transparent;

  .el-drawer__body {
    overflow: hidden;
    padding: 0px;

    .el-scrollbar__view {
      height: 100%;
    }
  }
}

.el-overlay {
  background-color: transparent;
}

/* 修改elementui message-box overlay */
.el-overlay-message-box {
  background-color: rgba($color: #000000, $alpha: .35);
}

/* 修改elementui message-box 确认按钮 */
.MessageBoxConfirmBtn,
.MessageBoxConfirmBtn:hover,
.MessageBoxConfirmBtn:focus {
  border: none;
  background-color: var(--theme-color);
}

.MessageBoxConfirmBtn:hover {
  opacity: .8;
}

/* 修改elementui textarea */
.el-textarea textarea {
  resize: none;

  &::-webkit-scrollbar {
    width: 5px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    @apply rounded bg-black/25 border-r-1px border-r-transparent;
  }

  &:focus {
    box-shadow: 0 0 0 1px var(--theme-color) inset;

    &::-webkit-scrollbar-thumb {
      border-right-color: var(--theme-color);
    }
  }
}

/* 修改elementui message */
.likeSongTip {
  min-width: 180px;
}
</style>