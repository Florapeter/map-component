//路由鉴权:鉴权，项目当中所有路由能不能被访问的权限的设置（某一个路由什么条件下可以访问，什么条件下不可以访问）
import router from "./router";
import NProgress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css"

//获取用户相关的小仓库内部token数据，判断用户是否登录
import { useUserStore } from "./store/auth";

//路由守卫:beforeEach，beforeEach是路由守卫的钩子函数，beforeEach会在路由跳转之前执行
router.beforeEach((to, from, next) => {
    //to:即将要访问的路由
    //from:从哪个路由来的
    //next:放行函数
    NProgress.start()
    //获取token，去判断用户登录还是未登录
    const userStore = useUserStore()
    const token = userStore.token
    if (token) {
        // 用户已登录
        if (to.path === "/login") {
            next("/")
        } else {
            // 判断是否需要权限且用户角色不匹配
            if (to.meta?.needAuth && !userStore.roles.some((role: string) => (to.meta.needAuth as string[]).includes(role))) {
                next("/")
            } else {
                next() // 有权限时应放行
            }
        }
    }
    else {
        //用户未登录判断
        if (to.path === "/login") {
            next()
        } else {
            next("/login")
        }
    }
})

// 路由守卫:afterEach，afterEach是路由守卫的钩子函数，afterEach会在路由跳转之后执行
router.afterEach((to: any, from: any) => {
    NProgress.done()
})

//第一个问题：任意路由切换实现进度业务  ---nprogress
//第二个问题：路由鉴权（路由组件访问权限的设置）


//用户未登录：可以访问login，其余路由不能访问（指向login）
//用户登陆成功：不可以访问login[指向首页]，其余的路由可以访问