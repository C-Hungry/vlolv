<template>
  <div class="order-info">

    <!-- 订单数据开始 -->
    <div class="order">
      <div class="order-basic">
        <div class="order-basic-box">
          <div class="basic-title">
            <h4 class="dis h4-l">订单：{{orderInfo.OrderName||"-"}}</h4>
            <h4 class="dis h4-r">{{orderInfo.TransportType||"-"}}</h4>
          </div>
          <div class="basic-info">
            <grid>
              <grid-item>
                <em v-if="orderInfo.ContractNumber>=10000">{{(orderInfo.ContractNumber/10000).toFixed(1)||"-"}}万吨</em>
                <em v-else>{{orderInfo.ContractNumber}}吨</em>
                <div>合同量</div>
              </grid-item>
              <grid-item>
                <em v-if="orderInfo.CompleteWeight>=10000">{{(orderInfo.CompleteWeight/10000).toFixed(1)||"-"}}万吨</em>
                <em v-else>{{orderInfo.CompleteWeight}}吨</em>
                <div>完成</div>
              </grid-item>
              <grid-item>
                <em>{{orderInfo.CompleteRate||"-%"}}</em>
                <div>完成率</div>
              </grid-item>
            </grid>
            <grid>
              <grid-item>
                <i>{{orderInfo.TransportOrderNumber||"0"}}个</i>
                <div>所有运单</div>
              </grid-item>
              <grid-item>
                <i>{{orderInfo.ExceptionNumber||"0"}}个</i>
                <div>运输异常</div>
              </grid-item>
              <grid-item>
                <i>{{orderInfo.ExceptionRate||"-%"}}</i>
                <div>异常率</div>
              </grid-item>
            </grid>
          </div>
        </div>
      </div>
      <div class="echart-bar" style="width:90%;height:300px;background:white;margin-top:5px;padding:15px;">
        <IEcharts :option="monthBar"></IEcharts>
      </div>
      <div class="order-list">
        <x-table :cell-bordered="false" style="background-color:#e8f8ff;">
          <thead>
            <tr>
              <th>时间</th>
              <th>计划量</th>
              <th>已发(T)</th>
              <th>完成(T)</th>
            </tr>
          </thead>
          <tbody v-for="(item,index) in dayPlanList" v-if="index<5" :key="item.Time">
            <tr @click="goInfo(item)">
              <td>{{item.Time}}</td>
              <td>{{item.FPValue||"-"}}</td>
              <td>{{item.HasSendWeight}}</td>
              <td style="position:relative">{{item.CompleteWeight}}
                <img class="pic-log" src="../../../assets/rarrow.svg">
              </td>
            </tr>
          </tbody>
          <tbody v-if="!isAllLoaded && dayPlanList.length>5">
            <tr @click="loadMore">
              <td colspan="4">查看更多</td>
            </tr>
          </tbody>
          <tbody v-else-if="dayPlanList.length==0">
            <tr style="color:#ccc">
              <td colspan="4">————暂无数据...————</td>
            </tr>
          </tbody>
          <tbody v-if="isAllLoaded && dayPlanList.length > 0">
            <tr style="color:grey">
              <td colspan="4">———— 完 ————</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <!-- 订单数据结束 -->
  </div>
</template>

