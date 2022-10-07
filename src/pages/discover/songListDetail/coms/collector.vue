<!-- 歌单收藏者 -->
<template>
  <!-- 提示 -->
  <el-alert v-if="!store.accountInfo.id" mt-2 title="登陆后查看全部" type="warning" :closable="false" />

  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols py-4>
        <li v-for="item in 6" flex gap-10px items-center>
          <el-skeleton-item variant="image" w-70px h-70px rounded-full />
          <div flex-1>
            <el-skeleton-item block variant="text" w="4/10" mb-7px />
            <el-skeleton-item block variant="text" w="7/10" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul grid3Cols py-4>
        <li v-for="item in collectorList" :key="item.userId" flex overflow-hidden gap-10px>
          <!-- 头像 -->
          <el-avatar @click="$router.push(`/personalPage/${item.userId}`)" :src="item.avatarUrl" cursor="pointer"
            :size="70" />
          <!-- 信息 -->
          <div class="group" flex overflow-hidden flex-1 flex-col flex-nowrap justify-center>
            <div flex items-center gap-5px>
              <!-- 名字 -->
              <p @click="$router.push(`/personalPage/${item.userId}`)" truncate text-15px cursor-pointer
                group-hover:themeColor>
                {{ item.nickname }}
              </p>
              <!-- 性别 -->
              <p v-if="item.gender" rounded-full p-3px
                :style="{ backgroundColor: item.gender == 1 ? '#dbeafe' : '#ffe4e6' }">
                <span text-15px shrink-0 flex
                  :class="item.gender == 1 ? 'i-carbon:gender-male' : 'i-carbon:gender-female'"
                  :style="{ color: item.gender == 1 ? '#3b82f6' : '#f43f5e' }"></span>
              </p>
            </div>
            <!-- 签名 -->
            <p v-if="item.signature" text="black/45 13px" truncate>{{ item.signature }}</p>
          </div>
        </li>
      </ul>

      <el-empty v-show="!collectorList.length" description="暂时没有收藏者!" />
    </template>
  </el-skeleton>

  <!-- 分页 -->
  <div v-show="collectorList.length" mb-20px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { reactive, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useMainStore } from "store";
import { SongListAPI } from "api";
const route = useRoute();
const store = useMainStore();
let id = parseInt(route.params.id as string);

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 是否正在加载
let loading = ref(true);
// 限制请求数据个数
let limit = 12;
// 总条数
let total = ref<number>(0);
// 收藏者列表
let collectorList = reactive<any>([]);
// 加载数据
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, subscribers, total: totalVal }: any = await SongListAPI.getSubscribers(id, offset, limit);
    if (code == 200) {
      if (!total.value) total.value = totalVal;
      collectorList.push(...subscribers);
    }
  } catch (err: any) {
    ElMessage.error("加载收藏者失败!");
  } finally {
    loading.value = false;
  }
};

// 分页发生变化
let change = (page: number) => {
  collectorList.splice(0, collectorList.length);
  loadData((page - 1) * limit);
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