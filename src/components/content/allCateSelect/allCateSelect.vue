<!-- 全部分类选择 -->
<template>
  <el-popover ref="popoverEl" :hide-after="0" popper-class="allType" placement="bottom-start" trigger="click">
    <template #reference>
      <!-- 按钮 -->
      <button :disabled="loading || !typeList.length" disabled:cursor-not-allowed cursor-pointer px-15px items-center
        flex border="1px solid #eee" rounded-full whitespace-nowrap select-none bg-white h-30px fontColor
        hover:bg="#eee" focus:outline-none>
        <span text-14px>{{ currentType }}</span>
        <span :class="loading || !typeList.length ? 'i-eva:loader-outline' : 'i-carbon:chevron-right'"></span>
      </button>
    </template>

    <template #default>
      <!-- 标题 -->
      <header flex p10px>
        <h1 @click="typeSelect(defaultType)" :class="{ active: defaultType == currentType }" class="item">
          {{ defaultType }}
        </h1>
      </header>

      <!-- 分割线 -->
      <el-divider m-0 />

      <!-- 列表 -->
      <el-scrollbar :always="true" :height="350">
        <main v-for="{ name, list } in typeList" :key="name" flex px-15px mt-10px mb-20px select-none>
          <!-- 类型名称 -->
          <p v-if="name" themeColor text-15px>{{ name }}</p>

          <!-- 类型列表 -->
          <ul flex-1 grid grid-cols-4 gap-y-8px gap-x-5px rounded-md>
            <li v-for="typeName in list" :key="typeName" flex justify-center overflow-hidden>
              <span @click="typeSelect(typeName)" :class="{ active: currentType == typeName }" class="item">
                {{ typeName }}
              </span>
            </li>
          </ul>
        </main>
      </el-scrollbar>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, toRaw, toRefs } from "vue";
import { PropType } from "vue";
const emit = defineEmits(['selected'])
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  currentType: {
    type: String,
    required: true
  },
  typeList: {
    type: Array as PropType<{ name: string, list: string[] }[]>,
    required: true
  },
});
let { currentType, loading, typeList } = toRefs(props);
let defaultType = toRaw(currentType.value);

// popover元素
let popoverEl = ref<any>(null);
// 类型选择事件
let typeSelect = (type: string) => {
  if (currentType.value !== type) {
    emit("selected", type);
    popoverEl.value?.hide()
  }
};
</script>

<style lang="scss" scoped>
.item {
  @apply truncate cursor-pointer text-14px py-3px px-10px fontColor hover-themeColor;
}

.active {
  border-radius: 20px;
  background-color: #eee;
  color: var(--theme-color);
}
</style>
<style lang="scss">
.allType {
  width: 480px !important;
}
</style>