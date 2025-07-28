import { defineStore } from "pinia"
import type{MenuItem} from "@/types/user"
import { ref } from "vue"



export const useTabsStore = defineStore("tabs",()=>{
    const tabs = ref<MenuItem[]>([])
    const currentTab = ref<{name: string; url: string }>({name: "数据看板", url: "/dashboard"})
    const addTab = (name: string, path: string, icon: string)=>{
        if(!tabs.value.some(item=>item.url === path)){
            tabs.value.push({ name, url: path, icon })
        }
    }
    const setCurrentTab = (name: string, path: string)=>{
        currentTab.value = {name, url: path}
    }
    const removeTab = (name: string)=>{
        if(currentTab.value.name === name){
            const currentIndex = tabs.value.findIndex(item=>item.name === name)
            if(currentIndex!==0){
            currentTab.value = tabs.value[currentIndex - 1]
            }else{
                return
            }
        }
        // 删除指定路径的选项卡
        tabs.value = tabs.value.filter(item=>item.name !== name)
    }
    return {tabs,addTab,setCurrentTab,currentTab,removeTab}
})
