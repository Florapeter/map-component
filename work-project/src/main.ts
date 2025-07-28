import "./mock/index";
import { createApp } from 'vue'
import 'uno.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import "./style.less"
import "./mock"
//引入鉴权文件
import "@/permission"

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)


app.mount('#app')
