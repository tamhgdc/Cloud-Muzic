import { RouteRecordRaw } from "vue-router";
import { useMainStore } from "store";

let Account = () => import("@/pages/account/account.vue");
let Dynamic = () => import("@/pages/account/dynamic/dynamic.vue");
let Login = () => import("@/pages/account/login/login.vue");
let Register = () => import("@/pages/account/register/register.vue");
let PersonalPage = () => import("@/pages/account/personalPage/personalPage.vue");
let MyHonePage = () => import("@/pages/account/myHomePage/myHomePage.vue");
let EditPersonalInfo = () => import("@/pages/account/editPersonalInfo/editPersonalInfo.vue");
let UserDynamic = () => import("@/pages/account/userDynamic/userDynamic.vue");
let UserFollows = () => import("@/pages/account/userFollows/userFollows.vue");
let UserFolloweds = () => import("@/pages/account/userFolloweds/userFolloweds.vue");
let RecentPlay = () => import("@/pages/account/recentPlay/recentPlay.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/account",
    component: Account,
    redirect: "/account/login",
    beforeEnter() {
      const store = useMainStore();
      if (store.accountInfo.id) {
        return "/myHonePage"
      } else {
        return true;
      }
    },
    meta: {
      title: "账户",
      tablist: [
        { title: "登陆", path: "/account/login" },
        { title: "注册", path: "/account/register" },
      ],
    },
    children: [{
      path: "login",
      component: Login,
    }, {
      path: "register",
      component: Register,
    }]
  },
  // 我的主页
  {
    path: "/myHonePage",
    component: MyHonePage,
    meta: { title: "我的主页", auth: true }
  },
  // 个人主页
  {
    path: "/personalPage/:uid",
    component: PersonalPage,
    meta: { title: "个人主页" }
  },
  // 关注
  {
    path: "/following",
    component: Dynamic,
    meta: { title: "动态", auth: true }
  },
  // 编辑个人信息
  {
    path: "/editPersonalInfo",
    component: EditPersonalInfo,
    meta: { title: "编辑个人信息", auth: true }
  },
  // 用户动态
  {
    path: "/userDynamic/:uid",
    component: UserDynamic,
    meta: { title: "个人动态", auth: true }
  },
  // 用户关注
  {
    path: "/userFollows/:uid",
    component: UserFollows,
    meta: { title: "个人关注", auth: true }
  },
  // 用户粉丝
  {
    path: "/userFolloweds/:uid",
    component: UserFolloweds,
    meta: { title: "个人粉丝", auth: true }
  },
  // 用户粉丝
  {
    path: "/recentPlay",
    component: RecentPlay,
    meta: { title: "最近播放", auth: true }
  }
];

export default routes;