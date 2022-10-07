<!-- 电台 -->
<template>
  <!-- 轮播图 -->
  <Carousel :bannerList="bannerList" />

  <!-- 电台分类 -->
  <CateList />

  <!-- 付费精选 -->
  <PaidBoutique />

  <!-- 渲染列表 -->
  <div v-for="{ title, path, id } in renderList" :key="id" wrapBox pb-7>
    <!-- 导航栏 -->
    <NavBar :title="title" :path="path" />
    <!-- 电台组件 -->
    <CateRadio :id="id" :title="title" />
  </div>
</template>

<script setup lang="ts">
import Carousel, { BannerItem } from "@/components/common/carousel/carousel.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import CateList from "./coms/cateList.vue";
import PaidBoutique from "./coms/paidBoutique.vue";
import CateRadio from "./coms/cateRadio.vue";
import { reactive, onMounted } from "vue";
import { RadioAPI } from "api";

// 渲染列表
let renderList = reactive([{
  title: "创作翻唱",
  path: "/radioCateDetail?id=2001&name=创作翻唱",
  id: 2001,
}, {
  title: "音乐推荐",
  path: "/radioCateDetail?id=2&name=音乐推荐",
  id: 2,
}, {
  title: "情感",
  path: "/radioCateDetail?id=3&name=情感",
  id: 3,
}, {
  title: "脱口秀",
  path: "/radioCateDetail?id=8&name=脱口秀",
  id: 8,
}]);

// banner列表
let bannerList = reactive<BannerItem[]>([]);
// 加载banner列表
onMounted(async () => {
  let { code, data }: any = await RadioAPI.getBanner();
  if (code == 200) bannerList.push(...data);
});
</script>
