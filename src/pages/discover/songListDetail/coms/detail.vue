<!-- 歌单详情 -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <div flex pt-15px pb-20px text-14px gap-20px>
        <el-skeleton-item variant="image" display-none sm:block min-h-35 min-w-35 lg:h-50 lg:w-50 rounded-md />
        <div flex-1>
          <el-skeleton-item block variant="text" h-25px w="4/10" />
          <div w-full flex items-center mt-10px>
            <el-skeleton-item variant="image" w-8 h-8 rounded-full />
            <el-skeleton-item block variant="text" w-50px ml-5px />
            <el-skeleton-item block variant="text" w-100px ml-10px />
          </div>
          <div flex flex-wrap my-20px gap-y-7px gap-x-15px>
            <el-skeleton-item block variant="text" w-95px h-29px rounded-full />
            <el-skeleton-item block variant="text" w-110px h-29px rounded-full />
            <el-skeleton-item block variant="text" w-110px h-29px rounded-full />
          </div>
          <el-skeleton-item block variant="text" w="2/10" mt-10px />
          <el-skeleton-item block variant="text" w="3/10" mt-10px />
          <el-skeleton-item block variant="text" w="8/10" mt-10px />
        </div>
      </div>
    </template>
    <template #default>
      <div ref="detailEl" flex pt-15px pb-20px text-14px gap-20px>
        <!-- 封面 -->
        <el-image :src="detail.coverImgUrl" fit="cover" transition-all flex-none display-none sm:block h-35 w-35 lg:h-50
          lg:w-50 rounded-md />

        <!-- 详情 -->
        <div flex-1 overflow-hidden>
          <!-- 标题 -->
          <h1 text-19px truncate>{{ detail.name }}</h1>

          <!-- 创建者 -->
          <div my-3 flex items-center gap-10px>
            <!-- 头像 -->
            <el-image @click="goPersonalPage" :src="detail.avatarUrl" fit="cover" w-8 h-8 min-w-8 rounded-full
              cursor-pointer />
            <!-- 名字 -->
            <p @click="goPersonalPage" themeColor cursor-pointer truncate>{{ detail.nickname }}</p>
            <!-- 创建时间 -->
            <p truncate text="black/50">{{ detail.createTime }}</p>
          </div>

          <!-- 操作 -->
          <ul class="operate">
            <li @click="Operate.playSongList(id)">
              <span class="icon" i-eva:play-circle-outline></span>
              <span>播放全部</span>
            </li>
            <li @click="Operate.collectSongList(id)">
              <span class="icon" i-carbon:folder-add></span>
              <span v-once>收藏({{ Handle.Count(detail.subscribedCount) }})</span>
            </li>
            <li @click="share()">
              <span class="icon i-carbon:link"></span>
              <span v-once>分享({{ Handle.Count(detail.shareCount) }})</span>
            </li>
          </ul>

          <!-- 元信息 -->
          <div flex flex-col gap-5px text-14px>
            <!-- 标签 -->
            <p v-if="detail.tags.length" truncate>
              <span>标&emsp;签:&nbsp;&nbsp;</span>
              <span v-for="(item, index) in detail.tags" :key="item">
                <span themeColor cursor-pointer>{{ item }}</span>
                <span v-if="index < (detail.tags.length - 1)">&nbsp;/&nbsp;</span>
              </span>
            </p>

            <!-- 次数 -->
            <div flex gap-10px>
              <p truncate>
                <span>歌曲数:&nbsp;&nbsp;</span>
                <span text="black/50">{{ detail.trackCount }}</span>
              </p>
              <p truncate>
                <span>播放数:&nbsp;&nbsp;</span>
                <span v-once text="black/50">{{ Handle.Count(detail.playCount) }}</span>
              </p>
            </div>

            <!-- 描述 -->
            <div v-if="detail.description" :class="{ showMore: showMore }" class="description">
              <span whitespace-nowrap>简&emsp;介:&nbsp;&nbsp;</span>
              <span class="content">{{ detail.description }}</span>
              <span @click.stop="showMore = !showMore" class="moreIcon" i-carbon:caret-down></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 折叠 -->
      <DetailFold :share="share" :name="detail.name" :id="id" :height="detailEl?.offsetHeight || 0"
        :disabled="props.activeComs !== 'SongList'" />
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import DetailFold from "./detailFold.vue";
import { useRoute, useRouter } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { SongListAPI } from "api";
const route = useRoute();
const router = useRouter();
const props = defineProps({ activeComs: String });
let id = parseInt(route.params.id as string);

// 加载状态
let loading = ref(true);
//  元素DOM
let detailEl = ref<any>(null);
// 详情
let detail = reactive<any>({});
// 展示更多
let showMore = ref<boolean>(false);

// 跳转个人页面
let goPersonalPage = () => {
  router.push(`/personalPage/${detail.userId}`);
}

// 分享
let share = () => {
  if (detail.name) {
    Operate.shareInfo(detail.name, location.href);
  }
}

// 加载歌单详情
let loadData = async () => {
  try {
    loading.value = true;
    let { code, playlist }: any = await SongListAPI.getDetail(id);
    if (code == 200) {
      let { playCount, trackCount, shareCount, createTime, description, creator, name, coverImgUrl, subscribedCount, tags, userId } = playlist;
      // 合并对象
      Object.assign(detail, {
        // ID
        userId,
        // 封面
        coverImgUrl,
        // 创建者头像
        avatarUrl: creator.avatarUrl,
        // 创建者头像
        nickname: creator.nickname,
        // 标题
        name,
        // 创建时间
        createTime: `${Handle.TimeStamp(createTime)} 创建`,
        // 收藏次数
        subscribedCount,
        // 分享次数
        shareCount,
        // 标签
        tags,
        // 歌曲数量
        trackCount,
        // 播放次数
        playCount,
        // 描述
        description
      });
    }
  } catch (err: any) {
    ElMessage.error("加载歌单详情失败!");
  } finally {
    loading.value = false;
  }
}
// 初始化数据
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
.operate {
  @apply mb-3 lg-my-5 flex content-center flex-row flex-wrap gap-y-7px gap-x-15px;

  li {
    @apply flexCenter select-none rounded-full w-110px text-center cursor-pointer border-1px border-#eee gap-2px whitespace-nowrap;

    span {
      @apply py-5px text-13px;

      &.icon {
        font-size: 19px;
      }
    }

    &:hover {
      background-color: #f5f7fa;
      color: var(--theme-color);
    }

    &:first-child {
      background: linear-gradient(to right, #fa5042, #d43b32);
      @apply w-95px border-none text-white/80;

      &:hover {
        color: white;
      }
    }
  }
}

// 描述 
.description {
  @apply flex;

  .content {
    @apply truncate flex-1;
  }

  .moreIcon {
    @apply ml-15px text-22px flex-none text-gray-500 cursor-pointer hover-themeColor;
  }

  // 显示更多
  &.showMore {
    .content {
      @apply whitespace-pre-line;
    }

    .moreIcon {
      @apply rotate-180;
    }
  }
}
</style>