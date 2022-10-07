<!-- 歌曲详情 -->
<template>
  <el-drawer direction="btt" custom-class="songDetailDrawer" :z-index="100" :append-to-body="true" :with-header="false"
    @close="closeDrawer" v-model="store.songDetailDrawer">
    <el-scrollbar>
      <div v-if="song?.id" :key="song.id" wrapBox>
        <!-- 信息 -->
        <section class="songInfo">
          <div class="infoWrap">
            <!-- 封面 -->
            <el-image :src="store.currentSong?.album.picUrl" fit="cover" class="cover" />
            <!-- 操作 -->
            <ul class="operate">
              <li>
                <LikeIcon :id="song.id" />
              </li>
              <li>
                <span i-carbon:folder-add></span>
              </li>
              <li @click="Operate.downloadSong(song!.id)">
                <span i-carbon:cloud-download></span>
              </li>
              <li @click="share">
                <span i-carbon:link></span>
              </li>
            </ul>
          </div>

          <div class="lyricWrap">
            <!-- 标题 -->
            <h1 text-20px truncate>{{ song.name }}</h1>

            <!-- 歌曲信息 -->
            <div class="info">
              <p flex-1 truncate>
                <span>专辑:&nbsp;</span>
                <span themeColor>{{ albumName }}</span>
              </p>
              <p class="artists">
                <span>歌手:&nbsp;</span>
                <Artists @jump="closeDrawer" :artists="artists!" fontSize="14px" />
              </p>
            </div>

            <!-- 歌词 -->
            <div flex-1 overflow-hidden>
              <Lyric :id="song.id" />
            </div>
          </div>
        </section>

        <!-- 评论 / 推荐 -->
        <section class="extra">
          <div flex-1 pb-50px>
            <Comment ref="commentEl" :id="song.id" :type="0" />
          </div>

          <div class="recommend">
            <!-- 标题 -->
            <h2 text-18px mb-10px>相似歌曲</h2>

            <!-- 相似歌曲列表 -->
            <SimiSongList :id="song.id" />
          </div>
        </section>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script setup lang="ts">
import Comment from "@/components/content/comment/comment.vue";
import LikeIcon from "@/components/content/likeIcon/likeIcon.vue";
import Artists from "@/components/content/artists/artists.vue";
import Lyric from "@/components/content/lyric/lyric.vue";
import SimiSongList from "./coms/simiSongList.vue";
import { useMainStore } from "store";
import { computed, ref } from "vue";
import { Operate } from "utils";
const store = useMainStore();

// 评论元素
let commentEl = ref<InstanceType<typeof Comment>>();
// 歌曲信息
let song = computed(() => {
  return store.currentSong?.song;
})
// 歌曲艺术家
let artists = computed(() => {
  return store.currentSong?.artists;
})
// 专辑名称
let albumName = computed(() => {
  return store.currentSong?.album.name;
})

// 关闭Drawer
let closeDrawer = () => {
  store.songDetailDrawer = false;
  commentEl.value?.closeDialog();
}

// 分享
let share = () => {
  let title = song.value?.name;
  if (title) {
    Operate.shareInfo(title, location.href);
  }
}
</script>

<style lang="scss" scoped>
// 歌曲信息容器高度
.songInfo {
  height: calc(var(--100vh) - var(--topNavBarHeight) - var(--topNavBarHeight) - 30px);
  @apply flex gap-40px py-15px;

  .infoWrap {
    @apply flex-1 flex-col justify-center items-center gap-30px hidden sm-flex;

    .cover {
      @apply w-2/5 rounded-md overflow-hidden shadow-xl;
    }
  }

  .lyricWrap {
    @apply flex flex-1 flex-col flex-nowrap overflow-hidden;

    .info {
      @apply flex gap-10px text-14px pt-5px pb-10px;
    }

    .artists {
      @apply flex-1 flex items-center truncate overflow-hidden;
    }
  }
}

.extra {
  @apply flex gap-40px pb-20px;

  .recommend {
    @apply w-300px min-w-300px hidden sm-inline-block;
  }
}

// 操作 
.operate {
  @apply flex items-center justify-center gap-30px;

  li {
    @apply p-10px rounded-full cursor-pointer bg-gray-100 hover-themeColor;

    span {
      @apply text-22px;
    }

    &:hover {
      @apply bg-gray-200;
    }
  }
}
</style>
<style lang="scss">
.songDetailDrawer {
  height: calc(var(--100vh) - var(--topNavBarHeight)) !important;
  @apply dark-bg-gray-300;

  .el-drawer__body {
    padding: 0px;
  }
}
</style>