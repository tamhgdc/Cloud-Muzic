<!-- 用户歌单 -->
<template>
  <div>
    <h3 truncate>创建的歌单</h3>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <ul class="list">
          <li v-for="item in 3">
            <el-skeleton-item variant="image" w-full h-35 rounded-md />
            <el-skeleton-item variant="text" block my-6px w="6/10" />
            <el-skeleton-item variant="text" block w="3/10" />
          </li>
        </ul>
      </template>
      <template #default>
        <ul class="list">
          <li v-for="item in songList" :key="item.id" @click="$router.push(`/songListDetail/${item.id}`)">
            <!-- 封面 -->
            <div relative>
              <el-image :src="item.coverImgUrl" fit="cover" class="cover" />
              <PlayCount :playCount="item.playCount" />
              <PlayIcon @playClick="Operate.playSongList(item.id)" position="bottom-right" />
            </div>

            <!-- 名字 -->
            <p class="name">{{ item.name }}</p>

            <!-- 多少首歌曲 -->
            <p class="trackCount">{{ item.trackCount }}首</p>
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
import { useMainStore } from "store";
import { SongListAPI } from "api";
import { Operate } from "utils";
const store = useMainStore();

// 用户歌单
interface SongInfo {
  coverImgUrl: string,
  id: number,
  name: string,
  playCount: number,
  trackCount: number
}
let songList = reactive<SongInfo[]>([]);
// 加载状态
let loading = ref<boolean>(true);

// 加载用户歌单
let loadData = async () => {
  try {
    loading.value = true;
    // 加载歌单
    let { code, playlist }: any = await SongListAPI.getUserPlaylist(store.accountInfo.id);
    if (code == 200) {
      let reg = new RegExp(".*喜欢的音乐$", 'g');
      playlist = playlist.map((item: any) => {
        let { coverImgUrl, id, name, playCount, trackCount } = item;
        if (reg.test(name)) name = "我喜欢的音乐";
        return { coverImgUrl, id, name, playCount, trackCount };
      });
      songList.push(...playlist);
    };
  } catch (err: any) {
    ElMessage.error("加载用户歌单失败!");
  } finally {
    loading.value = false;
  }
}
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.list {
  @apply grid grid-cols-3 gap-5 lg-gap-x-7 lg-gap-y-5 pt-10px;

  li {
    @apply cursor-pointer;

    &:hover .name {
      @apply themeColor;
    }

    .cover {
      @apply rounded-md brightness-90;
    }

    .name {
      @apply truncate text-15px pt-5px pb-2px;
    }

    .trackCount {
      @apply truncate text-gray-400 text-13px;
    }
  }
}
</style>