
<template>
  <div>
    <img src="../../images/login-bg.jpg" v-on:load="load()" style="display: none;">
    <div>
      <div class="index">
        <div class="background">
          <div class="footer">
            陕西中矿科技有限公司&nbsp;提供技术支持<br> COPYRIGHT©陕西中矿WWW.ZKKJGS.COM&nbsp;陕ICP备&nbsp;13013915号-3&nbsp;ICP证：陕B2-20140148
          </div>

          <div class="login-form">
            <div class="login-form-area">
              <div class="login-title">
                <!-- <img src="../../images/logo.png" height="60" width="60" style="display: inline-block; line-height: 88px; vertical-align: middle;">  -->&nbsp;&nbsp;阳光采购平台
              </div>
              <div class="login-content">
                <input class="form-field" type="text" v-model="loginModel.account" v-on:keydown="keydown" placeholder="用户名" ref="account">
                <br><br>
                <input class="form-field" type="password" v-model="loginModel.password" v-on:keydown="keydown" placeholder="密码">
                <br><br><br>
                <input class="form-submit" type="button" value="登录" v-on:click="login()">
                <br><br>
                <router-link to="/account/register1" style="float: right;">还没有账号？注册</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { saveUserInfo, getUserInfo, removeUserInfo , saveCompanyInfo} from "../../config/util";

export default {
  data() {
    return {
      loginModel: {
        account: "",
        password: ""
      },

      ready: false
    };
  },
  methods: {
    load() {
      this.ready = true;

      setTimeout(() => {
        this.$refs["account"].focus();
      });
    },
    login() {
      if (!this.loginModel.account) {
        this.$Message.warning("请输入用户名！");
        return;
      }
      if (!this.loginModel.password) {
        this.$Message.warning("请输入密码！");
        return;
      }

      this.$store.loading();
      this.$service
        .post("", {
          loginModel: {
            tenancyName: "",
            usernameOrEmailAddress: this.loginModel.account,
            password: this.loginModel.password
          }
        })
        .then(res1 => {
          saveUserInfo({ token: res1.result.accessToken });
          this.$service
            .post("/ZK/profile/GetCurrentUserProfileForEdit", {})
            .then(res2 => {
              saveUserInfo({
                token: res1.result.accessToken,
                userName: res2.result.name
              });

              this.$service
                .get("/ZK/permission/GetUsersPermissionsTree", {})
                .then(res3 => {
                  saveUserInfo({
                    token: res1.result.accessToken,
                    userName: res2.result.name,
                    permissions: res3.result
                  });
                  // this.$Message.success("登录成功！");
                  setTimeout(() => {
                    if (this.$route.query.url) {

                      var dataStr = "";

                      if(this.$route.query.params){
                        
                        var paramsObj = JSON.parse(this.$utils.decrypt(this.$route.query.params));

                        Object.keys(paramsObj).forEach(key => {
                              dataStr += key + "=" + paramsObj[key] + "&";
                        });

                        if (dataStr !== "") {
                          dataStr = dataStr.substr(0, dataStr.lastIndexOf("&"));
                        }
                      }
                      location.href = this.$utils.decrypt(this.$route.query.url)+ "?" + dataStr;
                    } else {
                      location.href = "/index";
                    }
                  });
                });
            });
            // 获取关联企业信息
            this.$service.post("/PlantOpenTender/companyService/GetAuditStatus",{})
              .then(res4=>{
                saveCompanyInfo({
                  auditStatus: res4.result.auditStatus,
                  companyId: res4.result.id,
                  companyType: res4.result.companyType
                })
              })
        })
        .catch(res => {
          this.$store.unloading();
        });
    },
    keydown(e) {
      var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
      if (eCode == 13) {
        this.login();
      }
    }
  },
  mounted() {
    
  }
};
</script>
<style scoped lang="less">
.index {
  .background {
    background-image: url(../../images/login-bg.jpg);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: bottom center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    .login-form {
      margin: 0;
      padding: 0 !important;
      border: 0;
      width: 630px;
      height: 435px;
      padding: 10px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: solid 1px #ddd;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      .login-form-area {
        position: absolute;
        top: 10px;
        bottom: 10px;
        left: 10px;
        right: 10px;
        border-radius: 8px;
        background-color: #e8f2f9;
        .login-title {
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 5px 5px 0 0;
          height: 130px;
          // background-color: #E8F2F9;
          color: #084489;
          font-size: 26px;
          line-height: 130px;
          text-align: center;
        }
        .login-content {
          position: absolute;
          top: 130px;
          bottom: 0;
          left: 0;
          right: 0;
          margin: 0 64px;

          .form-field {
            height: 45px;
            margin: 0;
            padding: 0 15px;
            border: solid 2px #b1d1eb;
            border-radius: 5px;
            width: 100%;
            font-size: 16px;
            text-align: left;
            outline: none;
          }

          .form-submit {
            height: 45px;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 5px;
            width: 100%;
            outline: none;
            font-size: 16px;
            background-color: #eb1236;
            color: #fff;
          }
        }
      }
    }

    .footer {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translate(-50%, 0);
      color: #ccc;
      font-size: 13px;
      line-height: 25px;
      text-align: center;
    }
  }
}
</style>