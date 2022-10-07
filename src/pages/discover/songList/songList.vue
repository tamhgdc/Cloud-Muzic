<!-- 发现音乐 - 歌单 -->
<template>
  <div wrapBox py-20px>
    <!-- 分类列表 -->
    <CateList :currentType="currentType" :loading="loading" @selected="selected" />

    <!-- 骨架屏 -->
    <el-skeleton :loading="loading" animated>
      <template #template>
        <ul grid6Cols py-20px>
          <li v-for="item in 6">
            <el-skeleton-item variant="image" w-full h-33 rounded-md />
            <el-skeleton-item variant="text" mt-6px />
            <el-skeleton-item variant="text" w="5/10" />
          </li>
        </ul>
      </template>
      <template #default>
        <!-- 歌单列表 -->
        <List :songList="songList" />
      </template>
    </el-skeleton>

    <!-- 分页 -->
    <div v-show="songList.length">
      <el-pagination @current-change="(page: number) => loadData(page - 1)" background layout="prev, pager, next"
        :pager-count="5" :page-size="limit" :total="total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import CateList from "./coms/cateList.vue";
import { ElMessage } from "element-plus";
import List from "./coms/list.vue";
import { SongListAPI } from "api";

// 是否正在加载
let loading = ref<boolean>(true);
// 当前类型
let currentType = ref<string>("全部歌单");
// 列表总条数
let total = ref<number>(0);
// 限制请求的个数
let limit = 30;
// 歌单列表
let songList = reactive<any>([]);

// 分类选择事件
let selected = (type: string) => {
  total.value = 0;
  currentType.value = type;
  loadData(0);
}

// 加载歌单列表
let loadData = async (offset: number) => {
  try {
    loading.value = true;
    songList.splice(0, songList.length);
    let { code, playlists, total: count }: any = await SongListAPI.getTop(currentType.value, offset *= limit, limit);
    if (code == 200) {
      if (!total.value) total.value = count;
      songList.splice(0, songList.length, ...playlists);
    }
  } catch (err: any) {
    ElMessage.error("加载歌单列表失败!");
  } finally {
    loading.value = false;
  }
}

// 初始化歌单列表
onMounted(() => loadData(0));
</script>