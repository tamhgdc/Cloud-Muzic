<!-- 布局组件 -->
<template>
  <main id="layout" :class="{ hiddenSidebar: songDetailDrawer, folding: sidebarFolding }">
    <!-- 顶部导航栏 -->
    <Topbar class="topbar" />
    <!-- 侧边导航栏 -->
    <Sidebar class="sidebar" />
    <!-- 播放栏 -->
    <PlayBar class="playbar" />
    <!-- 视图 -->
    <div class="view" ref="scrollEl" @scroll="scroll">
      <router-view v-slot="{ Component }">
        <keep-alive :exclude="excludeList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </main>
</template>

<script setup lang="ts">
import Topbar from "./topbar/topbar.vue";
import Sidebar from "./sidebar/sidebar.vue";
import PlayBar from "./playBar/playBar.vue";
import { useThrottleFn } from "@vueuse/core";
import { ref, toRefs, watch } from "vue";
import { useRoute } from "vue-router";
import { useMainStore } from "store";
const store = useMainStore();
const route = useRoute();
let { scrollTop, songDetailDrawer, sidebarFolding } = toRefs(store);

// keepAlive排除列表
let excludeList = ['Login', 'Register', 'SingerDetail', 'SongListDetail', 'AllMV', 'MVDetail', 'VideoDetail', 'Search', 'PersonalPage', 'UserFollows', 'UserFolloweds', 'UserDynamic'];

// 滚动元素
let scrollEl = ref<HTMLElement | null>(null);
// 滚动事件
let scroll = useThrottleFn((event: UIEvent) => {
  if (route.meta.scroll) {
    let target = event.target as HTMLElement;
    scrollTop.value = target.scrollTop;
  }
}, 100);
// 监听路由,将页面滚动到顶部
watch(route, () => scrollEl.value?.scrollTo({ top: 0 }));
</script>

<style lang="scss" scoped>
#layout {
  display: grid;
  overflow: hidden;
  width: 100%;
  height: var(--100vh);

  grid-template: var(--topNavBarHeight) auto var(--playBarHeight) / var(--sideNavBarWidth) auto;

  // 顶部栏
  .topbar {
    grid-row: 1/2;
    grid-column: 1/3;
  }

  // 侧边栏
  .sidebar {
    grid-row: 2/3;
    grid-column: 1/2;
    @apply md-row-end-4;
  }

  // 播放栏
  .playbar {
    grid-row: 3/4;
    grid-column: 1/3;
    @apply md-col-start-2 md-col-end-3;
  }

  // 路由视图
  .view {
    grid-row: 2/3;
    grid-column: 2/3;
    @apply dark-bg-gray-400 overflow-x-hidden;
  }
}

// 滚动条
.sidebar,
.view {
  overflow-y: overlay;

  &:hover::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    @apply rounded bg-black/15 dark-bg-gray-200;
  }
}

// 隐藏侧边栏
#layout.hiddenSidebar {
  .navbar {
    grid-row: 2/3;
  }

  .playbar {
    grid-column: 1/3;
  }
}

// 缩小侧边栏
#layout.folding {
  grid-template: var(--topNavBarHeight) auto var(--playBarHeight) / 70px auto;
}
</style>
