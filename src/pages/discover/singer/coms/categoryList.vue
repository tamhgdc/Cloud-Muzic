<!-- 类型列表 -->
<template>
  <div flex flex-col flex-nowrap gap-10px>
    <CateSelect v-for="{ title, list, selected, currentType } in typeList" :key="title" @selected="selected"
      :title="title" :typeList="list" :currentType="currentType" />
  </div>
</template>

<script setup lang="ts">
import CateSelect from "@/components/content/cateSelect/cateSelect.vue";
import { reactive, toRaw, watch } from "vue";
const emit = defineEmits(['selected']);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

// 当前类型
let currentVal = reactive({
  area: '-1',
  type: '-1',
  initial: '-1'
});
// 类型列表
let typeList = reactive([
  {
    title: "语种",
    currentType: "全部",
    list: ['全部', '华语', '欧美', '日本', ' 韩国', '其他'],
    selected(type: string) {
      if (!props.loading) {
        typeList[0].currentType = type;
        switch (type) {
          case '全部':
            currentVal.area = '-1';
            break;
          case "华语":
            currentVal.area = '7';
            break;
          case "欧美":
            currentVal.area = '96';
            break;
          case "日本":
            currentVal.area = '8';
            break;
          case "韩国":
            currentVal.area = '16';
            break;
          case "其他":
            currentVal.area = '0';
            break;
        }
      }
    }
  },
  {
    title: "分类",
    currentType: "全部",
    list: ['全部', '男歌手', '女歌手', '乐队'],
    selected(type: string) {
      if (!props.loading) {
        typeList[1].currentType = type;
        switch (type) {
          case '全部':
            currentVal.type = '-1';
            break;
          case "男歌手":
            currentVal.type = '1';
            break;
          case "女歌手":
            currentVal.type = '2';
            break;
          case "乐队":
            currentVal.type = '3';
            break;
        }
      }
    }
  },
  {
    title: "筛选",
    currentType: "热门",
    list: ["热门", ...[...Array(26).keys()].map(i => String.fromCharCode(i + 65)), "#"],
    selected(type: string) {
      if (!props.loading) {
        typeList[2].currentType = type;
        switch (type) {
          case '热门':
            currentVal.initial = '-1';
            break;
          case "#":
            currentVal.initial = '0';
            break;
          default:
            currentVal.initial = type;
        }
      }
    }
  },
])

// 监视 currentVal 变化
watch(currentVal, (newVal) => emit('selected', toRaw(newVal)), {
  immediate: true
})
</script>