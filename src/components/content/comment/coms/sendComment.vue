<!-- 发送评论 -->
<template>
  <div>
    <!-- 标题 -->
    <h4 class="title">听友评论</h4>
    <!-- 文本输入框 -->
    <el-input @keydown.stop rows="3" v-model.trim="content" maxlength="140" placeholder="输入评论或@朋友" show-word-limit
      type="textarea" />
    <!-- 操作 -->
    <div class="operate">
      <button @click="sendComment" :disabled="!content.length || !store.accountInfo.id" class="send">评论</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/shared';
import { useMainStore } from "store";
import { PropType, ref } from "vue";
const store = useMainStore();
const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  type: {
    type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5 | 6>,
    required: true
  }
})

// 评论内容
let content = ref<string>("");
// 发送评论
let sendComment = useDebounceFn(() => {
  if (props.id) {
    console.log(props.id);
  };
}, 200);
</script>

<style lang="scss" scoped>
.title {
  @apply mb-15px text-18px;
}

.operate {
  @apply flex justify-end mt-15px;

  .send {
    @apply px-15px py-5px border-1px border-#dcdfe6 rounded-full bg-white text-14px cursor-pointer;

    &:not(:disabled):hover {
      @apply border-1px border-transparent themeBgColor text-white;
    }

    &:disabled {
      @apply bg-gray-100 text-gray-500 cursor-not-allowed;
    }
  }
}
</style>