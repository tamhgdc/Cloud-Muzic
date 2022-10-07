<!-- 喜欢图标 -->
<template>
  <span @click.stop="iconClick" :class="icon" class="like"></span>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { useMainStore } from "store";
import { computed, ref } from "vue";
import { SongAPI } from "api";
const store = useMainStore();
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

// 喜欢状态
let likeStatus = ref<boolean>(false);
// 喜欢或取消喜欢
let iconClick = async () => {
  if (likeStatus.value) return;
  likeStatus.value = true;
  try {
    if (store.likeList.length && props.id) {
      let bool = store.likeList.includes(props.id);
      let { code }: any = await SongAPI.likeSong(props.id, !bool);
      if (code !== 200) return;
      if (bool) {
        // 取消喜欢
        store.likeList.splice(store.likeList.indexOf(props.id), 1);
        ElMessage.success({
          message: "取消喜欢成功!",
          duration: 1500,
          center: true,
          customClass: "likeSongTip"
        });
      } else {
        // 喜欢
        store.likeList.push(props.id);
        ElMessage.success({
          message: "已添加到我的喜欢!",
          duration: 1500,
          center: true,
          customClass: "likeSongTip"
        });
      }
    }
  } catch (err: any) {
    ElMessage.error("喜欢/取消喜欢失败!");
  } finally {
    likeStatus.value = false;
  }
};

// 图标
let icon = computed(() => {
  return store.likeList.includes(props.id) ? ['i-carbon-favorite-filled', 'text-red-500'] : ['i-carbon-favorite'];
});
</script>

<style lang="scss" scoped>
.like {
  @apply i-carbon-favorite hover-i-carbon-favorite-filled hover-text-red-500 hover-dark-text-orange-400 cursor-pointer;
}
</style>