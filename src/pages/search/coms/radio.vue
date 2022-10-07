<!-- 电台 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols pt-15px>
        <li v-for="item in 3" flex gap-10px items-center p-10px rounded-md>
          <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-md />
          <div flex flex-col h-full justify-evenly flex-1>
            <el-skeleton-item variant="text" w="2/3" />
            <el-skeleton-item variant="text" w="1/3" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul v-show="radioList.length" class="list">
        <li v-for="item in radioList" :key="item.userId" @click="$router.push(`/radioDetail/${item.id}`)" class="group">
          <el-image :src="item.picUrl" fit="cover" h-17 w-17 min-w-17 rounded-md />
          <div class="detail">
            <p class="title" group-hover-themeColor>{{ item.name }}</p>
            <p text-13px text-gray-400>
              <span>by: </span>
              <span @click.stop="$router.push(`/personalPage/${item.userId}`)" hover-themeColor>{{ item.nickname
              }}</span>
            </p>
          </div>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!radioList.length" description="暂无电台!" />
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
// 电台列表
interface RadioInfo {
  id: number,
  picUrl: string,
  name: string,
  nickname: string,
  userId: number
}
let radioList = reactive<RadioInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  // 清空数组
  radioList.splice(0, radioList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载歌手列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { djRadiosCount = 0, djRadios = [] } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 1009, offset, limit);
    if (code == 200) {
      // 处理数据总条数
      if (!total.value) {
        emit("getCount", `找到 ${djRadiosCount} 个电台`);
        total.value = djRadiosCount;
      }
      // 处理电台列表
      if (djRadios.length) {
        let list: RadioInfo[] = djRadios.map((item: any): RadioInfo => {
          let { id, picUrl, name, dj: { nickname, userId } } = item;
          return { id, picUrl, name, nickname, userId };
        });
        radioList.push(...list);
      }
    }
  } catch (err: any) {
    ElMessage.error("加载电台列表失败!");
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

.detail {
  @apply flex flex-col h-full justify-evenly overflow-hidden;

  .title {
    @apply truncate text-15px;
  }
}
</style>