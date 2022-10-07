import { RouteRecordRaw } from "vue-router";
import account from "./account";
import discover from "./discover";
import video from "./video";
import other from "./other"

const routes: RouteRecordRaw[] = [
  // 发现音乐
  ...discover,
  // 账户
  ...account,
  // 视频
  ...video,
  // 其他
  ...other,
];

export default routes;