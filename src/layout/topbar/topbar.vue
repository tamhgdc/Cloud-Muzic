<!-- 顶部导航栏 -->
<template>
  <div class="topbar">
    <!-- 标题 -->
    <h1 @click="$router.push('/')" class="title" :class="{ folding: store.sidebarFolding }">
      {{ store.sidebarFolding ? 'Music' : 'CloudMusic' }}
    </h1>

    <!-- 导航栏 -->
    <nav class="nav">
      <!-- 路由 -->
      <section class="router">
        <RouterNav />
      </section>

      <!-- 功能 -->
      <section class="function">
        <!-- 搜索 -->
        <Search />

        <!-- 主题 -->
        <ThemeSelect />

        <!-- 通知 -->
        <span v-if="store.accountInfo.id" @click.stop="openNoticeDrawer" class="icon" i-carbon:notification></span>

        <!-- 暗夜模式 -->
        <span @click.stop="toggleDark()" class="icon" i-carbon:sun dark:i-carbon-moon></span>
      </section>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";
import ThemeSelect from "./coms/themeSelect.vue";
import RouterNav from "./coms/routerNav.vue";
import Search from "./coms/search.vue";
import { useMainStore } from "store";
const store = useMainStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);

// 打开通知
let openNoticeDrawer = () => {
  store.playListDrawer = false;
  store.messageDrawer = !store.messageDrawer;
}
</script>

<style lang="scss" scoped>
// 顶部导航栏
.topbar {
  @apply relative z-100 flex items-center h-full w-full shadow-md themeBgColor select-none dark-bg-gray-700;
}

// 标题
.title {
  width: var(--sideNavBarWidth);
  @apply text-white text-20px text-center cursor-pointer select-none hidden sm-block dark-text-gray-300;

  &.folding {
    @apply w-70px;
  }
}

// 图标
:deep(.icon) {
  @apply flex-1 text-white/70 whitespace-nowrap text-19px cursor-pointer hover-text-white hover-dark-text-orange-400;
}

// 导航栏
.nav {
  @apply flex flex-1 h-full justify-between p-x-15px gap-15px;

  .router {
    @apply w-220px overflow-hidden;
  }

  .function {
    @apply flex flex-none items-center gap-10px;
  }
}

@media screen and (min-width: 430px) {
  .nav .router {
    flex: 1;
  }
}
</style>
