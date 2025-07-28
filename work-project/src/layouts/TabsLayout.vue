<template>
    <el-tabs v-model="currentTab.name" class="demo-tabs" closable @tab-click="handleClick" @tab-remove="remove" type="card" >
        <el-tab-pane v-for="items in tabs" :key="items.name" :label="items.name" :name="items.name">
            <template #label>
                <span class="custom-tabs-label">
                    <el-icon>
                        <component :is="items.icon" />
                        <!-- 渲染对应的图标 -->
                    </el-icon>
                    <span v-if="items && items.name">&nbsp;{{ items.name }}</span>
                    <!-- 渲染对应的名称 -->
                </span>
            </template>
        </el-tab-pane>
    </el-tabs>
    <router-view />
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useUserStore } from "@/store/auth"
import { useTabsStore } from "@/store/tabs"
import { useRouter,useRoute } from "vue-router"
import type { MenuItem } from "@/types/user"
const router = useRouter()
const route = useRoute()
const tabsStore = useTabsStore()
const {tabs,currentTab} = storeToRefs(tabsStore)
const {setCurrentTab,addTab,removeTab} = tabsStore
const userStore = useUserStore()
const {menu} = storeToRefs(userStore)

function findObjectByUrl(arr:MenuItem[],url:string): MenuItem | null {
    for (const item of arr){
        if(item.url === url){
            return item
        }
        if(item.children){
            const result: MenuItem | null = findObjectByUrl(item.children, url)
            if(result){
                return result
            }
        }
    }
    return null
}
const menuItem = findObjectByUrl(menu.value,route.path)
if (menuItem && menuItem.name && menuItem.url && menuItem.icon) {
    addTab(menuItem.name, menuItem.url, menuItem.icon)
    setCurrentTab(menuItem.name, menuItem.url)
}

const handleClick = ({index}:{index:number}) => {
    router.push(tabs.value[index].url)
    setCurrentTab(tabs.value[index].name,tabs.value[index].url)
}
const remove = (panelName: string) => {
    if(currentTab.value.name==panelName){
        //如果点击的是高亮的
        removeTab(panelName);
        router.push(currentTab.value.url)
    }else{
        removeTab(panelName); 
    }
}

</script>
<style scoped lang="less">
:deep(.el-tabs__item) {
  background: #fff !important;
  color: #222 !important;
  transition: background 0.2s, color 0.2s;
}
:deep(.el-tabs__item.is-active) {
  background: #409eff !important;
  color: #fff !important;
}
:deep(.el-tabs__item:hover) {
  background: #e6f0fa !important;
  color: #409eff !important;
}
:deep(.el-tabs__header) {
    margin: 0 0 5px 0 !important;
}
</style>