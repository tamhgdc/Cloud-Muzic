<!-- 账户详情 -->
<template>
  <div rounded overflow-hidden h-85>
    <div relative>
      <!-- 背景图片 -->
      <el-image :src="info.backgroundUrl" fit="cover" h-40 w-full brightness-95 />
      <!-- 编辑个人信息 -->
      <div absolute right-0px bottom-5px @click="goEditInfo">
        <el-tooltip ref="tooltipEl" content="编辑个人信息" placement="top" effect="light" :hide-after="0">
          <span cursor-pointer text-22px mr-5px mb-1px text-white i-carbon:edit></span>
        </el-tooltip>
      </div>
    </div>

    <!-- 头像 -->
    <el-image :src="info.avatarUrl" class="avatar" />

    <!-- 简介 -->
    <div h-full translate-y--70px bg-gray-200 p-10px pt-40px>
      <div text-15px>
        <p flex items-center gap-5px min-h-20px>
          <span text-18px themeColor>{{ info.nickname }}</span>
          <span bg-orange-400 py-2px px-5px text-white text-13px rounded>{{ info.level }}</span>
          <span v-if="info.gender" text-17px
            :class="info.gender == 1 ? 'i-carbon:gender-male' : 'i-carbon:gender-female'"
            :style="{ color: info.gender == 1 ? '#3b82f6' : '#e3357b' }"></span>
        </p>
        <p truncate py-5px>个人介绍: {{ info.signature }}</p>
        <p truncate>所在地区: {{ info.cityName }}</p>
      </div>

      <div flex justify-between gap-10px mt-10px h-12>
        <!-- 计数 -->
        <ul class="count">
          <li @click="goCountPage('/userDynamic')">
            <span text-blue-500>{{ info.dynamic || 0 }}</span>
            <span>动态</span>
          </li>
          <li @click="goCountPage('/userFollows')">
            <span text-teal-500>{{ info.follows || 0 }}</span>
            <span>关注</span>
          </li>
          <li @click="goCountPage('/userFolloweds')">
            <span text-violet-500>{{ info.followeds || 0 }}</span>
            <span>粉丝</span>
          </li>
        </ul>
        <!-- 退出登陆 -->
        <div @click.stop="exitLogin" class="exit">
          <span i-carbon:login></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElTooltip } from "element-plus";
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "store";
import { AccountAPI } from "api";
import { Handle } from "utils";
const store = useMainStore();
const router = useRouter();

// 个人信息
interface ProfileInfo {
  id: number,            // 用户id
  level: number,          // 等级
  avatarUrl: string,      // 头像
  backgroundUrl: string,  // 背景图片
  gender: 0 | 1 | 2,      // 性别
  nickname: string,       // 昵称
  signature: string,      // 签名
  cityName: string,       // 城市
  dynamic: number,        // 动态数量
  follows: number,        // 关注数量
  followeds: number       // 粉丝数量
}
let info = reactive<ProfileInfo>({} as ProfileInfo);
// tooltip元素
let tooltipEl = ref<InstanceType<typeof ElTooltip>>();

// 跳转编辑个人信息页面
let goEditInfo = () => {
  if (tooltipEl.value) {
    tooltipEl.value.hide();
    router.push("/editPersonalInfo");
  }
}

// 跳转 动态/关注/粉丝 页面
let goCountPage = (path: string) => {
  if (info?.id) {
    router.push(`${path}/${info.id}`);
  }
}

// 退出登陆
let exitLogin = async () => {
  try {
    await ElMessageBox.confirm(
      '是否退出登陆!',
      '提示',
      {
        center: true,
        showCancelButton: false,
        confirmButtonText: '退出',
        confirmButtonClass: 'MessageBoxConfirmBtn',
        customStyle: {
          width: '280px'
        }
      }
    )
    // 确认退出
    let { code }: any = await AccountAPI.loginLogout();
    if (code == 200) {
      ElMessage.success("退出成功!");
      // 清除账号信息
      store.accountInfo = { id: 0, avatarUrl: '', nickname: '', signature: '' };
      // 跳转到首页
      router.replace("/");
    }
  } catch (err: any) { }
}

// 获取 动态/关注/粉丝 数量
let getCount = async (id: number) => {
  try {
    let [Event, Follows, Followeds]: any = await Promise.all([AccountAPI.getUserEvent(id), AccountAPI.getUserFollows(id), AccountAPI.getUserFolloweds(id)])
    Object.assign(info, {
      dynamic: Event?.size || 0,             // 动态
      followeds: Followeds?.size || 0,       // 粉丝
      follows: Follows?.follow.length || 0   // 关注
    });
  } catch (err: any) {
    ElMessage.error("加载动态/关注/粉丝数失败!");
  }
}

// 加载个人信息
onMounted(async () => {
  try {
    // 获取个人信息
    let { code, profile }: any = await AccountAPI.getUserAccount();
    // 获取个人等级
    let { data: { level } } = await AccountAPI.getUserLevel();
    if (code == 200) {
      let { userId: id, avatarUrl, backgroundUrl, city, nickname, signature, province, gender } = profile;
      // 处理城市
      let cityName = Handle.City(province, city);
      store.accountInfo = { nickname, avatarUrl, id, signature };
      Object.assign(info, { id, level, avatarUrl, backgroundUrl, gender, nickname, signature, cityName });
      // 获取数量
      getCount(id);
    }
  } catch (err: any) {
    ElMessage.error("加载账号信息失败!");
  }
});
</script>

<style lang="scss" scoped>
.avatar {
  transform: translate(10px, -35px);
  @apply w-70px h-70px rounded-full relative z-10 border-5px border-#fff;
}

.count {
  @apply flex gap-10px;

  li {
    @apply bg-white rounded h-full py-5px px-10px flex flex-col justify-between items-center cursor-pointer;


    span {
      &:first-child {
        @apply text-17px truncate;
      }

      &:last-child {
        @apply text-14px text-gray-500 truncate;
      }
    }
  }
}

.exit {
  @apply bg-white rounded h-full px-10px cursor-pointer flex items-center hover-themeColor;

  span {
    @apply text-20px;
  }
}
</style>