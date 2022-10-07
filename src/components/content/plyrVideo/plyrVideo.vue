<!-- Plyr视频组件 -->
<template>
  <video ref="playerEl" playsinline controls>
    <source v-for="item in props.source" :key="item.r" :src="item.url" :size="item.r" type="video/mp4" />
  </video>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted, onBeforeUnmount } from "vue";
import { useMitt } from "utils";
import Plyr from "plyr";
const props = defineProps({
  source: {
    type: Array as PropType<{ r: number, url: string }[]>,
    required: true,
  },
  poster: String
});

// plyr实例
let videoPlyr: Plyr | null = null;
// video元素
let playerEl = ref<HTMLElement | null>(null);
onMounted(() => {
  // 音质数组
  let qualityArr = props.source.map(item => item.r);
  videoPlyr = new Plyr(playerEl.value!, {
    settings: ["speed", "quality"],
    quality: {
      default: Math.max(...qualityArr),
      options: qualityArr.reverse(),
    },
    controls: [
      "play",
      "volume",
      "progress",
      "settings",
      "fullscreen",
      "current-time",
    ],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
    i18n: {
      speed: "速度",
      normal: "标准",
      quality: "画质",
      qualityBadge: {
        1080: "超清",
        720: "高清",
        480: "标清",
      },
    },
  });

  // 设置海报
  if (props.poster) {
    videoPlyr.poster = props.poster;
  }

  // 视频播放,暂停音频播放
  videoPlyr.on("play", () => useMitt.emit("stopAudio"));
});

// 音频播放,暂停视频播放
useMitt.on("stopVideo", () => {
  if (videoPlyr?.playing) videoPlyr.pause();
});

// 销毁视频组件
onBeforeUnmount(() => videoPlyr?.destroy());
</script>

<style>
.plyr--video {
  border-radius: 6px;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  -o-border-radius: 6px;
}
</style>