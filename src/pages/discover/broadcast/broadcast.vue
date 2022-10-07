<!-- 独家放送 -->
<template>
  <div wrapBox>
    <!-- 独家放送列表 -->
    <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled" class="list">
      <li v-for="item in broadcastList" :key="item.id">
        <BroadcastItem v-bind="item" />
      </li>
    </ul>

    <!-- 提示 -->
    <Tip :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import BroadcastItem from "@/components/content/broadcastItem/broadcastItem.vue";
import { ElMessage } from "element-plus";
import { ref, reactive } from "vue";
import { MVAPI } from "api";
export interface BroadcastInfo {
  id: number,
  copywriter: string,
  picUrl: string
}

// 是否正在加载
let loading = ref<boolean>(false);
// 是否禁用无限滚动
let disabled = ref<boolean>(false);
// 独家放送列表
let broadcastList = reactive<BroadcastInfo[]>([]);

// 加载数据
let loadData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let { code, result, more }: any = await MVAPI.getBroadcastList(broadcastList.length, 28);
    if (code == 200) {
      // 处理独家放送列表
      let list = result.map((item: any) => {
        let { id, copywriter, picUrl } = item;
        return { id, copywriter, picUrl };
      });
      broadcastList.push(...list);
      // 无法加载更多
      if (!more) disabled.value = true;
    }
  } catch (err: any) {
    ElMessage.error("加载独家放送失败!");
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.list {
  @apply pt-4 grid4Cols overflow-hidden;
}
</style>