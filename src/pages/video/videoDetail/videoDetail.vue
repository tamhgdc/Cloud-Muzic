<!-- Video详情 -->
<template>
  <div :key="($route.params.vid as string)" class="videoDetails">
    <!-- 视频信息 -->
    <div class="info">
      <el-skeleton :loading="loading" animated>
        <template #template>
          <!-- 视频 -->
          <el-skeleton-item w-full h-250px sm:h-310px md:h-432px lg:h-354px rounded-md pt-4 />
          <div flex justify-between items-center>
            <!-- 创建人信息 -->
            <div mt-4 mb-10px flex gap-10px items-center>
              <el-skeleton-item variant="image" w-45px h-45px rounded-full />
              <el-skeleton-item block variant="text" w-60px />
            </div>
            <!-- 关注按钮 -->
            <el-skeleton-item block variant="text" w-75px h-30px rounded-full />
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
          <!-- Video视频 -->
          <PlyrVideo :source="videoSource" :poster="videoDetail!.coverUrl" />

          <!-- 详情 -->
          <Detail :info="videoDetail!" />
        </template>
      </el-skeleton>

      <!-- 评论 -->
      <Comment :id="(route.params.vid as string)" :type="5" />
    </div>

    <!-- 相关推荐 -->
    <div class="relevant">
      <Relevant />
    </div>
  </div>
</template>

<script lang="ts">

export default { name: "VideoDetail" }
</script>
<script setup lang="ts">
import Detail from "./coms/detail.vue";
import Relevant from "./coms/relevant.vue";
import Comment from "@/components/content/comment/comment.vue";
import PlyrVideo from "@/components/content/plyrVideo/plyrVideo.vue";
import { reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { VideoAPI } from "api";
import { Handle } from "utils";
export interface VideoDetail {
  // 视频标题
  title: string,
  // 视频id
  vid: string,
  // 播放次数
  playCount: string,
  // 发布时间
  publishTime: string,
  // 视频收藏数量
  subCount: number,
  // 视频分享数量
  shareCount: number,
  // 视频点赞数量
  likedCount: number,
  // 视频描述
  description: string,
  // 视频封面
  coverUrl: string,
  // 创建人
  creator: {
    // 头像
    avatarUrl: string,
    // 名称
    nickname: string,
    // 是否关注
    followed: boolean,
    // 创建人ID
    userId: number
  }
}
export interface VideoSource {
  r: number,
  url: string
}
const route = useRoute();

// 加载状态
let loading = ref<boolean>(true);
// 视频详情
let videoDetail = ref<VideoDetail | null>(null);
// 视频url
let videoSource = reactive<VideoSource[]>([]);

// 加载视频详情
let loadVideoDetail = async (vid: string) => {
  try {
    loading.value = true;
    let [Detail, Url]: any = await Promise.all([VideoAPI.getDetail(vid), VideoAPI.getUrl(vid)]);
    // 处理视频详情
    if (Detail.code == 200) {
      let { title, vid, subscribeCount: subCount, publishTime, playTime: playCount, shareCount, praisedCount: likedCount, description, creator, coverUrl } = Detail.data;
      let { avatarUrl, nickname, followed, userId } = creator;
      // 处理播放时间
      publishTime = Handle.TimeStamp(publishTime);
      // 处理播放次数
      playCount = Handle.Count(playCount);
      videoDetail.value = {
        title,
        vid,
        playCount,
        publishTime,
        subCount,
        shareCount,
        likedCount,
        description,
        coverUrl,
        creator: {
          avatarUrl,
          nickname,
          followed,
          userId
        },
      }
    }
    // 处理视频地址
    if (Url.code == 200) {
      let { url, r } = Url.urls[0];
      videoSource.push({ r, url });
    }
  } catch (err: any) {
    ElMessage.error("加载视频详情失败!");
  } finally {
    loading.value = false;
  }
}

// 监听路由id的变化 -> 加载数据
watch(() => route.params.vid, (newVal) => {
  if (route.fullPath.startsWith("/videoDetail/")) {
    // 清空数组,以便于id改变时,重新渲染
    videoSource.splice(0, videoSource.length);
    // 加载视频详情
    loadVideoDetail(newVal as string);
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.videoDetails {
  @apply wrapBox flex gap-25px py-15px;

  .info {
    @apply overflow-hidden flex-1;
  }

  .relevant {
    @apply w-350px hidden lg-block overflow-hidden;
  }
}
</style>
