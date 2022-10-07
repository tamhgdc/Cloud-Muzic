<!-- 专辑 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols py-15px>
        <li v-for="item in 3" flex gap-10px items-center p-10px rounded-md>
          <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-md />
          <el-skeleton-item variant="text" w="1/3" />
        </li>
      </ul>
    </template>
    <template #default>
      <ul v-show="albumList.length" class="list">
        <li v-for="item in albumList" :key="item.id" @click="$router.push(`/albumDetail/${item.id}`)">
          <el-image :src="item.picUrl" fit="cover" h-17 w-17 min-w-17 rounded-md />
          <Artists :artists="item.artists" fontSize="14px" />
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!albumList.length" description="暂无专辑!" />
    </template>
  </el-skeleton>

  <!-- 分页 -->
  <div v-show="!loading && !(total < limit)" mb-15px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
import Artists from "@/components/content/artists/artists.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { OtherAPI } from "api";
const route = useRoute();
const emit = defineEmits(["getCount"]);

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 获取歌曲数量限制
let limit = 18;
// 数据总条数
let total = ref<number>(0);
// 加载状态
let loading = ref<boolean>(true);
// 专辑列表
interface AlbumInfo {
  id: number,
  picUrl: string,
  artists: []
}
let albumList = reactive<AlbumInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  // 清空数组
  albumList.splice(0, albumList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载专辑列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { albums = [], albumCount = 0 } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 10, offset, limit);
    if (code == 200) {
      // 处理数据总条数
      if (!total.value) {
        emit("getCount", `找到 ${albumCount} 位歌手`);
        total.value = albumCount;
      }
      // 处理专辑列表
      if (albums.length) {
        let list = albums.map((item: any) => {
          let { id, picUrl, artists } = item;
          return { id, picUrl, artists };
        });
        albumList.push(...list);
      }
    }
  } catch (err: any) {
    ElMessage.error("加载专辑列表失败!");
  } finally {
    loading.value = false;
  }
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
.list {
  @apply grid3Cols py-15px;

  li {
    @apply flex items-center gap-10px p-10px bg-gray-100 hover-bg-gray-200 rounded-md cursor-pointer;
  }
}
</style>