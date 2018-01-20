<style scoped lang="less">
.menu-sub {
  width: 200px;
  height: 695px;
  float: left;
  background-color: #4a80ba;
  .account-info {
    height: 180px;
    font-size: 16px;
    color: white;
    text-align: center;
    border-bottom: solid 3px white;
  }
  .menu-sub-item {
    color: white;
    font-size: 16px;
    text-align: center;
    padding: 10px 0px;
    border-bottom: solid 2px #5c8dc1;
    display: block;
  }
  .selected {
    background-color: #0950a0;
  }
}
.main-view {
  float: right;
  width: 1000px;
  height: auto;
  min-height: 690px;
  padding-left: 5px;
  position: relative;
}
.main-view2 {
  width: 1200px;
  height: auto;
  min-height: 690px;
  position: relative;
}
</style>
<template>
  <div class="clearfix">
    <div v-if="showMenu()" class="menu-sub">
      <div class="account-info">
        <br><br>
        <img src="../../images/用户头像.png">
        <br>
        <Tooltip :content="$store.userInfo.userName" placement="right">{{shortName}}</Tooltip> 
      </div>
      <div v-for="item in items" v-if="item.display&&item.hasPermission" :key="item.path">
        <router-link v-if="item.path==$route.path" class="menu-sub-item selected" :to="item.path" style="color: white!important;">{{item.title}}</router-link>
        <router-link v-else class="menu-sub-item" :to="item.path" style="color: white!important;">{{item.title}}</router-link>
      </div>
    </div>
    <div class="main-view" v-if="isAccountView">
      <Spin v-if="!hasPermission" fix>
        <div>您无权限访问，请联系管理员！</div>
      </Spin>
      <router-view v-else></router-view>
    </div>
    <div class="main-view2" v-else>
      <Spin v-if="!hasPermission" fix>
        <div>您无权限访问，请联系管理员！</div>
      </Spin>
      <router-view v-else></router-view>
    </div>
  </div>
</template>
<script>
import config from '../../config/config';
export default {
  data() {
    return {
      hasPermission: false,
      shortName: "",
      isAccountView: true,
      items: [
        {
          path: "/account/account-info",
          title: "账户信息",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/company-info",
          title: "企业信息",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/my-bidding",
          title: "我的招标",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/my-bidded",
          title: "我的投标",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/company-verify",
          title: "企业审核",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/system-role",
          title: "角色管理",
          display: true,
          hasPermission: true
        },
        {
          path: "/account/system-user",
          title: "用户管理",
          display: true,
          hasPermission: true
        }
      ]
    };
  },
  methods: {
    showMenu() {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].path == this.$route.path) {
          return true;
        }
      }
      return false;
    },

    validatePermission(path) {
      for (var i = 0; i < this.$store.userInfo.permissions.length; i++) {
        if (this.$store.userInfo.permissions[i] == path) {
          this.hasPermission = true;
          return;
        }
      }
      this.hasPermission = false;
    }
  },
  mounted() {
    if (this.$route.path == "/account/account-info" ||
        this.$route.path == "/account/company-info" ||
        this.$route.path == "/account/my-bidding" ||
        this.$route.path == "/account/my-bidded" ||
        this.$route.path == "/account/company-verify" ||
        this.$route.path == "/account/system-role" ||
        this.$route.path == "/account/system-user"
      ) {
        this.isAccountView = true;
      }else {
        this.isAccountView = false;
      }
    if (!this.$store.userInfo) {
      this.$router.push(
        "/account/login?url=" + this.$utils.encrypt(this.$route.path) + 
        "&params=" + this.$utils.encrypt(JSON.stringify(this.$route.query)));
        return;
    }
    if (this.$store.userInfo.userName.length > 4) {
      this.shortName = this.$store.userInfo.userName.substring(0,4) + "...";
    } else {
      this.shortName = this.$store.userInfo.userName;
    }
    this.$store.permissionPass = () => {
      this.hasPermission = true;
    };
    this.$store.permissionDeny = () => {
      this.hasPermission = false;
    };
    this.validatePermission(this.$route.path);

    this.$service
      .fetch(
        config.baseUrl + "/PlantOpenTender/companyService/GetAuditStatus",
        {},
        "POST",
        false
      )
      .then(res => {
        if (res.result.auditStatus != 1) return;

        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].path == "/account/company-info") {
            this.items[i].title = "企业信息(已认证)";
            return;
          }
        }
      });
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].hasPermission =
        this.$store.userInfo.permissions.indexOf(this.items[i].path) >= 0;
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == "/account/account-info" ||
        to.path == "/account/company-info" ||
        to.path == "/account/my-bidding" ||
        to.path == "/account/my-bidded" ||
        to.path == "/account/company-verify" ||
        to.path == "/account/system-role" ||
        to.path == "/account/system-user"
      ) {
        this.isAccountView = true;
      }else {
        this.isAccountView = false;
      }
      this.validatePermission(to.path);
    }
  }
};
</script>
