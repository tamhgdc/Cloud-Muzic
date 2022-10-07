<!-- 私人FM -->
<template>
  <el-skeleton :loading="loading" animated>
    <template #template>
      <div wrapBox>
        <div class="songInfo" flex gap-20px py-15px>
          <section flex flex-1 flex-col gap-30px justify-center items-center>
            <!-- 封面 -->
            <el-skeleton-item variant="image" w-230px h-230px rounded-md />
            <!-- 操作按钮 -->
            <ul flex gap-30px>
              <li v-for="item in 4">
                <el-skeleton-item w-42px h-42px rounded-full />
              </li>
            </ul>
          </section>
          <section hidden md:inline-block flex-1>
            <!-- 标题 -->
            <el-skeleton-item variant="text" h-25px w="4/10" />
            <!-- 艺人 -->
            <div flex gap-100px mt-7px>
              <el-skeleton-item variant="text" w="2/10" />
              <el-skeleton-item variant="text" w="3/10" />
            </div>
          </section>
        </div>
        <el-skeleton-item variant="text" h-20px w-100px />
      </div>
    </template>
    <template #default>
      <div v-if="currentSong?.id" wrapBox pb-20px>
        <!-- 歌曲信息 -->
        <div class="songInfo">
          <section class="detail">
            <!-- 封面 -->
            <el-image :src="currentSong.picUrl" fit="cover" class="cover" />

            <!-- 操作 -->
            <ul class="operate">
              <!-- 喜欢 -->
              <li>
                <LikeIcon :id="currentSong.id" />
              </li>
              <!-- 收藏 -->
              <li>
                <span i-carbon:folder-add></span>
              </li>
              <!-- 下一首 -->
              <li @click="loadData">
                <span important:text-20px i-carbon:skip-forward></span>
              </li>
              <!-- 分享 -->
              <li @click="share">
                <span i-carbon:link></span>
              </li>
            </ul>
          </section>

          <section class="lyricWrap">
            <!-- 标题 -->
            <h1 text-20px truncate>{{ currentSong.name }}</h1>

            <!-- 歌曲信息 -->
            <div class="info">
              <p flex-1 truncate>
                <span>专辑:&nbsp;</span>
                <span themeColor>{{ currentSong.albumName }}</span>
              </p>
              <p class="artists">
                <span>歌手:&nbsp;</span>
                <Artists fontSize="14px" :artists="currentSong.artists" />
              </p>
            </div>

            <!-- 歌词 -->
            <div flex-1 overflow-hidden>
              <Lyric :id="currentSong.id" />
            </div>
          </section>
        </div>

        <!-- 评论 -->
        <Comment :id="currentSong.id" :type="0" />
      </div>
    </template>
  </el-skeleton>
</template>

<script setup lang="ts">
import Comment from "@/components/content/comment/comment.vue";
import Lyric from "@/components/content/lyric/lyric.vue";
import Artists from "@/components/content/artists/artists.vue";
import LikeIcon from "@/components/content/likeIcon/likeIcon.vue";
import { ElMessage } from "element-plus";
import { Handle, Operate } from "utils";
import { onMounted, ref } from "vue";
import { useMainStore } from "store";
import { SongAPI } from "api";
const store = useMainStore();

// 加载状态
let loading = ref<boolean>(true);
// 当前歌曲
interface CurrentSong {
  id: number,
  albumName: string,
  picUrl: string,
  artists: any,
  name: string
}
let currentSong = ref<CurrentSong | null>(null);
// 错误请求次数限制
let attemptCount = 0;

// 分享
let share = () => {
  let name = currentSong.value?.name;
  if (name) {
    Operate.shareInfo(name, location.href);
  }
}

// 加载私人FM
let loadData = async () => {
  try {
    loading.value = true;
    let { code, data }: any = await SongAPI.getPersonalFM();
    if (code == 200) {
      let SongInfo = Handle.SongInfo(data[0]);
      let { song: { name, id }, artists, album: { name: albumName, picUrl } } = SongInfo;
      currentSong.value = { name, id, artists, albumName, picUrl };
      store.playSong(SongInfo);
    }
  } catch (err: any) {
    attemptCount++;
    attemptCount >= 3 ? ElMessage.error("加载私人FM错误!") : loadData();
    return;
  } finally {
    attemptCount = 0;
    loading.value = false;
  }
}
// 初始化私人FM
onMounted(() => loadData());
</script>

<style lang="scss" scoped>
/* 歌曲信息 */
.songInfo {
  height: calc(100vh - (var(--topNavBarHeight) + var(--playBarHeight) + 30px));
  @apply flex gap-20px py-15px;

  .detail {
    @apply flex flex-col justify-center items-center gap-30px flex-1;

    .cover {
      @apply w-1/2 shadow-xl rounded-md;
    }
  }

  .lyricWrap {
    @apply hidden md-flex flex-1 flex-col overflow-hidden;

    .info {
      @apply flex gap-10px text-14px pt-5px pb-10px;

      .artists {
        @apply flex-1 flex items-center truncate overflow-hidden;
      }
    }
  }
}

/* 操作 */
.operate {
  @apply flex items-center justify-center gap-30px;

  li {
    @apply p-10px rounded-full cursor-pointer bg-gray-100 hover-themeColor hover-bg-gray-200;

    span {
      @apply text-22px;
    }
  }
}
</style>
