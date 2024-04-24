import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from '@/router'
import ElementUI from "element-plus";
import 'element-plus/theme-chalk/index.css'


const app = createApp(App);
app.config.globalProperties.$defaultAvatar = 'https://q7.itc.cn/q_70/images03/20240405/bd739544ef6c44cba8aed4fbc0fcc967.jpeg';
app.config.globalProperties.$staticRoot = 'http://localhost:8080/static/';
app.use(store)
   .use(router)
   .use(ElementUI)
   .mount('#app');
