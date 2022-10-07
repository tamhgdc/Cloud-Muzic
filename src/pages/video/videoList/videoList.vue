<!-- Video -->
<template>
  <div wrapBox pt-15px>
    <!-- 分类选择 -->
    <CateList :loading="loading" :currentType="currentType" @selected="selected" />

    <!-- 视频列表 -->
    <ul v-if="videoList.length" v-infinite-scroll="loadData" grid4Cols pt-20px overflow-hidden>
      <li v-for="item in videoList" :key="item.vid">
        <VideoItem v-bind="item" />
      </li>
    </ul>

    <!-- 提示 -->
    <Tip :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import VideoItem from "@/components/content/videoItem/videoItem.vue";
import { onMounted, reactive, ref } from "vue";
import CateList from "./coms/cateList.vue";
import { ElMessage } from "element-plus";
import { VideoAPI } from "api";

// 是否正在加载
let loading = ref<boolean>(false);
// 禁用无限加载
let disabled = ref<boolean>(false);
// 当前类型
let currentType = ref<string>("全部视频");
// 当前类型ID
let currentID = ref<number>(0);
// 视频列表
let videoList = reactive<any>([]);

// 类型选择
let selected = (typeName: string, typeID: number) => {
  currentType.value = typeName;
  currentID.value = typeID;
  // 清空视频列表
  videoList.splice(0, videoList.length);
  // 初始化禁用无限滚动
  disabled.value = false;
  // 加载数据
  loadData();
}

// 处理视频列表
let handleList = (list: any[]) => {
  return list.map((item: any) => {
    let { data: { title, vid, durationms, coverUrl, playTime, creator: { nickname, userId } } } = item;
    return {
      uid: userId, // 创建人ID
      vid,         // 视频ID
      title,       // 标题
      durationms,  // 时长
      coverUrl,    // 封面
      playTime,    // 播放次数
      nickname     // 创建人名称
    }
  });
}

// 加载视频列表数据
let loadData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    if (currentID.value === 0) {
      // 获取全部视频列表
      let { code, datas, hasmore }: any = await VideoAPI.getTimelineAll(videoList.length);
      if (code == 200) {
        // 是否禁止加载
        if (!hasmore) disabled.value = true;
        // 处理视频列表
        let list = handleList(datas);
        videoList.push(...list);
      }
    } else {
      // 获取标签/分类视频列表
      let { code, datas, hasmore }: any = await VideoAPI.getGroup(currentID.value, videoList.length);
      if (code == 200) {
        // 是否禁止加载
        if (!hasmore) disabled.value = true;
        // 处理视频列表
        let list = handleList(datas);
        videoList.push(...list);
      }
    }
  } catch (err: any) {
    ElMessage.error("加载视频列表失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化视频列表
onMounted(() => loadData());
</script>