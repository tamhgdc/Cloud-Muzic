import { RouteRecordRaw } from "vue-router";

let PrivateFM = () => import("@/pages/privateFM/privateFM.vue");
let Error = () => import("@/pages/error/error.vue");
let Search = () => import("@/pages/search/search.vue");

const routes: RouteRecordRaw[] = [
  // 搜索页面
  {
    path: "/search/:keyword",
    meta: { title: "搜索" },
    component: Search
  },
  // 私人FM
  {
    path: "/privateFM",
    meta: { title: "私人FM", auth: true },
    component: PrivateFM
  },
  // 404 
  {
    path: '/:pathMatch(.*)',
    component: Error,
    meta: { title: "404 Not Found" }
  }
];

export default routes;