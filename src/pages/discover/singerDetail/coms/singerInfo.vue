<!-- 歌手详情 歌手信息 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <div ref="skeletonEl" mt-15px mb-30px>
        <el-skeleton-item block variant="text" h-20px w-130px />
        <el-skeleton-item block variant="text" ml-8 w-full mt-17px />
        <el-skeleton-item block variant="text" w-full mt-7px />
        <el-skeleton-item block variant="text" w-full mt-7px />
        <el-skeleton-item block variant="text" w-full mt-7px />
        <el-skeleton-item block variant="text" w-full mt-7px />
        <el-skeleton-item block variant="text" w="4/10" mt-7px />
      </div>
    </template>
    <template #default>
      <!-- 简介 -->
      <section mt-15px>
        <h3 class="title">{{ name }}简介</h3>
        <p class="content">{{ singerDesc.briefDesc }}</p>
      </section>
      <!-- 成就 -->
      <section v-for="item in singerDesc.introduction" :key="item.ti" mt-30px>
        <h3 class="title">{{ item.ti }}</h3>
        <p class="content">{{ item.txt }}</p>
      </section>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { ArtistAPI } from "api";
const route = useRoute();
let { id, name }: any = route.query;

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 歌手描述
let singerDesc = reactive<any>({});
// 加载歌手描述
let loadData = async () => {
  try {
    let { briefDesc, code, introduction }: any = await ArtistAPI.getDescribe(id);
    if (code == 200) Object.assign(singerDesc, { briefDesc, introduction, });
  } catch (err: any) {
    ElMessage.error("加载歌手简介失败!");
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

<style lang="scss" scoped>
.title {
  @apply text-17px mb-10px;
}

.content {
  @apply text-15px text-black/45 indent-8 leading-6 whitespace-pre-wrap;
}
</style>