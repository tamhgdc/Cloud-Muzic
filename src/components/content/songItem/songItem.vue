<!-- 歌曲Item -->
<template>
  <div class="song">
    <!-- 封面 -->
    <div relative>
      <el-image :src="songInfo.album.picUrl" fit="cover" class="cover" />
      <PlayIcon @playClick="playSong" :visible="true" size="28px" fontSize="23px" />
    </div>
    <!-- 信息 -->
    <div class="info">
      <!-- 名称 -->
      <p @click.stop="playSong" class="name">{{ songInfo.song.name }}</p>
      <!-- 艺术家 -->
      <Artists :artists="songInfo.artists" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import Artists from "@/components/content/artists/artists.vue";
import { useMainStore, SongInfo } from "store";
import { PropType, toRefs } from 'vue';
const store = useMainStore();
const props = defineProps({
  songInfo: {
    type: Object as PropType<SongInfo>,
    required: true
  },
  bgColor: {
    type: String,
    default: "#f3f4f6"
  }
})
let { songInfo, bgColor } = toRefs(props);

// 播放歌曲
let playSong = () => {
  store.playSong(songInfo.value);
}
</script>

<style lang="scss" scoped>
.song {
  background-color: v-bind(bgColor);
  @apply w-full rounded-md flex gap-10px p-8px cursor-pointer;

  .cover {
    @apply flex w-12 h-12 min-w-12 rounded-md cursor-pointer brightness-90;
  }

  .info {
    @apply flex-1 flex flex-col justify-around overflow-hidden;

    .name {
      @apply truncate text-14px cursor-pointer hover-themeColor;
    }
  }
}
</style>