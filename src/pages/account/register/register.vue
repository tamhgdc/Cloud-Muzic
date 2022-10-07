<!-- 注册 -->
<template>
  <div flex h-full overflow-hidden>
    <el-scrollbar flex-1 flex justify-center>
      <div class="form" pt-25px md:pt-125px pb-25px w-270px>
        <!-- 表单 -->
        <el-form ref="formEl" :model="formData" :disabled="disabledForm" label-width="65px" :rules="rules">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model.trim="formData.nickname" :clearable="true" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model.trim="formData.phone" :clearable="true" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="formData.password" type="password" :show-password="true" :clearable="true" />
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
              <button @click.prevent="submit" :disabled="disabledForm" class="btn" bg-blue-500>注册</button>
              <button @click.prevent="formEl.resetFields()" :disabled="disabledForm" class="btn"
                bg-amber-500>重置</button>
            </div>
          </el-form-item>
        </el-form>

        <!-- 条款 -->
        <div :class="{ shake: termsTip }" class="agreeTerms" flex items-center>
          <!-- 同意框 -->
          <el-checkbox v-model="agreeTerms" size="default" :disabled="disabledForm" />
          <span text-13px fontColor whitespace-nowrap>&nbsp;&nbsp;同意</span>
          <a class="terms" href="https://st.music.163.com/official-terms/service" target="__black">《服务条款》</a>
          <a class="terms" href="https://st.music.163.com/official-terms/privacy" target="__black">《隐私政策》</a>
          <a class="terms" href="https://st.music.163.com/official-terms/children" target="__black">《儿童隐私政策》</a>
        </div>

        <!-- 提示 -->
        <el-alert title="密码8-20位! 至少包含字母/数字/字符两种组合!" type="info" :closable="false" />
      </div>
    </el-scrollbar>

    <Lottie :animationData="lottieAnima!" flex-1 hidden md:block />
  </div>
</template>

<script lang="ts">
export default { name: "Register" }
</script>
<script setup lang="ts">
import Lottie from "@/components/common/lottie/lottie.vue";
import lottieAnima from "@/assets/lottieFile/register.json";
import { ElNotification, ElMessage, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { Validation } from "utils";
import { AccountAPI } from "api";

// 同意条款
let agreeTerms = ref(false);
// 提醒用户同意条款
let termsTip = ref(false);
// 表单元素
let formEl = ref<any>(null);
// 禁用表单
let disabledForm = ref(false);
// 表单数据
let formData = reactive({
  nickname: "",
  phone: "",
  password: "",
  captcha: ""
});
// 表单校验规则
let rules = reactive<FormRules>({
  nickname: [
    { required: true, message: '请填写昵称!', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称2-10个字符!', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请填写密码!', trigger: 'blur' },
    { min: 8, max: 20, message: '密码8-20位!', trigger: 'blur' },
  ],
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

// 提交注册
let submit = () => {
  // 判断用户是否同意了条款
  if (!agreeTerms.value) {
    termsTip.value = true;
    let timer = setTimeout(() => {
      termsTip.value = false;
      clearTimeout(timer);
    }, 1000);
    return;
  }

  // 验证表单
  formEl.value.validate(async (isValid: boolean) => {
    if (isValid) {
      // 验证手机号
      if (!Validation.phone(formData.phone)) {
        return ElMessage.warning("手机号不符合格式!");
      }
      // 验证密码
      if (!Validation.password(formData.password)) {
        return ElMessage.warning("密码需包含[字母/数字/字符]两种组合!");
      }
      // 禁用表单
      disabledForm.value = true;

      // 暂不支持注册
      let timer = setTimeout(() => {
        disabledForm.value = false;
        ElNotification.warning({ message: "暂不支持注册!", duration: 2000, showClose: false });
        clearTimeout(timer);
      }, 1000);

      // 发起注册请求
      // let { captcha, phone, password, nickname } = toRaw(formData);
      // let result = await AccountAPI.registerCellphone(parseInt(captcha), parseInt(phone), password, nickname);
    }
  });
}
</script>

<style lang="scss" scoped>
.btn {
  @apply border-none whitespace-nowrap text-white text-15px flex-1 h-32px px-20px rounded cursor-pointer opacity-85 disabled-cursor-not-allowed disabled-opacity-70 not-disabled-hover-opacity-100;
}

.terms {
  @apply decoration-none text-13px text-blue-800 truncate;
}

.form :deep(.el-input__wrapper).is-focus {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.agreeTerms :deep(.el-checkbox) {

  .el-checkbox__inner,
  .is-checked .el-checkbox__inner {
    border-color: #3b82f6;
  }

  .is-checked .el-checkbox__inner {
    background-color: #3b82f6;
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>