<!-- 邮箱登陆 -->
<template>
  <div ref="emailEl" w-270px pt-15px sm:pt-0px mx-auto>
    <el-form ref="formEl" :model="formData" :disabled="disabledForm" label-width="65px" :rules="rules">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="formData.email" :clearable="true" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="formData.password" type="password" :show-password="true" :clearable="true" />
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
let emailEl = ref<any>(null);
// 表单元素
let formEl = ref<any>(null);
// 禁用表单
let disabledForm = ref(false);
// 表单数据
let formData = reactive({
  email: "",
  password: "",
});

// 表单校验规则
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请填写邮箱!', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请填写密码!', trigger: 'blur' },
    { min: 8, max: 20, message: '密码8-20位!', trigger: 'blur' }
  ]
});

// 提交登陆
let submit = () => {
  formEl.value.validate(async (isValid: boolean) => {
    if (isValid) {
      // 验证163邮箱
      if (!Validation.email163(formData.email)) {
        return ElMessage.warning("邮箱应该为网易邮箱!");
      }
      // 验证密码
      if (!Validation.password(formData.password)) {
        return ElMessage.warning("密码需包含[字母/数字/字符]两种组合!");
      }
      // 禁用表单
      disabledForm.value = true;
      // 发起登陆请求
      let { code }: any = await AccountAPI.loginEmail(formData.email, formData.password);
      // 登陆结果
      Operate.loginResult(code, () => router.replace("/"));
      // 解除禁用表单
      disabledForm.value = false;
    }
  });
}

// 监听容器元素是否显示在页面上
onMounted(() => {
  useIntersectionObserver(emailEl.value, ([{ isIntersecting }]) => {
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