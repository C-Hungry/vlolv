<template>
  <div class="detail-index">
    <div class="base-info">
      <div class="content">
        <div class="content-title">电厂：{{Kanban.ReceiverName}}</div>
        <div class="content-item-v-list">
          <div class="content-item-v-item">
            <div v-if="Kanban.TotalOrderWeight>=100000000" class="v-item-amount">{{(Kanban.TotalOrderWeight/100000000).toFixed(1)}}亿吨</div>
            <div v-else-if="Kanban.TotalOrderWeight>=10000" class="v-item-amount">{{(Kanban.TotalOrderWeight/10000).toFixed(1)}}万吨</div>
            <div v-else class="v-item-amount">{{Kanban.TotalOrderWeight}}吨</div>
            <div class="v-item-title">订单总量</div>
          </div>
          <div class="content-item-v-item">
            <div class="v-item-amount">{{Kanban.TotalOrderNumber}}个</div>
            <div class="v-item-title">订单个数</div>
          </div>
          <div class="content-item-v-item">
            <div class="v-item-amount">{{Kanban.ExceptionNumber}}个</div>
            <div class="v-item-title">异常运单</div>
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-head">
            完成率：{{Kanban.CompleteRate}}
          </div>
          <div class="content-item-tail">
            异常率：{{Kanban.ExceptionRate?Kanban.ExceptionRate:"--"}}
          </div>
        </div>
        <div class="content-item">
          <div class="content-item-head">
            <span v-if="Kanban.HighThanCompleteRate[0]=='-'">低于同行业：{{Kanban.HighThanCompleteRate.substr(1)}}</span>
            <span v-else>高于同行业：{{Kanban.HighThanCompleteRate}}</span>
          </div>
          <div class="content-item-tail">
            <span v-if="Kanban.HighThanExceptionRate[0]=='-'">低于同行业：{{Kanban.HighThanExceptionRate.substr(1)}}</span>
            <span v-else>高于同行业：{{Kanban.HighThanExceptionRate}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="statistics-bar">
      <div class="title-list">
        <div class="title-item selected" v-if="statisticsBarItem=='day'" v-on:click="statisticsBarItem='day'">日统计</div>
        <div class="title-item" v-else v-on:click="statisticsBarItem='day'">日统计</div>
        <div class="title-item selected" v-if="statisticsBarItem=='month'" v-on:click="statisticsBarItem='month'">月统计</div>
        <div class="title-item" v-else v-on:click="statisticsBarItem='month'">月统计</div>
      </div>
      <div v-if="statisticsBarItem=='day'">
        <div class="echart-box">
          <IEcharts :option="dayBar"></IEcharts>
        </div>
        <group>
          <cell-box>
            <div class="table-box table-header">
              <div class="table-cell-first">时间</div>
              <div class="table-cell">计划量</div>
              <div class="table-cell">已发</div>
              <div class="table-cell">完成</div>
            </div>
          </cell-box>
          <cell-box v-for="(item, index) in dayPlanList" v-if="index<5" :key="item.Time" is-link>
            <div class="table-box" @click="dayPlanDetail(item)">
              <div class="table-cell-first">{{item.Time}}</div>
              <div class="table-cell">{{item.FPValue}}</div>
              <div class="table-cell">{{item.HasSendWeight}}</div>
              <div class="table-cell">{{item.CompleteWeight}}</div>
            </div>
          </cell-box>
          <cell-box v-if="dayPlanList.length>0">
            <div class="table-box">
              <div class="table-cell-first" @click="$router.push('/dayplan?corpid=' + CorpID)">查看更多</div>
            </div>
          </cell-box>
          <cell-box v-else>
            <div class="table-box">
              <div class="table-cell-first">暂无数据</div>
            </div>
          </cell-box>
        </group>
      </div>
      <div v-if="statisticsBarItem=='month'">
        <div class="echart-box">
          <IEcharts :option="monthBar"></IEcharts>
        </div>
        <group>
          <cell-box>
            <div class="table-box table-header">
              <div class="table-cell">时间</div>
              <div class="table-cell">计划量</div>
              <div class="table-cell">已发</div>
              <div class="table-cell">完成</div>
            </div>
          </cell-box>
          <cell-box v-for="(item, index) in monthPlanList" v-if="index<5" :key="item.Time" is-link>
            <div class="table-box" @click="monthPlanDetail(item)">
              <div class="table-cell">{{item.Time}}</div>
              <div class="table-cell">{{item.FPValue}}</div>
              <div class="table-cell">{{item.HasSendWeight}}</div>
              <div class="table-cell">{{item.CompleteWeight}}</div>
            </div>
          </cell-box>
          <cell-box v-if="monthPlanList.length>0">
            <div class="table-box">
              <div class="table-cell-first" @click="$router.push('/monthplan?corpid=' + CorpID)">查看更多</div>
            </div>
          </cell-box>
          <cell-box v-else>
            <div class="table-box">
              <div class="table-cell-first">暂无数据</div>
            </div>
          </cell-box>
        </group>
      </div>
    </div>
    <div class="statistics-pie">
      <div class="title">
        订单统计
        <!-- <select v-model="currentYear" style="float: right; border: 0; outline: 0;">
          <option v-for="item in yearList" :value="item" :key="item">{{item}}年</option>
        </select> -->
        <div v-on:click="chooseYear=true" style="float: right; border: 0; outline: 0; font-weight: normal;">
          {{currentYear}}年<img height="15" src="../../../assets/more_unfold.png" style="vertical-align: middle;" />
        </div>
      </div>
      <div v-if="orderPie.legend.data.length>0" class="echart-box">
        <IEcharts :option="orderPie"></IEcharts>
      </div>
      <group>
        <cell-box>
          <div class="table-box table-header" style="min-height: 38px;">
            <div class="table-cell-first">订单</div>
            <div class="table-cell">合同量(T)</div>
            <div class="table-cell">已发(T)</div>
            <div class="table-cell">完成率</div>
          </div>
        </cell-box>
        <cell-box v-for="item in orderList" :key="item.OrderName" is-link>
          <div class="table-box" @click="orderDetail(item)" style="min-height: 38px;">
            <div class="table-cell-first">{{item.OrderName}}</div>
            <div class="table-cell">{{item.ContractWeight}}</div>
            <div class="table-cell">{{item.HasSendWeight}}</div>
            <div class="table-cell">{{item.CompleteRate}}</div>
          </div>
        </cell-box>
        <cell-box v-if="orderList.length>0">
          <div class="table-box" style="min-height: 38px;">
            <div class="table-cell-first" @click="$router.push('/orderplan?corpid=' + CorpID + '&year='+ currentYear)">查看更多</div>
          </div>
        </cell-box>
        <cell-box v-else>
          <div class="table-box" style="min-height: 38px;">
            <div class="table-cell-first">暂无数据</div>
          </div>
        </cell-box>
      </group>
    </div>
    <popup v-model="chooseYear" position="bottom" max-height="50%">
      <div class="table-box" style="margin-top: 15px;">
        <div class="table-cell-first">
          请选择年份
        </div>
      </div>
      <group>
        <cell-box v-for="item in yearList" :key="item">
          <div class="table-box" @click="currentYear=item;chooseYear=false;">
            <div class="table-cell-first">{{item+'年'}}</div>
          </div>
        </cell-box>
      </group>
    </popup>
    <br>
  </div>
</template>

<script>
// 引入echarts
import IEcharts from "vue-echarts-v3";
import "echarts/lib/chart/bar";
import {
  TransferDom,
  Popup,
  Group,
  Cell,
  CellBox,
  XTable,
  LoadMore,
  XHeader
} from "vux";

export default {
  components: {
    TransferDom,
    Popup,
    Group,
    Cell,
    CellBox,
    IEcharts,
    XTable,
    LoadMore,
    XHeader
  },
  data() {
    return {
      chooseYear: false,

      CorpID: this.$route.query.corpid ? this.$route.query.corpid : "1",

      Kanban: {
        ReceiverName: "",
        TotalOrderWeight: 0,
        TotalOrderNumber: 0,
        ExceptionNumber: 0,
        CompleteRate: "",
        CompleteWeight: 0,
        HighThanCompleteRate: "",
        ExceptionRate: "",
        HighThanExceptionRate: ""
      },

      currentYear: "",
      yearList: [],
      statisticsBarItem: "day",
      dayPlanList: [],
      monthPlanList: [],
      orderList: [],
      dayBar: {
        barWidth: "15px",
        grid: {
          top: "10%",
          left: "5%",
          right: "5%",
          bottom: "25%"
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
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 60
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false
          }
        ],
        dataZoom: [
          {
            show: true,
            type: "inside",
            startValue: 0,
            endValue: 5
          }
        ],
        series: [
          {
            name: "已发量",
            type: "bar",
            data: []
          },
          {
            name: "完成量",
            type: "bar",
            data: []
          }
        ],
        color: ["#afe6fe", "#28b7f7"]
      },
      monthBar: {
        barWidth: "15px",
        grid: {
          top: "10%",
          left: "5%",
          right: "5%",
          bottom: "20%"
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
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 60
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            show: false
          }
        ],
        dataZoom: [
          {
            show: true,
            type: "inside",
            startValue: 0,
            endValue: 5
          }
        ],
        series: [
          {
            name: "已发量",
            type: "bar",
            data: []
          },
          {
            name: "完成量",
            type: "bar",
            data: []
          }
        ],
        color: ["#afe6fe", "#28b7f7"]
      },
      orderPie: {
        tooltip: {
          trigger: "item",
          formatter: "{b} : <br/>{c} ({d}%)"
        },
        legend: {
          x: "center",
          y: "bottom",
          data: [],
          show: false
        },
        series: [
          {
            name: "详情",
            type: "pie",
            radius: ["30%", "60%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            data: []
          }
        ]
      }
    };
  },
  methods: {
    dayPlanDetail(item) {
      this.$webview.notice("电厂详情", {
        startTime: item.Time,
        endTime: item.Time,
        sendName: this.Kanban.ReceiverName,
        receiverId: parseInt(this.CorpID)
      });
    },
    monthPlanDetail(item) {
      var datetime = new Date(item.Time + "-01");
      var startTime = this.$utils.formateDate(datetime, "yyyy-MM-dd");
      datetime.setMonth(datetime.getMonth() + 1);
      datetime.setDate(datetime.getDate() - 1);
      var endTime = this.$utils.formateDate(datetime, "yyyy-MM-dd");
      this.$webview.notice("电厂详情", {
        startTime: startTime,
        endTime: endTime,
        sendName: this.Kanban.ReceiverName,
        receiverId: parseInt(this.CorpID)
      });
    },
    orderDetail(item) {
      this.$router.push(
        "/OrderDetails/basic?OrderId=" +
          item.OrderId +
          "&receiverId=" +
          this.CorpID
      );
    },
    loadYearOrders() {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      Promise.all([
        this.$service
          .get("/RecDelReport/GetElectricByConsignerDetailInfo", {
            CorpID: this.CorpID,
            year: this.currentYear
          })
          .then(res => {
            this.orderPie.legend.data = [];
            this.orderPie.series[0].data = [];
            for (var i = 0; i < res.Data.length; i++) {
              this.orderPie.legend.data.push(res.Data[i].ConsignerName);
              this.orderPie.series[0].data.push({
                value: res.Data[i].ContractWeight,
                name: res.Data[i].ConsignerName
              });
            }
          }),
        this.$service
          .get("/RecDelReport/GetElectricByOrderDetailInfo", {
            CorpID: this.CorpID,
            pageIndex: 0,
            pageSize: 5,
            year: this.currentYear
          })
          .then(res => {
            this.orderList = res.Data ? res.Data.OrderDetailInfo : [];
          })
      ])
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
        })
        .catch(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
        });
    }
  },
  watch: {
    currentYear(val) {
      this.loadYearOrders();
    }
  },
  mounted() {
    // this.$vux.loading.show();
    this.$webview.loading("show");
    Promise.all([
      this.$service
        .get("/RecDelReport/GetElectircDetailInfoTop", {
          CorpID: this.CorpID
        })
        .then(res => {
          this.Kanban = res.Data;
        }),
      this.$service
        .get("/RecDelReport/GetElectricDetailInfoByDayWithPage", {
          CorpID: this.CorpID,
          pageIndex: 0,
          pageSize: 999,
          dayNumber: 30
        })
        .then(res => {
          this.dayPlanList = res.Data;
          for (var i = 0; i < this.dayPlanList.length; i++) {
            this.dayBar.xAxis[0].data.push(this.dayPlanList[i].Time);
            this.dayBar.series[0].data.push(this.dayPlanList[i].HasSendWeight);
            this.dayBar.series[1].data.push(this.dayPlanList[i].CompleteWeight);
          }
        }),
      this.$service
        .get("/RecDelReport/GetElectricDetailInfoByMonthWithPage", {
          CorpID: this.CorpID,
          pageIndex: 0,
          pageSize: 999,
          monthNumber: 12
        })
        .then(res => {
          this.monthPlanList = res.Data;
          for (var i = 0; i < this.monthPlanList.length; i++) {
            this.monthBar.xAxis[0].data.push(this.monthPlanList[i].Time);
            this.monthBar.series[0].data.push(
              this.monthPlanList[i].HasSendWeight
            );
            this.monthBar.series[1].data.push(
              this.monthPlanList[i].CompleteWeight
            );
          }
        })
    ])
      .then(res => {
        this.$webview.loading("hide");        
        this.currentYear = this.$utils.formateDate(new Date(), "yyyy");
        this.yearList = [
          parseInt(this.currentYear),
          parseInt(this.currentYear) - 1 + "",
          parseInt(this.currentYear) - 2 + ""
        ];
      })
      .catch(res => {
        this.$webview.loading("hide");        
        this.currentYear = this.$utils.formateDate(new Date(), "yyyy");
        this.yearList = [
          parseInt(this.currentYear),
          parseInt(this.currentYear) - 1 + "",
          parseInt(this.currentYear) - 2 + ""
        ];
      });
  }
};
</script>

