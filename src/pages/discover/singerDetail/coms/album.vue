<!-- 歌手详情 专辑 -->
<template>
  <ul v-infinite-scroll="loadAlbumData" :infinite-scroll-disabled="disabled" class="albumList">
    <li v-for="album in albumList" :key="album.id">
      <!-- 专辑封面  -->
      <section overflow-hidden>
        <el-image :src="album.picUrl" fit="cover" lazy class="cover" />
        <p v-if="album.time" text-sm>{{ Handle.TimeStamp(album.time) }}</p>
      </section>

      <!-- 歌单列表 -->
      <section flex-1 h-full overflow-hidden>
        <!-- 信息 -->
        <div class="info">
          <!-- 标题 -->
          <h4 class="title">{{ album.name }}</h4>
          <!-- 操作 -->
          <div flex-none>
            <span @click="Operate.addPlayList(album.songList, album.id)" class="icon" i-carbon:continue></span>
            <span v-if="album.id" class="icon" ml-15px i-carbon:folder-add></span>
          </div>
        </div>

        <!-- 歌单列表 -->
        <SongList :songList="album.more ? album.songList.slice(0, 10) : album.songList" :albumMode="true" />

        <!-- 是否显示全部 -->
        <div v-if="album.more" class="more">
          <span @click.stop="album.more = false">查看全部</span>
          <span text-18px i-carbon:chevron-right></span>
        </div>
      </section>
    </li>
  </ul>

  <!-- 提示 -->
  <Tip :disabled="disabled" />
</template>

<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import SongList from "@/components/content/songList/songList.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { useRoute } from "vue-router";
import { SongInfo } from "store";
import { ArtistAPI } from "api";
const route = useRoute();
let id = parseInt(route.query.id as string);

// 是否正在加载
let loading = ref(false);
// 是否禁用无限滚动
let disabled = ref(false);
// 偏移量
let offset = ref(0);
// 限制
let limit = 5;
// 专辑列表
interface AlbumItem {
  id: number,
  more: boolean,
  songList: SongInfo[],
  time: number,
  name: string,
  picUrl: string
}
let albumList = reactive<AlbumItem[]>([]);

// 加载专辑数据
let loadAlbumData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let { more, code, hotAlbums }: any = await ArtistAPI.getAlbum(id, offset.value, limit);
    if (code == 200) {
      // 加载专辑信息
      let list = await loadAlbumInfo(hotAlbums) as AlbumItem[];
      albumList.push(...list?.sort((x, y) => y.time - x.time));
      offset.value += limit;
      // 无法加载更多
      if (!more) disabled.value = true;
    }
  } catch (err: any) {
    ElMessage.error("加载专辑列表失败!");
  } finally {
    loading.value = false;
  }
}

// 加载专辑信息
let loadAlbumInfo = (hotAlbums: any) => {
  return Promise.all(hotAlbums.map(async (item: any) => {
    let { code, album: { id, publishTime: time, name, picUrl }, songs }: any = await ArtistAPI.getAlbumInfo(item.id);
    if (code == 200) {
      // 处理歌单列表
      let songList = Handle.SongList(songs);
      // 处理歌曲列表长度
      let more = songList.length > 10 ? true : false;
      return { id, time, more, songList, name, picUrl }
    }
  }));
}

// 加载热门50首歌曲
let loadHot50 = async () => {
  try {
    loading.value = true;
    let { code, songs }: any = await ArtistAPI.getTopSong(id);
    if (code == 200) {
      let songList = Handle.SongList(songs);
      let more = songList.length > 10 ? true : false;
      albumList.push({
        id: 0,
        more,
        songList,
        time: 0,
        name: "热门50首",
        picUrl: "/img/top50.png"
      });
    }
  } catch (err: any) {
    ElMessage.error("加载Top50失败!");
  } finally {
    loading.value = false;
  }
}

// 加载热门50首歌曲
onMounted(() => loadHot50());
</script>

<style lang="scss" scoped>
.albumList {
  @apply flex flex-col flex-nowrap gap-40px py-4 overflow-hidden;

  li {
    @apply flex flex-col sm-flex-row gap-25px;

    .cover {
      @apply transition-all w-35 h-35 lg-w-40 lg-h-40 rounded-md shadow-lg;
    }

    .info {
      @apply flex items-center mb-10px gap-15px overflow-hidden;

      .title {
        @apply truncate max-w-50% font-bold text-17px cursor-pointer;
      }

      .icon {
        @apply text-black/50 text-19px cursor-pointer hover-themeColor;
      }
    }

    .more {
      @apply flex items-center justify-end h-40px text-black/60 text-14px cursor-pointer hover-fontColor;
    }

    :deep(.el-table) {
      .el-table__header-wrapper {
        display: none;
      }

      td.el-table__cell,
      th.el-table__cell.is-leaf {
        border-bottom: none;
      }

      .el-table__inner-wrapper::before {
        background-color: transparent;
      }
    }
  }
}
</style>