<!-- 侧边导航栏 -->
<template>
  <main class="sidebar" :class="{ folding: sidebarFolding }">
    <!-- 登陆 / 注册 / 账号信息 -->
    <div>
      <!-- 已登陆 -->
      <section v-if="store.accountInfo.id" @click="$router.push('/myHonePage')" class="profile">
        <!-- 头像 -->
        <el-image :src="accountInfo.avatarUrl" class="avatar" />

        <!-- 信息 -->
        <div class="info">
          <!-- 昵称 -->
          <p class="nickname">{{ accountInfo.nickname }}</p>
          <!-- 签名 -->
          <p class="signature">{{ accountInfo.signature }}</p>
        </div>
      </section>

      <!-- 未登陆 -->
      <section v-else @click="$router.push('/account/login')" class="listItem login" py-15px rounded>
        <span i-carbon:login></span>
        <p>未登陆</p>
      </section>
    </div>

    <!-- 导航列表 / 版权声明 -->
    <nav class="nav">
      <!-- 列表 -->
      <ul class="navList">
        <li @click="$router.push(item.path)" :class="{ active: $route.matched[0]?.path == item.path }"
          v-for="item in navList" :key="item.title">
          <span :class="item.icon"></span>
          <p>{{ item.title }}</p>
        </li>
      </ul>

      <!-- 版权声明 -->
      <div class="copyright">
        <a href="https://github.com/404Awesome/CloudMusic" target="_blank" class="link">
          <span class="icon" i-carbon:information-filled></span>
          <span class="content">本项目为开源项目!</span>
        </a>
        <p mt-5px>本项目仅用于学习用途!</p>
        <p>资源版权都属于网易云音乐!</p>
      </div>
    </nav>

    <!-- 折叠 -->
    <div @click="folding" class="foldingBtn">
      <span class="icon" :class="store.sidebarFolding ? 'i-carbon:chevron-right' : 'i-carbon:chevron-left'"></span>
      <span class="content">折叠导航栏</span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch } from "vue";
import { useMainStore } from "store";
const store = useMainStore();
let { sidebarFolding, accountInfo } = toRefs(store);

// 导航列表
interface ListItem {
  icon: string,
  title: string,
  path: string
}
// 无需登陆列表
let noLogin: ListItem[] = [
  {
    icon: "i-carbon:music",
    title: "发现音乐",
    path: "/discover",
  },
  {
    icon: "i-carbon:media-library",
    title: "视频",
    path: "/video",
  },
];
// 需要登陆列表
let needLogin: ListItem[] = [
  {
    icon: "i-carbon:user-multiple",
    title: "关注",
    path: "/following",
  },
  {
    icon: "i-carbon:radar",
    title: "私人FM",
    path: "/privateFM",
  },
  {
    icon: "i-carbon:recently-viewed",
    title: "最近播放",
    path: "/recentPlay",
  }
];
// 导航列表
let navList = reactive<ListItem[]>([]);

// 监视store中的账号状态
watch(() => store.accountInfo.id, (status) => {
  navList.splice(0, navList.length, ...noLogin);
  if (status) navList.push(...needLogin);
}, { immediate: true });

// 折叠侧边栏
let folding = () => {
  store.sidebarFolding = !store.sidebarFolding;
}
</script>

<style lang="scss" scoped>
// 侧边栏容器
.sidebar {
  @apply flex flex-col gap-10px select-none p-10px h-full overflow-hidden bg-gray-300 dark-bg-gray-500;
}

// 导航
.nav {
  @apply flex flex-col gap-10px flex-1 justify-between;
}

// 版权声明
.copyright {
  @apply bg-white/80 p-10px rounded-md text-14px text-gray-500 dark-bg-gray-300 dark-text-gray-400;

  // 标题
  .link {
    @apply flex items-center gap-3px decoration-none;

    // 图标
    .icon {
      @apply block text-20px themeColor dark-text-orange-400;
    }

    // 内容
    .content {
      @apply text-16px themeColor hover-decoration-underline dark-text-orange-400;
    }
  }
}

// 个人信息
.profile {
  @apply transition duration-200 ease-in-out flex gap-10px p-10px rounded-md bg-white/0 cursor-pointer;

  &:hover {
    @apply bg-white/80 dark-bg-gray-400;
  }

  .avatar {
    @apply flex-none w-45px h-45px rounded-full;
  }

  // 个人信息
  .info {
    @apply flex flex-col flex-nowrap justify-around text-13px w-full overflow-hidden;

    .nickname {
      @apply truncate themeColor text-15px dark-text-orange-400;
    }

    .signature {
      @apply truncate dark-text-gray-200;
    }
  }
}

.navList {
  @apply overflow-hidden rounded-md;

  .active {
    @apply text-white themeBgColor dark-bg-gray-600 dark-text-gray-200;
  }
}

.navList li,
.listItem {
  @apply flex items-center p-10px bg-white cursor-pointer gap-5px dark-bg-gray-300;

  p {
    @apply whitespace-nowrap text-14px;
  }

  &:hover {
    @apply themeBgColor text-white dark-bg-gray-600 dark-text-gray-200;
  }
}

.foldingBtn {
  @apply flex justify-center items-center bg-white/80 rounded-md px-5px py-7px cursor-pointer hover-themeColor;

  .icon {
    @apply text-19px;
  }

  .content {
    @apply text-14px;
  }
}

// 侧边栏折叠状态
.folding {
  .profile {
    @apply p-5px rounded-full;

    .avatar {
      @apply w-40px h-40px;
    }

    .info {
      @apply display-none;
    }
  }

  .navList li {
    @apply justify-center;

    p {
      @apply display-none;
    }
  }

  .copyright {
    p {
      @apply display-none;
    }

    .link {
      @apply justify-center;

      .content {
        @apply display-none;
      }
    }
  }

  .foldingBtn .content {
    @apply display-none;
  }

  .login {
    @apply p-10px justify-center;

    p {
      @apply display-none;
    }
  }
}
</style>
