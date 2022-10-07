<!-- 每日歌曲推荐 -->
<template>
  <div wrapBox>
    <!-- 头部简介 -->
    <header class="header">
      <div class="icon">
        <el-image src="/img/dailySongsIcon.png" fit="cover" />
        <p class="date">{{ new Date().getDate() }}</p>
      </div>

      <div>
        <h1 text-23px font-bold>每日歌曲推荐</h1>
        <p mt-5px text-14px truncate text-gray-500>根据你的音乐口味生成, 每天6:00更新</p>
      </div>
    </header>

    <!-- 操作 -->
    <ul class="operate">
      <li @click="Operate.addPlayList(songList, 50)">
        <span class="icon" i-eva:play-circle-outline></span>
        <span>播放全部</span>
      </li>
      <li @click="collectAllSongs">
        <span class="icon" i-carbon:folder-add></span>
        <span>收藏全部</span>
      </li>
    </ul>

    <!-- 分割线 -->
    <el-divider mt-20px mb-0px />

    <!-- 列表 -->
    <SongList v-loading="loading" :songList="songList" />
  </div>
</template>

<script setup lang="ts">
import SongList from "@/components/content/songList/songList.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { useMainStore } from "store";
import { SongInfo } from "store";
import { SongAPI } from "api";
const store = useMainStore();

// 加载状态
let loading = ref<boolean>(false);
// 歌曲列表
let songList = reactive<SongInfo[]>([]);

// 收藏全部
let collectAllSongs = () => {
  if (songList.length) {
    console.log('收藏全部');
  }
}

// 加载每日歌曲推荐
let loadData = async () => {
  try {
    loading.value = true;
    let { code, data: { dailySongs } }: any = await SongAPI.getRecommend();
    if (code == 200) {
      // 处理歌曲列表
      let list = Handle.SongList(dailySongs);
      songList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载每日推荐歌单失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化数据
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.header {
  @apply pt-15px pb-20px flex gap-20px;

  .icon {
    @apply relative h-20 w-20;

    .date {
      transform: translate(-50%, -10px);
      @apply absolute top-50% left-50% text-#D33A32 text-35px font-bold;
    }
  }
}

.operate {
  @apply mb-3 lg-my-0 flex content-center flex-row flex-wrap gap-y-7px gap-x-15px;

  li {
    @apply flexCenter select-none rounded-full w-100px text-center cursor-pointer border-1px border-#eee gap-5px whitespace-nowrap;

    span {
      @apply py-5px text-13px;

      &.icon {
        font-size: 19px;
      }
    }

    &:hover {
      background-color: #f5f7fa;
      color: var(--theme-color);
    }

    &:first-child {
      width: 95px;
      border: none;
      background: linear-gradient(to right, #fa5042, #d43b32);
      color: rgba($color: #fff, $alpha: .8);

      &:hover {
        color: white;
      }
    }
  }
}
</style>
