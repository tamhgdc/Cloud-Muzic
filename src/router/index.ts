import { createRouter, createWebHistory } from "vue-router";
import { useMainStore } from "store";
import routes from "./routes";

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, from, next) => {
  // 更改标题
  document.title = `CloudMusic ${to.matched[0].meta.title as string}`;
  // 判断即将跳转的页面是否需要权限
  if (!to.meta.auth) return next();
  const store = useMainStore();
  store.accountInfo.id ? next() : next("/account/login");
});

export default router;
