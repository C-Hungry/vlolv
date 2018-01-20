<style scoped>
@import "styles/common.css";
</style>
<template>
    <div class="root">
        <div class="menu" style="position: static;"></div>
        <div ref="banner" class="menu">
            <div class="menu-logo">阳光采购平台</div>
            <div class="menu-items">
                <div class="menu-item">
                    <router-link to="/index" style="color: white!important;font-size: 16px!important;">首页</router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/bidding/list" style="color: white!important;font-size: 16px!important;">招标公告</router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/nonbidding/list" style="color: white!important;font-size: 16px!important;">非招标公告</router-link>
                </div>
                <div class="menu-item">
                    <router-link to="/bidded/list" style="color: white!important;font-size: 16px!important;">中标公示</router-link>
                </div>
            </div>
            <div class="menu-account">
                <div class="menu-account-new">
                    <!-- <router-link to="/account/create-bidding" style="color: white!important;font-size: 16px!important;">+发布</router-link> -->
                </div>
                <div v-if="$store.userInfo" class="menu-account-main">
                    <Dropdown :transfer="true" placement="bottom-end">
                        <a href="javascript:void(0)" style="color: white;height:100px;min-width: 108px;display:inline-block;padding: 0 30px;text-align:center;">
                            <!-- <Tooltip :content="$store.userInfo.userName" placement="left" :delay="1000">{{shortName}}</Tooltip> -->   
                            {{shortName}}              
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem  v-if="companyType == 2">
                                <div class="user-dropdown" v-on:click="$router.push('/account/create-bidding')"><Icon type="ios-paperplane"></Icon>&nbsp;&nbsp;&nbsp;发布</div>    
                            </DropdownItem>
                            <DropdownItem>
                                <div class="user-dropdown" v-on:click="$router.push('/account/account-info')"><Icon type="ios-person"></Icon>&nbsp;&nbsp;&nbsp;个人中心</div>  
                            </DropdownItem>
                            <DropdownItem>
                                <div class="user-dropdown" v-on:click="logout()"><Icon type="power"></Icon>&nbsp;&nbsp;&nbsp;&nbsp;退出</div>  
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div v-else class="menu-account-main">
                    <div style="padding: 0 30px;">
                        <router-link to="/account/login" style="color: white!important;font-size: 16px!important;">登录</router-link>&nbsp;&nbsp;|&nbsp;
                        <router-link to="/account/register1" style="color: white!important;font-size: 16px!important;">注册</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="$route.path!='/index'" class="bread-card">
            <div class="bread-card-text">
                <Breadcrumb separator=">">
                    <Icon type="ios-location"></Icon>&nbsp;&nbsp;当前位置&nbsp;:&nbsp;
                    <BreadcrumbItem v-for="(item,index) in breadCrumbs" :key="index" :class="{'bread-crumb-active': index == breadCrumbs.length - 1}">{{item}}</BreadcrumbItem>
                </Breadcrumb>
            </div>
        </div>
        <div v-else class="swpier-banner">
            <div class="banner-footer">
                <!-- <div class="notice">
                    <div class="notice-txt">公告</div>
                    <div class="notice-data">2018年度xxxxxxxxxxxxxxxxx</div>
                    <div class="notice-info">
                        <a href="#">详情</a>
                    </div>
                </div> -->
            </div>
        </div>

        <div class="main">
            <router-view></router-view>
        </div>

        <br>
        <div class="main-foot">
            陕西中矿科技有限公司&nbsp;提供技术支持<br> COPYRIGHT©陕西中矿WWW.ZKKJGS.COM&nbsp;陕ICP备&nbsp;13013915号-3&nbsp;ICP证：陕B2-20140148
        </div>
        <Spin v-if="loading" fix style="z-index: 99999;">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<script>
import { saveUserInfo, getUserInfo, removeUserInfo, removeCompanyInfo, getToken, saveCompanyInfo } from "./config/util";

