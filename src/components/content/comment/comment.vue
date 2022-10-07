<!-- 评论列表 -->
<template>
  <div class="comment">
    <!-- 发送评论 -->
    <SendComment :id="id" :type="type" />

    <!-- 标题 -->
    <h4 class="title">当前评论 ({{ total }})</h4>

    <!-- 评论列表 -->
    <CommentSkeleton @load="loadData" :loading="loading">
      <div v-for="(item, index) in commentList" :key="item.commentId" class="commentList">
        <!-- 头像 -->
        <el-image @click.stop="goPersonalPage(item.userId)" :src="item.avatarUrl" fit="cover" lazy class="cover" />

        <!-- 详细 -->
        <div flex-1 text-15px>
          <!-- 评论人 -->
          <section>
            <span @click.stop="goPersonalPage(item.userId)" class="nickname">
              {{ item.nickname }}:
            </span>
            <span leading-5>{{ item.content }}</span>
          </section>

          <!-- 被回复 -->
          <section v-if="item.beReplied">
            <p v-if="item.beReplied.status == -5" class="beReplied" text-center>
              <span>该评论已删除</span>
            </p>
            <p v-else class="beReplied">
              <span @click.stop="goPersonalPage(item.beReplied!.userId)" class="nickname">
                @{{ item.beReplied.nickname }}:
              </span>
              <span leading-5>{{ item.beReplied.content }}</span>
            </p>
          </section>

          <!-- 功能-->
          <section class="operate">
            <p>{{ item.time }}</p>
            <div flex items-center gap-10px>
              <span class="report">举报</span>
              <span class="like">
                <span :class="{ liked: item.liked }" class="likeIcon"></span>
                <span text-13px>{{ item.likedCount || "" }}</span>
              </span>
              <span @click="share(item.nickname, item.content)" class="icon" i-carbon:link></span>
              <span @click="replyCommentEl?.open(item.userId, item.nickname)" class="icon" i-carbon:chat></span>
            </div>
          </section>

          <!-- 分割线 -->
          <el-divider v-show="(index + 1) !== commentList.length" />
        </div>
      </div>

      <!-- 数据为空 -->
      <el-empty v-show="!commentList.length" description="暂时没有评论!" />
    </CommentSkeleton>

    <!-- 回复评论 -->
    <ReplyComment ref="replyCommentEl" />

    <!-- 分页 -->
    <div v-show="!loading && total > limit">
      <el-pagination @current-change="loadData" background layout="prev, pager, next" :pager-count="5"
        :page-size="limit" :total="total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SendComment from "./coms/sendComment.vue"
import ReplyComment from "./coms/replyComment.vue";
import CommentSkeleton from "./skeleton/commentSkeleton.vue";
import { toRaw, ref, reactive, PropType } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Operate } from "utils";
import { OtherAPI } from "api";
const router = useRouter();
const props = defineProps({
  id: {
    type: [Number, String],
    required: true
  },
  type: {
    type: Number as PropType<0 | 1 | 2 | 3 | 4 | 5 | 6>,
    required: true
  },
  limit: {
    type: Number,
    default: 20
  },
});
let { id, type, limit } = toRaw(props);

// 回复评论元素
let replyCommentEl = ref<InstanceType<typeof ReplyComment>>();
// 评论加载状态
let loading = ref<boolean>(true);
// 评论总条数
let total = ref<number>(0);
// 评论数据的time
let cursor = ref<string>("");
// 评论列表
interface CommentItem {
  commentId: number,
  content: string,
  liked: boolean,
  likedCount: number,
  time: number,
  avatarUrl: string,
  nickname: string,
  userId: number,
  beReplied: null | {
    id: number,
    content: string,
    nickname: string,
    userId: number,
    status: number
  }
}
let commentList = reactive<CommentItem[]>([]);

// 加载评论列表
let loadData = async (pageNo: number = 1) => {
  try {
    loading.value = true;
    let { code, data: { comments, totalCount, cursor: cursorID } }: any = await OtherAPI.getCommentNew(id, type, pageNo, limit, cursor.value);
    if (code == 200) {
      if (!total.value) total.value = totalCount;
      cursor.value = cursorID;
      // 处理评论列表
      let list = comments.map((item: any) => {
        let { commentId: id, content, liked, likedCount, timeStr: time, beReplied, user: { avatarUrl, nickname, userId } } = item;
        if (beReplied) {
          let { beRepliedCommentId: id, content, status, user: { userId, nickname } } = beReplied[0];
          beReplied = { id, content, status, userId, nickname }
        }
        return { id, content, liked, likedCount, time, avatarUrl, nickname, userId, beReplied };
      });
      // 清空列表,并添加评论
      commentList.splice(0, commentList.length, ...list);
    }
  } catch (err: any) {
    ElMessage.error("加载评论失败!");
  } finally {
    loading.value = false;
  }
}

// 跳转个人页面
let goPersonalPage = (id: number) => {
  router.push(`/personalPage/${id}`);
}

// 分享
let share = (nickname: string, content: string) => {
  if (nickname) {
    let title = `@${nickname}: ${content}`;
    Operate.shareInfo(title, location.href);
  }
}

defineExpose({
  // 关闭回复评论对话框
  closeDialog() {
    replyCommentEl.value?.close();
  }
});
</script>

<style lang="scss" scoped>
.title {
  @apply text-18px mb-15px truncate;
}

.comment {
  @apply overflow-hidden;

  :deep(.el-overlay) {
    @apply bg-black/30;
  }
}

.commentList {
  @apply flex gap-15px;

  .cover {
    @apply cursor-pointer flex-none w-10 h-10 rounded-full border-1 border-gray-200;
  }

  .nickname {
    @apply themeColor cursor-pointer;
  }

  .beReplied {
    @apply py-7px px-10px text-14px mt-5px rounded bg-#f4f4f5;
  }

  .operate {
    @apply flex justify-between mt-10px text-13px text-black/60;

    .report {
      @apply cursor-pointer hover-themeColor opacity-100 sm-opacity-0;
    }

    .like {
      @apply cursor-pointer hover-text-red-500 flex gap-3px items-center;

      .likeIcon {
        @apply text-18px i-carbon-thumbs-up;
      }

      .liked {
        @apply i-carbon-thumbs-up-filled text-red-500;
      }

      &:hover .likeIcon {
        @apply i-carbon-thumbs-up-filled;
      }
    }

    .icon {
      @apply cursor-pointer text-18px hover-themeColor;
    }
  }

  &:hover .operate .report {
    @apply opacity-100;
  }
}
</style>