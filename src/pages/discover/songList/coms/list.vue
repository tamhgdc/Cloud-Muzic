<!-- 歌单列表 -->
<template>
  <ul grid6Cols py-20px>
    <li @click="$router.push(`/songListDetail/${item.id}`)" v-for="item in props.songList" :key="item.id" cursor-pointer
      overflow-hidden>
      <div class="cover">
        <!-- 封面 -->
        <el-image fit-="cover" lazy :src="item.coverImgUrl" brightness-85 />

        <!-- 创建者名字-->
        <p class="nickname">
          <span>{{ item.creator.nickname }}</span>
        </p>

        <!-- 播放数 -->
        <PlayCount :playCount="item.playCount" />

        <!-- 播放按钮 -->
        <PlayIcon @playClick="Operate.playSongList(item.id)" position="bottom-right" />
      </div>

      <!-- 标题 -->
      <p class="name">{{ item.name }}</p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import { Operate } from "utils";
import { PropType } from "vue";
const props = defineProps({
  songList: {
    type: Array as PropType<any[]>,
    required: true
  }
});
</script>

<style lang="scss" scoped>
.cover {
  @apply relative flex overflow-hidden rounded-md text-white text-13px;

  .nickname {
    @apply absolute bottom-5px left-5px z-2 overflow-hidden truncate w-3/5;
  }
}

.name {
  @apply twoLineOmit mt-5px text-14px hover-themeColor;
}
</style>