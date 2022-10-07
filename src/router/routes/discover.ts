import { RouteRecordRaw } from "vue-router";
import { useMainStore } from "store";

let Discover = () => import("@/pages/discover/discover.vue");
let Recommend = () => import("@/pages/discover/recommend/recommend.vue");
let SongList = () => import("@/pages/discover/songList/songList.vue");
let Ranking = () => import("@/pages/discover/ranking/ranking.vue");
let Singer = () => import("@/pages/discover/singer/singer.vue");
let PaidBoutique = () => import("@/pages/discover/paidBoutique/paidBoutique.vue");
let RadioStation = () => import("@/pages/discover/radioStation/radioStation.vue");
let RadioDetail = () => import("@/pages/discover/radioDetail/radioDetail.vue");
let RadioCateDetail = () => import("@/pages/discover/radioCateDetail/radioCateDetail.vue");
let DailySongs = () => import("@/pages/discover/dailySongs/dailySongs.vue")
let Broadcast = () => import("@/pages/discover/broadcast/broadcast.vue");
let SongListDetail = () => import("@/pages/discover/songListDetail/songListDetail.vue");
let SingerDetail = () => import("@/pages/discover/singerDetail/singerDetail.vue");
let AlbumDetail = () => import("@/pages/discover/albumDetail/albumDetail.vue");


// 默认为发现音乐
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/discover"
  },
  {
    path: "/discover",
    component: Discover,
    redirect: "/discover/recommend",
    meta: {
      title: "发现音乐",
      tablist: [
        { title: "个性推荐", path: "/discover/recommend" },
        { title: "排行榜", path: "/discover/ranking" },
        { title: "歌单", path: "/discover/songList" },
        { title: "歌手", path: "/discover/singer" },
        { title: "主播电台", path: "/discover/radioStation" },
      ]
    },
    children: [{
      path: "recommend",
      component: Recommend,
    }, {
      path: "songList",
      component: SongList,
    }, {
      path: "ranking",
      component: Ranking
    }, {
      path: "singer",
      component: Singer
    }, {
      path: "radioStation",
      component: RadioStation
    }]
  },
  // 每日推荐
  {
    path: "/dailySongs",
    component: DailySongs,
    meta: { title: "每日推荐", auth: true }
  },
  // 歌单详情
  {
    path: "/songListDetail/:id",
    meta: { title: "歌单详情", scroll: true },
    component: SongListDetail,
    beforeEnter() {
      const store = useMainStore();
      store.scrollTop = 0;
      return true;
    }
  },
  // 独家放送
  {
    path: "/broadcast",
    meta: { title: "独家放送" },
    component: Broadcast
  },
  // 歌手详情
  {
    // query: { id, name, alias? }
    path: "/singerDetail",
    meta: { title: "歌手详情" },
    component: SingerDetail
  },
  // 付费精品
  {
    path: "/paidBoutique",
    meta: { title: "付费精品" },
    component: PaidBoutique
  },
  // 电台详情
  {
    path: "/radioDetail/:id",
    meta: { title: "电台详情", auth: true },
    component: RadioDetail
  },
  // 电台分类详情
  {
    path: "/radioCateDetail",
    meta: { title: "电台分类详情", auth: true },
    component: RadioCateDetail
  },
  // 专辑详情
  {
    path: "/albumDetail/:id",
    meta: { title: "专辑详情" },
    component: AlbumDetail
  },
];

export default routes;