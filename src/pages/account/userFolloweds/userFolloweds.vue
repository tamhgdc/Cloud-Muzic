<!-- 粉丝 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" wrapBox grid3Cols pt15px>
        <li v-for="item in 3" flex gap-10px items-center py-15px px-20px>
          <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-full />
          <div flex-1 h-full>
            <el-skeleton-item variant="text" w="1/3" />
            <el-skeleton-item variant="text" w="3/4" mt-10px />
            <el-skeleton-item variant="text" w="2/5" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <!-- 粉丝列表 -->
      <div v-show="followedList.length" v-for="item in followedList" :key="item.id" class="list">
        <PersonalCard v-bind="item" />
      </div>

      <!-- 空状态 -->
      <el-empty v-show="!followedList.length" description="暂无粉丝!" />
    </template>
  </el-skeleton>

  <!-- 分页 -->
  <div v-show="!loading && !(total < limit)" mb-15px>
    <el-pagination @current-change="change" background layout="prev, pager, next" :page-size="limit" :pager-count="5"
      :total="total" />
  </div>
</template>

<script lang="ts">
export default { name: "UserFolloweds" }
</script>
<script setup lang="ts">
import PersonalCard from "@/components/content/personalCard/personalCard.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { AccountAPI } from 'api';
const route = useRoute();

// 限制获取数量
let limit = 30;
// 数据总条数
let total = ref<number>(0);
// 加载状态
let loading = ref<boolean>(false);
// 粉丝列表
interface FollowedInfo {
  id: number,
  avatarUrl: string,
  nickname: string,
  signature: string,
  playlistCount: number,
  followeds: number
}
let followedList = reactive<FollowedInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  // 清空数组
  followedList.splice(0, followedList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载粉丝列表
let loadData = async (offset: number = 0) => {
  if (loading.value) return;
  loading.value = true;
  try {
    let id = route.params.uid;
    let { code, size, followeds }: any = await AccountAPI.getUserFolloweds(parseInt(id as string), offset, limit);
    if (code == 200) {
      // 数据总条数
      if (!total.value) total.value = size;
      // 处理粉丝列表
      let list: FollowedInfo[] = followeds.map((item: any): FollowedInfo => {
        let { userId, avatarUrl, nickname, signature, playlistCount, followeds } = item;
        // 处理签名值为null
        if (!signature) signature = "";
        return { id: userId, avatarUrl, nickname, signature, playlistCount, followeds };
      });
      followedList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载关注列表失败!");
  } finally {
    loading.value = false;
  }
}

//  初始化粉丝列表
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.list {
  @apply wrapBox grid3Cols py-15px;
}
</style>