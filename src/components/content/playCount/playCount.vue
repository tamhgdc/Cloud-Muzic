<!-- 播放次数 -->
<template>
  <p class="playCount">
    <span text-21px i-eva:arrow-right-outline></span>
    <span text-15px>{{ Handle.Count(props.playCount) }}</span>
  </p>
</template>

<script setup lang="ts">
import { Handle } from "utils";
const props = defineProps({
  playCount: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.playCount {
  @apply absolute top-2px right-6px z-2 flex items-center text-white;
}
</style>