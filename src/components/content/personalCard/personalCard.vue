<!-- 个人名片 -->
<template>
  <div class="personalCard">
    <!-- 头像 -->
    <el-image @click="$router.push(`/personalPage/${id}`)" :src="avatarUrl" fit="cover" class="avatar" />
    <div class="detail">
      <!-- 名称 -->
      <p class="nickname" @click="$router.push(`/personalPage/${id}`)">{{ nickname }}</p>
      <!-- 签名 -->
      <p v-if="signature" class="signature">{{ signature }}</p>
      <!-- 数量 -->
      <p class="count">
        <span>歌单: {{ playlistCount }}</span>
        <span>粉丝: {{ followeds }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  avatarUrl: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  signature: {
    type: String,
    required: true
  },
  playlistCount: {
    type: Number,
    required: true
  },
  followeds: {
    type: Number,
    required: true
  }
});
let { id, avatarUrl, nickname, signature, playlistCount, followeds } = toRaw(props);
</script>

<style lang="scss" scoped>
.personalCard {
  @apply py-15px px-20px flex gap-10px items-center hover-bg-gray-100;
}

.avatar {
  @apply rounded-full w-70px min-w-70px border-1px border-gray-200 cursor-pointer;
}

.detail {
  @apply text-13px text-gray-500 overflow-hidden cursor-default;

  .nickname {
    @apply truncate fontColor text-16px pb-10px cursor-pointer hover-themeColor;
  }

  .signature {
    @apply truncate pb-3px;
  }

  .count {
    @apply flex gap-10px;
  }
}
</style>