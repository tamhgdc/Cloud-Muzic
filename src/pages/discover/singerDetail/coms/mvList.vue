<!-- 歌手详情 MV列表 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid4Cols mt-15px>
        <li v-for="item in 4">
          <el-skeleton-item variant="image" w-full h-35 rounded-md />
          <el-skeleton-item block variant="text" w="6/10" mt-7px />
        </li>
      </ul>
    </template>
    <template #default>
      <ul class="mvList">
        <li v-for="mv in MVList" :key="mv.id" @click="$router.replace(`/mvDetail/${mv.id}`)" cursor-pointer>
          <div class="cover">
            <!-- 封面 -->
            <el-image :src="mv.imgurl" fit="cover" lazy class="img" />

            <!-- 播放次数 -->
            <PlayCount :playCount="mv.playCount" />

            <!-- mv时长 -->
            <VideoDuration :durationms="mv.duration" />
          </div>

          <!-- 标题 -->
          <p class="name">{{ mv.name }}</p>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!MVList.length" description="暂无MV!" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import VideoDuration from "@/components/content/videoDuration/videoDuration.vue";
import PlayCount from "@/components/content/playCount/playCount.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { ArtistAPI } from "api";
import { Handle } from "utils";
const route = useRoute();
let id = parseInt(route.query.id as string);

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// MV列表
let MVList = reactive<any>([]);
// 加载数据
let loadData = async () => {
  try {
    loading.value = true;
    let { hasMore, code, mvs }: any = await ArtistAPI.getMV(id);
    if (code == 200) MVList.push(...mvs);
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

<style lang="scss" scoped>
.mvList {
  @apply grid4Cols p-y-15px;

  .cover {
    @apply relative rounded overflow-hidden;

    .img {
      @apply brightness-85 h-35 transition duration-300 ease-in-out z-0 flex hover-scale-115;
    }
  }

  .name {
    @apply truncate mt-5px text-15px hover-themeColor;
  }
}
</style>