<!-- 私信 -->
<template>
  <ul v-if="msgList.length" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled" class="list">
    <li v-for="item in msgList" :key="item.userId">
      <!-- 头像 -->
      <div py-10px>
        <el-image :src="item.avatarUrl" fit="cover" @click.stop="$router.push(`/personalPage/${item.userId}`)"
          class="avatar" />
      </div>
      <!-- 信息 -->
      <div @click.stop="goMsgContent(item)" class="info">
        <p flex justify-between>
          <span themeColor>{{ item.nickname }}</span>
          <span text-gray-400>{{ item.time }}</span>
        </p>
        <p truncate>{{ item.msg }}</p>
      </div>
    </li>
  </ul>
  <el-empty v-else description="暂无私信内容!" />
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useMainStore } from "store";
import { AccountAPI } from 'api';
import { Handle } from 'utils';
import { ElMessage } from 'element-plus';
const store = useMainStore();

// 禁用加载列表
let disabled = ref(false);
// 私信列表
interface MsgItem {
  msg: string,
  avatarUrl: string,
  nickname: string,
  userId: number,
  time: string
}
let msgList = reactive<MsgItem[]>([]);

// 跳转私信内容
let goMsgContent = (item: MsgItem) => {
  let { userId, nickname } = item;
  store.messageDrawer = false;
  store.privateMsgInfo = { name: nickname, id: userId };
  store.privateMsgDrawer = true;
}

// 加载私信列表
let loadData = async () => {
  try {
    let { more, code, msgs }: any = await AccountAPI.getMsgPrivate(msgList.length);
    if (code == 200) {
      // 是否禁用加载
      disabled.value = !more;
      // 处私信列表
      let list: MsgItem[] = msgs.map((item: any) => {
        let { fromUser: { avatarUrl, nickname, userId }, lastMsgTime, lastMsg } = item;
        let { msg } = JSON.parse(lastMsg);
        let time = Handle.TimeStamp(lastMsgTime);
        return { msg, avatarUrl, nickname, userId, time };
      });
      Object.assign(msgList, list);
    }
  } catch (err: any) {
    ElMessage.error("加载私信列表错误!");
  }
}
// 初始化私信列表
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.list {
  li {
    @apply px-15px flex gap-10px cursor-pointer hover-bg-gray-100;

    .avatar {
      @apply rounded-full w-45px h-45px min-w-45px border-1px border-#eee;
    }

    .info {
      @apply text-13px py-10px flex-1 flex flex-col justify-around border-b-1px border-#eee overflow-hidden;
    }
  }
}
</style>