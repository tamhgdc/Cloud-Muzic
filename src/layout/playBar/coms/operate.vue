<!-- 操作 -->
<template>
  <section class="operate">
    <!-- 打开播放列表 -->
    <span @click="openDrawer" i-carbon:list-boxes></span>

    <!-- 音量 -->
    <div v-if="!Validation.mobileDevice()">
      <el-popover :hide-after="0" placement="top" trigger="click">
        <template #reference>
          <span :class="icon"></span>
        </template>
        <template #default>
          <div class="volume">
            <p>音量: {{ store.volume }}</p>
            <el-slider v-model="store.volume" :min="0" :max="100" :show-tooltip="false" />
          </div>
        </template>
      </el-popover>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMainStore } from "store";
import { Validation } from "utils";
import { computed } from "vue";
const store = useMainStore();

// 声音图标
let icon = computed(() => {
  if (store.volume == 0) {
    return "i-carbon:volume-mute";
  } else if (store.volume <= 50) {
    return "i-carbon:volume-down";
  } else {
    return "i-carbon:volume-up";
  }
})

// 打开播放列表
let openDrawer = () => {
  store.messageDrawer = false;
  store.privateMsgDrawer = false;
  store.playListDrawer = !store.playListDrawer;
}
</script>

<style lang="scss" scoped>
.dark .volume :deep(.el-slider) {
  --el-slider-main-bg-color: #fb923c !important;
}

// 操作
.operate {
  @apply flex flex-1 items-center justify-end pr-15px gap-15px;

  span {
    @apply shrink-0 text-20px cursor-pointer hover-themeColor dark-text-gray-300 hover-dark-text-orange-400;
  }
}

// 音量滑块
.volume {
  padding: 7px 15px;

  :deep(.el-slider) {
    height: 20px;
    --el-slider-main-bg-color: var(--theme-color);

    .el-slider__button {
      width: 15px;
      height: 15px;
    }

    .el-slider__runway,
    .el-slider__bar {
      height: 4px;
    }
  }
}
</style>