<!-- 个性推荐 主播电台 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul grid3Cols mt-15px pb-30px ref="skeletonEl">
        <li v-for="item in 6" flex gap-20px>
          <el-skeleton-item variant="image" h-20 w-20 rounded-md />
          <div flex-1 flex flex-col justify-center>
            <el-skeleton-item variant="text" w="7/10" />
            <el-skeleton-item variant="text" w="2/10" mt-10px />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul class="radio">
        <li v-for="{ id, picUrl, name, copywriter } in radioList" :key="id" class="listItem">
          <!-- 电台封面 -->
          <div @click="goRadioDetail(id)" class="cover">
            <el-image :src="picUrl" fit="cover" lazy class="img" />
            <span class="icon" i-eva:arrow-right-fill></span>
          </div>

          <!-- 电台信息 -->
          <div class="detail">
            <p class="title">{{ copywriter }}</p>
            <p class="nickname">{{ name }}</p>
          </div>
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useMainStore } from "store";
import { RadioAPI } from "api";
const store = useMainStore();
const router = useRouter();

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref<boolean>(true);
// radio列表
let radioList = reactive<any>([]);
// 加载radio列表
let loadData = async () => {
  try {
    let { djRadios, code }: any = await RadioAPI.getHot(0, 6);
    if (code == 200) {
      if (djRadios.length > 6) djRadios.length = 6;
      radioList.push(...djRadios);
    };
  } catch (err: any) {
    ElMessage.error("加载主播电台失败!");
  } finally {
    loading.value = false;
  }
}

// 跳转电台详情页面
let goRadioDetail = (id: number) => {
  if (store.accountInfo.id) {
    router.push(`/radioDetail/${id}`);
  } else {
    ElMessage.warning("需要登陆后查看!");
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

<style lang="scss" scoped>
.radio {
  @apply grid3Cols mt-15px pb-30px;

  .listItem {
    @apply flex gap-10px cursor-pinter;
  }
}

.cover {
  @apply relative flex;


  &:hover .icon {
    opacity: 1;
  }

  .img {
    @apply h-20 w-20 min-w-20 rounded-md cursor-pointer border-1px border-gray-200;
  }

  .icon {
    @apply cursor-pointer absolute bottom-0px right-0px text-white text-27px opacity-0;
  }
}

.detail {
  @apply flex overflow-hidden flex-1 flex-col flex-nowrap rounded-md justify-evenly px-10px bg-gray-100 hover-bg-gray-200;

  .title {
    @apply truncate text-15px cursor-pointer hover-themeColor;
  }

  .nickname {
    @apply truncate text-13px text-black/50 cursor-pointer hover-themeColor;
  }
}
</style>