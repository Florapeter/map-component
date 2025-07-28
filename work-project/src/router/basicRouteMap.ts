import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: "Home",
        component: () => import('@/layouts/DefaultLayout.vue'), 
        children:[
            {
                path:'dashboard',
                name:'dashboard',
                component:()=>import('@/views/dashboard/DashBoard.vue'),
            },
            {
                path:'chargingstation/monitor',
                name:'monitor',
                component:()=>import('@/views/chargingstation/Monitor.vue'),
            },
            {
                path:'chargingstation/management',
                name:'management',
                component:()=>import('@/views/chargingstation/Management.vue'),
            },
            {
                path:'chargingstation/statistics',
                name:'statistics',
                component:()=>import('@/views/chargingstation/Statistics.vue'),
            },
            {
                path:'/map',
                name:'map',
                component:()=>import('@/views/map/ElectronicMap.vue'),
            },
            {
                path:'/operations/orders',
                name:'orders',
                component:()=>import("@/views/operations/Orders.vue"),
            },
            {
                path:'/operations/detail',
                name:'detail',
                component:()=>import("@/views/operations/Detail.vue")
            },
            {
                path:'/operations/total',
                name:'total',
                component:()=>import("@/views/operations/Total.vue")
            },
            {
                path:'/alarm',
                name:'alarm',
                component:()=>import("@/views/alarm/Alarm.vue")
            },
            {
                path:'/equipment',
                name:'equipment',
                component:()=>import("@/views/equipment/Equipment.vue")
            },
            {
                path:'/document',
                name:'document',
                component:()=>import("@/views/document/Document.vue"),
            },
            {
                path:'/system',
                name:'system',
                component:()=>import("@/views/system/System.vue"),
                meta: {
                    needAuth: ["admin", "manager"]
                }  
            },
            {
                path:'/personal',
                name:'personal',
                component:()=>import("@/views/personal/Personal.vue")
            }
        ]
    },
    //跟它同级的还有一个登陆页面
    {
        path: '/login',
        name: "Login",
        component: () => import('@/views/Login.vue'),
    },
    // 404 页面路由配置
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
    }
]
export default routes