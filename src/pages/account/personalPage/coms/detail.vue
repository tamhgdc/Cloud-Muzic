<!-- 用户详情 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <div class="detail">
        <el-skeleton-item variant="image" class="avatar" />
        <div flex-1>
          <el-skeleton-item block variant="text" h-25px w="2/10" />
          <div flex justify-between items-center flex-wrap gap-10px py-10px>
            <section flex gap-10px>
              <el-skeleton-item block variant="text" w-23px h-23px rounded-full />
              <el-skeleton-item block variant="text" w-44px h-22px rounded-full />
            </section>
            <section flex gap-10px>
              <el-skeleton-item block variant="text" w-86px h-31px rounded-full />
              <el-skeleton-item block variant="text" w-72px h-31px rounded-full />
            </section>
          </div>
          <div flex gap-30px py-10px>
            <el-skeleton-item block variant="text" w-60px h-30px />
            <el-skeleton-item block variant="text" w-60px h-30px />
            <el-skeleton-item block variant="text" w-60px h-30px />
          </div>
          <el-skeleton-item block variant="text" w="3/10" mt-10px />
          <el-skeleton-item block variant="text" w="5/10" mt-10px />
        </div>
      </div>
    </template>
    <template #default>
      <div class="detail">
        <el-image :src="detail.avatarUrl" fit="cover" class="avatar" />

        <div flex-1 overflow-hidden>
          <!-- 名称 -->
          <h1 class="nickname">{{ detail.nickname }}</h1>

          <!-- 元信息 -->
          <div class="metaInfo">
            <section>
              <!-- 性别 -->
              <p v-if="detail.gender" class="gender">
                <span :class="detail.gender == 1 ? 'i-carbon:gender-male' : 'i-carbon:gender-female'"
                  :style="{ color: detail.gender == 1 ? '#3b82f6' : '#e3357b' }"></span>
              </p>

              <!-- 等级 -->
              <p class="level">Lv{{ detail.level }}</p>
            </section>
            <section select-none>
              <p @click.stop="sendMsg">
                <span class="icon" i-carbon:email></span>
                <span class="">发私信</span>
              </p>
              <p @click.stop="followed">
                <span class="icon" :class="detail.followed ? 'i-carbon:checkmark' : 'i-carbon:add'"></span>
                <span>{{ detail.followed ? '已关注' : '关注' }}</span>
              </p>
            </section>
          </div>

          <!-- 计数 -->
          <ul class="count">
            <li @click.stop="$router.push(`/userDynamic/${uid}`)" pr-25px>
              <span>{{ detail.eventCount }}</span>
              <span>动态</span>
            </li>
            <li @click.stop="$router.push(`/userFollows/${uid}`)" px-25px>
              <span>{{ detail.follows }}</span>
              <span>关注</span>
            </li>
            <li @click.stop="$router.push(`/userFolloweds/${uid}`)" pl-25px>
              <span>{{ detail.followeds }}</span>
              <span>粉丝</span>
            </li>
          </ul>

          <!-- 信息 -->
          <div class="info">
            <p v-if="detail.cityName">
              <span class="title">所在城市:</span>
              <span class="content">{{ detail.cityName }}</span>
            </p>
            <p v-if="detail.signature" :class="{ showMore: showMore }">
              <span class="title">个人介绍:</span>
              <span class="content">{{ detail.signature }}</span>
              <span @click.stop="showMore = !showMore" class="moreIcon" i-carbon:caret-down></span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useDebounceFn } from "@vueuse/shared";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { useMainStore } from "store";
import { AccountAPI } from "api";
import { Handle } from "utils";
const route = useRoute();
const store = useMainStore();
const uid = parseInt(route.params.uid as string);

// 加载状态
let loading = ref(true);
// 是否显示更多
let showMore = ref(false);
// 用户详情
let detail = reactive<any>({});

// 发私信
let sendMsg = () => {
  store.privateMsgInfo = { id: uid, name: detail.nickname };
  store.privateMsgDrawer = true;
}

// 关注 / 取消关注
let followed = useDebounceFn(async () => {
  try {
    let uid = parseInt(route.params.uid as string);
    let t = detail.followed ? 0 : 1;
    let { code, user = null }: any = await AccountAPI.getFollow(uid, t);
    if (code == 200) detail.followed = !!user;
  } catch (err: any) {
    ElMessage.error("该账户已被风控!");
  }
}, 300);

// 加载用户详情
let loadData = async () => {
  try {
    loading.value = true;
    let { code, level, profile: { avatarUrl, followeds, followed, follows, gender, eventCount, nickname, signature, province, city } }: any = await AccountAPI.getUserDetail(uid);
    if (code == 200) {
      // 处理城市
      let cityName = Handle.City(province, city);
      Object.assign(detail, {
        level,
        avatarUrl,
        followeds,
        followed,
        follows,
        gender,
        eventCount,
        nickname,
        signature,
        cityName
      })
    }
  } catch (err: any) {
    ElMessage.error("加载个人信息失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化用户详情
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.detail {
  @apply flex flex-col sm-flex-row gap-15px md-gap-30px pt-15px;

  .avatar {
    @apply transition-all duration-200;
    @apply h-20 w-20 min-w-20 md-h-35 md-w-35 md-min-w-35 rounded-full border-1px border-#eee;
  }
}

.nickname {
  @apply text-22px font-bold truncate;
}

.metaInfo {
  @apply flex justify-between items-center flex-wrap gap-10px border-b-1px border-b-#eee py-10px;

  section {
    @apply truncate;

    &:first-child {
      @apply flex gap-10px items-center;

      .gender {
        @apply flex text-17px bg-gray-100 p-3px rounded-full;
      }

      .level {
        @apply bg-gray-100 text-14px py-3px px-7px rounded-full;
      }
    }

    &:last-child {
      @apply flex gap-10px;

      p {
        @apply flex gap-3px border-1px border-gray-200 rounded-full px-11px py-6px text-14px hover-bg-gray-100 cursor-pointer;

        .icon {
          @apply text-17px;
        }
      }
    }
  }
}

.count {
  @apply flex py-10px;

  li {
    @apply border-r-1px border-r-#eee flex flex-col gap-3px overflow-hidden cursor-pointer;

    &:last-child {
      @apply border-r-none;
    }

    &:hover span:first-child {
      @apply themeColor;
    }

    span {
      &:first-child {
        @apply text-20px truncate;
      }

      &:last-child {
        @apply text-14px text-gray-500 truncate;
      }
    }
  }
}

.info {
  @apply leading-6 overflow-hidden;

  p {
    @apply flex gap-5px text-14px select-none;

    span {
      &.title {
        @apply flex-none;
      }

      &.content {
        @apply truncate text-gray-500 flex-1;
      }
    }
  }

  .moreIcon {
    @apply ml-10px text-22px flex-none text-gray-500 cursor-pointer hover-themeColor;
  }

  .showMore {
    .content {
      @apply whitespace-normal;
    }

    .moreIcon {
      @apply rotate-180;
    }
  }
}
</style>