
var WebViewPlugin = {};

WebViewPlugin.install = function (Vue) {


  Vue.prototype.$webview = {

     //status为show或hide
     loading: function (status,msg) {
      msg = msg || "";
      if (navigator.appVersion.indexOf("iPhone") >= 0) {
        window.webkit.messageHandlers.loadingManager.postMessage({
          title: status,
          params: msg,
          callback: ""
        });
      } else if (navigator.appVersion.indexOf("Android") >= 0) {
        setTimeout(() => {
          loadingManager.postMessage(status,msg);
        });
      } else {
        throw new Error("未能识别浏览器版本");
      }
    },
    close: function () {

      if (navigator.appVersion.indexOf("iPhone") >= 0) {

        window.webkit.messageHandlers.guanbi.postMessage({ title: "", params: {}, callback: "" });
      }
      else if (navigator.appVersion.indexOf("Android") >= 0) {

        closeWebView.postMessage();
      }
      else {
        throw new Error("未能识别浏览器版本");
      }

    },
    notice: function (title, params) {

      return new Promise((resolve, reject) => {

        if (!window.__EventBus) {

          window.__EventBus = {
            index: 0
          };
        }

        var id = setTimeout(() => {

          reject({ status: "timeout" });
        }, 5000);

        window.__EventBus.index++;

        var callbackStr = "callback" + window.__EventBus.index;

        window.__EventBus[callbackStr] = function (data) {

          if (id != 0) resolve(data);
          window.__EventBus[callbackStr] = undefined;
          clearTimeout(id);
          id = 0;
        }

        if (navigator.appVersion.indexOf("iPhone") >= 0) {

          window.webkit.messageHandlers.WKManager.postMessage({ title: title, params: params, callback: "window.__EventBus." + callbackStr });
        }
        else if (navigator.appVersion.indexOf("Android") >= 0) {

          window.webViewManager.postMessage(JSON.stringify(params), title, "window.__EventBus." + callbackStr);
        }
        else {

          reject({ status: "error", msg: "未能识别您的浏览器版本。" });
        }

      });
    }

  }
}

export default WebViewPlugin;