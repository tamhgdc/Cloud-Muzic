import { GET } from "../request";

export default {
  // 获取电台Banner
  getBanner() {
    return GET("/dj/banner");
  },
  // 获取电台分类列表
  getCatelist() {
    return GET("/dj/catelist");
  },
  // 获取付费精选
  getPaygift(offset: number = 0, limit: number = 30) {
    return GET("/dj/paygift", { offset, limit });
  },
  // 获取类别热门电台
  getCateRadioHot(cateId: number, offset: number = 0, limit: number = 30) {
    return GET("/dj/radio/hot", { cateId, offset, limit });
  },
  // 获取电台详情(需登陆)
  getDetail(rid: number) {
    return GET("/dj/detail", { rid });
  },
  // 获取节目详情
  getProgramDetail(id: number) {
    return GET("/dj/program/detail", { id });
  },
  // 获取今日精选
  getTodayPerfered() {
    return GET("/dj/today/perfered");
  },
  // 获取热门电台
  getHot(offset: number = 0, limit: number = 30) {
    return GET("/dj/hot", { limit, offset });
  }
}