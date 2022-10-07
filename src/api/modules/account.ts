import { POST, GET } from "../request";
import md5 from "md5";

export default {
  // 获取账户详情
  getUserAccount() {
    return GET("/user/account");
  },
  // 获取用户详情
  getUserDetail(uid: number) {
    return GET("/user/detail", { uid });
  },
  // 发送验证码
  captchaSent(phone: number) {
    return POST("/captcha/sent", { phone });
  },
  // 注册(修改密码)
  registerCellphone(captcha: number, phone: number, password: string, nickname: string) {
    return GET("/register/cellphone", { captcha, phone, password, nickname });
  },
  // 登录状态
  loginStatus() {
    return GET("/login/status");
  },
  // 退出登录
  loginLogout() {
    return GET("/logout");
  },
  // 登陆密码 
  loginPassword(phone: number, password: string) {
    return POST("/login/cellphone", { phone, md5_password: md5(password) });
  },
  // 邮箱登录
  loginEmail(email: string, password: string) {
    return POST("/login", { email, md5_password: md5(password) });
  },
  // 验证码登录
  loginCaptcha(phone: number, captcha: number) {
    return POST("/login/cellphone", { phone, captcha });
  },
  // 二维码 key 生成接口
  loginQrKey() {
    return POST("/login/qr/key");
  },
  // 二维码生成接口
  loginQrCreate(key: string) {
    return POST("/login/qr/create", { key });
  },
  // 二维码检测扫码状态接口
  loginQrCheck(key: string) {
    return GET("/login/qr/check", { key });
  },
  // 获取用户等级信息
  getUserLevel() {
    return GET("/user/level");
  },
  // 获取用户动态
  getUserEvent(uid: number) {
    return GET("/user/event", { uid });
  },
  // 获取用户关注列表
  getUserFollows(uid: number, offset: number = 0, limit: number = 30) {
    return GET("/user/follows", { uid, offset, limit });
  },
  // 获取用户粉丝列表
  getUserFolloweds(uid: number, offset: number = 0, limit: number = 30) {
    return GET("/user/followeds", { uid, offset, limit });
  },
  // 获取用户信息 , 歌单，收藏，mv, dj 数量
  getUserSubcount() {
    return GET("/user/subcount");
  },
  // 获取动态消息
  getEvent(lasttime: number, pagesize: number = 20) {
    return GET("/event", { pagesize, lasttime });
  },
  // 关注/取消关注用户
  getFollow(id: number, t: number = 0 | 1) {
    // [t] 1为关注 0为取消关注
    return GET("/follow", { id, t });
  },
  // 通知 - 私信
  getMsgPrivate(offset: number = 0, limit: number = 15) {
    return GET("/msg/private", { offset, limit });
  },
  // 私信内容
  getMsgPrivateHistory(uid: number, before: number, limit: number = 15) {
    return GET("/msg/private/history", { uid, before, limit });
  },
  // 发送私信
  sendText(user_ids: number, msg: string) {
    return GET("/send/text", { user_ids, msg });
  },
  // 最近播放-歌曲
  getRecentSong(limit: number = 100) {
    return GET("/record/recent/song", { limit });
  }
}