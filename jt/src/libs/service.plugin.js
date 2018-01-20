
import config from "../config/config";
import { getToken } from '../config/utils';

var ApiServicePlugin = {};

ApiServicePlugin.install = function (Vue) {


  Vue.prototype.$service = {

    get: function (url, data) {

      url = config.baseUrl + url;

      return this.fetch(url, data, "GET", true);
    },

    post: function (url, data) {

      url = config.baseUrl + url;

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
          requestObj = new ActiveXObject();
        }

        const TOKEN = getToken("sid");
        const UID = getToken("UID");

        // let UID = 1;
        // let TOKEN = "2f4yfbjgbsaovkrkh1l04uin";
              
        requestObj.open(type, url, true);
        requestObj.setRequestHeader("Accept", "application/json");
        requestObj.setRequestHeader("Content-type", "application/json");
        requestObj.setRequestHeader("TOKEN", TOKEN);
        requestObj.setRequestHeader("UID", UID);
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

              console.log(obj);

              reject(obj);
            }
          }
        }
      });
    }
  }
}

export default ApiServicePlugin;