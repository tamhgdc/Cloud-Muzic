<!-- 分类列表 -->
<template>
  <nav flex justify-between gap-20px>
    <!-- 全部分类 -->
    <ALLCateSelect @selected="selected" :loading="loading" :currentType="currentType" :typeList="allCateList" />

    <!-- 热门分类 -->
    <div v-if="hotCateList.length" display-none items-center lg:flex>
      <CateSelect @selected="selected" :loading="loading" :currentType="currentType" :typeList="hotCateList" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import ALLCateSelect from "@/components/content/allCateSelect/allCateSelect.vue";
import CateSelect from "@/components/content/cateSelect/cateSelect.vue";
import { onMounted, reactive, toRefs } from "vue";
import { SongListAPI } from "api";
const emit = defineEmits(['selected']);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  currentType: {
    type: String,
    required: true
  }
});
let { loading, currentType } = toRefs(props);

// 热门分类列表
let hotCateList = reactive<string[]>([]);
// 全部分类列表
let allCateList = reactive<any>([]);

// 分类已选择
let selected = (type: string) => !loading.value && emit('selected', type);

// 加载类型列表
onMounted(async () => {
  let [hotList, cateList]: any = await Promise.all([SongListAPI.getHotList(), SongListAPI.getCateList()])
  // 处理热门列表
  if (hotList.code == 200) {
    let list = hotList.tags.map((tag: any) => tag.name);
    hotCateList.push(...list);
  }

  // 处理全部分类
  if (cateList.code == 200) {
    let { categories, sub } = cateList;
    let allList = Object.values(categories).map((cate: any, index: number) => {
      let list = sub.filter((subItem: any) => subItem.category == index).map((item: any) => item.name);
      return { list, name: cate }
    });
    allCateList.push(...allList);
  }
});
</script>