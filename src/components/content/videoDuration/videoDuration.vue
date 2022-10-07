<!-- 视频时长 -->
<template>
  <p class="time">{{ Handle.Duration(props.durationms) }}</p>
</template>

<script setup lang="ts">
import { Handle } from "utils";
const props = defineProps({
  durationms: {
    type: Number,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.time {
  @apply absolute text-white text-15px right-5px bottom-7px;
}
</style>