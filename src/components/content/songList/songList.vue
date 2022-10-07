<!-- 歌单列表 -->
<template>
  <el-table @row-dblclick="store.playSong" :data="songList" stripe class="songList">
    <!-- 序号 -->
    <el-table-column :width="40" type="index">
      <template v-slot="{ $index }">
        <p class="index">{{ $index + 1 }}</p>
      </template>
    </el-table-column>

    <!-- 操作 -->
    <el-table-column :width="65">
      <template v-slot="{ row }">
        <p class="operate">
          <LikeIcon :id="row.song.id" />
          <span @click.stop="Operate.downloadSong(row.song.id)" class="download"></span>
        </p>
      </template>
    </el-table-column>

    <!-- 标题 -->
    <el-table-column label="音乐标题">
      <template v-slot="{ row }">
        <p :class="{ 'themeColor': store.currentSong?.song.id == row.song.id }" class="title">
          {{ row.song.name }}
        </p>
      </template>
    </el-table-column>

    <!-- 歌手 -->
    <el-table-column label="歌手" v-if="!albumMode">
      <template v-slot="{ row }">
        <Artists :artists="row.artists" />
      </template>
    </el-table-column>

    <!-- 专辑 -->
    <el-table-column label="专辑" v-if="!albumMode">
      <template v-slot="{ row }">
        <div hover:themeColor cursor-pointer>
          <p v-if="row.album.name.length" truncate>
            <span>{{ row.album.name }}</span>
            <span v-if="row.album.tns.length">&nbsp;({{ row.album.tns.join(",") }})</span>
          </p>
          <p v-else truncate>未知专辑</p>
        </div>
      </template>
    </el-table-column>

    <!-- 空数据 -->
    <template #empty>
      <el-empty description="暂无歌曲!" />
    </template>
  </el-table>
</template>

<script setup lang="ts">
import LikeIcon from "@/components/content/likeIcon/likeIcon.vue";
import Artists from "@/components/content/artists/artists.vue";
import { useMainStore, SongInfo } from "store";
import { PropType, toRefs } from "vue";
import { Operate } from "utils";
const store = useMainStore();
const props = defineProps({
  songList: {
    type: Array as PropType<SongInfo[]>,
    required: true
  },
  albumMode: {
    type: Boolean,
    default: false
  }
});
let { songList, albumMode } = toRefs(props);
</script>

<style scoped lang="scss">
.songList {
  @apply w-full h-full text-13px overflow-hidden select-none;

  .index {
    @apply truncate text-center text-gray-400;
  }

  .title {
    @apply truncate cursor-default;
  }

  .operate {
    @apply flex justify-between text-17px;

    .download {
      @apply i-carbon-cloud-download hover-themeColor cursor-pointer;
    }
  }
}
</style>