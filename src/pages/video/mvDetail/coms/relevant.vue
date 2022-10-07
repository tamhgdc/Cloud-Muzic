<!-- 相关mv -->
<template>
  <h4 text-lg mb-2>相关推荐</h4>

  <el-skeleton :loading="loading" animated>
    <template #template>
      <div v-for="item in 3" flex gap-10px mb-4>
        <el-skeleton-item variant="image" flex-1 h-35 rounded-md />
        <div flex-1 mt-5px>
          <el-skeleton-item block variant="text" w-full />
          <el-skeleton-item block variant="text" w="2/10" mt-7px />
          <el-skeleton-item block variant="text" w="4/10" mt-10px />
        </div>
      </div>
    </template>
    <template #default>
      <div v-for="item in relevantList" :key="item.id" mb-4>
        <MVItem v-bind="item" :isFlex="true" mode="replace" />
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import MVItem from "@/components/content/mvItem/mvItem.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { MVAPI } from "api";
const route = useRoute();

// 加载状态
let loading = ref(true);
// 相关mv列表
let relevantList = reactive<any[]>([]);
// 加载相关mv
let loadData = async () => {
  try {
    let id = parseInt(route.params.id as string);
    let { code, mvs }: any = await MVAPI.getRelevant(id);
    if (code == 200) relevantList.push(...mvs);
  } catch (err: any) {
    ElMessage.error("加载相关mv失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化数据
onMounted(() => loadData());
</script>