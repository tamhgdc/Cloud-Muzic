<!-- 视频详情 -->
<template>
  <div pt-4 pb-8>
    <!-- 创建人 -->
    <div flex justify-between>
      <section class="userInfo">
        <el-avatar @click="goPersonalPage" :src="creator.avatarUrl" :size="45" fit="cover" cursor-pointer />
        <p @click="goPersonalPage" class="nickname">{{ creator.nickname }}</p>
      </section>
      <section flex items-center>
        <p class="followedBtn" :class="{ followed: creator.followed }">
          <span text-18px :class="creator.followed ? 'i-carbon:checkmark' : 'i-carbon:add'"></span>
          <span>{{ creator.followed ? '已关注' : '关注' }}</span>
        </p>
      </section>
    </div>

    <!-- mv信息 -->
    <div pt-10px>
      <!-- 标题 -->
      <h4 class="title">
        <span class="content">{{ title }}</span>
        <span v-if="description" @click="showDesc = !showDesc" :class="{ active: showDesc }" class="descIcon"></span>
      </h4>

      <!-- 元信息 -->
      <p class="metaInfo">
        <span>发布: {{ publishTime }}</span>
        <span>播放: {{ playCount }}</span>
      </p>

      <!-- 简介 -->
      <p v-show="showDesc" class="description">{{ description }}</p>

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
import { VideoDetail } from "../videoDetail.vue";
import { PropType, ref, toRaw } from 'vue';
import { useRouter } from "vue-router";
import { Operate } from "utils";
const router = useRouter();
const props = defineProps({
  info: {
    type: Object as PropType<VideoDetail>,
    required: true
  }
});
let { vid, title, publishTime, playCount, subCount, shareCount, likedCount, description, creator } = toRaw(props.info);

// 是否显示简介
let showDesc = ref<boolean>(false);

// 跳转个人主页
let goPersonalPage = () => {
  if (creator.userId) {
    router.push(`/personalPage/${creator.userId}`);
  }
}

// 赞 / 收藏 / 分享
let control = ([{
  title: `赞 (${likedCount})`,
  icon: "i-carbon:thumbs-up group-hover:i-carbon-thumbs-up-filled",
  method() {
    console.log(vid);
  }
}, {
  title: `收藏 (${subCount})`,
  icon: "i-carbon:folder-add",
  method() {
    console.log(vid);
  }
}, {
  title: `分享 (${shareCount})`,
  icon: "i-carbon:link",
  method() {
    if (title) {
      Operate.shareInfo(title, location.href);
    }
  }
}]);

// 举报
let report = () => {
  console.log(vid);
}
</script>

<style lang="scss" scoped>
// 创建人信息
.userInfo {
  @apply flex gap-10px items-center;

  .nickname {
    @apply truncate text-15px cursor-pointer hover-themeColor;
  }
}

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

// 元信息
.metaInfo {
  @apply flex py-10px text-black/50 text-14px gap-15px;
}

// 描述
.description {
  @apply p-10px mb-10px rounded-md bg-#f4f4f5 text-14px;
}

// 关注按钮样式
.followedBtn {
  @apply flex items-center gap-3px cursor-pointer hover-opacity-80 themeBgColor text-white text-14px px-13px py-6px rounded-full;

  // 已关注的样式
  &.followed {
    @apply bg-gray-400 hover-opacity-80;
  }
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