<template>
  <div class="batch-detail">
    <myFrame :routes="routes">
      <div slot="router-box">
        <!-- 批次详情 -->
        <div class="batch-info">
          <div class="batch-basic">
            <div class="batch-info-top">
              <h2 v-if="batchInfo.StartStationName && batchInfo.StartStationName">{{batchInfo.StartStationName || "-"}} — {{batchInfo.EndStationName || "-"}}</h2>
              <h2 v-else>- -</h2>
              <div class="batch-li">批次编号：{{batchInfo.BatchNumber||"-"}}</div>
              <div class="batch-li">发运时间：{{batchInfo.CreateTime.replace("T", " ")||"-"}}</div>
              <div class="batch-li">货物参数：{{paramsList}}</div>
              <div class="batch-li">备注：{{batchInfo.Remark||"-"}}</div>
              <div class="batch-li" @click="goInfo(batchInfo.OrderId)" style="position:relative">所属订单：{{batchInfo.OrderName||"-"}}
                <img class="pic-log" src="../../assets/rarrow.svg" alt="">
              </div>
            </div>
            <div class="batch-info-bottom">
              <div class="batch-real-title">批次实时状态</div>
              <div class="info-list-box">
                <div class="info-list" v-for="item in infoList" :key="item.state">
                  <span class="line"></span>
                  <div class="title-item" :class="{active : item.status == currentType}" @click="getBatchListByTitle(item.status)">
                    <h4>{{item.CarriageWeight}}T</h4>
                    <h4>{{item.Number}}节</h4>
                    <h4>{{item.statusName}}</h4>
                  </div>
                </div>
              </div>
              <!-- 列表 -->
              <div class="batch-list">
                <x-table :cell-bordered="false" style="background-color:white;">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>车皮号</th>
                      <th>重量(T)</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody v-for="(item,index) in batchList" :key="index">
                    <tr>
                      <td>{{item.No}}</td>
                      <td>{{item.CarriageNo + '' || "-"}}</td>
                      <td>{{item.GoodsWeight + '' || "-"}}</td>
                      <td>{{item.CarriageStatusStr || "-"}}</td>
                    </tr>
                  </tbody>
                  <tbody v-if="!isAllLoaded && batchList.length == 5">
                    <tr @click="loadMore">
                      <td colspan="4">查看更多</td>
                    </tr>
                  </tbody>

                  <tbody v-if="batchList.length == 0">
                    <tr style="color:#ccc">
                      <td colspan="4">———— 暂无数据 ————</td>
                    </tr>
                  </tbody>
                  <tbody v-if="isAllLoaded && batchList.length > 0">
                    <tr style="color:grey">
                      <td colspan="4">———— 完 ————</td>
                    </tr>
                  </tbody>
                </x-table>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </myFrame>

  </div>
</template>
<script>
import myFrame from "../../components/myFrame";
import { XTable, LoadMore, Alert } from "vux";
import config from "../../config/config.js";

