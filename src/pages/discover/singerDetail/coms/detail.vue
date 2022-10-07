<!-- 歌手详情 详情 -->
<template>
  <div class="singerDetail">
    <!-- 歌手图片 -->
    <el-image :src="singerDetail.cover" fit="cover" class="avatar" />

    <!-- 歌手信息 -->
    <div class="info">
      <!-- 姓名 -->
      <h1 truncate>{{ name }}</h1>
      <!-- 别名 -->
      <p v-if="alias" class="alias">
        {{ typeof alias == 'string' ? alias : alias.join("; ") }}
      </p>

      <!-- 收藏 -->
      <div v-if="store.accountInfo.id" @click="collection" :class="{ collected: followed }" class="collection">
        <span text-19px p-y-5px i-carbon:folder-add></span>
        <span p-y-5px>{{ followed ? '已收藏' : '收藏' }}</span>
      </div>

      <!-- 数量 -->
      <ul class="count">
        <li truncate>单曲数: {{ singerDetail.musicSize }}</li>
        <li truncate>专辑数: {{ singerDetail.albumSize }}</li>
        <li truncate>MV数: {{ singerDetail.mvSize }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useMainStore } from "store";
import { ArtistAPI } from "api";
const store = useMainStore();
const route = useRoute();
let { id, name, alias }: any = toRaw(route.query);

// 收藏状态
let followed = ref(false);
// 收藏 需登陆
let collection = () => { }

// 歌手详情
let singerDetail = reactive<any>({});
// 加载歌手详情
onMounted(async () => {
  try {
    let { code, data: { artist } }: any = await ArtistAPI.getDetail(parseInt(id as string));
    if (code == 200) Object.assign(singerDetail, artist);
  } catch (err: any) {
    ElMessage.error("加载歌手详情失败!");
  }
})
</script>

<style lang="scss" scoped>
.singerDetail {
  @apply flex flex-col gap-20px sm-flex-row;

  .avatar {
    @apply flex-none transition-all duration-300 ease-linear h-35 w-35 lg-h-50 lg-w-50 rounded-md;
  }

  .info {
    @apply flex overflow-hidden flex-1 flex-col flex-nowrap pt-2;

    .alias {
      @apply text-14px text-black/50 truncate mt-1;
    }

    .count {
      @apply flex text-15px gap-20px mt-3 lg-mt-5;
    }
  }
}

.collection {
  @apply mt-3 lg-mt-5 flexCenter w-80px border-1px border-#eee rounded-20px whitespace-nowrap cursor-pointer gap-3px select-none transition-all;

  &:hover {
    @apply themeColor bg-#f5f7fa;
  }

  &.collected {
    width: 90px;
    color: var(--theme-color);
  }
}
</style>