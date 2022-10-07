<!-- 独家放送item -->
<template>
  <div @click="$router.push(`/mvDetail/${id}`)" class="broadcast">
    <!-- 封面 -->
    <el-image :src="picUrl" fit="cover" lazy class="cover" />

    <!-- 描述 -->
    <p class="content">
      {{ copywriter }}
    </p>
  </div>
</template>
 
<script setup lang="ts">
import { toRaw } from "vue";
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  picUrl: {
    type: String,
    required: true
  },
  copywriter: {
    type: String,
    required: true
  },
});
let { id, picUrl, copywriter } = toRaw(props);
</script>

<style lang="scss" scoped>
.broadcast {
  @apply cursor-pointer relative rounded-md overflow-hidden;

  &:hover {
    .cover {
      @apply scale-110;
    }

    .content {
      @apply themeColor;
    }
  }

  .cover {
    @apply transition-transform brightness-85 flex h-35;
  }

  .content {
    @apply bg-white/75 text-15px absolute bottom-0px w-full p-5px text-14px truncate;
  }
}
</style>