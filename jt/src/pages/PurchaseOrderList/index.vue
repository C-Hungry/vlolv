<template>
  <div class="purchase-order">
    <myFrame :routes="routes" :closeable="true">
      <div slot="router-box">
        <!-- 选择器 -->
        <div class="select-top">
          <grid>
            <grid-item class="grid-item-reset">
              <div @click="toggleCoalType()">
                <span :style="{color: (isShowCoalTypeList ? '#26A2FF': '#757575')}">{{coal}}</span>&nbsp;
                <img v-if="isShowCoalTypeList" src="../../assets/up.svg" alt="up">
                <img v-else src="../../assets/down.svg" alt="down">
              </div>
            </grid-item>
            <grid-item class="grid-item-reset">
              <div @click="toggleDateType()">
                <span :style="{color: (isShowSignDateTypeList ? '#26A2FF': '#757575')}">{{electionDate}}</span>&nbsp;
                <img v-if="isShowSignDateTypeList" src="../../assets/up.svg" alt="up">
                <img v-else src="../../assets/down.svg" alt="down">
              </div>
            </grid-item>
          </grid>
          <ul class="drop-down-ul" v-if="isShowCoalTypeList">
            <li class="drop-down-li" v-for="(item, index) in coalTypeList" @click="getCurrentCoalType(item)" :key="index">{{item.CoalName}}</li>
          </ul>
          <ul class="drop-down-ul" v-if="isShowSignDateTypeList">
            <li class="drop-down-li" v-for="(item, index) in signDateTypeList" @click="getCurrentDateType(item)" :key="index">{{item}}</li>
          </ul>
          <div class="masker" v-if="isShowCoalTypeList || isShowSignDateTypeList" @click="isShowCoalTypeList=false;isShowSignDateTypeList=false;"></div>
        </div>
        <!-- 列表项 -->
        <div class="list">
          <scroller v-if="contractsList.length > 0" lock-x height="-100" :scroll-bottom-offset="-15" @on-scroll="onScroll" @on-scroll-bottom="onScrollBottom">
            <div style="padding-bottom:1px;">
              <load-more tip="正在更新" v-if="isPulldownLoading && isloading"></load-more>
              <div v-for="(item, index) in contractsList" :key="index">
                <div class="list-item" @click="openDetail(index)">
                  <p class="list-item-leval0">
                    <img class="site-log" height="21" width="21" src="../../assets/order.png" alt="">
                    <span class="title">{{item.OrderName}}</span>
                    <span class="badge">
                      <img class="spot" src="../../assets/spot.svg" alt="">
                    </span>
                  </p>
                  <p class="list-item-leval1">
                    <img class="site-log" src="../../assets/fa.svg" alt="">
                    <span class="title">{{item.ConsignerName}}</span>
                  </p>
                  <p class="list-item-leval1">
                    <img class="site-log" src="../../assets/shou.svg" alt="">
                    <span class="title">{{item.ReceiverName}}</span>
                  </p>
                  <p class="list-item-leval2">
                    <span>{{item.CoalName}}</span>
                    <span v-if="item.TotalNumber>=10000">{{(item.TotalNumber/10000).toFixed(1)||"-"}}万吨</span>
                    <span v-else>{{item.TotalNumber}}吨</span>
                  </p>
                  <p class="list-item-leval3">
                    <span>合同日期：{{item.StartDate}} 至 {{item.EndDate}}</span>
                  </p>
                </div>
                <!-- 点击下拉显示框开始 -->
                <div class="ed" v-if='index == currentIndex'>
                  <div class="dis-log" @click="goCarrier(item)">
                    <img class="log" src="../../assets/car.svg" alt="">
                    <h4 class="dis">新增承运商</h4>
                  </div>
                  <!--  -->
                  <div class="dis-log" @click="del(item.OrderID)">
                    <img class="log" src="../../assets/del.svg" alt="">
                    <h4 class="dis">删除</h4>
                  </div>
                  <div v-transfer-dom>
                    <confirm v-model="show" :title="('提示!')" @on-confirm="onConfirm(item.OrderID)">
                      <p style="text-align:center;">{{ ('确定删除?') }}</p>
                    </confirm>
                  </div>
                </div>
                <!-- 点击下拉显示框结束 -->
              </div>
              <load-more tip="正在加载" v-if="isPullupLoading && isloading"></load-more>
              <load-more :show-loading="false" tip="数据已全部加载" background-color="#f1f2f6" v-if="isAllLoaded"></load-more>
            </div>
          </scroller>
          <!-- 首页提示显示 -->
          <div class="no-data" v-if="!isloadingFailed && !isloading && contractsList.length == 0">
            <img style="width:70px;" src="../../assets/icon_special_nodata.png" alt="no-data" />
            <br />
            <span>暂无数据</span>
          </div>
          <div class="data-failed" v-if="isloadingFailed && contractsList.length == 0">
            <img style="width:70px;" src="../../assets/icon_special_failure.png" alt="failed" />
            <br />
            <span>加载失败</span>
            <br />
            <x-button style="width:110px;color:#3BA1F4;border:1px solid #3BA1F4;margin-top:4px;" :mini="true" :plain="true" action-type="button"
              @click.native="getContractList">重新加载</x-button>
          </div>
        </div>
        <!-- 时间选择器 -->
        <div v-transfer-dom>
          <popup v-model="isShowPopup">
            <popup-header left-text="取消" right-text="确定" title="请选择签订日期" :show-bottom-border="false" @on-click-left="isShowPopup = false"
              @on-click-right="getCustomDate"></popup-header>
            <group>
              <datetime v-model="customStartSignDate" :end-date="customEndSignDate" format="YYYY-MM-DD" title="开始日期">
              </datetime>
              <datetime v-model="customEndSignDate" format="YYYY-MM-DD" title="结束日期">
              </datetime>
            </group>
            <div style="height: 12px"></div>
          </popup>
        </div>
      </div>
    </myFrame>
  </div>
