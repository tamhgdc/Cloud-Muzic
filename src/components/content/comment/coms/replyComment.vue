<!-- 回复评论 -->
<template>
  <el-dialog v-model="dialogVisible" @close="close" customClass="replyCommentDialog" :width="350" title="评论" center>
    <!-- 文本输入框 -->
    <el-input v-model.trim="content" :placeholder="`回复 ${info.name}:`" show-word-limit type="textarea" @keydown.stop
      rows="4" maxlength="140" />

    <!-- 操作 -->
    <div class="operate">
      <button @click="sendComment" :disabled="!content.length || !store.accountInfo.id" class="send">评论</button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { ElDialog } from "element-plus";
import { useMainStore } from "store";
import { reactive, ref } from "vue";
const store = useMainStore();

// info
let info = reactive<{ uid: number, name: string }>({ uid: 0, name: "" });
// 回复内容
let content = ref<string>("");
// dialog是否显示
let dialogVisible = ref<boolean>(false);

// 发送评论
let sendComment = useDebounceFn(() => {
  if (info.uid) {
    console.log(info);
  }
}, 200);

// 关闭dialog
let close = () => {
  if (info.uid) {
    dialogVisible.value = false;
    content.value = "";
    Object.assign(info, { uid: 0, name: "" });
  }
}

// 打开dialog
let open = (uid: number, name: string) => {
  dialogVisible.value = true;
  Object.assign(info, { uid, name });
}

defineExpose({ open, close });
</script>

<style lang="scss" scoped>
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
<style lang="scss" >
.replyCommentDialog {
  margin-top: calc((var(--100vh) - var(--playBarHeight) - 200px) / 2);
  @apply rounded-md;

  .el-dialog__header {
    @apply mr-0px px-20px py-15px;

    .el-dialog__title {
      @apply fontColor;
    }
  }

  .el-dialog__body {
    @apply px-10px pt-0px pb-15px fontColor;
  }

  .el-dialog__headerbtn {
    @apply w-auto h-auto top-17px right-10px text-18px;
  }
}
</style>