export default {
  components: {
    XTable,
    LoadMore,
    myFrame,
    Alert
  },
  data() {
    return {
      batchID: this.$route.query.batchID,
      ReceiverId: this.$route.query.ReceiverId,

      CarriageStatus: -1,
      receiveId: 1,
      batchInfo: {
        StartStationName: "",
        EndStationName: "",
        BatchNumber: "加载中",
        OrderName: "加载中",
        OrderId: null,
        CreateTime: "加载中",
        Remark: "加载中  "
      },
      pageIndex: 0,
      pageSize: 5,
      batchId: "",
      count: 0,
      currentType: -1,
      isAllLoaded: false,
      paramsList: "",
      routes: [
        {
          path: "/BatchDetail",
          title: "批次详情"
        }
      ],
      infoList: [
        {
          status: -1,
          statusName: "已发",
          Number: 0,
          CarriageWeight: 0
        },
        {
          status: 1,
          statusName: "途中",
          Number: 0,
          CarriageWeight: 0
        },
        {
          status: 2,
          statusName: "待收",
          Number: 0,
          CarriageWeight: 0
        },
        {
          status: 3,
          statusName: "完成",
          Number: 0,
          CarriageWeight: 0
        }
      ],
      batchList: []
    };
  },
  methods: {
    getBatchListByTitle(status) {
      this.CarriageStatus = status;
      this.count = 1;
      if (this.currentType == status) {
        return;
      }
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.isAllLoaded = false;
      this.pageIndex = 0;
      this.currentType = status;
      this.getBatchList();
    },

    hide() {
      if (this.count == 2) {
        // this.$vux.loading.hide();
        this.$webview.loading("hide");
      }
    },

    showModuleAuto() {
      this.showModule();
      setTimeout(() => {
        AlertModule.hide();
      }, 3000);
    },

    getBatchList() {
      let params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        transportType: this.currentType,
        batchId: this.batchID
      };
      this.$service
        .get("/RecDelReport/GetBatchDetailInfo", params)
        .then(res => {
          this.count++;
          this.hide();
          this.batchList = [];
          let batchList = res.Data.CarriageInfo;
          if (batchList.length < this.pageSize) {
            this.isAllLoaded = true;
          }
          for (let i = 0; i < batchList.length; i++) {
            this.batchList.push(batchList[i]);
          }
          let infoList = res.Data.CarriageNumber;
          infoList.forEach((item, index) => {
            switch (item.status) {
              case -1:
                this.infoList[0].Number = item.Number;
                this.infoList[0].CarriageWeight = item.CarriageWeight;
                break;
              case 1:
                this.infoList[1].Number = item.Number;
                this.infoList[1].CarriageWeight = item.CarriageWeight;
                break;
              case 2:
                this.infoList[2].Number = item.Number;
                this.infoList[2].CarriageWeight = item.CarriageWeight;
                break;
              case 3:
                this.infoList[3].Number = item.Number;
                this.infoList[3].CarriageWeight = item.CarriageWeight;
                break;
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    getBatchInfo() {
      this.$service
        .get("/RailFreightNew/GetRailBatchInfo", {
          batchID: this.batchID
        })
        .then(res => {
          console.log(res);
          this.count++;
          this.hide();
          let datas = res.Data;
          // 判断是否为承运商还是电厂，如果是承运商则可进行装车登记
          if (datas.CurrentCorpId == datas.ShipperID) {
            this.routes.push({
              name: "装车登记",
              action: () => {
                location.href =
                  config.HCDomain +
                  "/newadd?RailBtachId=" +
                  this.$route.query.batchID;
              }
            });
          }
          this.receiveId = datas.ReceiverID;
          if (datas.paramList.length != 0) {
            let detail = "";
            for (let j = 0; j < datas.paramList.length; j++) {
              detail +=
                datas.paramList[j].PName +
                " " +
                datas.paramList[j].PValue +
                "  " +
                datas.paramList[j].PUnit;
            }
            this.paramsList = detail;
          } else {
            this.paramsList = "";
          }
          this.batchInfo = datas;
        })
        .catch(err => {
          console.log("请求失败");
        });
    },

    getMore() {
      this.pageIndex++;
      this.getBatchList();
    },

    loadMore() {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$router.push({
        path: "/BatchList",
        query: {
          batchId: this.batchID,
          currentType: this.CarriageStatus
        }
      });
    },

    goInfo(id) {
      if (id <= 0) {
        this.$vux.alert.show({
          title: "抱歉",
          content: "暂无该订单详情..."
        });
        return;
      }
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$router.push({
        path: "/OrderDetails/basic",
        query: {
          OrderId: id,
          receiverId: this.ReceiverId ? this.ReceiverId : this.receiveId
        }
      });
    }
  },
  mounted() {
    // this.$vux.loading.show();
    this.$webview.loading("show");
    this.getBatchInfo();
    setTimeout(() => {
      this.getBatchList();
    });
  }
};
</script>

<style scoped lang="less">
.batch-detail {
  background: #f1f2f5;

  /* header */
  .vux-header,
  .vux-button-group > a.vux-button-group-current {
    background: #28b7f7;
    color: white;
  }

  /* 批次详情 */
  .info-list-box {
    overflow: hidden;
  }
  .batch-info {
    .batch-basic {
      padding: 15px;
      background: #f1f2f5;
    }
    .batch-info-top {
      padding: 17px;
      border-radius: 7px;
      background: white;
    }
    .pic-log {
      position: absolute;
      top: 5px;
      right: -10px;
    }
    h2 {
      color: #28acf7;
      font-size: 17px;
      font-weight: 600;
      padding-bottom: 10px;
      border-bottom: 2px solid #f1f2f5;
    }
    .batch-li {
      margin-top: 10px;
    }
  }

  /* 批次实时详情 */
  .batch-real-title {
    color: #999;
    padding: 10px 3px;
  }
  .info-list-box {
    font-size: 0;
  }
  .info-list {
    width: 25%;
    background: white;
    font-size: 0;
    display: inline-block;
    position: relative;
  }
  .info-list:nth-of-type(1) {
    border-top-left-radius: 7px;
  }
  .info-list:nth-of-type(4) {
    border-top-right-radius: 7px;
  }
  .title-item {
    text-align: center;
    width: 100%;
    color: #999;
    padding: 5px 0;
  }
  .info-list:nth-of-type(1) .line {
    width: 0;
  }
  .line {
    display: inline-block;
    width: 1px;
    height: 41px;
    background: #dbdbdb;
    position: absolute;
    left: 0;
    top: 25px;
  }
  h4 {
    font-size: 16px;
    font-weight: 300;
  }
  .title-item.active {
    background: #28acf7;
    color: white;
  }

  .batch-list {
    tr th,
    tr td {
      width: 25%;
    }
  }
}

/* 公共样式 */
.dis {
  display: inline-block;
}
</style>
