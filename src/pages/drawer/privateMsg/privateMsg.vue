<!-- 私信 -->
<template>
  <el-drawer direction="rtl" size="350px" :z-index="200" :append-to-body="true" v-model="store.privateMsgDrawer"
    :with-header="false">
    <div :key="store.privateMsgInfo.id" h-full bg-white>
      <!-- 私信头部 -->
      <header class="header">
        <p @click.stop="goBack" class="return">
          <span i-carbon:chevron-left></span>
        </p>
        <p class="name">{{ store.privateMsgInfo.name }}</p>
      </header>

      <!-- 私信内容 -->
      <MsgContent />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import MsgContent from "./coms/msgContent.vue";
import { useMainStore } from "store";
const store = useMainStore();

// 返回上一级
let goBack = () => {
  store.privateMsgDrawer = false;
  store.messageDrawer = true;
}
</script>

<style lang="scss" scoped>
.header {
  @apply flex h-40px items-center;

  .return {
    @apply w-40px text-center cursor-pointer;

    &:hover>span {
      @apply themeColor;
    }

    &>span {
      @apply text-22px text-gray-400;
    }
  }

  .name {
    @apply text-center flex-1 text-14px pr-40px truncate select-none;
  }
}
</style>