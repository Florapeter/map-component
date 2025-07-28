<template>
<el-sub-menu v-if="item.children" :index="item.url">
    <template #title>
        <el-icon>
            <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
    </template>
    <menu-item-component v-for="child in item.children" :key="child.url" :item="child" />
</el-sub-menu>
<el-menu-item v-else :index="item.url" @click="add(item.name,item.url,item.icon)" v-show="!(item.name === '订单详情')">
    <el-icon>
        <component :is="item.icon" />
    </el-icon>
    <span>{{ item.name }}</span>
</el-menu-item>
</template>

<script lang='ts'>
import { defineComponent,type PropType } from 'vue';
import type { MenuItem as MenuItemType } from '@/types/user';
import { useTabsStore } from '@/store/tabs';

// 这是一个菜单项组件，接收一个 item 对象作为 prop，根据 item 是否有 children 渲染子菜单或普通菜单项
export default defineComponent({
    name: 'MenuItemComponent', // 遵循多词组件名规范
    props: {
        // item: 菜单项对象，包含菜单的名称、url 以及可选的子菜单
        item: {
            type: Object as PropType<MenuItemType>,
            required: true
        }
    },
    setup(){
        const tabsStore = useTabsStore()
        const {addTab,setCurrentTab} = tabsStore
        function add(name: string, url: string, icon: string){
            addTab(name, url, icon)
            setCurrentTab(name,url)
        }
        return {add}
    }
})
</script>

<style scoped lang='less'>
.is-active {
    background-color: rgb(34, 136, 255);
    color: #fff !important;

    div {
        span {
            color: #fff;
        }
    }
}
.el-menu-item:hover {
    background-color: rgb(34, 136, 255) !important;
    color: #fff !important;
}
:deep(.el-sub-menu__title:hover) {
    background-color: rgb(34, 136, 255) !important;
    color: #fff !important;
}
</style>