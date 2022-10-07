<!-- 相关视频 -->
<template>
  <h4 text-lg mb-2>相关推荐</h4>

  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul>
        <li v-for="item in 4" flex gap-10px mb-4>
          <el-skeleton-item variant="image" flex-1 h-35 rounded-md />
          <div flex-1 mt-5px>
            <el-skeleton-item block variant="text" w-full />
            <el-skeleton-item block variant="text" w="2/10" mt-7px />
            <el-skeleton-item block variant="text" w="4/10" mt-10px />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <div mb-4 v-for="item in relevantList" :key="item.id">
        <VideoItem v-bind="item" mode="replace" :isFlex="true" />
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import VideoItem from "@/components/content/videoItem/videoItem.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { VideoAPI } from "api";
const route = useRoute();

// 加载状态
let loading = ref(true);
// 相关video列表
let relevantList = reactive<any[]>([]);
// 加载相关video
let loadData = async () => {
  try {
    let { code, data }: any = await VideoAPI.getRelated(route.params.vid as string);
    if (code == 200) {
      let list = data.map((item: any) => {
        let { vid, coverUrl, title, durationms, playTime, creator } = item;
        let { userId, userName } = creator[0];
        return { uid: userId, nickname: userName, vid, coverUrl, title, durationms, playTime }
      });
      relevantList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载相关video失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化数据
onMounted(() => loadData());
</script>