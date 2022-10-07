<!-- 歌词 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <!-- 歌词 -->
      <div ref="skeletonEl" mt-50px flex flex-col gap-20px>
        <el-skeleton-item variant="text" w="6/10" />
        <el-skeleton-item variant="text" w="2/10" />
        <el-skeleton-item variant="text" w="5/10" />
        <el-skeleton-item variant="text" w="8/10" />
        <el-skeleton-item variant="text" w="4/10" />
        <el-skeleton-item variant="text" w="3/10" />
        <el-skeleton-item variant="text" w="6/10" />
        <el-skeleton-item variant="text" w="7/10" />
        <el-skeleton-item variant="text" w="3/10" />
        <el-skeleton-item variant="text" w="5/10" />
      </div>
    </template>
    <template #default>
      <!-- 歌词列表 -->
      <ul @mouseenter="pause" @mouseleave="mouseLeave" @touchstart="pause" @touchend="touchLeave" ref="lyricEl"
        class="lyric">
        <li v-for="({ time, lyric }, index) in lyricList" :key="time" v-show="lyric" @click.stop="lyricClick(time)"
          :class="{ active: progress >= time && progress <= lyricList[index + 1]?.time }">
          {{ lyric }}
        </li>
      </ul>

      <!-- 提示 -->
      <el-empty v-show="!lyricList.length" description="暂无歌词!" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { promiseTimeout, useIntersectionObserver, useThrottleFn, watchPausable } from '@vueuse/core';
import { onMounted, reactive, ref, toRefs } from 'vue';
import { scrollTo } from "seamless-scroll-polyfill";
import { ElMessage } from 'element-plus';
import { Handle, useMitt } from 'utils';
import { Lyric } from "@/utils/handle";
import { useMainStore } from "store";
import { SongAPI } from 'api';
const store = useMainStore();
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

// 加载状态
let loading = ref(true);
// 歌曲进度
let { progress } = toRefs(store);
// 歌词列表元素
let lyricEl = ref<HTMLElement | null>(null);
// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 歌词列表
let lyricList = reactive<Lyric[]>([]);
// 当前播放的歌词
let playLyric = ref<string>("");

// 滚动歌词
let scrollLyrics = (update: boolean = false) => {
  try {
    let currentLyric = lyricEl.value?.querySelector(".active") as HTMLElement;
    if (currentLyric && playLyric.value !== currentLyric?.textContent || update) {
      playLyric.value = currentLyric.textContent!;
      let wrapHeight = lyricEl.value!.offsetHeight;
      let top = currentLyric.offsetTop - (wrapHeight / 2 - 20);
      scrollTo(lyricEl.value!, {
        top,
        behavior: "smooth"
      });
    };
  } catch (err: any) { }
};

// 监听音乐进度并滚动歌词
const { stop, pause, resume } = watchPausable(() => progress.value, useThrottleFn(() => scrollLyrics(), 300));

// 鼠标离开
let mouseLeave = () => {
  resume();
  scrollLyrics(true);
}

// touch离开歌词
let touchLeave = (function () {
  let timer: any = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      resume();
      scrollLyrics(true);
      clearTimeout(timer);
    }, 2000);
  }
}());

// 点击歌词
let lyricClick = async (time: number) => {
  // 改变音乐播放进度
  useMitt.emit("changeProgress", time + 0.3);
  // 100毫秒后执行后续操作
  await promiseTimeout(150);
  // 滚动歌词
  scrollLyrics(true);
};

// 加载歌词
let loadLyric = async () => {
  try {
    loading.value = true;
    let { code, lrc: { lyric } }: any = await SongAPI.getLyric(props.id);
    if (code == 200) {
      // 处理歌词
      let list = Handle.Lyric(lyric);
      // 默认激活第一句歌词
      playLyric.value = list[list.length - 1].lyric;
      // 向歌词列表最后添加歌词
      let time = list[list.length - 1].time + 30;
      lyricList.push(...list, { lyric: "", time });
      // 判断歌词小于4句,停止监听进度
      if (list.length <= 4) stop();
    }
  } catch (err: any) {
    ElMessage.error("加载歌词失败!");
  } finally {
    loading.value = false;
  }
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadLyric();
      stop();
    }
  });
})
</script>

<style lang="scss" scoped>
.lyric {
  height: 100%;
  padding: 15px 0px;
  overflow-y: overlay;
  overflow-x: hidden;
  overscroll-behavior: contain;
  position: relative;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  li {
    @apply p-10px leading-5 text-15px transition-all duration-250 ease-linear select-none cursor-pointer rounded-md;

    &.active {
      animation: lyric 1s ease-in-out;
      @apply themeColor text-18px dark-text-orange-400;
    }
  }
}


@keyframes lyric {
  0% {
    @apply bg-white text-15px;
  }

  50% {
    @apply bg-gray-100 text-18px;
  }
}

@media (any-hover: hover) {
  .lyric li:hover {
    @apply bg-gray-100 themeColor;
  }
}
</style>
<style lang="scss">
.lyricScroll~.el-scrollbar__bar.is-vertical {
  width: 0% !important;
}
</style>