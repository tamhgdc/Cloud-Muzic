<!-- 付费精品 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul wrapBox grid2Cols py-15px>
        <li v-for="item in 4" flex gap-15px>
          <el-skeleton-item variant="image" w-30 h-30 rounded-md />
          <div flex-1 flex flex-col justify-around>
            <el-skeleton-item block variant="text" h-20px w="4/10" />
            <div>
              <el-skeleton-item block variant="text" w="8/10" />
              <el-skeleton-item block variant="text" w="5/10" mt-4px />
            </div>
            <el-skeleton-item block variant="text" h-15px w="2/10" />
          </div>
        </li>
      </ul>
    </template>
    <template #default>
      <ul wrapBox grid2Cols py-15px>
        <li v-for="item in paygiftList" :key="item.id" flex gap-15px>
          <!-- 封面 -->
          <el-image :src="item.picUrl" fit="cover" rounded-md cursor-pointer w-30 />

          <!-- 简介 -->
          <div flex overflow-hidden flex-1 flex-col flex-nowrap justify-around cursor-default>
            <!-- 名字 -->
            <p truncate cursor-pointer hover:themeColor>{{ item.name }}</p>
            <!-- 描述 -->
            <p flex-nowrap flex-col flex overflow-hidden text="13px #8395a7">
              <span truncate>{{ item.rcmdText }}</span>
              <span truncate>{{ item.lastProgramName }}</span>
            </p>
            <!-- 价格 -->
            <p text="#d63031">{{ Handle.Price(item.originalPrice) }}</p>
          </div>
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { RadioAPI } from "api";
import { Handle } from "utils";

// 加载状态
let loading = ref(true);
// 付费精选列表
let paygiftList = reactive<any[]>([]);
// 加载付费精选
onMounted(async () => {
  try {
    let { code, data: { list } }: any = await RadioAPI.getPaygift(0, 50);
    if (code == 200) paygiftList.push(...list);
  } catch (err: any) {
    ElMessage.error("加载付费精选失败!");
  } finally {
    loading.value = false;
  }
});
</script>