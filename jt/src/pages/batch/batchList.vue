<template>
  <div class="batch-list">
    <!-- <x-header title="slot:overwrite-title" :left-options="{backText: ''}">
      批次详情列表
    </x-header> -->
    <myFrame :routes="routes">
      <div slot="router-box">
        <!-- 列表项 -->
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
            <tbody v-if="!isAllLoaded && batchList.length >= 10">
              <tr @click="getMore">
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
      </div>
    </myFrame>
  </div>
</template>
<script>
  import {
    XTable,
    LoadMore
  } from "vux";
  import myFrame from "../../components/myFrame";

  export default {
    components: {
      XTable,
      LoadMore,
      myFrame
    },
    data() {
      return {
        pageIndex: 0,
        pageSize: 10,
        batchId: "",
        currentType: this.$route.query.currentType ?
          this.$route.query.currentType :
          -1,
        isAllLoaded: false,
        routes: [{
          path: "/BatchList",
          title: "批次详情列表"
        }],
        infoList: [{
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
        if (this.currentType == status) {
          return;
        }
        // this.$vux.loading.show();
        this.$webview.loading("show");
        this.isAllLoaded = false;
        this.pageIndex = 0;
        this.currentType = status;
        this.getBatchList(true);
      },
      getBatchList(flag) {
        let params = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          transportType: this.currentType,
          batchId: this.$route.query.batchId
        };
        // this.$vux.loading.show();
        this.$webview.loading("show");
        this.$service
          .get("/RecDelReport/GetBatchDetailInfo", params)
          .then(res => {
            if (flag) {
              this.batchList = [];
            }
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
            // this.$vux.loading.hide();
            this.$webview.loading("hide");
          })
          .catch(err => {
            this.$vux.loading.show({
              text: "请求失败..."
            });
          });
      },
      getMore() {
        this.pageIndex++;
        this.getBatchList();
      }
    },
    mounted() {
      this.getBatchList();
    }
  };

</script>

<style scoped lang="less">
  .batch-list {
    /* header */
    .vux-header,
    .vux-button-group>a.vux-button-group-current {
      background: #28b7f7;
      color: white;
    }
    /* 列表项 */
    .info-list-box {
      font-size: 0;
      margin-top: 10px;
    }
    .batch-real-title {
      color: #999;
      padding: 10px 3px;
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
    h4 {
      font-size: 16px;
      font-weight: 300;
    }
    .title-item.active {
      background: #28acf7;
      color: white;
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
    .batch-list {
      tr th,
      tr td {
        width: 25%;
      }
    }
  }

</style>
