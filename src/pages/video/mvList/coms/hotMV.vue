<!-- 热播MV -->
<template>
  <div my-12>
    <NavBar title="热播MV" path="/allMV/?area=全部&type=全部&order=最热" pb-4 />

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
        <MVList :list="hotMVList" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/common/navBar/navBar.vue";
import MVList from "@/components/content/mvList/mvList.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { MVAPI } from "api";

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 热播MV列表
let hotMVList = reactive<any>([]);
// 加载热播MV列表
let loadData = async () => {
  try {
    loading.value = true;
    let { code, data }: any = await MVAPI.getAllMV("全部", "全部", "最热", 0, 8);
    if (code == 200) hotMVList.push(...data);
  } catch (err: any) {
    ElMessage.error("加载热播MV失败!");
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
