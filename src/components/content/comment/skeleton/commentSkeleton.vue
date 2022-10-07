<!-- 骨架屏 -->
<template>
  <el-skeleton :loading="props.loading" animated>
    <template #template>
      <ul ref="skeletonEl">
        <li v-for="item in 3" pb-24px flex gap-15px>
          <el-skeleton-item variant="image" w-10 h-10 rounded-full />
          <div flex-1 pb-24px border-b="2px solid #eee">
            <div>
              <el-skeleton-item variant="text" w="8/100" mr-10px />
              <el-skeleton-item variant="text" w="35/100" />
            </div>
            <div>
              <el-skeleton-item variant="text" w="13/100" mr-10px />
              <el-skeleton-item variant="text" w="45/100" />
            </div>
            <div flex justify-between mt-3px>
              <el-skeleton-item variant="text" w="6/100" />
              <el-skeleton-item variant="text" w="13/100" />
            </div>
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, ref } from 'vue';
const emit = defineEmits(['load'])
const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  }
})

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      emit('load');
      stop();
    }
  })
});
</script>