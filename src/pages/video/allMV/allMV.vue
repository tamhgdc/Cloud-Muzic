<!-- 全部MV -->
<template>
  <div wrapBox pt-4 pb-8 v-if="currentType.type">
    <!-- 类型列表 -->
    <ul flex flex-col flex-nowrap mb-15px gap-10px>
      <li v-for="{ title, name, type } in typeList" :key="title" flex items-center gap-10px>
        <CateSelect @selected="(type: string) => currentType[name] = type" :title="title" :loading="loading"
          :currentType="currentType[name]" :typeList="type" />
      </li>
    </ul>

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
        <MVList :list="mvList" />
      </template>
    </el-skeleton>

    <!-- 分页 -->
    <div v-show="mvList.length">
      <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
        :total="total" />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "AllMV" };
</script>
<script setup lang="ts" name="allMV">
import CateSelect from "@/components/content/cateSelect/cateSelect.vue";
import MVList from "@/components/content/mvList/mvList.vue";
import { reactive, ref, watch, toRaw, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { MVAPI } from "api";
const route = useRoute();
let { area, type, order } = route.query;

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 是否加载
let loading = ref(false);
// mv总条数
let total = ref<number>(0);
// limit限制
let limit = 28;
// 请求偏移
let offset = ref<number>(0);
// mv列表
let mvList = reactive<any>([]);

// 当前选择的类型
let currentType = reactive<any>({
  area: area || "全部",
  type: type || "全部",
  order: order || "上升最快"
});
// 类型列表
let typeList = reactive([{
  type: ['全部', '内地', '港台', '欧美', '韩国', '日本'],
  title: "地区",
  name: 'area',
}, {
  type: ['全部', '官方版', '原声', '现场版', '网易出品'],
  title: "类型",
  name: 'type',
}, {
  type: ['上升最快', '最热', '最新'],
  title: "排序",
  name: 'order',
}]);

// 分页发生改变
let change = (page: number) => {
  offset.value = page * limit;
  loadData();
}

// 加载数据
let loadData = async () => {
  try {
    loading.value = true;
    mvList.splice(0, mvList.length);
    let { area, type, order } = toRaw(currentType);
    let { code, data, count }: any = await MVAPI.getAllMV(area, type, order, offset.value, limit);
    if (code == 200) {
      if (!total.value) total.value = count;
      mvList.splice(0, mvList.length, ...data);
    }
  } catch (err: any) {
    ElMessage.error("加载全部MV失败!");
  } finally {
    loading.value = false;
  }
}

// 监听类型列表并请求数据
watch(currentType, () => {
  nextTick(() => {
    total.value = 0;
    offset.value = 0;
    loadData();
  })
}, { immediate: true });
</script>