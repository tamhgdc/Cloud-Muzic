<!-- 个性推荐 -->
<template>
  <div>
    <!-- 轮播图 -->
    <Carousel :bannerList="bannerList" />

    <!-- 渲染列表 -->
    <div wrapBox pt-7 v-for="item in renderList" :key="item.path">
      <!-- 导航栏 -->
      <NavBar :path="item.path" :title="item.title" />
      <!-- 动态组件 -->
      <component :is="item.component" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Carousel, { BannerItem } from "@/components/common/carousel/carousel.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import SongList from "./coms/songList.vue";
import Broadcast from "./coms/broadcast.vue";
import NewSong from "./coms/newSong.vue";
import Radio from "./coms/radio.vue";
import MV from "./coms/mv.vue";
import { onMounted, reactive, markRaw } from "vue";
import { ElMessage } from "element-plus";
import { OtherAPI } from "api";

// 渲染列表
let renderList = reactive([
  {
    title: "推荐歌单",
    path: "/discover/songList",
    component: markRaw(SongList),
  },
  {
    title: "独家放送",
    path: "/broadcast",
    component: markRaw(Broadcast),
  },
  {
    title: "最新音乐",
    component: markRaw(NewSong),
  },
  {
    title: "推荐MV",
    path: "/video/mvList",
    component: markRaw(MV),
  },
  {
    title: "主播电台",
    path: "/discover/radioStation",
    component: markRaw(Radio),
  },
]);

// banner列表
let bannerList = reactive<BannerItem[]>([]);
// 加载banner列表
onMounted(async () => {
  try {
    let { code, banners }: any = await OtherAPI.getBanner();
    if (code == 200) bannerList.push(...banners);
  } catch (err: any) {
    ElMessage.error("加载Banner失败!");
  }
});
</script>