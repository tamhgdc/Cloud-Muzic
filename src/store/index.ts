import { useStorage, StorageSerializers } from "@vueuse/core";
import { defineStore } from "pinia";

// 歌曲信息
export interface SongInfo {
  artists: {
    id: number,
    name: string,
    tns: string[],
    alias: string[]
  }[],
  album: {
    id: number,
    name: string,
    picUrl: string,
    tns: string[],
    pic: number
  },
  song: {
    id: number,
    name: string,
    tns: string[]
  }
}
export interface AccountInfo {
  id: number,
  avatarUrl: string,
  nickname: string,
  signature: string
}
export const useMainStore = defineStore("main", {
  state: () => {
    return {
      // 账号信息
      accountInfo: useStorage<AccountInfo>('accountInfo', { id: 0, avatarUrl: '', nickname: '', signature: '' }, localStorage),
      // 页面滚动距离
      scrollTop: useStorage<number>('scrollTop', 0),
      // 主题色
      themeColor: useStorage<string>('theme', '#d95047', localStorage),
      // 音量大小
      volume: useStorage<number>('volume', 70, localStorage),
      // 播放列表
      playList: useStorage<SongInfo[]>('playList', [], localStorage),
      // 当前歌单ID
      songListID: useStorage<number>('songListID', 0, sessionStorage),
      // 当前音乐播放进度
      progress: useStorage<number>("progress", 0, sessionStorage),
      // 当前窗体宽度是否小于640px
      is640px: useStorage<boolean>("is640px", false, localStorage),
      // 喜欢的音乐列表
      likeList: useStorage<number[]>("likeList", [], sessionStorage),
      // 当前播放歌曲
      currentSong: useStorage<SongInfo | null>('currentSong', null, localStorage, { serializer: StorageSerializers.object }),
      // 私信信息
      privateMsgInfo: useStorage<{ name: string, id: number }>("privateMsgInfo", { name: "", id: 0 }, sessionStorage),
      // 播放列表抽屉打开状态
      playListDrawer: useStorage<boolean>("playListDrawer", false, sessionStorage),
      // 消息抽屉打开状态
      messageDrawer: useStorage<boolean>("messageDrawer", false, sessionStorage),
      // 歌曲详情抽屉打开状态
      songDetailDrawer: useStorage<boolean>('songDetailDrawer', false, sessionStorage),
      // 私信内容抽屉打开状态
      privateMsgDrawer: useStorage<boolean>('privateMsgDrawer', false, sessionStorage),
      // 侧边栏折叠
      sidebarFolding: useStorage<boolean>('sidebarFolding', false, localStorage)
    };
  },
  actions: {
    IsExists(id: number) {
      // 检查歌单中是否已经存在该歌曲
      return !(this.playList.findIndex(item => item.song.id == id) === -1);
    },
    playSong(songInfo: SongInfo) {
      let id = songInfo.song.id;
      if (this.currentSong?.song.id !== id) {
        // 限制播放列表只能存50首歌
        if (this.playList.length >= 50) this.playList.shift();
        this.currentSong = songInfo;
        if (!this.IsExists(id)) this.playList.push(songInfo);
      }
    },
    getCurrentSongIndex() {
      // 获取当前播放歌曲在播放列表中的位置
      return this.playList.findIndex(item => item.song.id == this.currentSong?.song.id);
    },
    emptyPlayList() {
      if (this.playList.length) {
        // 清空播放列表
        this.playList.splice(0);
        // 清空当前歌单ID
        this.songListID = 0;
      }
    },
    addPlayList(songList: SongInfo[]) {
      /*
       * 清空歌单
       * 将传进来的歌曲全部传入当前播放列表
       * 并播放第一首歌
       */
      this.emptyPlayList();
      this.playList.push(...songList);
      this.playSong(songList[0]);
    }
  }
});