export default {
  data() {
    return {
      loading: false,
      companyType: 1,
      shortName: "",
      breadList: [
        { path: "/index", title: "首页" },
        { path: "/bidding/list", title: "招标公告" },
        { path: "/bidding/detail", title: "招标公告>详情" },
        { path: "/nonbidding/list", title: "非招标公告" },
        { path: "/nonbidding/detail", title: "非招标公告>详情" },
        { path: "/nonbidding/tobid-quote", title: "个人中心>我的招标>报价" },
        { path: "/bidded/list", title: "中标公示" },
        { path: "/bidded/detail", title: "中标公示>详情" },
        { path: "/account/register1", title: "注册" },
        { path: "/account/register2", title: "注册" },
        { path: "/account/register3", title: "注册" },
        { path: "/account/register4", title: "注册" },
        { path: "/account/account-info", title: "个人中心>账户信息" },
        { path: "/account/company-info", title: "个人中心>企业信息" },
        { path: "/account/my-bidding", title: "个人中心>我的招标" },
        { path: "/account/my-bidded", title: "个人中心>我的投标" },
        { path: "/account/quote-info", title: "个人中心>我的招标>待报价详情" },
        { path: "/account/tobid-quote", title: "个人中心>我的招标>待报价" },
        { path: "/account/tobid", title: "个人中心>我的招标>投标" },
        { path: "/account/my-bid-detail", title: "个人中心>我的投标>投标详情" },
        { path: "/account/my-bid-company-info", title: "个人中心>我的招标>投标公司详情" },
        { path: "/account/change-pass", title: "个人中心>修改密码" },
        { path: "/account/create-bidding", title: "个人中心>我的招标>新建项目" },
        { path: "/account/edit-bidding", title: "个人中心>我的招标>编辑项目" },
        { path: "/account/my-bidding-detail", title: "个人中心>我的招标>招标详情" },
        { path: "/account/publish-bidded", title: "个人中心>我的招标>招标详情>发布中标公示" }
      ],
      breadCrumbs: [] 
    };
  },
  mounted() {
    this.$store.loading = () => {
      this.loading = true;
    };

    this.$store.unloading = () => {
      this.loading = false;
    };

    this.$store.userInfo = getUserInfo();
    if (this.$store.userInfo) {
        if (this.$store.userInfo.userName && this.$store.userInfo.userName.length > 4) {
            this.shortName = this.$store.userInfo.userName.substring(0,4) + "...";
        } else {
            this.shortName = this.$store.userInfo.userName;
        }
        this.$service.post("/PlantOpenTender/companyService/GetAuditStatus",{}).then(data=>{
            this.companyType = data.result.companyType;
            saveCompanyInfo({
                auditStatus: data.result.auditStatus,
                companyId: data.result.id,
                companyType: data.result.companyType
            })
        })
        this.$service
            .get("/ZK/permission/GetUsersPermissionsTree", {})
            .then(res => {
                saveUserInfo({
                    token: this.$store.userInfo.token,
                    userName: this.$store.userInfo.userName,
                    permissions: res.result
                });
            });
    }
    window.onscroll = e => {
      this.$refs["banner"].style.left = -document.body.scrollLeft + "px";
      this.$refs["banner"].style.right = document.body.scrollLeft + "px";
    };
  },
  beforeDestroy() {},
  methods: {
    logout() {
      this.$Modal.confirm({
        title: "确认",
        content: "确认退出？",
        onOk: () => {
          this.$service.get("", {}).then(res => {
            removeUserInfo();
            removeCompanyInfo();
            window.sessionStorage.removeItem("registerModel");
            location.href = "/index";
          });
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      if (!this.breadList) return;
      this.breadCrumbs = ["未知"];
      for (var i = 0; i < this.breadList.length; i++) {
        if (to.path == this.breadList[i].path) {
          this.breadCrumbs = this.breadList[i].title.split(">");
        }
      }
    }
  }
};
</script>
