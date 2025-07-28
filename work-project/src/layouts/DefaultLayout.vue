<template>
    <el-container>
        <el-aside width="200px">
            <Menu />
        </el-aside>
        <el-container>
            <el-header>
                <TopHeader />
            </el-header>
            <el-main>
                <TabsLayout />
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang='ts'>
import Menu from '@/components/navMenv/Menu.vue'
import TopHeader from '@/components/topHeader/TopHeader.vue'
import TabsLayout from '@/layouts/TabsLayout.vue'
</script>

<style scoped lang='less'>
.el-aside {
    height: 100vh;
    background-color: white;
    box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
}

.el-header {
    padding: 0 !important;
}

.el-main {
    padding: 0px 20px !important;
    height: 80vh;
    overflow: auto;
    margin-top: 0px !important;
    //超出的部分用滚动条的形式展示
}
</style>