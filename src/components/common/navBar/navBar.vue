<!-- 导航栏 -->
<template>
  <nav flex items-center w-full select-none>
    <!-- 标题 -->
    <h4 @click="goRouter" class="peer" hover:themeColor m-0 whitespace-nowrap text-17px cursor-pointer>
      {{ title }}
    </h4>
    <!-- 图标 -->
    <span v-if="path" peer-hover="themeColor translate-x-5px" text-20px transition-transform
      i-carbon:chevron-right></span>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { toRaw } from "vue";
const router = useRouter();
const props = defineProps({
  path: String,
  title: {
    type: String,
    required: true
  }
});
const { path, title } = toRaw(props);

// 跳转路由
let goRouter = () => path && router.push(path);
</script>