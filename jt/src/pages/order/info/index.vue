<template>
  <div class="basice-info">
    <!-- 基本详情开始 -->
    <div class="details">
      <div class="details-cell">
        <h5>收货信息</h5>
        <div class="details-info">
          <div @click="goPowerPlant(detailList.ReceiverId)">
            <span>收货方：</span>
            <span>{{detailList.ReceiverName||'-'}}</span>
            <img class="piclog" src="../../../assets/rarrow.svg" alt="">
          </div>
          <div>
            <span>收货地：</span>
            <span>{{RecAreaList||'-'}}</span>
          </div>
          <div>
            <span>联系人：</span>
            <span>{{detailList.ReceiverLineName||'-'}}</span>
            <a v-if="detailList.ReceiverTelephone" @click="callSomebody(detailList.ReceiverTelephone)">
              <img class="piclog" src="../../../assets/phone.svg" alt="">
            </a>
          </div>
        </div>
      </div>
      <div class="details-cell">
        <h5>发货信息</h5>
        <div class="details-info">
          <div>
            <span>发货方：</span>
            <span>{{detailList.ConsignerName||'-'}}</span>
            <!-- 暂时不做跳转 -->
            <!-- <span>
              <img class="piclog" src="../../../assets/rarrow.svg" alt="">
            </span> -->
          </div>
          <div>
            <span>发货地：</span>
            <span>{{ConAreaList||'-'}}</span>
          </div>
          <div>
            <span>联系人：</span>
            <span>{{detailList.ConsignerLineName||'-'}}</span>
            <a v-if="detailList.ReceiverTelephone" @click="callSomebody(detailList.ConsignerTelephone)">
              <img class="piclog" src="../../../assets/phone.svg" alt="">
            </a>
          </div>
        </div>
      </div>
      <div class="details-cell">
        <h5>货物信息</h5>
        <div class="details-info">
          <div>
            <span>货物：</span>
            <span>{{detailList.ProductName||'-'}}</span>
          </div>
          <div>
            <span>指标：</span>
            <span>{{productInfo||'-'}}</span>
          </div>
        </div>
      </div>
      <div class="details-cell">
        <h5>其他信息</h5>
        <div class="details-info">
          <div>
            <span>合同编号：</span>
            <span>{{detailList.ContractNumber||'-'}}</span>
          </div>
          <div>
            <span>运输方式：</span>
            <span>{{detailList.TransportType||'-'}}</span>
          </div>
          <div v-if="flag">
            <span>调运限制：</span>
            <span>{{limit||'-'}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 详情结束 -->
  </div>
</template>

<script>
  import {
    XTable,
    LoadMore
  } from "vux";
  export default {
    components: {
      XTable,
      LoadMore
    },

    data() {
      return {
        orderId: this.$route.query.OrderId,

        detailList: {
          ReceiverName: "加载中",
          ReceiverLineName: "加载中",
          ReceiverTelephone: null,
          ConsignerName: "加载中",
          ConsignerLineName: "加载中",
          ProductName: "加载中",
          ContractNumber: "加载中",
          TransportType: "加载中",
          ConsignerTelephone: null
        },
        productInfo: "加载中",
        limit: "加载中",
        ConAreaList: "加载中",
        RecAreaList: "加载中",
        flag: false
      };
    },
    methods: {
      loadDetailList() {
        this.$service
          .get("/RecDelReport/GetBuyOrderInfo", {
            orderId: this.orderId
          })
          .then(res => {
            console.log(res.Data);
            let datas = res.Data;
            // 运输方式匹配
            if (datas.TransportType == 1 || datas.TransportType == "汽车") {
              datas.TransportType = "汽运";
              this.flag = true;
            } else {
              datas.TransportType = "铁运";
            }
            // 收货区域匹配
            if (datas.RecAreaList) {
              let recAre = "";
              for (var i = 0; i < datas.RecAreaList.length; i++) {
                recAre += datas.RecAreaList[i].AreaName + " ";
              }
              this.RecAreaList = recAre;
            } else {
              this.RecAreaList = "";
            }
            // 发货区域
            if (datas.ConAreaList) {
              let conArea = "";
              for (var z = 0; z < datas.ConAreaList.length; z++) {
                conArea += datas.ConAreaList[z].AreaName + " ";
              }
              this.ConAreaList = conArea;
            } else {
              this.ConAreaList = "";
            }
            this.detailList = datas;

            let limits = "";
            if (datas.TransportRequire) {
              if (datas.TransportRequire.IsInConsignArea >= 1) {
                limits = "在发货区域,";
              } else {
                limits += "不在发货区域,";
              }
              if (datas.TransportRequire.IsHasEquipment >= 1) {
                limits += "有设备,";
              } else {
                limits += "无设备,";
              }
              if (datas.TransportRequire.IsReceipt >= 1) {
                limits += "有回单,";
              } else {
                limits += "无回单,";
              }
              this.limit = limits;
            } else {
              this.limit = "";
            }
            if (datas.pvList) {
              let pvInfo = "";
              for (let j = 0; j < datas.pvList.length; j++) {
                pvInfo +=
                  datas.pvList[j].PName +
                  " " +
                  datas.pvList[j].PValue +
                  "  " +
                  datas.pvList[j].PUnit;
              }
              this.productInfo = pvInfo;
            } else {
              this.productInfo = "";
            }
            // this.$vux.loading.hide();
            this.$webview.loading("hide");
          })
          .catch(err => {
            // this.$vux.loading.hide();
            this.$webview.loading("hide");
            console.log(err);
          });
      },
      goPowerPlant(id) {
        console.log(id);
        this.$router.push({
          path: "/powerplant/detail",
          query: {
            corpid: id
          }
        });
      },
      callSomebody(mobile) {
        console.log(mobile);
        this.$webview.notice("打电话", {
          telPhoneNum: mobile
        });
      }
    },
    mounted() {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.loadDetailList();
    }
  };

</script>

<style scoped lang="less">
  /* 收货信息 */

  .details {
    background: #f1f2f5;
  }

  .details-cell {
    padding: 15px;
    background: white;
    margin-bottom: 15px;
  }

  h5 {
    font-size: 15px;
    color: #333333;
  }

  .details-info {
    color: #666666;
    font-size: 15px;
  }

  .details-info>div {
    position: relative;
  }

  .piclog {
    position: absolute;
    top: 4px;
    right: 0;
  }
  /* 订单列表 */

  .order-list {
    background: #e8f8ff;
    padding: 0 10px;
    tbody tr td {
      width: 50px;
      font-size: 13px;
      text-overflow: ellipsis;
      /* for IE */
      -moz-text-overflow: ellipsis;
      /* for Firefox,mozilla */
      overflow: hidden;
      white-space: nowrap;
      /* text-align: left */
    }
    .pic-log {
      position: absolute;
      top: 11px;
      right: -5px;
    }
  }
  /* 公共样式 */

  .dis {
    display: inline-block;
  }

</style>
