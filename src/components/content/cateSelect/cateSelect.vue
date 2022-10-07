<!-- 分类选择组件 -->
<template>
  <div text-14px select-none flex gap-5px>
    <!-- 标题 -->
    <span v-if="title" py-3px>{{ title }}:</span>

    <!-- 类型列表 -->
    <ul class="cateList">
      <li v-for="item in typeList" :key="item" class="listItem">
        <p @click="typeSelect(item)" :class="{ active: currentType === item }" class="content">{{ item }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRaw, toRefs } from "vue";
const emit = defineEmits(["selected"]);
const props = defineProps({
  title: String,
  loading: {
    type: Boolean,
    default: false
  },
  currentType: {
    type: String,
    required: true
  },
  typeList: {
    type: Array as PropType<string[]>,
    required: true,
  }
});
let { typeList, title } = toRaw(props);
let { currentType, loading } = toRefs(props);

// 类型选择事件
let typeSelect = (type: string) => {
  if (currentType.value !== type && !loading.value) {
    emit("selected", type);
  }
};
</script>

<style lang="scss" scoped>
// 类型列表
.cateList {
  @apply flex gap-5px items-center flex-1 flex-wrap;

  .listItem {
    @apply pr-5px border-r-1px border-r-#eee last-pr-0 last-border-r-0;

    .content {
      @apply py-3px px-8px text-center whitespace-nowrap cursor-pointer hover-themeColor;
    }
  }
}

// 激活时样式
.active {
  @apply rounded-20px bg-#eee themeColor;
}
</style>