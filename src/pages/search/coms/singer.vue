<!-- 歌手 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols pt-15px>
        <li v-for="item in 3" flex items-center p-10px rounded-md>
          <div flex flex-1 items-center gap-10px>
            <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-md />
            <el-skeleton-item variant="text" w="1/3" />
          </div>

          <el-skeleton-item h-26px w-26px rounded-full />
        </li>
      </ul>
    </template>
    <template #default>
      <ul v-show="singerList.length" class="list">
        <li v-for="item in singerList" :key="item.id" @click="goSingerDetail(item)" class="group">
          <div flex flex-1 items-center gap-10px text-14px overflow-hidden>
            <!-- 封面 -->
            <el-image :src="item.picUrl" fit="cover" h-17 w-17 min-w-17 rounded-md />

            <!-- 名称 -->
            <p group-hover:themeColor truncate>{{ item.name }}</p>

            <!-- 别名 -->
            <p v-if="item.alias.length" text-gray-400 truncate>
              <span>(</span>
              <span v-for="aliasItem in item.alias">{{ aliasItem }}</span>
              <span>)</span>
            </p>
          </div>

          <!-- 用户图标 -->
          <p text-red-500 text-25px i-carbon:user-avatar-filled></p>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!singerList.length" description="暂无歌手!" />
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
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { OtherAPI } from "api";
const route = useRoute();
const router = useRouter();
const emit = defineEmits(["getCount"]);

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 获取歌曲数量限制
let limit = 18;
// 数据总条数
let total = ref<number>(0);
// 加载状态
let loading = ref<boolean>(true);
// 歌手列表
interface SingerInfo {
  id: number,
  picUrl: string,
  name: string,
  alias: string[]
}
let singerList = reactive<SingerInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  // 清空数组
  singerList.splice(0, singerList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 跳转歌手详情页面
let goSingerDetail = (singer: SingerInfo) => {
  let { alias, id, name } = singer;
  router.push({
    path: "/singerDetail",
    query: { alias, id, name }
  });
}

// 加载歌手列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { artistCount = 0, artists = [] } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 100, offset, limit);
    if (code == 200) {
      // 处理数据总条数
      if (!total.value) {
        emit("getCount", `找到 ${artistCount} 位歌手`);
        total.value = artistCount;
      }
      // 处理歌手列表
      if (artists.length) {
        let list = artists.map((item: any) => {
          let { id, alias, picUrl, name } = item;
          return { id, alias, picUrl, name };
        });
        singerList.push(...list);
      }
    }
  } catch (err: any) {
    ElMessage.error("加载歌手列表失败!");
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
    @apply hover-bg-gray-200 cursor-pointer p-10px bg-gray-100 rounded-md flex items-center justify-between;
  }
}
</style>