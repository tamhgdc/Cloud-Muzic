<!-- 用户歌单/收藏 -->
<template>
  <div py-20px>
    <header class="header">
      <!-- 标题 -->
      <p class="title">歌单</p>
      <!-- 导航 -->
      <nav class="nav" v-if="!(current == 0 && isMore)">
        <button @click="previousPage" :disabled="loading || current == 0">
          <span i-carbon:chevron-left></span>
        </button>
        <button @click="nextPage" :disabled="loading || isMore">
          <span i-carbon:chevron-right></span>
        </button>
      </nav>
    </header>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <ul grid6Cols mt-15px>
          <li v-for="item in 6">
            <el-skeleton-item variant="image" w-full h-33 rounded-md />
            <el-skeleton-item variant="text" mt-6px />
            <el-skeleton-item variant="text" w="5/10" />
          </li>
        </ul>
      </template>
      <template #default>
        <ul class="songList">
          <li v-for="item in playlist" :key="item.id" @click="$router.push(`/songListDetail/${item.id}`)">
            <!-- 封面 -->
            <div relative>
              <el-image :src="item.coverImgUrl" fit="cover" class="cover" />
              <PlayCount :playCount="item.playCount" />
              <PlayIcon @playClick="Operate.playSongList(item.id)" position="bottom-right" />
            </div>
            <!-- 标题 -->
            <p class="name">{{ item.name }}</p>
            <!-- 歌曲数量 -->
            <p class="count">{{ item.trackCount }}首</p>
          </li>
        </ul>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { SongListAPI } from "api";
import { Operate } from "utils";
const route = useRoute();

// 加载状态
let loading = ref<boolean>(true);
// 当前页数
let current = ref<number>(0);
// 请求个素限制
let limit = 18;
// 是否还有更多
let isMore = ref<boolean>(false);
// 用户歌单
interface Playlist {
  name: string,
  id: number,
  trackCount: number,
  playCount: number,
  coverImgUrl: string
}
let playlist = reactive<Playlist[]>([]);

// 上一页
let previousPage = () => {
  current.value--;
  loadData(current.value * limit);
}

// 下一页
let nextPage = () => {
  current.value++;
  loadData(current.value * limit);
}

// 加载用户歌单
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let uid = parseInt(route.params.uid as string);
    let { more, code, playlist: list }: any = await SongListAPI.getUserPlaylist(uid, offset, limit);
    if (code == 200) {
      // 是否还有更多
      isMore.value = !more;
      // 处理列表
      list = list.map((item: any) => {
        let { name, id, trackCount, playCount, coverImgUrl } = item;
        return { name, id, trackCount, playCount, coverImgUrl }
      });
      // 歌单列表长度不能大于限制
      if (list.length > limit) list.length = limit;
      playlist.splice(0, playlist.length, ...list);
    }
  } catch (err: any) {
    ElMessage.error("加载用户歌单失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化用户歌单
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.header {
  @apply flex justify-between gap-20px items-center;

  .title {
    @apply text-18px truncate;
  }

  .nav {
    @apply flex gap-10px;

    button {
      @apply border-none p-5px rounded-md flex justify-center items-center bg-gray-200 cursor-pointer outline-none;

      &:disabled {
        @apply bg-gray-100 cursor-not-allowed;

        &>span {
          @apply text-gray-400;
        }
      }

      &:not(:disabled):hover>span {
        @apply themeColor;
      }

      &>span {
        @apply text-20px fontColor;
      }
    }
  }
}

.songList {
  @apply flex flex-wrap justify-around gap-10px mt-15px;

  li {
    @apply cursor-pointer w-135px;

    &:hover .name {
      @apply themeColor;
    }

    .cover {
      @apply w-full h-135px rounded-md brightness-90 border-1px border-gray-200;
    }

    .name {
      @apply truncate pt-5px pb-3px text-15px;
    }

    .count {
      @apply text-13px text-black/40 truncate;
    }
  }
}
</style>