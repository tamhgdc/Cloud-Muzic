<!-- 主题选择 -->
<template>
  <el-popover placement="bottom" trigger="click" :hide-after="0" popper-class="themeSelect">
    <template #reference>
      <span class="icon" i-carbon:color-palette></span>
    </template>
    <template #default>
      <ul @click="themeSelect" class="themeList">
        <li>
          <span class="color" bg="#d95047"></span>
          <span class="name">红色</span>
        </li>
        <li>
          <span class="color" bg="#575fcf"></span>
          <span class="name">蓝色</span>
        </li>
        <li>
          <span class="color" bg="#6ab04c"></span>
          <span class="name">绿色</span>
        </li>
      </ul>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { useMainStore } from "store";
const store = useMainStore();

// 主题选择
let themeSelect = (event: Event) => {
  let color = (event.target as any).getAttribute("bg");
  if (!color || color == store.themeColor) return;
  store.themeColor = color;
  document.documentElement.style.setProperty("--theme-color", color);
};
</script>

<style lang="scss" scoped>
.themeList {
  @apply flex justify-around py-10px px-5px;

  li {
    @apply flex flex-col items-center;

    .color {
      @apply block w-20px h-20px rounded-full cursor-pointer;
    }

    .name {
      @apply mt-3px text-13px text-gray-500 select-none;
    }
  }
}
</style>
<style lang="scss">
.themeSelect {
  width: 130px !important;
  min-width: 130px !important;
}
</style>