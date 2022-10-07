<!-- 关注的人 -->
<template>
  <div wrapBox>
    <!-- 关注列表 -->
    <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled" v-show="followList.length" class="list">
      <li v-for="item in followList" :key="item.id">
        <PersonalCard v-bind="item" />
      </li>
    </ul>

    <!-- 空状态 -->
    <el-empty v-show="disabled && !followList.length" description="未关注任何人!" />

    <!-- 提示 -->
    <Tip :disabled="disabled" />
  </div>
</template>

<script lang="ts">
export default { name: "UserFollows" }
</script>
<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import PersonalCard from "@/components/content/personalCard/personalCard.vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { reactive, ref } from "vue";
import { AccountAPI } from 'api';
const route = useRoute();

// 禁用无限加载
let disabled = ref<boolean>(false);
// 加载状态
let loading = ref<boolean>(false);
// 关注列表
interface FollowInfo {
  id: number,
  nickname: string,
  signature: string,
  playlistCount: number,
  followeds: number,
  avatarUrl: string
}
let followList = reactive<FollowInfo[]>([]);

// 加载关注列表
let loadData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let id = route.params.uid;
    let { code, more, follow }: any = await AccountAPI.getUserFollows(parseInt(id as string), followList.length);
    if (code == 200) {
      // 是否禁用无限加载
      if (!more) disabled.value = true;
      // 处理关注列表
      let list: FollowInfo[] = follow.map((item: any): FollowInfo => {
        let { userId, nickname, signature, playlistCount, followeds, avatarUrl } = item;
        // 处理签名值为null
        if (!signature) signature = "";
        return { id: userId, nickname, signature, playlistCount, followeds, avatarUrl };
      });
      followList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载关注列表失败!");
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.list {
  @apply grid3Cols pt-15px important-gap-0px;
}
</style>