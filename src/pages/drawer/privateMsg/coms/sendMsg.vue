<template>
  <div class="sendMsg">
    <!-- 表单 -->
    <el-input @keydown.stop v-model.lazy="content" :rows="3" show-word-limit maxlength="200"
      :placeholder="`回复 ${store.privateMsgInfo.name}:`" type="textarea" />
    <!-- 操作 -->
    <div class="operate">
      <p class="icon" i-carbon:face-wink></p>
      <button @click.stop="sendContent" class="send">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { useMainStore } from "store";
import { AccountAPI } from 'api';
import { ref } from 'vue';
const store = useMainStore();
const emit = defineEmits(['sendSuccess']);

// 私信内容
let content = ref("");
// 发送私信内容
let sendContent = async () => {
  if (content.value.trim()) {
    try {
      let { code, newMsgs }: any = await AccountAPI.sendText(store.privateMsgInfo.id, content.value.trim());
      // 发送私信成功
      if (code == 200) emit('sendSuccess', newMsgs);
    } catch (err: any) {
      ElMessage.warning("发送私信失败!");
    }
  } else {
    ElMessage.warning("请输入私信内容!");
  }
}
</script>

<style lang="scss" scoped>
.sendMsg {
  @apply h-140px p-10px;

  .operate {
    @apply flex justify-between items-center mt-10px;

    .icon {
      @apply text-22px cursor-pointer hover-themeColor;
    }

    .send {
      @apply border-1px border-#eee bg-white rounded-full py-6px px-15px;
      @apply text-13px fontColor hover-bg-#eee cursor-pointer tracking-widest;
    }
  }
}
</style>