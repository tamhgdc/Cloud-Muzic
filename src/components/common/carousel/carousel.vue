<!-- 轮播图 -->
<template>
  <div class="carousel">
    <div wrapBox>
      <el-carousel :interval="3000" indicator-position="none" :type="store.is640px ? '' : 'card'" height="200px">
        <el-carousel-item v-for="item in props.bannerList" :key="item.targetId">
          <el-image rounded-md h-full :src="item.imageUrl || item.pic" fit="cover" />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from 'store';
import { PropType } from 'vue';
export interface BannerItem {
  imageUrl: string,
  pic: string,
  targetId: number,
  [propName: string]: any
}
const store = useMainStore();
const props = defineProps({
  bannerList: {
    type: Array as PropType<BannerItem[]>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.carousel {
  @apply pt-2 sm-py-7 sm-bg-gray-100 dark-sm-bg-gray-300;
}
</style>