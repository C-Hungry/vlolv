let config = {
    
    //开发-王安茂
    baseUrl: "http://192.168.1.16/ZK.ITMS.WebApi/api/TMSApp",
    HCDomain: "/mint-ui-1/#",
    
    // //开发-代星
    // baseUrl: "http://192.168.1.12/ZK.ITMS.WebApi/api/TMSApp",
    // HCDomain: "/mint-ui-1/#",

    // //开发-刘欣
    // baseUrl: "http://192.168.1.188:80/ZK.ITMS.WebApi/api/TMSApp",
    // HCDomain: "/mint-ui-1/#",

    // // 正式
    // baseUrl: "http://api.i-tms.cn/api/TMSApp",
    // HCDomain: "/rail/#",

    // //测试-黄敏
    // baseUrl: "http://192.168.1.122/ZK.ITMS.WebApi/api/TMSApp",
    // HCDomain: "/mint-ui-1/#",
    
    //集团DEMO演示
    // baseUrl: "http://dev.zkkjgs.com:81/ITMSWebApi.Demo/api/TMSApp",
    // HCDomain: "/rail/#",

    key: "itms",
};


if(window.service && window.service.baseUrl){
    config.baseUrl = window.service.baseUrl;
}
if(window.service && window.service.HCDomain){
    config.HCDomain = window.service.HCDomain;
}

export default config;