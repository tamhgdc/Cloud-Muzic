import { GET } from "../request";

export default {
  // 获取推荐歌单
  getPersonalized(limit: number = 30) {
    return GET("/personalized", { limit });
  },
  // 获取歌单详情
  getDetail(id: number) {
    return GET("/playlist/detail", { id });
  },
  // 获取歌单分类
  getCateList() {
    return GET("/playlist/catlist");
  },
  // 获取热门歌单分类
  getHotList() {
    return GET("/playlist/hot");
  },
  // 获取歌单(网友精选碟)
  getTop(cat: string, offset: number = 0, limit: number = 30) {
    return GET("/top/playlist", { cat, offset, limit });
  },
  // 获取歌单收藏者
  getSubscribers(id: number, offset: number = 0, limit: number = 20) {
    return GET("/playlist/subscribers", { id, offset, limit });
  },
  // 获取歌单所有歌曲
  getTrackAll(id: number, offset: number = 0, limit: number = 100) {
    return GET("/playlist/track/all", { id, limit, offset });
  },
  // 所有榜单内容摘要
  getTopDetail() {
    return GET("/toplist/detail");
  },
  // 获取用户歌单
  getUserPlaylist(uid: number, offset: number = 0, limit: number = 30) {
    return GET("/user/playlist", { uid, offset, limit });
  },
}