import { GET } from "../request";

export default {
  // 获取歌手分类列表
  getList(type: number, area: number, initial: string, offset: number = 0, limit: number = 30) {
    // type: -1[全部] 1[男歌手] 2[女歌手] 3[乐队]
    // area: -1[全部] 7[华语] 96[欧美] 8[日本] 16[韩国] 0[其他]
    return GET("/artist/list", { type, area, initial, offset, limit });
  },
  // 获取歌手专辑
  getAlbum(id: number, offset: number = 0, limit: number = 30) {
    return GET("/artist/album", { id, offset, limit });
  },
  // 获取相似歌手(需要登陆)
  getSimilar(id: number) {
    return GET("/simi/artist", { id });
  },
  // 获取歌手描述
  getDescribe(id: number) {
    return GET("/artist/desc", { id });
  },
  // 获取歌手详情
  getDetail(id: number) {
    return GET("/artist/detail", { id })
  },
  // 获取歌手mv
  getMV(id: number) {
    return GET("/artist/mv", { id });
  },
  // 歌手热门50首歌曲
  getTopSong(id: number) {
    return GET("/artist/top/song", { id });
  },
  // 获取专辑内容
  getAlbumInfo(id: number) {
    return GET("/album", { id });
  },
}