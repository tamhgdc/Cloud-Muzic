<!-- 电台分类列表 -->
<template>
  <div flex mt-15px select-none>
    <el-skeleton :loading="loading" animated>
      <template #template>
        <div w-full flex justify-center>
          <el-skeleton-item w="8/10" h-80px rounded-md />
        </div>
      </template>
      <template #default>
        <!-- 左移动按钮 -->
        <div class="moveBtn">
          <span @click="leftMove" class="moveIcon" i-carbon:chevron-left></span>
        </div>

        <!-- 类型列表 -->
        <el-scrollbar ref="scrollbarEl" :height="80" :native="true" :wrap-style="{ overflow: 'hidden' }" flex-1>
          <ul ref="containerEl" flex gap-20px>
            <li v-for="{ id, picMacUrl, name } in cateList" :key="id" @click="goRadioPage(id, name)" class="group"
              w-55px shrink-0 grow-0 cursor-pointer>
              <!-- 图标 -->
              <div mx-auto w-50px h-50px p-10px rounded-full bg="#fdf6f5" group-hover:bg="#fdeded">
                <div :style="{ backgroundImage: `url(${picMacUrl})` }" w-full h-full bg="center right cover no-repeat">
                </div>
              </div>

              <!-- 标题 -->
              <p text="center 13px" mt-5px>{{ name }}</p>
            </li>
          </ul>
        </el-scrollbar>

        <!-- 右移动按钮 -->
        <div class="moveBtn">
          <span @click="rightMove" class="moveIcon" i-carbon:chevron-right></span>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useMainStore } from "store";
import { RadioAPI } from "api";
const router = useRouter();
const store = useMainStore();


// 移动状态
let isMove = ref(false);
// 加载状态
let loading = ref(true);
// 分类列表
let cateList = reactive<any>([]);

// 加载电台分类
onMounted(async () => {
  try {
    let { code, categories }: any = await RadioAPI.getCatelist();
    if (code == 200) cateList.push(...categories);
  } catch (err: any) {
    ElMessage.error("加载电台分类失败!");
  } finally {
    loading.value = false;
  }
});

// 跳转电台分类页面
let goRadioPage = (id: number, name: string) => {
  if (store.accountInfo.id) {
    router.push({
      path: "/radioCateDetail",
      query: { id, name }
    })
  } else {
    ElMessage.warning("需要登陆后查看!");
  }
}

// el-scrollbar元素
let scrollbarEl = ref<any>(null);
// 列表容器元素
let containerEl = ref<HTMLElement | null>(null);
// 向左移动
let leftMove = () => {
  if (isMove.value) return;
  isMove.value = true;
  let left = scrollbarEl.value.wrap$.scrollLeft;
  let containerWidth = containerEl.value!.clientWidth;
  if (left <= 0) {
    isMove.value = false;
    return;
  };
  let callback = () => {
    if (containerWidth <= 0) {
      isMove.value = false;
      return;
    }
    left -= 10;
    containerWidth -= 10
    scrollbarEl.value.setScrollLeft(left);
    requestAnimationFrame(callback);
  };
  requestAnimationFrame(callback);
};
// 向右移动
let rightMove = () => {
  if (isMove.value) return;
  isMove.value = true;
  let left = scrollbarEl.value.wrap$.scrollLeft;
  let scrollWidth = containerEl.value!.scrollWidth;
  let containerWidth = containerEl.value!.clientWidth;
  if (left + containerWidth >= scrollWidth) {
    isMove.value = false;
    return;
  };
  let callback = () => {
    if (containerWidth <= 0) {
      isMove.value = false;
      return;
    }
    left += 10;
    containerWidth -= 10;
    scrollbarEl.value.setScrollLeft(left);
    requestAnimationFrame(callback);
  };
  requestAnimationFrame(callback);
};
</script>

<style lang="scss" scoped>
.moveBtn {
  @apply flex self-center justify-center pb-16px w-1/10;
}

.moveIcon {
  @apply relative text-#ced6e0 text-30px cursor-pointer hover-themeColor;
}
</style>