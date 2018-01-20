import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/powerplant/detail'
    // },
    {
      path: '/',
      redirect: '/PurchaseOrderList'
    },
    // 王健添加开始
    {
      path: '/OrderDetails',
      component: (resolve) => require(['../pages/order/index.vue'], resolve),
      children: [{
          path: '/OrderDetails/basic',
          component: (resolve) => require(['../pages/order/basic/index.vue'], resolve)
        },
        {
          path: '/OrderDetails/info',
          component: (resolve) => require(['../pages/order/info/index.vue'], resolve)
        },
      ]
    },
    {
      path: '/OrderDetails/OrderList',
      component: (resolve) => require(['../pages/order/basic/orderList.vue'], resolve),
    },
    {
      path: '/BatchDetail',
      component: (resolve) => require(['../pages/batch/batchDetail.vue'], resolve),
    },
    {
      path: '/BatchList',
      component: (resolve) => require(['../pages/batch/BatchList.vue'], resolve),
    }, 
    {
      path: '/PurchaseOrderList',
      component: (resolve) => require(['../pages/PurchaseOrderList/index.vue'], resolve),
    },
    // 王健添加结束

    
    // 王安茂添加开始
    {
      path: '/buyOrderNew',
      component: (resolve) => require(['../pages/buyOrder/create.vue'], resolve)
    },
    {
      path: '/powerplant',
      component: (resolve) => require(['../pages/powerPlant/index.vue'], resolve),
      children: [{
          path: '/powerplant/detail',
          component: (resolve) => require(['../pages/powerPlant/detail/index.vue'], resolve)
        },
        {
          path: '/powerplant/info',
          component: (resolve) => require(['../pages/powerPlant/info/index.vue'], resolve)
        },
      ]
    },
    {
      path: '/orderplan',
      component: (resolve) => require(['../pages/powerPlant/plan/orderplan.vue'], resolve)
    },
    {
      path: '/dayplan',
      component: (resolve) => require(['../pages/powerPlant/plan/dayplan.vue'], resolve)
    },
    {
      path: '/monthplan',
      component: (resolve) => require(['../pages/powerPlant/plan/monthplan.vue'], resolve)
    },
    //王安茂添加结束

    /* 程松庆添加开始
     * 煤质统计相关
    */
    // 分公司煤质统计列表
    {
      path: '/coalAnalysisList',
      component: (resolve) => require(['../pages/coalAnalysis/coalAnalysisList.vue'], resolve)
    },
    // 各个电厂煤质统计详情
    {
      path: '/coalAnalysisDetail',
      component: (resolve) => require(['../pages/coalAnalysis/coalAnalysisDetail.vue'], resolve)
    },
    /* 程松庆添加结束
     * 煤质统计相关
    */
  ]
})
