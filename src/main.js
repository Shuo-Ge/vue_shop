import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/global.css'
// 导入字体图标库
import './assets/fonts/iconfont.css'
// 导入asiox
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 注册组件
Vue.use(ElementUI);

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
