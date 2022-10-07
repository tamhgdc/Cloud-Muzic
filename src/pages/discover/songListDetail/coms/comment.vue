<!-- 歌单评论 -->
<template>
  <div py-4>
    <Comment :id="id" :type="2" />
  </div>
</template>

<script setup lang="ts">
import Comment from "@/components/content/comment/comment.vue";
import { useRoute } from "vue-router";
const route = useRoute();
let id = parseInt(route.params.id as string);
</script>