</template>

<script>
  import {
    DateManager,
    getToken,
    getUid
  } from "../../config/utils.js";
  import {
    PopupHeader,
    Popup,
    // TransferDom,
    Group,
    XButton,
    Grid,
    GridItem,
    Sticky,
    Datetime,
    Masker,
    Scroller,
    LoadMore,
    Confirm,
    TransferDomDirective as TransferDom
  } from "vux";
  import myFrame from "../../components/myFrame";

  export default {
    directives: {
      TransferDom
    },
    components: {
      PopupHeader,
      Popup,
      TransferDom,
      Group,
      XButton,
      Grid,
      GridItem,
      Sticky,
      Datetime,
      Masker,
      Scroller,
      LoadMore,
      myFrame,
      Confirm
    },
    data() {
      return {
        show: false,
        isloading: true,
        isloadingFailed: false,
        isPulldownLoading: false,
        isPullupLoading: false,
        isAllLoaded: false,
        isShowPopup: false,
        isShowCoalTypeList: false,
        isShowSignDateTypeList: false,
        currentIndex: -1,
        routes: [{
            path: "/PurchaseOrderList",
            title: "订单列表"
          },
          {
            name: "新增",
            action: () => {
              this.$router.push("/buyOrderNew");
            }
          }
        ],
        currentCoalType: "",
        startSignDate: "",
        endSignDate: "",
        coal: "煤种",
        electionDate: "筛选日期",
        pageIndex: 0,
        pageSize: 10,
        customStartSignDate: "",
        EndSignDate: "",
        customEndSignDate: "",
        contractsList: [],
        coalTypeList: [],
        signDateTypeList: ["全部", "昨日", "本周", "本月", "自定义"],
        scrollerState: {}
      };
    },
    watch: {
      // 监控结束时间不得小于开始时间
      customEndSignDate(newVal) {
        console.log(newVal);
        this.EndSignDate = newVal;
        let newT = new Date(newVal).getTime();
        let startT = new Date(this.customStartSignDate).getTime();
        if (startT > newT) {
          this.$vux.toast.text("开始日期不可大于结束日期", "middle");
          this.customStartSignDate = newVal;
        }
      }
    },
    methods: {
      onScrollBottom() {
        if (
          this.isAllLoaded ||
          this.isloading ||
          this.isPullupLoading ||
          this.isPulldownLoading
        ) {
          return;
        }
        this.isPullupLoading = true;
        this.pageIndex++;
        this.getContractList();
      },
      onScroll(position) {
        if (position.top < -50) {
          if (this.isloading || this.isPullupLoading || this.isPulldownLoading) {
            return;
          }
          this.isAllLoaded = false;
          this.isPulldownLoading = true;
          this.pageIndex = 0;
          this.getContractList();
        }
      },
      toggleCoalType() {
        //煤种类型下拉开关
        this.isShowSignDateTypeList = false;
        this.isShowCoalTypeList = !this.isShowCoalTypeList;
      },
      toggleDateType() {
        //签订日期类型下拉开关
        this.isShowCoalTypeList = false;
        this.isShowSignDateTypeList = !this.isShowSignDateTypeList;
      },
      getCurrentCoalType(item) {
        //获取当前煤种类型
        this.isShowCoalTypeList = false;
        if (item) {
          this.coal = item.CoalName;
          this.currentCoalType = item.CoalId == "-1" ? " " : item.CoalId;
          this.pageIndex = 0;
        }
        this.isAllLoaded = false;
        this.getContractList();
      },
      getCurrentDateType(type) {
        //获取当前签订日期类型
        this.isShowSignDateTypeList = false;
        if (type == "全部") {
          this.startSignDate = "";
          this.endSignDate = "";
        } else if (type == "昨日") {
          this.startSignDate = DateManager.getYesterdayDate();
          this.endSignDate = DateManager.getYesterdayDate();
        } else if (type == "本周") {
          this.startSignDate = DateManager.getWeekStartDate();
          this.endSignDate = DateManager.getWeekEndDate();
        } else if (type == "本月") {
          this.startSignDate = DateManager.getMonthStartDate();
          this.endSignDate = DateManager.getMonthEndDate();
        } else if (type == "自定义") {
          this.electionDate = type;
          this.customStartSignDate = DateManager.formatDate(new Date());
          this.customEndSignDate = DateManager.formatDate(new Date());
          this.isShowPopup = true;
          return;
        } else {
          return;
        }
        this.electionDate = type;
        this.pageIndex = 0;
        this.isAllLoaded = false;
        this.getContractList();
      },
      getCustomDate() {
        //获取自定义时间，并查询列表
        this.startSignDate = this.customStartSignDate;
        this.endSignDate = this.customEndSignDate;
        this.isShowPopup = false;
        this.pageIndex = 0;
        this.isAllLoaded = false;
        this.getContractList();
      },
      openDetail(index) {
        // 设置
        if (this.currentIndex == index) {
          this.currentIndex = -1;
        } else {
          this.currentIndex = index;
        }
      },
      getContractList() {
        //根据筛选日期查询
        // this.$vux.loading.show();
        this.$webview.loading("show");        
        this.isloading = true;
        this.isloadingFailed = false;
        let params = {
          coalType: this.currentCoalType || " ",
          startTime: this.startSignDate || " ",
          endTime: this.endSignDate || " ",
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        };
        console.log(params);
        this.$service
          .get("/BuyOrder/GetBuyOrderListWithPage", params)
          .then(res => {
            console.log(res);
            this.isloading = false;
            setTimeout(() => {
              this.isPulldownLoading = false;
              this.isPullupLoading = false;
            }, 1500);
            this.$webview.loading("hide");
            let data = res.Data.map(item => {
              item.StartDate = DateManager.formatDate(new Date(item.StartDate));
              item.EndDate = DateManager.formatDate(new Date(item.EndDate));
              return item;
            });

            if (this.isPullupLoading) {
              if (data.length == 0) {
                this.isAllLoaded = true;
                return;
              }
              for (let i = 0; i < data.length; i++) {
                this.contractsList.push(data[i]);
              }
            } else {
              this.contractsList = data;
            }
          })
          .catch(err => {
            this.isloading = false;
            this.isloadingFailed = true;
            this.$webview.loading("hide");
          });
      },
      getCoalTypeList() {
        //api 获取煤种列表
        this.$service
          .get("/BuyOrder/GetCoalTypeList", {})
          .then(res => {
            let array = res.Data;
            array.unshift({
              CoalId: "-1",
              CoalName: "全部"
            });
            this.coalTypeList = array;
          })
          .catch(err => {});
      },
      goCarrier(item) {
        // 跳转至新增承运商页面
        this.$webview.notice("新增托运", {
          orderId: item.OrderID,
          OrderName: item.OrderName,
          ConsignerName: item.ConsignerName,
          ReceiverName: item.ReceiverName
        });
      },
      del(item) {
        // 删除订单
        console.log(item);
        this.show = true;
      },
      onConfirm(msg) {
        console.log(msg);
        let orderParams = {
          buyOrderId: msg
        };
        this.$service
          .get("/BuyOrder/DeleteBuyOrder", orderParams)
          .then(res => {
            this.$vux.toast.text(res.Msg, "bottom");
            setTimeout(() => {
              this.getCurrentCoalType();
              this.currentIndex = -1;
            });
          })
          .catch(err => {});
      }
    },
    mounted() {
      if (getToken("sid")) {
        this.getCoalTypeList();
        this.getContractList();
      } else {
        this.$vux.alert.show({
          title: "提示",
          content: "获取当前登录用户信息失败",
          buttonText: "关闭"
        });
        this.isloading = false;
        this.isloadingFailed = true;
      }
    }
  };

