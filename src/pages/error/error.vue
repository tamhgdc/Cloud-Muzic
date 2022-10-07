<!-- 404 Not Found -->
<template>
  <div h-full overflow-hidden flex justify-center items-center>
    <Lottie w="1/2" :animationData="lottieAnima" />
  </div>
</template>

<script setup lang="ts">
import Lottie from "@/components/common/lottie/lottie.vue";
import lottieAnima from "@/assets/lottieFile/error.json";
</script>
