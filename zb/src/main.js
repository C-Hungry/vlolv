import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import Vuex from 'vuex';
import promise from "promise-polyfill";
import ApiServicePlugin from './libs/service.plugin';
import UtilsPlugin from './libs/utils.plugin';

if (!window.Promise) {
    window.Promise = promise;
}

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Vuex);
Vue.use(ApiServicePlugin);
Vue.use(UtilsPlugin);


// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

window.VueRootInstance = new Vue({
    el: '#app',
    router: router,
    store: {
        userInfo: null,
        registerModel: null,
        loading: () => { },
        unloading: () => { },
    },
    render: h => h(App)
});
