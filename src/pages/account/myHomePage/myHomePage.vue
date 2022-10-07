<!-- 我的主页 -->
<template>
  <div class="myHomePage">
    <!-- 详情 -->
    <Detail />

    <!-- 用户歌单 -->
    <SongList />
  </div>
</template>

<script setup lang="ts">
import Detail from "./coms/detail.vue";
import SongList from "./coms/songList.vue";
</script>

<style lang="scss" scoped>
.myHomePage {
  @apply wrapBox pt-15px pb-20px grid grid-cols-1 gap-y-20px md-grid-cols-2 md-gap-x-15px lg-gap-x-30px;
}
</style>