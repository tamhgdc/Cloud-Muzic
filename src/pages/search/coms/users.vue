<!-- 用户 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul ref="skeletonEl" grid3Cols pt-15px>
        <li v-for="item in 3" flex gap-10px items-center p-10px rounded-md>
          <el-skeleton-item variant="image" h-17 w-17 min-w-17 rounded-md />
          <div flex-1 flex flex-col h-full justify-around>
            <el-skeleton-item variant="text" w="1/3" />
            <el-skeleton-item variant="text" w="2/3" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul v-show="userList.length" class="list">
        <li v-for="item in userList" :key="item.id" @click="$router.push(`/personalPage/${item.id}`)">
          <el-image :src="item.avatarUrl" fit="cover" class="avatar" />

          <div class="detail">
            <div flex gap-10px>
              <!--  名字 -->
              <p class="nickname">{{ item.nickname }}</p>
              <!-- 性别 -->
              <p v-if="item.gender" rounded-full p-3px
                :style="{ backgroundColor: item.gender == 1 ? '#dbeafe' : '#ffe4e6' }">
                <span text-15px shrink-0 flex
                  :class="item.gender == 1 ? 'i-carbon:gender-male' : 'i-carbon:gender-female'"
                  :style="{ color: item.gender == 1 ? '#3b82f6' : '#f43f5e' }"></span>
              </p>
            </div>
            <p v-if="item.signature" class="signature">{{ item.signature }}</p>
          </div>
        </li>
      </ul>

      <!-- 空状态 -->
      <el-empty v-show="!userList.length" description="暂无用户!" />
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
// 用户列表
interface UserInfo {
  id: number,
  nickname: string,
  // 0[无性] 1[男] 2[女]
  gender: 0 | 1 | 2,
  avatarUrl: string,
  signature: string
}
let userList = reactive<UserInfo[]>([]);

// 分页发生改变
let change = (page: number) => {
  // 清空数组
  userList.splice(0, userList.length);
  let offset = (page - 1) * limit;
  loadData(offset);
}

// 加载用户列表
let loadData = async (offset: number = 0) => {
  try {
    loading.value = true;
    let { code, result: { userprofiles = [], userprofileCount = 0 } }: any = await OtherAPI.getCloudSearch(route.params.keyword as string, 1002, offset, limit);
    if (code == 200) {
      // 处理数据总条数
      if (!total.value) {
        emit("getCount", `找到 ${userprofileCount} 位用户`);
        total.value = userprofileCount;
      }
      // 处理用户列表
      if (userprofiles.length) {
        let list: UserInfo[] = userprofiles.map((item: any): UserInfo => {
          let { userId, nickname, gender, avatarUrl, signature } = item;
          return { id: userId, nickname, gender, avatarUrl, signature };
        });
        userList.push(...list);
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
    @apply flex gap-10px;
  }
}

.avatar {
  @apply h-17 w-17 min-w-17 rounded-md border-1px border-gray-200 cursor-pointer;
}

.detail {
  @apply flex-1 flex flex-col justify-around;
  @apply bg-gray-100 hover-bg-gray-200 rounded-md cursor-pointer overflow-hidden p-10px;

  .nickname {
    @apply truncate min-w-1/3 hover-themeColor;
  }

  .signature {
    @apply truncate text-13px text-gray-400;
  }
}
</style>