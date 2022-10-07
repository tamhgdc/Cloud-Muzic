<!-- 个性推荐 推荐歌单 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul grid6Cols mt-15px min-h-300px>
        <li v-for="item in 12">
          <el-skeleton-item variant="image" w-full h-33 rounded-md />
          <el-skeleton-item variant="text" mt-6px />
          <el-skeleton-item variant="text" w="5/10" />
        </li>
      </ul>
    </template>
    <template #default>
      <ul class="songList">
        <!-- 每日推荐 -->
        <li v-if="store.accountInfo.id" @click="$router.push('/dailySongs')" cursor-pointer>
          <!-- 封面 -->
          <div class="dailySongs cover">
            <el-image src="/img/dailySongs.png" fit="cover" />
            <p class="tipText">根据你的音乐口味生成每日更新</p>
            <p class="date">{{ new Date().getDate() }}</p>
            <PlayIcon @playClick="playDailySongs" position="bottom-right" />
          </div>

          <p class="name">每日歌曲推荐</p>
        </li>

        <!-- 歌单列表 -->
        <li v-for="item in SongList" :key="item.id" @click="$router.push(`/songListDetail/${item.id}`)" cursor-pointer>
          <!-- 封面 -->
          <div class="cover">
            <el-image :src="item.picUrl" fit="cover" brightness-85 />
            <PlayCount :playCount="item.playCount" />
            <PlayIcon @playClick="Operate.playSongList(item.id)" position="bottom-right" />
          </div>

          <!-- 名字 -->
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import { reactive, ref, onActivated, computed } from "vue";
import { SongAPI, SongListAPI } from "api";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { useMainStore } from "store";
const store = useMainStore();

// 加载状态
let loading = ref<boolean>(false);
// 推荐歌单列表
interface SongInfo {
  picUrl: string,
  id: number,
  name: string,
  playCount: number
}
let songList = reactive<SongInfo[]>([]);
// 歌单
let SongList = computed((): SongInfo[] => {
  return store.accountInfo.id ? songList.slice(0, 11) : songList;
});

// 播放每日推荐音乐
let playDailySongs = async () => {
  try {
    if (store.songListID == 50) return ElMessage.warning('请不要重复播放相同歌单!');
    let { code, data: { dailySongs } }: any = await SongAPI.getRecommend();
    if (code == 200) {
      // 处理歌曲列表
      let list = Handle.SongList(dailySongs);
      store.addPlayList(list);
      // 设置歌单ID
      store.songListID = 50;
    }
  } catch (err: any) {
    ElMessage.error("加载每日推荐歌单失败!");
  }
}

// 加载推荐歌单列表
let loadData = async () => {
  try {
    loading.value = true;
    let { code, result }: any = await SongListAPI.getPersonalized(12);
    if (code == 200) {
      // 处理歌单
      let list = result.map((item: any) => {
        let { picUrl, id, name, playCount } = item;
        return { picUrl, id, name, playCount }
      })
      songList.push(...list);
    };
  } catch (err: any) {
    ElMessage.error("加载推荐歌单列表失败!");
  } finally {
    loading.value = false;
  }
}

// 如果没有请求到数据,重新发起请求
onActivated(() => {
  if (!loading.value && !songList.length) {
    loadData();
  }
})
</script>

<style lang="scss" scoped>
.songList {
  @apply grid6Cols mt-15px min-h-300px;
}

.dailySongs {
  &:hover .tipText {
    opacity: 1;
  }

  .tipText {
    @apply transition duration-300 ease-in-out absolute top-0px left-0px right-0px p-10px text-13px font-bold text-white bg-black/40 opacity-0;
  }

  .date {
    transform: translate(-50%, -10px);
    @apply text-white text-33px absolute top-50% left-50%;
  }
}

.cover {
  @apply relative flex overflow-hidden rounded-md;
}

.name {
  @apply mt-5px text-14px twoLineOmit hover-themeColor hover-dark-text-orange-400;
}
</style>