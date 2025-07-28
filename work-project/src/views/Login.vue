<template>
    <div class="bg-container" :style="{ backgroundImage: `url(${bgUrl})` }">
        <div class="w-95 h-62.5 p-12.5 shadow-lg text-center absolute top-1/2 -mt-50 left-10% bg-white/90 rounded-lg">
            <div class="flex justify-center items-center mb-4">
                <img :src="logo" alt="logo" class="w-17.5 h-17.5">
                <h1 class="ml-4 text-blue-800 text-xl font-bold">动力谷能源管理平台</h1>
            </div>
            <el-form class="mt" :model="ruleForm" :rules="rules" ref="formRef" @keyup.enter.native="handleLogin">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="Lock" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                    
                        ref="loginBtn"
                        type="primary"
                        style="width: 100%;"
                        @click="handleLogin"
                    >
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang='ts'>
import logo from '@/assets/logo.png'
import bgImage from '@/assets/bg.png'
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
// 修正：将 useUserStore 的导入路径改为正确的路径
import { useUserStore } from '@/store/auth'
import router from '@/router';

interface RuleForm {
    username: string;
    password: string;
}

const bgUrl = bgImage

const ruleForm: RuleForm = reactive({
    username: "",
    password: ""
})

const rules: FormRules<RuleForm> = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 8, message: '用户名要求4到8位字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const formRef = ref<FormInstance>()

const loginBtn = ref()

const userStore = useUserStore()

const handleLogin = () => {
  // 让按钮聚焦
  loginBtn.value?.$el?.focus?.()
  // 添加点击动画
  loginBtn.value?.$el?.classList.add('is-active')
  setTimeout(() => {
    loginBtn.value?.$el?.classList.remove('is-active')
  }, 150)

  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      await userStore.login(ruleForm)
      router.push("/")
    } else {
      console.log('error submit!!')
    }
  })
}
</script>

<style scoped>
.bg-container {
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>