<!-- 歌手详情 相似歌手 -->
<template>
  <!-- 提示 -->
  <el-alert v-if="!store.accountInfo.id" mt-2 title="需登陆后进行查看!" type="warning" :closable="false" />

  <!-- 相似歌手列表 -->
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" class="singerList">
        <li v-for="item in 6">
          <el-skeleton-item variant="image" class="cover" />
          <el-skeleton-item block variant="text" w="4/10" mt-7px />
        </li>
      </ul>
    </template>
    <template #default>
      <ul class="singerList">
        <li v-for="item in similarSinger" :key="item.id" @click="goSingerDetail(item)" class="group">
          <!-- 封面 -->
          <el-image :src="item.picUrl" fit="cover" class="cover" />
          <!-- 名字 -->
          <p class="name">{{ item.name }}</p>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!similarSinger.length" description="暂无相似歌手!" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useMainStore } from "store";
import { ArtistAPI } from "api";
const store = useMainStore();
const router = useRouter();
const route = useRoute();
let id = parseInt(route.query.id as string);

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref(true);
// 相似歌手列表
let similarSinger = reactive<any>([]);

// 加载相似歌手 需要登陆
let loadData = async () => {
  try {
    loading.value = true;
    let { code, artists }: any = await ArtistAPI.getSimilar(id);
    if (code == 200) {
      let list: any = artists.map((item: any) => {
        let { id, name, alias, picUrl } = item;
        return { id, name, alias, picUrl };
      });
      similarSinger.push(...list);
    }
  } catch (err: any) {
    ElMessage.warning("加载相似歌手失败!");
  } finally {
    loading.value = false;
  }
}

// 跳转歌手详情页面
let goSingerDetail = (singer: any) => {
  let { alias, name, id } = toRaw(singer);
  router.push({
    path: `/singerDetail`,
    query: { id, name, alias }
  });
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  const { stop } = useIntersectionObserver(skeletonEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadData();
      stop();
    }
  })
});
</script>

<style lang="scss" scoped>
.singerList {
  @apply grid6Cols justify-items-center mt-15px overflow-hidden;

  li {
    @apply cursor-pointer;

    .cover {
      @apply h-130px w-130px rounded-md border-1px border-gray-200;
    }

    .name {
      @apply mt-5px text-15px;
    }
  }
}
</style>