<!-- Lottie动画 -->
<template>
  <div ref="lottieEl"></div>
</template>

<script setup lang="ts">
import lottie from "lottie-web";
import { onMounted, ref } from "vue";
const props = defineProps({
  animationData: {
    type: Object,
    required: true,
  },
});

let lottieEl = ref<HTMLElement | null>(null);
onMounted(() => {
  // 初始化动画
  lottie.loadAnimation({
    container: lottieEl.value!,
    renderer: "svg",
    loop: true,
    animationData: props.animationData,
  });
});
</script>
