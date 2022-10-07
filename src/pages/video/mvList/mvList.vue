<!-- MV -->
<template>
  <div wrapBox pt-4 pb-8>
    <!-- 最新MV -->
    <NewMV />

    <!-- 热播MV -->
    <HotMV />

    <!-- 网易出品 -->
    <Exclusive />

    <!-- MV排行榜 -->
    <MVRanking :limit="10">
      <template #default>
        <NavBar title="MV排行榜" path="/mvRankingList" />
      </template>
    </MVRanking>
  </div>
</template>

<script setup lang="ts">
import NewMV from "./coms/newMV.vue";
import HotMV from "./coms/hotMV.vue";
import Exclusive from "./coms/exclusive.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import MVRanking from "@/components/content/mvRanking/mvRanking.vue"; 
</script>