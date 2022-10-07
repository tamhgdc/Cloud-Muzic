import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import { SongInfo, useMainStore } from "store";
import { AccountAPI, SongListAPI } from "api";
import { useDebounceFn } from "@vueuse/core";
import { useRouter } from "vue-router";
import { Handle } from "utils";
import { toRaw } from "vue";

// 防抖函数延迟时间
const delay = 300;
export default {
  // 将歌单列表前20首歌添加到播放列表
  playSongList: useDebounceFn(async (id: number) => {
    const store = useMainStore();
    if (store.songListID == id) return ElMessage.warning('请不要重复播放相同歌单!');
    let { code, songs }: any = await SongListAPI.getTrackAll(id, 0, 20);
    if (code == 200) {
      let songList = Handle.SongList(songs);
      store.addPlayList(songList);
      store.songListID = id;
    }
  }, delay),
  // 将歌曲列表添加到播放列表
  addPlayList: useDebounceFn((songList: SongInfo[], id: number) => {
    const store = useMainStore();
    songList = toRaw(songList);
    if (store.songListID == id && id) return ElMessage.warning('请不要重复播放相同歌单!');
    store.addPlayList(songList);
    store.songListID = id;
  }, delay),
  // 播放歌曲
  playSong(song: any) {
    const store = useMainStore();
    let songInfo = Handle.SongInfo(song);
    store.playSong(songInfo);
  },
  // 下载歌曲
  downloadSong: useDebounceFn(async (id: number) => {
    try {
      await ElMessageBox.confirm(
        '跳转新的页面进行下载!',
        '提示',
        {
          center: true,
          showCancelButton: false,
          confirmButtonText: '跳转',
          confirmButtonClass: 'MessageBoxConfirmBtn',
          customStyle: {
            width: '280px'
          }
        }
      )
      if (id) {
        let url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
        window.open(url);
      }
    } catch (err: any) { }
  }, delay),
  // 收藏专辑
  collectAlbum: useDebounceFn((id: number) => {
    console.log(id);
  }, delay),
  // 收藏歌单
  collectSongList: useDebounceFn((id: number) => {
    console.log(id);
  }, delay),
  // 分享信息
  shareInfo: (title: string, href: string) => {
    console.log(title);
    console.log(href);
  },
  // 未登陆,清除登陆状态
  clearLoginStatus() {
    const router = useRouter();
    const store = useMainStore();
    // 清除账号信息
    store.accountInfo = { id: 0, avatarUrl: '', nickname: '', signature: '' };
    // 提示用户重新登录
    ElNotification.warning({ message: "登陆失效, 请重新登录!", duration: 2000, showClose: false });
    // 跳转到登陆页
    router.push("/account/login");
  },
  // 登陆结果
  async loginResult(code: number, goHome: () => any) {
    if (code == 200) {
      const store = useMainStore();
      // 登陆成功
      let { profile: { userId: id, avatarUrl, nickname, signature } }: any = await AccountAPI.getUserAccount();
      // 保存账号信息
      store.accountInfo = { id, avatarUrl, nickname, signature };
      // 提示用户登陆成功!
      ElNotification.success({ message: "登陆成功", duration: 2000, showClose: false });
      // 跳转首页
      goHome();
    } else {
      // 提示用户登陆失败!
      ElNotification.error({ message: "登陆失败!", duration: 2000, showClose: false });
    }
  }
}