</script>

<style lang="less" scoped>
  .purchase-order {
    /* padding-top: 46px; */
    .select-top {
      width: 100%;
      position: fixed;
      top: 46px;
      left: 0;
      z-index: 100;
      .masker {
        position: fixed;
        top: 90px;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        opacity: 0.5;
        background-color: #000000;
      }
      .grid-item-reset {
        padding: 10px 20px;
        text-align: center;
        background-color: #ffffff;
        span {
          color: #757575;
          vertical-align: middle;
        }
        img {
          vertical-align: middle;
        }
      }
      .drop-down-ul {
        overflow: scroll;
        max-height: 195px;
        width: 100%;
        background-color: #ffffff;
        .drop-down-li {
          color: #757575;
          height: 28px;
          line-height: 28px;
          text-align: center;
          padding: 5px;
          border-bottom: 1px solid #f1f2f6;
        }
      }
    }
    .list {
      position: absolute;
      top: 45px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
      .list-item {
        width: 95%;
        height: auto;
        margin: 10px auto;
        padding: 12px 12px;
        box-sizing: border-box;
        border-radius: 6px;
        background-color: #ffffff;
        .list-item-leval0 {
          .title {
            font-size: 16px;
            font-weight: 600;
          }
          .badge {
            color: red;
            float: right;
          }
        }
        .list-item-leval1 {
          .title {
            font-size: 15px;
            font-weight: 300;
          }
        }
        .list-item-leval2 {
          padding: 8px 0;
          span {
            font-size: 14px;
            background-color: #dddddd;
            padding: 3px 7px;
            border-radius: 5px;
            color: #333333;
          }
        }
        .list-item-leval3 {
          span {
            font-size: 12px;
            color: #bababa;
          }
        }
      }
      .ed {
        text-align: center;
      }
      .dis-log {
        width: 45%;
        margin: auto;
        text-align: center;
        position: relative;
        display: inline-block;
        h4 {
          font-weight: 500;
          color: #666666;
        }
      }
      .site-log {
        position: relative;
        top: 5px;
      }
      .dis {
        display: inline-block;
      }
      .log {
        position: relative;
        top: 5px;
        left: -3px;
      }
      .spot {
        position: relative;
        right: 10px;
        top: 5px;
      }
    }
    .no-data,
    .data-failed {
      color: #757575;
      text-align: center;
      margin-top: 150px;
    }
  }

</style>
