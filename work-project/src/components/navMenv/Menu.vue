<template>
    <div class="logo">
        <img :src="logo" width="34px" height="34px" />
        <h1>动力谷</h1>
    </div>
    <el-menu :router="true" :default-active="$route.path">
        <menu-item v-for="item in userStore.menu" :key="item.url" :item="item" />
        <!-- :item="item"  把每一项都给传进去，传进MenuItem进行判断 -->
        <!-- 循环一定要给key，而item.url是独一无二的，可以当作循环中的key -->
    </el-menu>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/auth';
import MenuItem from './MenuItem.vue';
import logo from '@/assets/logo.png';

const userStore = useUserStore()
console.log(userStore.menu);

</script>

<style scoped lang='less'>
.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    height: 50px;

    img {
        margin-left: -10px;
    }

    h1 {
        color: #333;
        margin-left: 10px;
        font-size: 22px
    }

    .el-menu {
        border-right: none;
    }
}

</style>