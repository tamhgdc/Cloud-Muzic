<!-- 歌曲信息 -->
<template>
  <div class="songInfo">
    <!-- 封面 -->
    <div @click="openSongDetail" class="cover">
      <el-image :src="currentSong?.album.picUrl" fit="cover" class="img" />
      <p class="icon" i-carbon:chevron-sort></p>
    </div>

    <!-- 详情 -->
    <div class="detail">
      <!-- 标题 -->
      <p @click="openSongDetail" class="title">{{ currentSong?.song.name }}</p>
      <!-- 时间 -->
      <p class="time">
        <span>{{ handleTime(store.progress) }}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{ handleTime(props.duration) }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useMainStore } from "store";
import { toRefs } from "vue";
const store = useMainStore();
const route = useRoute();
const props = defineProps({
  duration: {
    type: Number,
    required: true
  }
});
let { songDetailDrawer, currentSong } = toRefs(store);

// 处理歌曲时间
let handleTime = (time: number) => {
  let minute = Math.floor(time / 60).toFixed(0).padStart(2, "0");
  let seconds = Math.floor(time % 60).toFixed(0).padStart(2, "0");
  return `${minute}:${seconds}`;
}

// 打开歌曲详情
let openSongDetail = () => {
  if (route.path !== "/privateFM") {
    songDetailDrawer.value = !songDetailDrawer.value;
  }
};
</script>

<style lang="scss" scoped>
.songInfo {
  @apply flex overflow-hidden items-center pl-6px h-full gap-6px;

  .cover {
    min-width: calc(var(--playBarHeight) - 12px);
    width: calc(var(--playBarHeight) - 12px);
    height: calc(var(--playBarHeight) - 12px);
    @apply relative overflow-hidden rounded-md cursor-pointer;

    .icon {
      @apply absolute top-3px left-3px p-5px text-white text-25px z-10 opacity-0;
    }

    &:hover {
      .img {
        @apply brightness-80;
      }

      .icon {
        @apply opacity-100;
      }
    }
  }

  .detail {
    @apply hidden sm-flex flex-1 h-40px flex-col justify-around;

    .title {
      @apply sm-max-w-32 xl-max-w-62 truncate select-none text-14px cursor-pointer hover-themeColor dark-text-gray-300 hover-dark-text-orange-400;
    }

    .time {
      @apply text-black/40 text-12px whitespace-nowrap cursor-default dark-text-gray-400;
    }
  }
}
</style>