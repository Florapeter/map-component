<template>
    <div class="header">
        <div class="personal">
            <el-badge is-dot class="item" style="margin-right: 20px;">
                <el-icon size="20">
                    <Bell />
                </el-icon>
            </el-badge>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <el-dropdown :hide-on-click="false" @command="handleCommand">
                <span class="el-dropdown-link">
                    欢迎你，{{username}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item icon="User" command="user">个人中心</el-dropdown-item>
                        <el-dropdown-item icon="SwitchButton" command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const {username} = storeToRefs(userStore)
const router = useRouter()

function handleCommand(command: string) {
    if (command === 'user') {
        router.push('/personal')
    }else{
        userStore.logout()
        router.push('/login')
    }
}
</script>

<style lang='less'>
.header {
    background-color: #fff;
    height: 50px;
    align-items: center;
    padding: 0 20px;
}
.personal {
    float: right;
    height: 50px;
    display: flex;
    align-items: center;
    .el-badge {
        margin-top: 10px;
    }
    .el-dropdown-link {
        margin-left: 20px;
        font-weight: 600;
        color: #2d3a4b;
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
            color: #409eff;
        }
        display: flex;
        align-items: center;
    }
}
:deep(.el-dropdown-menu) {
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    padding: 8px 0;
    min-width: 140px;
}
:deep(.el-dropdown-menu__item) {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    padding: 10px 24px;
    border-radius: 6px;
    transition: background 0.2s, color 0.2s;
    &:hover {
        background: #f0f7ff;
        color: #409eff;
    }
    display: flex;
    align-items: center;
}
:deep(.el-dropdown-menu__item .el-icon) {
    margin-right: 8px;
}
</style>