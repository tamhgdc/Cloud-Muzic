import { GET } from "../request";

export default {
  // 推荐新音乐
  getNewSong(limit: number = 10) {
    return GET("/personalized/newsong", { limit });
  },
  // 获取歌曲详情
  getDetail(ids: number) {
    return GET("/song/detail", { ids });
  },
  // 获取私人FM
  getPersonalFM() {
    return GET("/personal_fm");
  },
  // 获取相似音乐
  getSimi(id: number) {
    return GET("/simi/song", { id });
  },
  // 获取歌词
  getLyric(id: number) {
    return GET("/lyric", { id });
  },
  // 获取每日推荐歌曲
  getRecommend() {
    return GET("/recommend/songs");
  },
  // 喜欢音乐列表
  getLikeList(uid: number) {
    return GET("/likelist", { uid });
  },
  // 喜欢音乐列表
  likeSong(id: number, like: boolean) {
    // 默认为 true 即喜欢 , 若传 false, 则取消喜欢
    return GET("/like", { id, like });
  }
}