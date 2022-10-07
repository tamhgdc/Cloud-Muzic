import { RouteRecordRaw } from "vue-router";
import { useMainStore } from "store";

let Video = () => import("@/pages/video/video.vue");
let VideoList = () => import("@/pages/video/videoList/videoList.vue");
let MVList = () => import("@/pages/video/mvList/mvList.vue");
let MVDetail = () => import("@/pages/video/mvDetail/mvDetail.vue");
let VideoDetail = () => import("@/pages/video/videoDetail/videoDetail.vue");
let AllMV = () => import("@/pages/video/allMV/allMV.vue");
let RankingList = () => import("@/pages/video/rankingList/rankingList.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/video",
    component: Video,
    redirect: "/video/mvList",
    meta: {
      title: "视频",
      tablist: [
        { title: "MV", path: "/video/mvList" },
        { title: "视频", path: "/video/videoList", auth: true }
      ]
    },
    children: [{
      path: "videoList",
      component: VideoList,
      beforeEnter() {
        const store = useMainStore();
        return store.accountInfo.id ? true : "/account/login";
      },
    }, {
      path: "mvList",
      component: MVList
    }]
  },
  // MV详情
  {
    path: "/mvDetail/:id",
    component: MVDetail,
    meta: { title: "MV详情" }
  },
  // 视频详情
  {
    path: "/videoDetail/:vid",
    component: VideoDetail,
    meta: { title: "视频详情", auth: true }
  },
  // 全部MV
  {
    path: "/allMV",
    component: AllMV,
    meta: { title: "全部MV" }
  },
  // MV排行榜
  {
    path: "/mvRankingList",
    component: RankingList,
    meta: { title: "MV排行榜" }
  }
];

export default routes;