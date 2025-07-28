import { defineStore } from "pinia";
import { loginApi } from "@/api/user";
interface LoginParams {
    username: string;
    password: string;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        token:localStorage.getItem('token') || null,
        //向后端发送用户名和密码，后端返回一个token
        //将token存储到本地
        //每次请求时，每一次发请求都要携带上token
        //如果token过期，则重新登录
        //如果token不存在，则重新登录
        //如果token存在，则继续请求
        //如果token过期，则重新登录
        //如果token不存在，则重新登录
        roles: localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')!) : [],//按钮权限控制
        username:localStorage.getItem("username") || "",
        menu:localStorage.getItem("menu")?JSON.parse(localStorage.getItem("menu")!):[]//菜单权限控制
    }),
    actions:{
        async login(data: LoginParams){
            try {
                const {data:{token,user:{username,roles},menulist}} = await loginApi(data);
                this.token=token;
                this.roles=roles;
                this.menu=menulist;
                this.username = username;
                localStorage.setItem("token",token);
                localStorage.setItem("roles",JSON.stringify(roles))
                localStorage.setItem("username",username)
                localStorage.setItem("menu",JSON.stringify(menulist))
                
                
            } catch (error) {
                console.log("登录失败:", error);
            }
        },
        logout(){
            this.token = null;
            this.roles = [];
            this.menu = [];
            this.username = "";
            localStorage.clear()
        }
    }
})