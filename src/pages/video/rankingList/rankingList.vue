<!-- 全部mv排行榜 -->
<template>
  <div wrapBox px-0 pt-15px pb-30px>
    <MVRanking :limit="50">
      <template #default>
        <p whitespace-nowrap text-15px>
          <span>最近更新: 今天</span>
          <el-popover :hide-after="0" placement="bottom-start" :width="200" trigger="hover">
            <template #reference>
              <span ml-5px text-17px cursor-pointer hover:themeColor i-carbon:information></span>
            </template>
            <template #default>
              <p p-10px>选取云音乐中三个月内发布的热度最高的50支MV,每天更新。热度由MV播放、收藏、分享数量综合计算</p>
            </template>
          </el-popover>
        </p>
      </template>
    </MVRanking>
  </div>
</template>

<script setup lang="ts">
import MVRanking from "@/components/content/mvRanking/mvRanking.vue";
</script>