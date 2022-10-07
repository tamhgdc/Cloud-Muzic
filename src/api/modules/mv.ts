import { GET } from "../request";

export default {
  // 获取独家放送列表
  getBroadcastList(offset: number = 0, limit: number = 60) {
    return GET("/personalized/privatecontent/list", { limit, offset });
  },
  // 获取mv详情
  getDetail(mvid: number) {
    return GET("/mv/detail", { mvid });
  },
  // 获取mv推荐
  getPersonalized() {
    return GET("/personalized/mv");
  },
  // 获取mv地址
  getAddress(id: number, r: number = 1080) {
    return GET("/mv/url", { id, r });
  },
  // 获取最新mv
  getNewMV(area: string = "", limit: number = 30) {
    // area 不填则为全部
    return GET("/mv/first", { area, limit });
  },
  // 获取mv点赞/分享/评论数数据
  getDetailInfo(mvid: number) {
    return GET("/mv/detail/info", { mvid });
  },
  // 获取网易出品mv
  getExclusive(offset: number = 0, limit: number = 30) {
    return GET("/mv/exclusive/rcmd", { offset, limit });
  },
  // 获取mv排行
  getTopMV(area: string = "全部", offset: number = 0, limit: number = 30) {
    return GET("/top/mv", { area, offset, limit });
  },
  // 获取全部mv
  getAllMV(area: string = "全部", type: string = "全部", order: string = "上升最快", offset: number = 0, limit: number = 30) {
    return GET("/mv/all", { area, type, order, offset, limit });
  },
  // 获取相关mv
  getRelevant(mvid: number) {
    return GET("/simi/mv", { mvid });
  }
};