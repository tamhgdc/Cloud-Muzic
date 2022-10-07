<!-- MV详情 -->
<template>
  <div pt-4 pb-8>
    <!-- 艺术家 -->
    <div flex gap-10px items-center>
      <el-avatar :src="artists[0].img1v1Url" :size="45" />
      <Artists fontSize="15px" :artists="artists!" />
    </div>

    <!-- mv信息 -->
    <div pt-10px>
      <!-- 标题 -->
      <h4 class="title">
        <span class="content">{{ name }}</span>
        <span v-if="desc" @click="showDesc = !showDesc" :class="{ active: showDesc }" class="descIcon"></span>
      </h4>

      <!-- 元信息 -->
      <p class="metaInfo">
        <span>发布: {{ publishTime }}</span>
        <span>播放: {{ playCount }}</span>
      </p>

      <!-- 简介 -->
      <p v-show="showDesc" class="description">{{ desc }}</p>

      <!-- 赞 / 收藏 / 分享 -->
      <div class="operate">
        <ul class="list">
          <li v-for="item in control" :key="item.title" @click.stop="item.method">
            <span :class="item.icon" mr-5px text-17px></span>
            <span truncate>{{ item.title }}</span>
          </li>
        </ul>

        <!-- 举报 -->
        <p @click="report" class="report">举报</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Artists from "@/components/content/artists/artists.vue";
import { MVDetail } from "../mvDetail.vue";
import { toRaw, ref, PropType } from "vue";
import { Operate } from "utils";
const props = defineProps({
  info: {
    type: Object as PropType<MVDetail>,
    required: true
  }
});
let { id, artists, publishTime, playCount, desc, name, subCount, likedCount, shareCount } = toRaw(props.info);

// 是否显示简介
let showDesc = ref<boolean>(false);

// 赞 / 收藏 / 分享
let control = ([{
  title: `赞 (${likedCount})`,
  icon: "i-carbon:thumbs-up group-hover:i-carbon-thumbs-up-filled",
  method() {
    console.log(id);
  }
}, {
  title: `收藏 (${subCount})`,
  icon: "i-carbon:folder-add",
  method() {
    console.log(id);
  }
}, {
  title: `分享 (${shareCount})`,
  icon: "i-carbon:link",
  method() {
    if (name) {
      Operate.shareInfo(name, location.href);
    }
  }
}]);

// 举报
let report = () => {
  console.log(id);
}
</script>

<style lang="scss" scoped>
// 标题
.title {
  @apply text-20px flex items-center gap-5px truncate;

  .content {
    @apply max-w-7/10 truncate;
  }

  .descIcon {
    transition: transform 0.3s ease-in-out;
    transform: rotate(180deg);

    @apply min-w-25px text-25px cursor-pointer hover-themeColor i-eva-arrow-up-fill;

    &.active {
      transform: rotate(0deg);
    }
  }
}

// 描述
.description {
  @apply p-10px mb-10px rounded-md bg-#f4f4f5 text-14px;
}

// 元信息
.metaInfo {
  @apply flex py-10px text-black/50 text-14px gap-15px;
}

// 操作
.operate {
  @apply flex items-center justify-between text-14px gap-10px select-none;

  .list {
    @apply flex flex-wrap overflow-hidden flex-1 gap-10px;

    li {
      @apply flex items-center py-6px px-13px rounded-full cursor-pointer hover-text-white hover-themeBgColor border-1px border-#eee;
    }
  }

  .report {
    @apply truncate cursor-pointer hover-themeColor;
  }
}
</style>
