import { GET } from "../request";

export default {
  // 获取个性推荐Banner
  getBanner(type: 0 | 1 | 2 | 3 = 0) {
    // type: 0[pc] 1[android] 2[iphone] 3[ipad]
    return GET("/banner", { type });
  },
  // 获取热搜列表(详细)
  getSearchHot() {
    return GET("/search/hot/detail");
  },
  // 搜索
  getCloudSearch(keywords: string, type: number = 1, offset: number = 0, limit: number = 50) {
    // type: 1[单曲], 10[专辑], 100[歌手], 1000[歌单], 1002[用户], 1009[电台], 1014[视频], 
    return GET("/cloudsearch", { keywords, type, offset, limit });
  },
  // 热门话题
  getHotTopic(offset: number = 0, limit: number = 20) {
    return GET("/hot/topic", { offset, limit });
  },
  // 新版评论接口
  getCommentNew(id: number | string, type: 0 | 1 | 2 | 3 | 4 | 5 | 6, pageNo: number = 1, pageSize: number = 20, cursor: string = "") {
    // type [0]歌曲 [1]mv [2]歌单 [3]专辑 [4]电台 [5]视频 [6]动态
    // sortType [1]按推荐排序 [2]按热度排序 [3]按时间排序
    return GET("/comment/new", { id, type, pageNo, pageSize, sortType: 3, cursor });
  },

}