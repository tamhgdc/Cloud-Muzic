<!-- MV Item -->
<template>
  <div :class="{ flex: isFlex }" class="mvItem">
    <!-- 封面 -->
    <section @click="goMVDetailPage" class="cover">
      <el-image fit="cover" lazy :src="cover" class="img" />
      <PlayCount :playCount="playCount" />
      <PlayIcon @playClick="goMVDetailPage" />
    </section>

    <!-- 详情 -->
    <section class="detail">
      <!-- 标题 -->
      <p @click="goMVDetailPage" class="title">{{ name }}</p>

      <!-- 艺术家 -->
      <Artists :artists="artists" />
    </section>
  </div>
</template>

<script setup lang="ts">
import PlayCount from "@/components/content/playCount/playCount.vue";
import PlayIcon from "@/components/content/playIcon/playIcon.vue";
import Artists from "@/components/content/artists/artists.vue";
import { PropType, toRaw, toRef } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  artists: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  playCount: {
    type: Number,
    required: true,
  },
  isFlex: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String as PropType<"push" | "replace">,
    default: "push"
  }
});
let isFlex = toRef(props, "isFlex");
let { id, cover, artists, name, playCount, mode } = toRaw(props);

// 跳转MV详情页面
let goMVDetailPage = () => {
  if (mode == "push") {
    router.push(`/mvDetail/${id}`);
  } else if (mode == "replace") {
    router.replace(`/mvDetail/${id}`);
  } else {
    router.push(`/`);
  }
}
</script>

<style lang="scss" scoped>
.mvItem {
  @apply w-full text-15px cursor-pointer overflow-hidden;

  .cover {
    @apply relative flex overflow-hidden;

    .img {
      @apply rounded-md brightness-85 w-full h-35;
    }
  }

  .detail {
    @apply mt-5px overflow-hidden;

    .title {
      @apply truncate hover-themeColor hover-dark-text-orange-400;
    }
  }
}

// 横向布局
.mvItem.flex {
  gap: 10px;

  .cover,
  .detail {
    flex: 1;
  }

  .title {
    margin-bottom: 5px;
    white-space: normal;

    @apply twoLineOmit;
  }
}
</style>
