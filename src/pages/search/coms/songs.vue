<!-- 单曲 -->
<template>
  <!-- 歌曲列表 -->
  <SongList v-loading="loading" :songList="songsList" />

  <!-- 分页 -->
  <div v-show="!loading" mb-15px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
import SongList from "@/components/content/songList/songList.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { SongInfo } from "store";
import { Handle } from "utils";
import { OtherAPI } from "api";
const route = useRoute();
const emit = defineEmits(["getCount"]);

// 获取歌曲数量限制
let limit = 30;
// 数据总条数
let total = ref<number>(0);
// 加载状态
let loading = ref<boolean>(true);
// 歌曲列表
let songsList = reactive<SongInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  songsList.splice(0, songsList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载歌曲列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { songCount, songs } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 1, offset, limit);
    if (code == 200) {
      if (!total.value) {
        emit("getCount", `找到 ${songCount} 首单曲`);
        total.value = songCount;
      }
      let list = Handle.SongList(songs);
      songsList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载音乐列表失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化歌曲列表
onMounted(() => loadData());
</script>