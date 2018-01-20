const routers = [

    //王安茂添加的路由 开始
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        meta: {
            title: '首页'
        },
        component: (resolve) => require(['./views/index.vue'], resolve),
    },
    {
        path: '/bidding/list',
        meta: {
            title: '招标公告'
        },
        component: (resolve) => require(['./views/bidding/list.vue'], resolve)
    },
    {
        path: '/bidding/detail',
        meta: {
            title: '非招标公告'
        },
        component: (resolve) => require(['./views/bidding/detail.vue'], resolve)
    },
    {
        path: '/nonbidding/detail',
        meta: {
            title: '招标公告'
        },
        component: (resolve) => require(['./views/nonbidding/detail.vue'], resolve)
    }, {
        path: '/nonbidding/list',
        meta: {
            title: '非招标公告'
        },
        component: (resolve) => require(['./views/nonbidding/list.vue'], resolve)
    },

    {
        path: '/bidded/list',
        meta: {
            title: '中标公告'
        },
        component: (resolve) => require(['./views/bidded/list.vue'], resolve)
    },
    {
        path: '/bidded/detail',
        meta: {
            title: '中标公告'
        },
        component: (resolve) => require(['./views/bidded/detail.vue'], resolve)
    },
    {
        path: '/account/login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['./views/account/login.vue'], resolve)
    },
    {
        path: '/account/register1',
        meta: {
            title: '注册'
        },
        component: (resolve) => require(['./views/account/register1.vue'], resolve)
    },
    {
        path: '/account/register2',
        meta: {
            title: '注册'
        },
        component: (resolve) => require(['./views/account/register2.vue'], resolve)
    },
    {
        path: '/account/register3',
        meta: {
            title: '注册'
        },
        component: (resolve) => require(['./views/account/register3.vue'], resolve)
    },
    {
        path: '/account/register4',
        meta: {
            title: '注册'
        },
        component: (resolve) => require(['./views/account/register4.vue'], resolve)
    },
    {
        path: '/account',
        meta: {
            title: '账户信息'
        },
        component: (resolve) => require(['./views/account/_menu.vue'], resolve),
        children: [{
                path: '/account/account-info',
                component: (resolve) => require(['./views/account/children/account-info.vue'], resolve)
            },
            {
                path: '/account/company-info',
                component: (resolve) => require(['./views/account/children/company-info.vue'], resolve)
            },
            {
                path: '/account/my-bidding',
                component: (resolve) => require(['./views/account/children/my-bidding.vue'], resolve)
            },
            {
                path: '/account/my-bidded',
                component: (resolve) => require(['./views/account/children/my-bidded.vue'], resolve)
            },

            {
                path: '/account/my-bid-detail',
                component: (resolve) => require(['./views/account/children/my-bid-detail.vue'], resolve)
            },
            {
                path: '/account/quote-info',
                component: (resolve) => require(['./views/account/children/quote-info.vue'], resolve)
            },
            {
                path: '/account/my-bid-company-info',
                component: (resolve) => require(['./views/account/children/my-bid-company-info.vue'], resolve)
            },
            {
                path: '/account/tobid',
                component: (resolve) => require(['./views/account/children/tobid.vue'], resolve)
            },
            {
                path: '/account/tobid-quote',
                component: (resolve) => require(['./views/account/children/tobid-quote.vue'], resolve)
            },
         



            {
                path: '/account/change-pass',
                component: (resolve) => require(['./views/account/children/change-pass.vue'], resolve)
            },
            {
                path: '/account/company-verify',
                component: (resolve) => require(['./views/account/children/company-verify.vue'], resolve)
            },
            {
                path: '/account/system-role',
                component: (resolve) => require(['./views/account/children/system-role.vue'], resolve)
            },
            {
                path: '/account/system-user',
                component: (resolve) => require(['./views/account/children/system-user'], resolve)
            },
            {
                path: '/account/create-bidding',
                component: (resolve) => require(['./views/account/children/create-bidding'], resolve)
            },
            {
                path: '/account/edit-bidding',
                component: (resolve) => require(['./views/account/children/create-bidding'], resolve)
            },
            {
                path: '/account/my-bidding-detail',
                component: (resolve) => require(['./views/account/children/my-bidding-detail'], resolve)
            },
            {
                path: '/account/publish-bidded',
                component: (resolve) => require(['./views/account/children/publish-bidded'], resolve)
            },
        ],
    },
    {
        path: '/login',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['./views/account/login.vue'], resolve),
    },
    //王安茂添加的路由 结束


    //王健添加的路由 开始
    //王健添加的路由 结束


    //程庆松添加的路由 开始

    //程庆松添加的路由 结束
];
export default routers;