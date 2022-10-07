<!-- 个性推荐 MV -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid4Cols mt-15px>
        <li v-for="item in 4">
          <el-skeleton-item variant="image" w-full h-35 rounded-md />
          <el-skeleton-item block variant="text" w="7/10" my-7px />
          <el-skeleton-item block variant="text" w="2/10" />
        </li>
      </ul>
    </template>
    <template #default>
      <MVList mt-4 :list="mvList" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import MVList from "@/components/content/mvList/mvList.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { MVAPI } from "api";

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref<boolean>(true);
// mv列表
let mvList = reactive<any[]>([]);
// 加载mv列表
let loadData = async () => {
  try {
    let { code, result }: any = await MVAPI.getPersonalized();
    if (code == 200) {
      if (result.length > 4) result.length = 4;
      mvList.push(...result);
    };
  } catch (err: any) {
    ElMessage.error("加载MV列表失败!");
  } finally {
    loading.value = false;
  }
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadData();
      stop();
    }
  })
});
</script>