<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { saveUserInfo } from "./config/utils";

export default {
  name: "app",
  mounted() {
    // this.$webview
    //   .get("token")
    //   .then(token => {
    //     saveUserInfo(token);
    //   })
    //   .catch(r => {
    //     this.$vux.toast.text('hello');
    //   });
    //   setTimeout(() => {
    //     this.$vux.toast.text('hello'); 
    //   });
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";

body {
  background-color: #f1f2f5;
  color: #333;
  overflow: hidden;
  .weui-cell:before{
    left: 0px;
  }
}
</style>
