<!-- 动态 -->
<template>
  <div class="dynamic">
    <!-- 动态列表 -->
    <DynamicList />

    <!-- 热门话题 -->
    <HotTopic />
  </div>
</template>

<script setup lang="ts">
import DynamicList from "./coms/dynamicList.vue";
import HotTopic from "./coms/hotTopic.vue";
</script>

<style lang="scss" scoped>
.dynamic {
  @apply wrapBox flex gap-30px;
}
</style>
