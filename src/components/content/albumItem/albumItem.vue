<!-- 专辑Item -->
<template>
  <div class="album">
    <!-- 封面 -->
    <div relative>
      <el-image :src="picUrl" fit="cover" class="cover" />
      <PlayIcon @playClick="playAlbum" :visible="true" size="28px" fontSize="23px" />
    </div>
    <!-- 信息 -->
    <div class="info">
      <!-- 名称 -->
      <p @click.stop="$router.push(`/albumDetail/${id}`)" class="name">{{ name }}</p>
      <!-- 艺术家 -->
      <Artists :artists="artists" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import Artists from "@/components/content/artists/artists.vue";
import { PropType, toRaw, toRef } from 'vue';
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { ArtistAPI } from "api";
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  artists: {
    type: Array as PropType<any[]>,
    required: true
  },
  picUrl: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    default: "#f3f4f6"
  },
})
let bgColor = toRef(props, "bgColor")
let { id, picUrl, artists, name } = toRaw(props);

// 播放歌曲
let playAlbum = async () => {
  try {
    let { code, songs }: any = await ArtistAPI.getAlbumInfo(id);
    if (code == 200) {
      let songList = Handle.SongList(songs);
      Operate.addPlayList(songList, id);
    };
  } catch (err: any) {
    ElMessage.error("加载专辑歌曲失败!");
  }
}
</script>

<style lang="scss" scoped>
.album {
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