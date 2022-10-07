<!-- 提示 -->
<template>
  <el-divider>
    <span class="tip">{{ props.disabled ? '无法加载更多!' : 'Loading...' }}</span>
  </el-divider>
</template>

<script setup lang="ts">
const props = defineProps({
  disabled: {
    type: Boolean,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.tip {
  @apply themeColor text-17px pb-15px;
}
</style>