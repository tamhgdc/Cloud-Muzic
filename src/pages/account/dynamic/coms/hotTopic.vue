<!-- 热门话题 -->
<template>
  <div class="hotTopic">
    <NavBar title="热门话题" path="/" px-10px />

    <el-skeleton :loading="loading" animated>
      <template #template>
        <ul ref="skeletonEl" class="list">
          <li v-for="item in 5" important-hover-bg-white>
            <el-skeleton-item variant="image" h-12 w-12 rounded-md />
            <div class="info">
              <el-skeleton-item variant="text" w="6/10" />
              <el-skeleton-item variant="text" w="3/10" />
            </div>
          </li>
        </ul>
      </template>
      <template #default>
        <ul class="list">
          <li v-for="{ id, title, picUrl, count } in topicList" :key="id">
            <el-image @click.stop="goTopicPage(id)" :src="picUrl" fit="cover" class="picture" />
            <div class="info">
              <p @click.stop="goTopicPage(id)" class="title">#{{ title }}#</p>
              <p class="count">{{ count }}人参与</p>
            </div>
          </li>
        </ul>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/common/navBar/navBar.vue";
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { OtherAPI } from "api";

// 骨架屏容器元素
let skeletonEl = ref<HTMLElement | null>(null);
// 加载状态
let loading = ref<boolean>(true);
// 话题列表
interface TopicInfo {
  id: number,
  title: string,
  picUrl: string,
  count: number
}
let topicList = reactive<TopicInfo[]>([]);

// 跳转话题
let goTopicPage = (id: number) => {
  console.log(id);
}

// 加载热门话题
let loadData = async () => {
  try {
    loading.value = true;
    let { code, hot }: any = await OtherAPI.getHotTopic(0, 5);
    if (code == 200) {
      // 处理热门列表
      let list: TopicInfo[] = hot.map((item: any): TopicInfo => {
        let { actId, title, sharePicUrl, participateCount } = item;
        return { id: actId, title, picUrl: sharePicUrl, count: participateCount }
      })
      topicList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载热门话题失败!");
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
.hotTopic {
  @apply w-300px mt-20px overflow-hidden hidden md-block;

  .list {
    @apply pt-10px;

    li {
      @apply flex gap-5px py-5px px-10px cursor-pointer hover-bg-gray-100;
    }
  }
}

.picture {
  @apply w-12 h-12 min-w-12 rounded-md border-1px border-#eee;
}

.info {
  @apply flex-1 flex flex-col justify-around overflow-hidden;

  .title {
    @apply text-15px truncate hover-themeColor select-none;
  }

  .count {
    @apply text-13px text-gray-400 truncate;
  }
}
</style>