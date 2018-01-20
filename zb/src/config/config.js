import Env from './env';

let config = {

    env: Env,

    //开发地址
//     baseUrl: "//192.168.1.24:10025/api/services",
//     authorizationUrl: "//192.168.1.24:10025/api/Account/Authenticate",
//     logOut: "//192.168.1.24:10025/api/Account/Logout",

    
    //服务器
//  baseUrl: "http://192.168.1.100:81/pot.webapi/api/services",
//  authorizationUrl: "http://192.168.1.100:81/pot.webapi/api/Account/Authenticate",
//  logOut: "http://192.168.1.100:81/pot.webapi/api/Account/Logout",

    
    //测试地址
//  baseUrl: "http://192.168.1.23:8081/api/services",
//  authorizationUrl: "http://192.168.1.23:8081/api/Account/Authenticate",
//  logOut: "http://192.168.1.23:8081/api/Account/Logout",

    
    //外网
//  baseUrl: "http://47.93.179.77:10002/api/services",
//  authorizationUrl: "http://47.93.179.77:10002/api/Account/Authenticate",
//  logOut: "http://47.93.179.77:10002/api/Account/Logout",
    
    //正式版本
    baseUrl: "http://59.110.17.54/ZK.POT/api/services",
    authorizationUrl: "http://59.110.17.54/ZK.POT/api/Account/Authenticate",
    logOut: "http://59.110.17.54/ZK.POT/api/Account/Logout",
    
    key: "yangguangzhaotoubiao"
    
};

if(window.service && window.service.baseUrl){
    config.baseUrl = window.service.baseUrl;
}
if(window.service && window.service.authorizationUrl){
    config.authorizationUrl = window.service.authorizationUrl;
}
if(window.service && window.service.logOut){
    config.logOut = window.service.logOut;
}

export default config;