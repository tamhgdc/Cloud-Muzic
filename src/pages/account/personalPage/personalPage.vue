<!-- 个人主页 -->
<template>
  <div wrapBox :key="`${$route.params.uid}`">
    <!-- 详情 -->
    <Detail />
    <!-- 歌单 -->
    <SongList />
  </div>
</template>

<script lang="ts">
export default { name: "PersonalPage" }
</script>
<script setup lang="ts">
import Detail from "./coms/detail.vue";
import SongList from "./coms/songList.vue";
</script>
