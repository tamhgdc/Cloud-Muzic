<!-- 密码登陆 -->
<template>
  <div ref="captchaEl" w-270px pt-15px sm:pt-0px mx-auto>
    <el-form ref="formEl" :model="formData" :disabled="disabledForm" label-width="65px" :rules="rules">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="formData.phone" :clearable="true" />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <div flex gap-10px w-full>
          <el-input v-model.trim="formData.captcha" :clearable="true" />
          <button @click.prevent="sendCaptcha" :disabled="disabledSend || disabledForm" class="btn" bg-emerald-500
            min-w-70px>
            {{ captchaText }}
          </button>
        </div>
      </el-form-item>
      <el-form-item>
        <div w-full flex justify-center gap-10px>
          <button @click.prevent="submit" :disabled="disabledForm" class="btn" bg-blue-500>登陆</button>
          <button @click.prevent="formEl.resetFields()" :disabled="disabledForm" class="btn" bg-amber-500>重置</button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormRules, ElNotification } from 'element-plus';
import { useIntersectionObserver } from '@vueuse/core';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import { useMainStore } from "store";
import { Operate, Validation } from "utils";
import { AccountAPI } from "api";
const store = useMainStore();
const router = useRouter();

// 容器元素
let captchaEl = ref<any>(null);
// 表单元素
let formEl = ref<any>(null);
// 禁用表单
let disabledForm = ref(false);
// 表单数据
let formData = reactive({
  phone: "",
  captcha: "",
});
// 表单校验规则
let rules = reactive<FormRules>({
  phone: [
    { required: true, message: '请填写手机号!', trigger: 'blur' },
    { len: 11, message: '手机号11位!', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请填写验证码!', trigger: 'blur' },
    { len: 4, message: '验证码4位!', trigger: 'blur' }
  ]
});

// 验证码文本
let captchaText = ref<string | number>("发送");
// 禁用发送按钮
let disabledSend = ref(false);
// 发送验证码
let sendCaptcha = () => {
  formEl.value.validateField('phone', async (isValid: boolean) => {
    if (isValid) {
      if (Validation.phone(formData.phone)) {
        // 禁用发送
        disabledSend.value = true;
        //  开启倒计时
        captchaText.value = 60;
        let timer = setInterval(() => {
          (captchaText.value as number)--;
          if (captchaText.value <= 0) {
            captchaText.value = "发送";
            disabledSend.value = false;
            clearInterval(timer);
          }
        }, 1000);
        // 发送验证码
        await AccountAPI.captchaSent(parseInt(formData.phone));
      } else {
        ElMessage.warning("手机号不符合格式!");
      }
    }
  });
}

// 提交登陆
let submit = () => {
  formEl.value.validate(async (isValid: boolean) => {
    if (isValid) {
      // 验证手机号
      if (!Validation.phone(formData.phone)) {
        return ElMessage.warning("手机号不符合格式!");
      }
      // 验证验证码
      if (isNaN(formData.captcha as any)) {
        return ElMessage.warning("验证码只能是数字!");
      }
      // 禁用表单
      disabledForm.value = true;
      // 发起登陆请求
      let { code }: any = await AccountAPI.loginCaptcha(parseInt(formData.phone), parseInt(formData.captcha));
      // 登陆结果
      Operate.loginResult(code, () => router.replace("/"));
      // 解除禁用表单
      disabledForm.value = false;
    }
  });
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  useIntersectionObserver(captchaEl.value, ([{ isIntersecting }]) => {
    if (!isIntersecting) {
      formEl.value.resetFields();
    }
  })
});
</script>

<style lang="scss" scoped>
.btn {
  @apply border-none whitespace-nowrap text-white text-15px h-32px px-20px flex-1 rounded cursor-pointer opacity-85 disabled-cursor-not-allowed disabled-opacity-70 not-disabled-hover-opacity-100;
}
</style>