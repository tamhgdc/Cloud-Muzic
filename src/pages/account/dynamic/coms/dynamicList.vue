<!-- 动态列表 -->
<template>
  <div flex-1 flex flex-col overflow-hidden>
    <ul class="dynamicList" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
      <li v-for="item in dynamicList" :key="item.id">
        <!-- 头像 -->
        <el-image @click.stop="goPersonalPage(item.userId)" :src="item.avatarUrl" fit="cover" class="avatar" />

        <div flex-1 cursor-default overflow-hidden>
          <!-- 头部 -->
          <header class="header">
            <p flex gap-10px text-15px>
              <span @click.stop="goPersonalPage(item.userId)" class="nickname">{{ item.nickname }}</span>
              <span>分享{{ item.type }}</span>
            </p>
            <p text-14px text-gray-500>{{ Handle.TimeStamp(item.eventTime, true) }}</p>
          </header>

          <!-- 内容 -->
          <p v-html="item.content" class="content"></p>

          <!-- 专辑 / 单曲 -->
          <AlbumItem v-if="item.album" v-bind="item.album" hover:bg-gray-200 />
          <SongItem v-if="item.song" :songInfo="item.song" hover:bg-gray-200 />

          <!-- 配图 -->
          <div class="pictures">
            <el-image v-for="image in item.picsList" :key="image" :src="image" fit="cover"
              :preview-src-list="item.picsList" class="image" />
          </div>

          <!-- 操作 -->
          <ul class="operate">
            <li>
              <span class="icon" i-carbon:thumbs-up></span>
              <span>{{ item.likedCount }}</span>
            </li>
            <li>
              <span class="icon" i-carbon:reply></span>
              <span>{{ item.shareCount }}</span>
            </li>
            <li>
              <span @click.stop="handleComment(item.id)" class="icon" i-carbon:chat></span>
              <span>{{ item.commentCount }}</span>
            </li>
          </ul>

          <!-- 评论 -->
          <div v-show="currentComment == item.id">
            <Comment :id="item.id" :type="6" :limit="5" />
          </div>
        </div>
      </li>
    </ul>

    <!-- 提示 -->
    <Tip :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import Tip from "@/components/content/tip/tip.vue";
import Comment from "@/components/content/comment/comment.vue";
import SongItem from "@/components/content/songItem/songItem.vue";
import AlbumItem from "@/components/content/albumItem/albumItem.vue";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { SongInfo } from "store";
import { AccountAPI } from "api";
import { Handle } from "utils";
const router = useRouter();

// 限制请求数据个数
let limit = 10;
// 上一次时间
let lastTime = ref<number>(0);
// 禁用无限加载
let disabled = ref<boolean>(false);
// 加载状态
let loading = ref<boolean>(false);
// 动态列表
interface DynamicInfo {
  id: number,
  userId: number,
  eventTime: number,
  type: string,
  song: SongInfo,
  album: any,
  content: String,
  commentCount: number,
  likedCount: number,
  shareCount: number,
  avatarUrl: string,
  nickname: string,
  picsList: string[],
}
let dynamicList = reactive<DynamicInfo[]>([]);

// 当前动态评论
let currentComment = ref<number>(0);
// 打开/关闭评论
let handleComment = (id: number) => {
  currentComment.value = currentComment.value == id ? 0 : id;
}

// 跳转个人主页
let goPersonalPage = (id: number) => {
  router.push(`/personalPage/${id}`);
}

// 加载动态
let loadData = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    let { code, event, lasttime, more }: any = await AccountAPI.getEvent(lastTime.value, limit);
    if (code == 200) {
      // 禁用无限加载
      if (!more) disabled.value = true;
      lastTime.value = lasttime;
      // 处理动态
      let list = event.map((item: any) => {
        let { id, eventTime, pics, json, info: { commentCount, likedCount, shareCount }, user: { avatarUrl, nickname, userId } } = item;
        // 处理动态图片
        let picsList = pics.map((item: any) => item.originUrl);
        // 处理 json
        let info = JSON.parse(json);
        if (info.msg) {
          // 标签
          let tag = new RegExp("#(\\1.+?)#", "g");
          info.msg = info.msg.replace(tag, `<span class="tag">#$1#</span>`);

          // 链接
          let href = new RegExp("\n(\\1[https | http].+?)\n", "g");
          info.msg = info.msg.replace(href, `<a href="$1" target="_blank">网页链接</a>`)
        }
        // 判断动态类型
        if (info?.song) {
          info.type = "单曲";
          // 处理单曲内容
          info.song = Handle.SongInfo(info.song);
        } else if (info?.album) {
          info.type = "专辑";
          let { artists, name, picUrl, id } = info.album;
          info.album = { artists, name, picUrl, id }
        } else {
          info.type = "动态";
        }
        // 处理单曲
        return {
          id,
          userId,
          picsList,
          eventTime,
          type: info.type,
          song: info?.song,
          album: info?.album,
          content: info?.msg,
          commentCount,
          likedCount, shareCount,
          avatarUrl,
          nickname,
        }
      });
      dynamicList.push(...list);
    }
  } catch (err: any) {
    ElMessage.error("加载动态失败!");
  } finally {
    loading.value = false;
  }
}
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.hoverExtend {
  @apply themeColor opacity-85 hover-opacity-100 cursor-pointer select-none;
}

.dynamicList li {
  @apply overflow-hidden w-full flex gap-10px py-20px border-b-1px border-b-#eee;

  .avatar {
    @apply w-12 h-12 min-w-12 rounded-full border-1px border-#eee cursor-pointer;
  }
}

.header {
  @apply h-12 flex flex-col justify-around;

  .nickname {
    @extend .hoverExtend;
  }
}

.content {
  @apply text-15px py-10px leading-6;

  :deep(.tag) {
    @extend .hoverExtend;
  }

  :deep(a) {
    @apply pr-5px no-underline text-blue-500 cursor-pointer hover-text-blue-600 hover-underline;
  }
}

// 配图
.pictures {
  @apply grid gap-5 lg-gap-7 grid-cols-1 sm-grid-cols-2 my-10px;

  .image {
    @apply rounded-md border-1px border-#eee;
  }
}

// 操作
.operate {
  @apply flex justify-end gap-10px overflow-hidden select-none;

  li {
    @apply border-b-none border-r-1px border-gray-200;
    @apply w-auto flex items-center p-0 text-14px text-gray-400 gap-5px pr-10px;

    &:last-child {
      @apply pr-0px border-r-none;
    }

    .icon {
      @apply text-17px hover-fontColor cursor-pointer;
    }
  }
}
</style>