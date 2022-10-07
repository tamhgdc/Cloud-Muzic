<template>
  <!-- 私信内容 -->
  <div v-loading="loading" element-loading-text="Loading..." class="msgContent">
    <el-scrollbar>
      <ul v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled" class="list">
        <li v-for="item in msgList" :key="item.id">
          <!-- 时间 -->
          <p class="time">{{ Handle.TimeStamp(item.time, true) }}</p>
          <!-- 信息 -->
          <div class="info" :class="item.id !== store.privateMsgInfo.id && 'meSend'">
            <!-- 头像 -->
            <el-image :src="item.avatarUrl" fit="cover" @click.stop="$router.push(`/personalPage/${item.id}`)"
              class="avatar" />
            <!-- 详情 -->
            <div class="detail">
              <!-- 文本内容 -->
              <p>{{ item.msg }}</p>
              <!-- 专辑 -->
              <AlbumItem v-if="item.album" v-bind="item.album" bgColor="#fff" mt-10px />
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>

  <!-- 发送私信 -->
  <SendMsg @sendSuccess="sendSuccess" />
</template>

<script setup lang="ts">
import SendMsg from "./sendMsg.vue";
import AlbumItem from "@/components/content/albumItem/albumItem.vue";
import { ElMessage } from "element-plus";
import { useMainStore } from "store";
import { reactive, ref } from "vue";
import { AccountAPI } from "api";
import { Handle } from "utils";
const store = useMainStore();

// 加载状态
let loading = ref<boolean>(false);
// 是否禁用无限滚动
let disabled = ref<boolean>(false);
// 私信列表
interface MsgItem {
  time: number,
  album: {
    name: string,
    artists: any,
    picUrl: string,
    id: number
  },
  msg: string,
  avatarUrl: string,
  id: number,
}
let msgList = reactive<MsgItem[]>([]);

// 发送私信成功
let sendSuccess = (result: any) => {
  let list = handleMsgList(result);
  msgList.unshift(...list);
}

// 处理私信列表
let handleMsgList = (list: any) => {
  return list.map((item: any) => {
    let { time, msg: message, fromUser: { avatarUrl, userId: id } } = item;
    let { msg, album = null } = JSON.parse(message);
    if (album) {
      let { name, artists, picUrl, id } = album;
      album = { name, artists, picUrl, id };
    }
    return { time, album, msg, avatarUrl, id };
  });
}

// 加载私信内容
let loadData = async () => {
  if (!store.privateMsgInfo.id || loading.value) return;
  loading.value = true;
  try {
    let before = msgList.length ? msgList[msgList.length - 1].time : 0;
    let { code, more, msgs }: any = await AccountAPI.getMsgPrivateHistory(store.privateMsgInfo.id, before, 15);
    if (code == 200) {
      // 是否禁用无限滚动
      disabled.value = !more;
      // 处理私信列表
      let list = handleMsgList(msgs);
      msgList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载私信内容错误!");
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.msgContent {
  height: calc(100% - 40px - 140px);
}

.list li {
  @apply my-20px px-20px;

  .time {
    @apply inline-block ml-50% translate-x--50% text-center text-13px bg-gray-200 rounded-full py-3px px-10px;
  }

  .info {
    @apply flex gap-10px mt-20px;

    .avatar {
      @apply h-40px w-40px min-w-40px rounded-full border-1px border-#eee cursor-pointer;
    }

    .detail {
      @apply flex-1 bg-gray-200 text-14px p-10px rounded-md overflow-hidden;
    }

    &.meSend {
      @apply flex-row-reverse;
    }
  }
}
</style>