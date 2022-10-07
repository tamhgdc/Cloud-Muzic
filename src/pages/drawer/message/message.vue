<!-- 通知 -->
<template>
  <el-drawer direction="rtl" size="350px" :z-index="200" :append-to-body="true" v-model="store.messageDrawer"
    :with-header="false">
    <div h-full bg-white>
      <header class="header">
        <h1 class="title">消息</h1>
        <ul class="nav">
          <li v-for="item in navList" :key="item.name" @click.stop="navClick(item)"
            :class="{ active: currentNav.name == item.name }">
            {{ item.name }}
          </li>
        </ul>
      </header>
      <main class="view">
        <el-scrollbar>
          <keep-alive>
            <component :is="currentNav.component" />
          </keep-alive>
        </el-scrollbar>
      </main>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import AtMe from "./coms/atMe.vue";
import Notice from "./coms/notice.vue"
import Comment from "./coms/comment.vue";
import PrivateMsg from "./coms/privateMsg.vue";
import { markRaw, reactive } from "vue";
import { useMainStore } from "store";
const store = useMainStore();

// 当前导航名称
let currentNav = reactive<NavItem>({
  name: "私信",
  component: markRaw(PrivateMsg)
});
// 导航列表
interface NavItem {
  name: string,
  component: any
}
let navList: NavItem[] = [
  {
    name: "私信",
    component: markRaw(PrivateMsg)
  },
  {
    name: "评论",
    component: markRaw(Comment)
  },
  {
    name: "@我",
    component: markRaw(AtMe)
  },
  {
    name: "通知",
    component: markRaw(Notice)
  }
]

// 导航点击事件
let navClick = (item: NavItem) => {
  if (item.name !== currentNav.name) {
    Object.assign(currentNav, item);
  }
}
</script>

<style lang="scss" scoped>
.header {
  @apply h-85px px-20px flex flex-col justify-around;

  .title {
    @apply text-19px;
  }

  .nav {
    @apply flex w-full border-1px border-zinc-300 rounded-full;

    li {
      @apply flex-1 text-center py-6px cursor-pointer text-14px rounded-full hover-bg-zinc-100;

      &.active {
        @apply bg-zinc-400 text-white;
      }
    }
  }
}

.view {
  height: calc(100% - 90px);
}
</style>