<script>
  // 引入echarts
  import IEcharts from "vue-echarts-v3";
  import "echarts/lib/chart/bar";
  import {
    Grid,
    GridItem,
    XTable,
    LoadMore
  } from "vux";

  export default {
    components: {
      IEcharts,
      Grid,
      GridItem,
      XTable,
      LoadMore
    },

    data() {
      return {
        OrderId: this.$route.query.OrderId,
        receiverId: this.$route.query.receiverId,

        isAllLoaded: false,
        pageIndex: 0,
        pageSize: 10,
        state: -1,
        count: 0,
        orderInfo: {
          OrderName: "加载中",
          TransportType: "加载中",
          ContractNumber: "0",
          CompleteWeight: "0",
          CompleteRate: "加载中",
          TransportOrderNumber: "-",
          ExceptionNumber: "-",
          ExceptionRate: "加载中"
        },
        dayPlanList: [],
        orderList: [],
        monthBar: {
          barWidth: "15px",
          title: {
            text: "日统计"
          },
          grid: {
            left: "-8%",
            right: "-2%",
            bottom: "3%",
            containLabel: true
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
              label: {
                show: true
              }
            }
          },
          legend: {
            x: "right",
            data: ["已发量", "完成量"]
          },
          xAxis: [{
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 60
            }
          }],
          yAxis: [{
            type: "value",
            show: false
          }],
          dataZoom: [{
            show: false,
            type: "inside",
            startValue: 0,
            endValue: 5
          }],
          series: [{
              name: "已发量",
              type: "bar",
              //  单独设置颜色
              // itemStyle: {
              //   normal: {
              //     color: 'green'
              //   }
              // },
              data: [],
              barGap: "10%"
            },
            {
              name: "完成量",
              type: "bar",
              data: []
            }
          ],
          color: ["#afe6fe", "#28b7f7"]
        }
      };
    },

    methods: {
      loadMore() {
        this.$router.push({
          path: "/OrderDetails/OrderList",
          query: {
            state: this.state,
            OrderId: this.OrderId,
            sendName: encodeURIComponent(this.orderInfo.OrderName),
            receiverId: parseInt(this.receiverId)
          }
        });
        this.$vux.loading.show();
      },

      hide() {
        if (this.count == 2) {
          this.$webview.loading("hide");
        }
      },

      loadOrderInfo() {
        this.$service
          .get("/RecDelReport/GetBuyOrderDetailTop", {
            OrderId: this.OrderId
          })
          .then(res => {
            console.log(res);
            this.count++;
            this.hide();
            let datas = res.Data;
            if (datas.TransportType == 1 || datas.TransportType == "汽运") {
              datas.TransportType = "汽运";
              this.state = 1;
            } else {
              datas.TransportType = "铁运";
              this.state = 3;
            }
            this.orderInfo = datas;
          })
          .catch(err => {
            console.log(err);
          });
      },

      loadOrderDayInfo() {
        this.$service
          .get("/RecDelReport/GetBuyOrderDetailByDay", {
            OrderId: this.OrderId,
            pageIndex: this.pageIndex,
            pageSize: 999
          })
          .then(res => {
            this.count++;
            this.hide();
            if (res.Data.length < this.pageSize) {
              this.isAllLoaded = true;
            }
            this.dayPlanList = res.Data;
            if (this.dayPlanList) {
              for (var i = 0; i < this.dayPlanList.length; i++) {
                this.monthBar.xAxis[0].data.push(this.dayPlanList[i].Time);
                this.monthBar.series[0].data.push(
                  this.dayPlanList[i].HasSendWeight
                );
                this.monthBar.series[1].data.push(
                  this.dayPlanList[i].CompleteWeight
                );
              }
            } else {
              this.dayPlanList = [];
            }
          })
          .catch(err => {
            console.log(err);
          });
      },

      goInfo(item) {
        if (this.state == "1") {
          console.log("汽运");
          this.$webview.notice("运单列表", {
            startTime: item.Time,
            endTime: item.Time,
            sendName: this.orderInfo.OrderName,
            receiverId: parseInt(this.receiverId),
            orderId: parseInt(this.OrderId)
          });
        } else {
          console.log("铁运");
          this.$webview.notice("火车批次", {
            startTime: item.Time,
            endTime: item.Time,
            sendName: this.orderInfo.OrderName,
            orderId: parseInt(this.OrderId),
            receiverId: parseInt(this.receiverId)
          });
        }
      }
    },
    mounted() {
      this.$webview.loading("hide");
      this.loadOrderInfo();
      this.loadOrderDayInfo();
    }
  };

</script>

<style scoped lang="less">
  /* 订单数据 */

  .order {
    /* border: 1px solid red; */
    .order-basic {
      padding: 0 15px 15px 15px;
      background: #28b7f7;
    }
    .order-basic-box {
      padding: 15px;
      border-radius: 5px;
      background: white;
    }
    h4 {
      font-size: 16px;
    }

    .basic-title {
      margin-bottom: 15px;
      .h4-r {
        float: right;
      }
      .h4-l {
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .weui-grid {
      display: block;
      text-align: center;
      color: #666;
      padding: 5px 5px;
      /* div {
          font-size: 16px;
        } */
    }
    em,
    i {
      font-size: 19px;
    }
    em {
      color: #28acf7;
    }
    i {
      color: #ff9000;
    }
    .weui-grid:before,
    .weui-grids:after,
    .weui-grids:before,
    .weui-grid:after {
      border: 0;
    }
    .pic-log {
      position: absolute;
      top: 11px;
      right: -1px;
    }
  }
  /* 公共样式 */

  .dis {
    display: inline-block;
  }

</style>
