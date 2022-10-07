<!-- 相似歌曲 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" flex flex-col gap-15px>
        <li v-for="item in 3" flex gap-10px p-8px>
          <!-- 封面 -->
          <el-skeleton-item variant="image" w-12 h-12 rounded-md />
          <!-- 歌曲信息 -->
          <div flex-1 flex flex-col justify-around>
            <!-- 标题 -->
            <el-skeleton-item variant="text" w="7/10" />
            <!-- 艺术家 -->
            <el-skeleton-item variant="text" w="2/10" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul flex flex-col gap-15px>
        <li v-for="item in simiList" :key="item.song.id">
          <SongItem :songInfo="item" hover:bg-gray-200 />
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import SongItem from "@/components/content/songItem/songItem.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { SongInfo } from "store";
import { Handle } from "utils";
import { SongAPI } from "api";
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 相似歌曲列表
let simiList = reactive<SongInfo[]>([]);
// 获取相似歌曲列表
let loadSimiSong = async () => {
  try {
    loading.value = true;
    let { code, songs }: any = await SongAPI.getSimi(props.id);
    if (code == 200) {
      // 处理歌曲列表
      let list = Handle.SongList(songs);
      simiList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载相似歌曲列表失败!");
  } finally {
    loading.value = false;
  }
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadSimiSong();
      stop();
    }
  })
});
</script>