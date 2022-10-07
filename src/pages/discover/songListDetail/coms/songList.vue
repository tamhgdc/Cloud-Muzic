<!-- 歌曲列表 -->
<template>
  <!-- 列表 -->
  <SongList v-loading="loading" :songList="songList" />

  <!-- 分页 -->
  <div v-show="!loading && !(total < limit)" mb-15px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
import SongList from "@/components/content/songList/songList.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { SongListAPI } from "api";
import { SongInfo } from "store";
import { Handle } from "utils";
const route = useRoute();
let id = parseInt(route.params.id as string);

// 获取歌曲数量限制
let limit = 50;
// 数据总条数
let total = ref<number>(0);
// 禁止无限滚动
let disabled = ref<boolean>(false);
// 加载状态
let loading = ref<boolean>(false);
// 歌曲列表
let songList = reactive<SongInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  songList.splice(0, songList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载歌曲列表
let loadData = async (offset: number = 0) => {
  if (loading.value) return;
  loading.value = true;
  try {
    let { code, songs }: any = await SongListAPI.getTrackAll(id, offset, limit);
    if (code == 200) {
      let list = Handle.SongList(songs);
      songList.push(...list);
    }
    // 禁用无限加载
    if (songs.length < limit) {
      disabled.value = true;
    }
  } catch (err: any) {
    ElMessage.error("加载音乐列表失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化歌曲列表
onMounted(async () => {
  let { code, playlist: { trackCount } }: any = await SongListAPI.getDetail(id);
  if (code == 200) {
    total.value = trackCount;
    loadData();
  }
});
</script>