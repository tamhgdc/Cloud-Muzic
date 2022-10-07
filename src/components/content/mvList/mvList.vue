<!-- mv列表 -->
<template>
  <ul grid4Cols min-h-35>
    <li overflow-hidden v-for="mv in props.list" :key="mv.id">
      <MVItem :id="mv.id" :cover="mv.cover || mv.picUrl" :name="mv.name" :artists="mv.artists"
        :playCount="mv.playCount" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import MVItem from "@/components/content/mvItem/mvItem.vue";
import { PropType } from "vue";
const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
    required: true
  }
});
</script>