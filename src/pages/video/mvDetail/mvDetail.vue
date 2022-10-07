<!-- MV相关 -->
<template>
  <div :key="($route.params.id as string)" class="mvDetails">
    <!-- MV信息 -->
    <div class="info">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <!-- 视频 -->
          <el-skeleton-item w-full h-250px sm:h-310px md:h-432px lg:h-354px rounded-md pt-4 />
          <!-- 艺术家 -->
          <div flex gap-10px items-center mt-4 mb-10px>
            <el-skeleton-item block w-45px h-45px rounded-full />
            <el-skeleton-item block variant="text" w-60px />
          </div>

          <!-- 标题 -->
          <el-skeleton-item block variant="text" h-20px w-230px />
          <!-- 元信息 -->
          <div flex gap-10px py-10px>
            <el-skeleton-item block variant="text" w-90px />
            <el-skeleton-item block variant="text" w-70px />
          </div>
          <!-- 操作 -->
          <div flex justify-between items-center pb-8>
            <div flex gap-10px>
              <el-skeleton-item block variant="text" rounded-full w-123px h-30px />
              <el-skeleton-item block variant="text" rounded-full w-123px h-30px />
              <el-skeleton-item block variant="text" rounded-full w-123px h-30px />
            </div>
            <!-- 举报 -->
            <el-skeleton-item block variant="text" w-50px />
          </div>
        </template>
        <template #default>
          <!-- MV视频 -->
          <PlyrVideo :source="mvSource" :poster="mvDetail!.cover" />

          <!-- 详情 -->
          <Detail :info="mvDetail!" />
        </template>
      </el-skeleton>

      <!-- 评论 -->
      <Comment :id="(route.params.id as string)" :type="1" />
    </div>

    <!-- 相关推荐 -->
    <div class="relevant">
      <Relevant />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: "MVDetail" }
</script>
<script setup lang="ts">
import Comment from "@/components/content/comment/comment.vue";
import Detail from "./coms/detail.vue";
import Relevant from "./coms/relevant.vue";
import PlyrVideo from "@/components/content/plyrVideo/plyrVideo.vue";
import { reactive, watch, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { Handle } from "utils";
import { MVAPI } from "api";
export interface MVDetail {
  id: number,
  artists: any,
  publishTime: string,
  playCount: string,
  desc: string,
  name: string,
  subCount: number,
  likedCount: number,
  shareCount: number,
  cover: string
}
export interface MVSource {
  r: number,
  url: string
}
const route = useRoute();

// 加载状态
let loading = ref<boolean>(true);
// mv详情
let mvDetail = ref<MVDetail | null>(null);
// 请求到MV资源
let mvSource = reactive<MVSource[]>([]);

// 获取mv所有分辨率的视频地址
let getResolution = async (qualityArr: object[], id: number) => {
  let result = await Promise.all(qualityArr.map((quality: any) => MVAPI.getAddress(id, quality.br)));
  let list = result.map(({ code, data }: any) => {
    if (code == 200) return { r: data.r, url: data.url };
  }) as MVSource[];
  mvSource.push(...list);
};

// 加载mv详情
let loadMVDetail = async (id: number) => {
  try {
    loading.value = true;
    let [{ data: { brs, artists, publishTime, playCount, desc, name, subCount, cover } }, { likedCount, shareCount }]: any = await Promise.all([MVAPI.getDetail(id), MVAPI.getDetailInfo(id)]);
    await getResolution(brs, id);
    playCount = Handle.Count(playCount);
    mvDetail.value = { id, artists, publishTime, playCount, desc, name, subCount, likedCount, shareCount, cover };
  } catch (err: any) {
    ElMessage.error("加载mv详情失败!");
  } finally {
    loading.value = false;
  }
};

// 监听路由id的变化 -> 加载数据
watch(() => route.params.id, (newVal) => {
  if (route.fullPath.startsWith("/mvDetail/")) {
    // 清空数组,以便于id改变时,重新渲染
    mvSource.splice(0, mvSource.length);
    // 加载mv详情
    loadMVDetail(parseInt(newVal as string));
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.mvDetails {
  @apply wrapBox flex gap-25px py-15px;

  .info {
    @apply overflow-hidden flex-1;
  }

  .relevant {
    @apply w-350px hidden lg-block overflow-hidden;
  }
}
</style>