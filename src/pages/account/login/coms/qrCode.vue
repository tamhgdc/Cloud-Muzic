<!-- 二维码登陆 -->
<template>
  <div ref="qrCodeEl" class="qrcodeWrap">
    <!-- 二维码图片 -->
    <div v-loading="loading" class="qrcode">
      <el-image :class="{ overdue: qrCode.overdue }" :src="qrCode.img" />
    </div>

    <!-- 二维码状态 -->
    <p v-if="qrCode.status.length" class="status">{{ qrCode.status }}</p>

    <!-- 重新获取二维码 -->
    <button v-if="qrCode.overdue" @click="requestQrCode" class="reset">重置二维码</button>
  </div>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useIntersectionObserver } from "@vueuse/core";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { AccountAPI } from "api";
import { Operate } from 'utils';
const router = useRouter();

// 二维码加载状态
let loading = ref(true);
// 二维码信息
interface QrCode {
  img: string,
  key: string,
  status: string,
  overdue: boolean,
  timer: any
}
let qrCode = reactive<QrCode>({
  img: "",
  key: "",
  status: "",
  overdue: false,
  timer: null
});

// 请求二维码
let requestQrCode = async () => {
  try {
    loading.value = true;

    // 获取Key
    let key: any = await AccountAPI.loginQrKey();
    if (key.code !== 200) throw new Error();
    qrCode.key = key.data.unikey;

    // 获取二维码
    let qrData: any = await AccountAPI.loginQrCreate(qrCode.key);
    if (qrData.code !== 200) throw new Error();
    qrCode.img = (useQRCode(qrData.data.qrurl) as any);

    // 轮询二维码
    pollingQrCode();
  } catch (err: any) {
    ElMessage.warning("请求二维码失败!")
  } finally {
    loading.value = false;
  }
}

// 轮询二维码状态
let pollingQrCode = async () => {
  if (qrCode.timer) clearInterval(qrCode.timer);
  qrCode.timer = setInterval(async () => {
    // 二维码状态 800为二维码过期, 801为等待扫码, 802为待确认, 803为授权登录成功
    let { code, message }: any = await AccountAPI.loginQrCheck(qrCode.key);
    if (qrCode.status !== message) qrCode.status = message;
    // 二维码过期
    if (code === 800) {
      clearInterval(qrCode.timer);
      qrCode.overdue = true;
      return ElMessage.warning("二维码已过期!");
    }
    // 登录成功
    if (code === 803) {
      clearInterval(qrCode.timer);
      // 登陆成功
      Operate.loginResult(200, () => router.replace("/"));
    }
  }, 1500);
}

// 容器元素
let qrCodeEl = ref<HTMLElement | null>(null);
// 监听容器元素是否显示在页面上
onMounted(() => {
  useIntersectionObserver(qrCodeEl.value, ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // 进入页面
      requestQrCode();
    } else {
      // 离开页面
      qrCode.overdue = false;
      qrCode.status = '';
      qrCode.key = '';
      qrCode.img = '';
      clearInterval(qrCode.timer);
    }
  });
});
</script>

<style lang="scss" scoped>
// 二维码容器
.qrcodeWrap {
  @apply flex flex-col items-center justify-center pt-15px sm-pt-0px;

  .qrcode {
    @apply w-37 h-37 border-7px themeBorder rounded-md shadow-md;
  }
}

// 状态
.status {
  @apply truncate mt-5px text-17px;
}

// 过期二维码
.overdue {
  @apply blur-sm opacity-50;
}

// 重置按钮
.reset {
  @apply border-none cursor-pointer mt-20px px-15px py-7px themeBgColor rounded text-white text-15px opacity-85 hover-opacity-100;
}
</style>