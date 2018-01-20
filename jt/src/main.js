// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import "./common/commons.css";
import ApiServicePlugin from './libs/service.plugin';
import UtilsPlugin from './libs/utils.plugin'
import WebViewPlugin from './libs/webview.plugin'
import router from './router'
import  { AlertPlugin, ToastPlugin, LoadingPlugin } from 'vux'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ApiServicePlugin)
Vue.use(UtilsPlugin)
Vue.use(WebViewPlugin)

// Object.keys(Vux).forEach(key => {
//   Vue.component(key,Vux[key])
// })

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
