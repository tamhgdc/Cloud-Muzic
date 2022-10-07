<!-- 播放控件 -->
<template>
  <div class="playbar">
    <!-- 音频进度条 -->
    <div class="audio">
      <audio ref="audioEl" controls></audio>
    </div>

    <!-- 控制栏 -->
    <div class="controlLine">
      <!-- 歌曲信息 -->
      <section flex-1>
        <SongInfo :duration="duration" v-if="store.currentSong" />
      </section>

      <!-- 控制按钮 -->
      <section class="control">
        <!-- 喜欢 -->
        <LikeIcon v-if="store.currentSong" :id="store.currentSong?.song.id" />
        <!-- 上一首 -->
        <span @click="changeSong(false)" class="change" i-eva:skip-back-fill></span>
        <!-- 播放 -->
        <p @click="togglePlay" class="play">
          <span :class="playIcon" class="change"></span>
        </p>
        <!-- 下一首 -->
        <span @click="changeSong(true)" class="change" i-eva:skip-forward-fill></span>
        <!-- 分享 -->
        <span @click="share" class="share"></span>
      </section>

      <!-- 操作 -->
      <Operate />
    </div>
  </div>
</template>

<script setup lang="ts">
import Operate from "./coms/operate.vue";
import SongInfo from "./coms/songInfo.vue";
import LikeIcon from "@/components/content/likeIcon/likeIcon.vue"
import { promiseTimeout, useDebounceFn, useThrottleFn } from "@vueuse/shared";
import { ref, watch, onMounted, computed } from "vue";
import { useMitt, Validation } from "utils";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useMainStore } from "store";
import Plyr from "plyr";
const store = useMainStore();
const route = useRoute();

// audio元素
let audioEl = ref<HTMLElement | null>(null);
// 播放状态
let playStatus = ref<boolean>(false);
// 歌曲总时长
let duration = ref<number>(0);
// audioPlyr实例
let audioPlyr: Plyr | null = null;

// 视频播放,暂停音频播放
useMitt.on("stopAudio", () => {
  if (audioPlyr?.playing) audioPlyr.pause();
});
// 改变音乐进度
useMitt.on("changeProgress", (time) => {
  if (audioPlyr) {
    audioPlyr.currentTime = time as number;
  }
});

// 监听音量变化
watch(() => store.volume, useThrottleFn((volume: number) => {
  if (audioPlyr) {
    audioPlyr.volume = volume / 100;
  }
}, 1000));
// 监听音乐ID变化
watch(() => store.currentSong?.song.id, async (id) => {
  try {
    if (audioPlyr && id) {
      addSource(id);
      await audioPlyr.play();
    }
  } catch (err: any) {
    // 提示用户点击播放按钮
    if (err.name == "NotAllowedError") {
      ElMessage.success("加载完毕,请点击播放按钮!");
    }
  }
});

// 添加音乐源
let addSource = async (id: number) => {
  if (audioPlyr && id) {
    audioPlyr.source = {
      type: 'audio',
      sources: [{
        src: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
        type: 'audio/mp3'
      }]
    }
    await promiseTimeout(300);
    duration.value = audioPlyr.duration;
  }
}

// 分享
let share = () => {
  let title = store.currentSong?.song.name;
  if (title) {
    Operate.shareInfo(title, location.href);
  }
}

// 播放图标
let playIcon = computed(() => playStatus.value ? "i-carbon:pause-filled" : "i-eva:arrow-right-fill");
// 控制播放
let togglePlay = () => {
  // 判断当前播放器是存在播放源
  if (audioPlyr?.source) {
    audioPlyr.togglePlay();
  }
}
// 切换歌曲
let changeSong = useDebounceFn((control: boolean) => {
  // 判断当前是否为私人FM 
  if (route.path == "/privateFM") {
    return ElMessage.warning("当前为私人FM!");
  }
  // control为true是下一首, 反之是上一首
  let currentIndex = store.getCurrentSongIndex();
  if (currentIndex !== -1) {
    // 找到当前索引位置
    let target = control ? currentIndex + 1 : currentIndex - 1;
    let origin = control ? 0 : store.playList.length - 1;
    let result = store.playList[target] || store.playList[origin];
    if (result) store.currentSong = result;
  } else {
    // 未找到当前索引位置
    ElMessage.warning('暂无歌曲!');
  }
}, 200);

// 初始化plyr插件
onMounted(() => {
  let volume = Validation.mobileDevice() ? 1 : store.volume / 100;
  audioPlyr = new Plyr(audioEl.value!, {
    controls: ['progress'],
    volume
  });
  // 添加音乐源
  let source = store.currentSong?.song.id;
  if (source) addSource(source);
  // 播放时触发
  audioPlyr.on("play", () => {
    // 音频播放,暂停视频播放
    useMitt.emit("stopVideo");
    // 改变播放状态
    playStatus.value = true;
  });
  // 暂停时触发 -> 改变播放状态
  audioPlyr.on("pause", () => playStatus.value = false);
  // 播放完毕时触发 -> 播放下一首
  audioPlyr.on("ended", () => changeSong(true));
  // 当前歌曲播放进度
  audioPlyr.on("timeupdate", () => {
    store.progress = parseFloat((audioPlyr!.currentTime).toFixed(3));
  });
  // 监听键盘按键事件
  document.body.addEventListener("keydown", (event: KeyboardEvent) => {
    // 空格按键 -> 播放或暂停歌曲
    if (event.code === "Space" && audioPlyr!.source) {
      // 阻止默认事件
      event.preventDefault();
      // 播放
      togglePlay();
    };
  });
});
</script>

<style scoped lang="scss">
.dark .playbar .audio :deep(.plyr--audio):hover {
  --plyr-range-thumb-background: #fb923c !important;
}

.playbar {
  @apply relative z-300 h-full bg-white dark-bg-gray-600;

  .audio {
    @apply absolute top--10px z-200 w-full;

    :deep(.plyr--audio) {
      --plyr-control-spacing: 0px;
      --plyr-audio-controls-background: transparent;
      --plyr-range-track-height: 3px;
      --plyr-range-thumb-background: transparent;
      --plyr-range-thumb-shadow: none;
      --plyr-tooltip-radius: 2px;

      &:hover {
        --plyr-range-thumb-background: var(--theme-color);
      }
    }
  }

  .controlLine {
    @apply flex justify-between h-full gap-15px;
  }
}

// 控制
.control {
  @apply flex items-center justify-center gap-15px;

  .play {
    @apply themeBgColor p-3px rounded-full dark-bg-gray-500;

    span.change {
      @apply text-white dark-text-gray-300;
    }
  }

  .share {
    @apply i-carbon-link hover-text-blue-500;
  }

  span {
    @apply shrink-0 text-20px cursor-pointer dark-text-gray-300 hover-dark-text-orange-400;

    &.change {
      @apply text-30px themeColor dark-text-gray-300 hover-dark-text-orange-400;
    }
  }
}
</style>