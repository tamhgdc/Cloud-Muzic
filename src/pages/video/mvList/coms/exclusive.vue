<!-- 网易出品 -->
<template>
  <div my-12>
    <NavBar title="网易出品" path="/allMV/?area=全部&type=网易出品&order=最新" pb-4 />

    <el-skeleton :loading="loading" animated>
      <template #template>
        <ul ref="skeletonEl" grid4Cols mt-15px>
          <li v-for="item in 8">
            <el-skeleton-item variant="image" w-full h-35 rounded-md />
            <el-skeleton-item block variant="text" w="7/10" my-7px />
            <el-skeleton-item block variant="text" w="2/10" />
          </li>
        </ul>
      </template>
      <template #default>
        <MVList :list="exclusiveList" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/common/navBar/navBar.vue";
import MVList from "@/components/content/mvList/mvList.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { MVAPI } from "api";

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 网易出品列表
let exclusiveList = reactive<any>([]);
// 加载网易出品列表
let loadData = async () => {
  try {
    loading.value = true;
    let { code, data }: any = await MVAPI.getExclusive(0, 8);
    if (code == 200) exclusiveList.push(...data);
  } catch (err: any) {
    ElMessage.error("加载网易出品MV失败!");
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