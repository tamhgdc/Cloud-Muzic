<!-- 最新MV -->
<template>
  <!-- 导航栏 -->
  <nav flex pb-4>
    <NavBar flex-1 title="最新MV" path="/allMV/?area=内地&type=全部&order=最新" />
    <CateSelect :loading="loading" :typeList="areaList" :currentType="currentType" @selected="selected" />
  </nav>

  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul grid4Cols mt-15px>
        <li v-for="item in 8">
          <el-skeleton-item variant="image" w-full h-35 rounded-md />
          <el-skeleton-item block variant="text" w="7/10" my-7px />
          <el-skeleton-item block variant="text" w="2/10" />
        </li>
      </ul>
    </template>
    <template #default>
      <MVList :list="newMVList" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import CateSelect from "@/components/content/cateSelect/cateSelect.vue";
import MVList from "@/components/content/mvList/mvList.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { MVAPI } from "api";

// 加载状态
let loading = ref(true);
// 当前选中类型
let currentType = ref("内地");
// 地区列表
let areaList = reactive<string[]>(["内地", "港台", "欧美", "日本", "韩国"]);
// 选择选项事件
let selected = (area: string) => loadData(area);
// 最新MV列表
let newMVList = reactive<any>([]);

// 加载最新MV列表
let loadData = async (area: string, limit: number = 8) => {
  try {
    loading.value = true;
    let { code, data }: any = await MVAPI.getNewMV(area, limit);
    if (code == 200) {
      currentType.value = area;
      newMVList.splice(0, newMVList.length, ...data);
    }
  } catch (err) {
    ElMessage.error("加载最新MV失败!");
  } finally {
    loading.value = false;
  }
};
onMounted(() => loadData(currentType.value));
</script>