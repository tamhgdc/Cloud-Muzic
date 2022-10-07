<!-- 艺术家 -->
<template>
  <p class="artists" truncate>
    <span @click.stop="goArtistPage(artist)" v-for="artist in artists" :key="artist.id">
      {{ artist.name }}
    </span>
  </p>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { PropType, toRaw } from "vue";
const emit = defineEmits(['jump']);
const router = useRouter();
const props = defineProps({
  artists: {
    type: Array as PropType<any[]>,
    required: true,
  },
  fontSize: {
    type: String,
    default: "13px",
  },
});
let { artists, fontSize } = toRaw(props);

// 跳转艺术家页面
let goArtistPage = (artist: any) => {
  // 发生跳转事件
  emit('jump');
  let { id, name } = artist;
  router.push({ path: `/singerDetail`, query: { id, name } });
};
</script>

<style lang="scss" scoped>
.artists span {
  color: rgba(0, 0, 0, 0.6);
  font-size: v-bind(fontSize);
  cursor: pointer;

  &::after {
    display: inline-block;
    padding: 0px 5px;
    color: rgba(0, 0, 0, 0.4);
    content: "/";
    font-size: v-bind(fontSize);
    cursor: default;
  }

  &:last-child::after {
    display: none;
  }

  &:hover {
    @apply themeColor dark-text-orange-400;
  }
}
</style>
