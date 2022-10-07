<!-- mv排行榜 -->
<template>
  <!-- 导航 -->
  <nav flex pb-4>
    <!-- 插槽 -->
    <section flex-1>
      <slot></slot>
    </section>

    <!-- 类型选择组件 -->
    <CateSelect :currentType="currentType" :typeList="areaList" :loading="loading" @selected="selected" />
  </nav>

  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid2Cols>
        <li v-for="item in 6" flex gap-10px>
          <el-skeleton-item variant="text" self-center h-30px w-30px />
          <el-skeleton-item variant="image" flex-1 h-35 rounded-md />
          <div flex-1 flex flex-col pt-5px>
            <el-skeleton-item variant="text" w="7/10" my-7px />
            <el-skeleton-item variant="text" w="4/10" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul grid2Cols>
        <li v-for="(mv, index) in raningList" :key="mv.id" class="listItem">
          <!-- 排名 -->
          <p class="index">{{ index + 1 }}</p>

          <!-- MVItem -->
          <MVItem :id="mv.id" :cover="mv.cover" :name="mv.name" :artists="mv.artists" :playCount="mv.playCount"
            :isFlex="!store.is640px" />
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import CateSelect from "@/components/content/cateSelect/cateSelect.vue";
import MVItem from "@/components/content/mvItem/mvItem.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useMainStore } from "store";
import { MVAPI } from "api";
const store = useMainStore();
const props = defineProps({
  limit: {
    type: Number,
    required: true,
  }
})

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 地区列表
let areaList = reactive<string[]>(["内地", "港台", "欧美", "日本", "韩国"]);
// 当前类型
let currentType = ref<string>("内地");
// 选中类型
let selected = (area: string) => loadData(area);

// 加载排行榜的结果
let raningList = reactive<any>([]);
let loadData = async (area: string) => {
  try {
    loading.value = true;
    raningList.splice(0, raningList.length);
    let { code, data }: any = await MVAPI.getTopMV(area, 0, props.limit);
    if (code == 200) {
      raningList.splice(0, raningList.length, ...data);
      currentType.value = area;
    };
  } catch (err: any) {
    ElMessage.error("加载MV排行榜失败!");
  } finally {
    loading.value = false;
  }
};

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadData(currentType.value);
      stop();
    }
  })
});
</script>

<style lang="scss" scoped>
.listItem {
  @apply flex overflow-hidden;

  .index {
    @apply flex items-center w-50px grow-0 shrink-0 justify-center text-#999 text-25px dark-text-gray-200;
  }
}
</style>