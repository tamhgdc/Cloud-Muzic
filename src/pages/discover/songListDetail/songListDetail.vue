<!-- 歌单详情 -->
<template>
  <div wrapBox :key="`${$route.params.id}`">
    <!-- 歌单描述 -->
    <Detail :activeComs="activeComs" />

    <!-- 歌曲详情 -->
    <el-tabs v-model="activeComs">
      <el-tab-pane v-for="item in tabPaneList" :key="item.name" :label="item.label" :name="item.name">
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
export default { name: "SongListDetail" } 
</script>
<script setup lang="ts">
import Detail from "./coms/detail.vue";
import Comment from "./coms/comment.vue";
import SongList from "./coms/songList.vue";
import Collector from "./coms/collector.vue";
import { ref, markRaw } from "vue";

// 当前激活的组件
let activeComs = ref("SongList");
// tab列表
let tabPaneList = [
  {
    label: "歌曲列表",
    name: "SongList",
    component: markRaw(SongList)
  },
  {
    label: "评论",
    name: "Comment",
    component: markRaw(Comment)
  },
  {
    label: "收藏者",
    name: "Collector",
    component: markRaw(Collector)
  }
];
</script>