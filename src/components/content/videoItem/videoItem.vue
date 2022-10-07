<!-- 视频Item -->
<template>
  <div :class="{ flex: isFlex }" cursor-default>
    <div @click="goVideoDetailPage" class="cover">
      <!-- 封面 -->
      <el-image :src="coverUrl" fit="cover" class="img" />

      <!-- 播放次数 -->
      <PlayCount :playCount="playTime!" />

      <!-- 播放图标 -->
      <PlayIcon @playClick="goVideoDetailPage" />

      <!-- 时长 -->
      <VideoDuration :durationms="durationms!" />
    </div>

    <div class="info">
      <!-- 标题 -->
      <p @click.stop="goVideoDetailPage" class="title">{{ title }}</p>

      <!-- 创建人名称 -->
      <p class="creator">
        <span>by&nbsp;</span>
        <span @click.stop="goPersonalPage" class="nickname">{{ nickname }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoDuration from "@/components/content/videoDuration/videoDuration.vue";
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import { PropType, toRaw, toRef } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  mode: {
    type: String as PropType<"push" | "replace">,
    default: "push"
  },
  isFlex: {
    type: Boolean,
    default: false
  },
  uid: Number,
  vid: String,
  title: String,
  durationms: Number,
  coverUrl: String,
  playTime: Number,
  nickname: String
});
let { mode, uid, vid, title, durationms, coverUrl, playTime, nickname } = toRaw(props);
let isFlex = toRef(props, "isFlex");


// 跳转Video详情页面
let goVideoDetailPage = () => {
  if (mode == "push") {
    router.push(`/videoDetail/${vid}`);
  } else if (mode == "replace") {
    router.replace(`/videoDetail/${vid}`);
  } else {
    router.push(`/`);
  }
}

// 跳转创建人个人主页
let goPersonalPage = () => {
  router.push(`/personalPage/${uid}`);
}
</script>

<style lang="scss" scoped>
.cover {
  @apply relative cursor-pointer;

  .img {
    @apply h-35 rounded-md brightness-70;
  }
}

.info {
  .title {
    @apply truncate mb-3px mt-5px text-15px hover-themeColor cursor-pointer hover-dark-text-orange-400;
  }

  .creator {
    @apply text-13px text-gray-400 truncate w-2/3 dark-text-gray-500;

    .nickname {
      @apply text-13px text-gray-400 truncate w-2/3 hover-themeColor cursor-pointer dark-text-gray-500 hover-dark-text-orange-400;
    }
  }
}

// 横向布局
.flex {
  @apply flex gap-10px;

  .cover,
  .info {
    @apply flex-1 overflow-hidden;
  }

  .title {
    @apply twoLineOmit mb-10px whitespace-normal;
  }
}
</style>