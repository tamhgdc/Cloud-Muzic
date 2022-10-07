<!-- 路由导航 -->
<template>
  <div class="routerNav">
    <p v-if="$route.meta.tablist">
      <span v-for="item in ($route.meta.tablist as any)" :class="{ active: $route.fullPath == item.path }"
        @click="$router.push(item.path)">
        {{ item.auth && !store.accountInfo.id ? "" : item.title }}
      </span>
    </p>
    <p v-else>
      <span class="active">{{ $route.meta.title }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "store";
const store = useMainStore();
</script>

<style lang="scss" scoped>
.routerNav {
  display: flex;
  overflow-x: overlay;
  overflow-y: hidden;
  align-items: center;
  height: 100%;

  scroll-behavior: smooth;

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

.routerNav p {
  @apply flex text-white/70 whitespace-nowrap gap-15px select-none;

  span {
    @apply text-15px cursor-pointer;

    &.active,
    &:hover {
      @apply text-white dark-text-orange-400;
    }
  }
}
</style>