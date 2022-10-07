<!-- 播放图标 -->
<template>
  <div ref="playIcon" @click.stop="$emit('playClick')" :class="position, { visible: visible }" class="playIcon">
    <span i-eva:arrow-right-fill></span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, PropType, ref, toRefs, computed } from 'vue';
const props = defineProps({
  position: {
    type: String as PropType<"center" | "bottom-right">,
    default: "center",
  },
  visible: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: "40px",
  },
  fontSize: {
    type: String,
    default: "30px",
  }
});
let { position, visible, size, fontSize } = toRefs(props);

// 播放图标元素
let playIcon = ref<HTMLElement | null>(null);

// 为父元素添加类
onMounted(() => {
  playIcon.value?.parentElement?.classList.add("group");
})
</script>

<style lang="scss" scoped>
.playIcon {
  width: v-bind(size);
  height: v-bind(size);
  font-size: v-bind(fontSize);
  transition: opacity 0.3s ease-in-out;
  @apply flex items-center justify-center;
  @apply opacity-0 group-hover-opacity-100;
  @apply absolute rounded-full color-#d33a31 bg-white/70 cursor-pointer;

  &:hover {
    @apply bg-white/90;
  }
}

.center {
  transform: translate(-50%, -50%);
  @apply top-1/2 left-1/2;
}

.bottom-right {
  @apply bottom-10px right-10px;
}

.visible {
  @apply opacity-100;
}
</style>