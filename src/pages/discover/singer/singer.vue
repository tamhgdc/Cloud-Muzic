<!-- 歌手 -->
<template>
  <div pt-4 wrapBox>
    <!-- 分类列表 -->
    <categoryList @selected="cateSelected" :loading="loading" />

    <!-- 歌手列表 -->
    <ul v-if="artistsList.length" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled" class="singerList">
      <li v-for="item in artistsList" :key="item.id" @click="goSingerDetail(item)">
        <!-- 头像 -->
        <el-image :src="item.picUrl" lazy fit="cover" class="cover" />
        <!-- 名称 -->
        <p class="name">{{ item.name }}</p>
      </li>
    </ul>

    <!-- 提示 -->
    <Tip :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import categoryList from "./coms/categoryList.vue";
import { ref, reactive, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { ArtistAPI } from "api";
const router = useRouter();

// 是否禁用加载
let disabled = ref(false);
// 是否正在加载
let loading = ref(false);
// 类型列表
let typeList = {};
// 歌手列表
let artistsList = reactive<any>([]);

// 加载数据
let loadData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let { area, type, initial }: any = typeList;
    let { artists, code, more }: any = await ArtistAPI.getList(type, area, initial, artistsList.length, 30);
    if (code == 200) {
      artistsList.push(...artists);
      // 无法加载更多
      if (!more) disabled.value = true;
    }
  } catch (err: any) {
    ElMessage.error("加载歌手列表失败!");
  } finally {
    loading.value = false;
  }
}

// 分类已选择
let cateSelected = (category: any) => {
  // 清空数组
  artistsList.splice(0, artistsList.length);
  // 合并分类
  Object.assign(typeList, category);
  // 加载数据
  loadData();
}

// 跳转歌手页面
let goSingerDetail = (singer: any) => {
  let { alias, name, id } = toRaw(singer);
  router.push({
    path: `/singerDetail`,
    query: { id, name, alias }
  });
}
</script>

<style lang="scss" scoped>
.singerList {
  @apply grid6Cols justify-items-center mt-15px overflow-hidden;

  li {
    @apply cursor-pointer;

    .cover {
      @apply h-130px w-130px rounded-md border-1px border-gray-200;
    }

    .name {
      @apply mt-5px text-15px;
    }
  }
}
</style>