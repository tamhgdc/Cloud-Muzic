<!-- 歌单 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols pt-15px>
        <li v-for="item in 3" flex gap-10px p-10px rounded-md>
          <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-md />
          <div h-full flex flex-col justify-around flex-1>
            <el-skeleton-item variant="text" w="2/3" />
            <el-skeleton-item variant="text" w="1/3" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul v-show="songList.length" class="list">
        <li v-for="item in songList" :key="item.id" @click="$router.push(`/songListDetail/${item.id}`)" class="group">
          <!-- 封面 -->
          <el-image :src="item.coverImgUrl" fit="cover" class="img" />
          <!-- 详情 -->
          <div class="detail">
            <!-- 标题 -->
            <p class="title" group-hover:themeColor>{{ item.name }}</p>
            <!-- 信息 -->
            <div class="info">
              <p whitespace-nowrap>{{ item.trackCount }}首</p>
              <p>
                <span>by: </span>
                <span @click.stop="$router.push(`/personalPage/${item.userId}`)" class="nickname">
                  {{ item.nickname }}
                </span>
              </p>
            </div>
          </div>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!songList.length" description="暂无歌单!" />
    </template>
  </el-skeleton>

  <!-- 分页 -->
  <div v-show="!loading && !(total < limit)" mb-15px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
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
// 歌单列表列表
interface SongListInfo {
  coverImgUrl: string,
  name: string,
  id: number,
  trackCount: number,
  userId: number,
  nickname: string
}
let songList = reactive<SongListInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  songList.splice(0, songList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载歌单列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { playlistCount = 0, playlists = [] } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 1000, offset, limit);
    if (code == 200) {
      if (!total.value) {
        emit("getCount", `找到 ${playlistCount} 个歌单`);
        total.value = playlistCount;
      }
      // 处理歌单
      if (playlists.length) {
        let list = playlists.map((item: any) => {
          let { coverImgUrl, name, id, trackCount, creator: { userId, nickname } } = item;
          return { coverImgUrl, name, id, trackCount, userId, nickname }
        })
        songList.push(...list);
      }
    }
  } catch (err: any) {
    ElMessage.error("加载音乐列表失败!");
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
    @apply flex items-center gap-10px p-10px rounded-md bg-gray-100 hover-bg-gray-200 cursor-pointer;
  }
}

.img {
  @apply h-17 w-17 min-w-17 rounded-md;
}

.detail {
  @apply h-full flex flex-col justify-around overflow-hidden;

  .title {
    @apply text-16px truncate hover-themeColor;
  }

  .info {
    @apply flex gap-15px overflow-hidden text-14px text-gray-400;

    p:last-child {
      @apply truncate;

      .nickname {
        @apply hover-themeColor;
      }
    }
  }
}
</style>