<!-- 排行榜 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <ul wrapBox grid6Cols py-20px>
        <li v-for="item in 12">
          <el-skeleton-item variant="image" w-full h-33 rounded-md />
          <el-skeleton-item variant="text" block mt-5px w="7/10" />
          <el-skeleton-item variant="text" block mt-3px h-10px w="4/10" />
        </li>
      </ul>
    </template>
    <template #default>
      <ul wrapBox grid6Cols py-20px>
        <li v-for="item in rankingList" :key="item.id" @click="goSongListDetail(item.id)" class="group cover"
          cursor-pointer>
          <!-- 封面 -->
          <div relative>
            <el-image :src="item.coverImgUrl" fit="cover" rounded-md brightness-90 />
            <PlayCount :playCount="item.playCount" />
            <PlayIcon @playClick="Operate.playSongList(item.id)" />
          </div>

          <!-- 标题 -->
          <p truncate text-14px group-hover:themeColor>{{ item.name }}</p>

          <!-- 更新时间 -->
          <p truncate text="13px black/50" group-hover:themeColor>{{ Handle.TimeStamp(item.updateTime) }}</p>
        </li>
      </ul>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { useRouter } from "vue-router";
import { SongListAPI } from "api";
const router = useRouter();

// 加载状态
let loading = ref(true);
// 榜单列表
let rankingList = reactive<any>([]);

// 跳转歌单详情页面
let goSongListDetail = (id: number) => {
  router.push(`/songListDetail/${id}`);
}

// 加载榜单列表
let loadData = async () => {
  try {
    loading.value = true;
    let { code, list }: any = await SongListAPI.getTopDetail();
    if (code == 200) {
      list = list.map((item: any) => {
        let { id, coverImgUrl, name, playCount, updateTime } = item;
        return { id, coverImgUrl, name, playCount, updateTime };
      });
      rankingList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载榜单列表失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化榜单列表
onMounted(() => loadData());
</script>