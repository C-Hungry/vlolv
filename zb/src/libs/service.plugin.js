
import config from "../config/config";
import { getToken, getCompanyInfo} from '../config/util';

var ApiServicePlugin = {};

ApiServicePlugin.install = function (Vue) {


  Vue.prototype.$service = {

    get: function (url, data) {

      if (!url) {
        url = config.logOut;
      }
      else {
        url = config.baseUrl + url;
      }
      // alert(url);
      return this.fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      if (!url) {
        url = config.authorizationUrl;
      }
      else {
        url = config.baseUrl + url;
      }

      return this.fetch(url, data, "POST", true);
    },

    fetch: (url, data, type, hasErrorMsg) => {

      type = type.toUpperCase();

      return new Promise((resolve, reject) => {

        let dataStr = ''; //数据拼接字符串
        let sendData = {};

        Object.keys(data).forEach(key => {
          if (typeof (data[key]) == "object") {
            sendData = data[key];
          }
          else {
            if (!(data[key] === "")) dataStr += key + '=' + data[key] + '&';
          }
        })

        if (dataStr !== '') {
          dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
          url = url + '?' + dataStr;
        }

        let requestObj;
        if (window.XMLHttpRequest) {
          requestObj = new XMLHttpRequest();
        } else {
          requestObj = new ActiveXObject;
        }

        requestObj.open(type, url, true);
        requestObj.setRequestHeader("Accept", "application/json");
        requestObj.setRequestHeader("Content-type", "application/json");
        requestObj.setRequestHeader("Authorization", "Bearer " + getToken());
        requestObj.send(JSON.stringify(sendData));

        requestObj.onreadystatechange = () => {

          if (requestObj.readyState == 4) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            if (requestObj.status == 200) {
              resolve(obj);
            } else {
              if (obj.error && (obj.error.code == 1001 || obj.error.message == "当前用户没有登录到系统！" || obj.error.message == "用户未登录！")) {

                if (window.doNotShowNotLoginMsg) {
                  //no message
                  reject(obj);
                  return;
                }
                else if (!window.VueRootInstance.$children[0].$store.userInfo) {
                  window.VueRootInstance.$children[0].$Notice.error({
                    title: '错误',
                    desc: "当前用户没有登录到系统！",
                  });
                }
                else {
                  window.VueRootInstance.$children[0].$Notice.error({
                    title: '错误',
                    desc: "登录凭据信息过期，请重新登录！",
                  });
                }
                reject(obj);
                window.VueRootInstance.$children[0].$store.userInfo = null;
                window.VueRootInstance.$children[0].$router.push("/account/login?url=" +
                  window.VueRootInstance.$children[0].$utils.encrypt(window.VueRootInstance.$children[0].$route.path) +
                  "&params=" + window.VueRootInstance.$children[0].$utils.encrypt(JSON.stringify(window.VueRootInstance.$children[0].$route.query)))
                  ;

                window.doNotShowNotLoginMsg = true;
                setTimeout(() => {
                  window.doNotShowNotLoginMsg = false;
                }, 2000);
                return;
              }

              //企业未关联企业信息
              if (obj.error && obj.error.code == 1002) {
                window.VueRootInstance.$children[0].$Modal.confirm({
                  title: "企业认证",
                  okText: "去关联",
                  content: obj.error.message,
                  cancelText: "取消",
                  onOk: () => {
                    window.VueRootInstance.$children[0].$router.push('/account/register2')
                  }
                })
                reject(obj);
                return;
              }
              //企业信息认证中
              if (obj.error && obj.error.code == 1003) {
                window.VueRootInstance.$children[0].$Modal.info({
                  title: "企业审核",
                  content: obj.error.message,
                  okText: "我知道了"
                })
                reject(obj);
                return;
              }
              //企业认证失败
              if (obj.error && obj.error.code == 1004) {
                window.VueRootInstance.$children[0].$Modal.confirm({
                  title: "企业信息认证失败",
                  content: obj.error.message,
                  okText: "重新认证",
                  cancelText: "取消",
                  onOk: () => {
                    window.VueRootInstance.$children[0].$router.push('/account/register2?id=' + getCompanyInfo().companyId)
                  }
                })
                reject(obj);
                return;
              }

              if (hasErrorMsg) {

                window.VueRootInstance.$children[0].$Notice.error({
                  title: '错误',
                  desc: obj.message ? obj.message : obj.error.message,
                });

                reject(obj);

                return;
              }

              reject(obj);
            }
          }
        }
      });
    }
  }
}

export default ApiServicePlugin;