<!-- 歌手详情 -->
<template>
  <div wrapBox py-4 :key="`${$route.query.id}`">
    <!-- 个人详情 -->
    <Detail mb-4 />

    <!-- 个人成就 -->
    <el-tabs v-model="activeComs" :lazy="true">
      <el-tab-pane v-for="item in tabPaneList" :key="item.name" :label="item.label" :name="item.name">
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  
<script lang="ts">
export default { name: "SingerDetail" }
</script>
<script setup lang="ts">
import Detail from "./coms/detail.vue";
import Album from "./coms/album.vue";
import MVList from "./coms/mvList.vue";
import SingerInfo from "./coms/singerInfo.vue";
import SimilarSinger from "./coms/similarSinger.vue";
import { ref, markRaw } from "vue";

// 当前激活的组件
let activeComs = ref("Album");
// tab列表
let tabPaneList = [
  {
    label: "专辑",
    name: "Album",
    component: markRaw(Album)
  },
  {
    label: "MV",
    name: "MV",
    component: markRaw(MVList)
  },
  {
    label: "歌手详情",
    name: "SingerInfo",
    component: markRaw(SingerInfo)
  },
  {
    label: "相似歌手",
    name: "SimilarSinger",
    component: markRaw(SimilarSinger)
  }
];
</script>