<style scoped lang="less">
.detail-index {
  font-size: 14px;
  background-color: #f1f2f6;
  .base-info {
    background-color: #28b8f7;
    text-align: center;
    padding: 0 15px 15px 15px;
    .content {
      background-color: white;
      border-radius: 5px;
      text-align: left;
      padding: 15px;
      .content-title {
        font-size: 16px;
        font-weight: bold;
      }
      .content-item-v-list {
        margin: 10px 0 10px 0;
        display: flex;
        .content-item-v-item {
          flex: 1;
          text-align: center;
          .v-item-amount {
            font-size: 18px;
            color: #2caffb;
          }
          .v-item-title {
            color: #666;
          }
        }
      }
      .content-item {
        color: #666;
        display: flex;
        .content-item-head {
          flex: 1;
          text-align: left;
        }
        .content-item-tail {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
  .statistics-bar {
    margin-top: 20px;
    text-align: left;
    background-color: white;
    padding-top: 10px;
    position: relative;
    .title-list {
      position: absolute;
      padding: 0 10px;
      z-index: 1;
      .title-item {
        display: inline-block;
        font-size: 15px;
        text-align: left;
        margin-right: 5px;
        border-bottom: solid 2px white;
      }
      .title-item.selected {
        font-weight: bold;
        border-bottom: solid 2px #2899f7;
      }
    }
    .echart-box {
      height: 300px;
    }
  }
  .statistics-table {
    background: #e8f8ff;
    padding: 0 10px;
  }
  .statistics-pie {
    margin-top: 20px;
    text-align: left;
    background-color: white;
    padding-top: 10px;
    position: relative;
    .title {
      padding: 0 10px;
      font-size: 15px;
      font-weight: bold;
    }
    .echart-box {
      height: 200px;
    }
  }
  .table-box {
    width: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    .table-cell {
      flex: 2;
      text-align: center;
      word-break: break-all;
    }
    .table-cell-first {
      flex: 3;
      text-align: center;
      word-break: break-all;
    }
  }
  .table-header {
    font-weight: bold;
  }
}
</style>
