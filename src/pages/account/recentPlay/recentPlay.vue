<!-- 最近播放 -->
<template>
  <div wrapBox>
    <header class="header">
      <h1 class="total">共{{ recentSongList.length }}首</h1>
      <div class="operate">
        <p @click.stop="playAll" class="playAll">
          <span class="icon" i-eva:play-circle-outline></span>
          <span>播放全部</span>
        </p>
        <p @click.stop="clearList" class="clear">清空列表</p>
      </div>
    </header>
    <!-- 歌曲列表 -->
    <el-table @row-dblclick="playSong" :data="recentSongList" stripe v-loading="loading" class="songList">
      <!-- 序号 -->
      <el-table-column :width="50" type="index">
        <template v-slot="{ $index }">
          <p class="index">{{ $index + 1 }}</p>
        </template>
      </el-table-column>

      <!-- 标题 -->
      <el-table-column label="音乐标题">
        <template v-slot="{ row }">
          <p :class="{ 'themeColor': store.currentSong?.song.id == row.song.song.id }" class="title">
            {{ row.song.song.name }}
          </p>
        </template>
      </el-table-column>

      <!-- 歌手 -->
      <el-table-column label="歌手">
        <template v-slot="{ row }">
          <Artists :artists="row.song.artists" />
        </template>
      </el-table-column>

      <!-- 播放时间 -->
      <el-table-column width="120px" label="播放时间">
        <template v-slot="{ row }">
          <p>{{ row.time }}</p>
        </template>
      </el-table-column>

      <!-- 空数据 -->
      <template #empty>
        <el-empty description="暂无歌曲!" />
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import Artists from "@/components/content/artists/artists.vue";
import { SongInfo, useMainStore } from 'store';
import { onMounted, reactive, ref, toRaw } from 'vue';
import { ElMessage } from 'element-plus';
import { AccountAPI } from 'api';
import { Handle } from 'utils';
const store = useMainStore();

// 加载状态
let loading = ref<boolean>(true);
// 最近播放列表
interface RecentSong {
  song: SongInfo,
  time: string
}
let recentSongList = reactive<RecentSong[]>([]);

// 播放全部
let playAll = () => {
  if (recentSongList.length) {
    let list = JSON.parse(JSON.stringify(recentSongList)).splice(0, 50).map((item: RecentSong) => item.song);
    store.addPlayList(list);
  }
}

// 清空列表
let clearList = () => {
  ElMessage.warning("暂不支持此功能!");
}

// 播放歌曲
let playSong = (item: RecentSong) => {
  let { song } = toRaw(item);
  store.playSong(song);
}

// 加载最近播放
let loadData = async () => {
  try {
    loading.value = true;
    let { code, data: { list } }: any = await AccountAPI.getRecentSong(105);
    if (code == 200) {
      // 处理列表
      list = list.map((item: any) => {
        let { data, playTime } = item;
        let song = Handle.SongInfo(data);
        let time = Handle.TimeStamp(playTime);
        return { song, time };
      });
      recentSongList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载最近播放失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化数据
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.header {
  @apply py-20px border-b-1px border-b-zinc-200;

  .total {
    @apply text-16px text-gray-500;
  }

  .operate {
    @apply flex justify-between items-center mt-10px select-none;

    .playAll {
      @apply w-95px cursor-pointer rounded-full flex justify-center items-center gap-2px;
      background: linear-gradient(to right, #fa5042, #d43b32);

      span {
        @apply py-5px text-13px text-white/80;

        &.icon {
          font-size: 19px;
        }
      }

      &:hover span {
        @apply text-white;
      }
    }

    .clear {
      @apply text-16px cursor-pointer text-cyan-700 hover-text-cyan-900;
    }
  }
}

.songList {
  @apply w-full h-full text-13px overflow-hidden;

  .index {
    @apply truncate text-center text-gray-400;
  }

  .title {
    @apply truncate cursor-default select-none;
  }
}
</style>