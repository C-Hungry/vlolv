<style lang="less" scoped>
.analysis-container {
  .title {
    margin-bottom: 10px;
    clear: both;
    overflow: hidden;
    .title-left {
      font-size: 16px;
      font-weight: 800;
      float: left;
    }
    .title-right {
      float: right;
    }
  }
  .content {
    padding: 8px;
    background-color: #ffffff;
    margin-top: 10px;
    .table {
      .cell-active1 {
        background-color: #ff801b;
        color: #fff;
      }
      .cell-active2 {
        background-color: #28b8f6;
        color: #fff;
      }
      .vux-table:after {
        border-top: 1px solid #fff;
      }
      .vux-table td:after,
      .vux-table th:after {
        border-right: 1px solid #fff;
      }
      .vux-table td:before,
      .vux-table th:before {
        border-bottom: 1px solid #fff;
      }
    }
  }
}
</style>

<template>
    <div>
      <my-frame :routes="routes">
        <div slot="router-box">
          <div class="analysis-container">
            <div class="content">
              <div class="title">
                <div class="title-left">热量统计</div>
                <div class="title-right">单位：kcal</div>
              </div>
              <div class="table">
                <x-table :full-bordered="false" :cell-bordered="true" :content-bordered="true" style="background-color: #FDEBDA;">
                  <thead>
                    <tr style="font-weight: 800;">
                      <th>&nbsp;</th>
                      <th @click="getCalorificInfoByHour" :class="{'cell-active1': kcalType == 'day'}">当天</th>
                      <th @click="getCalorificInfoByDay" :class="{'cell-active1': kcalType == 'month'}">本月</th>
                      <th @click="getCalorificInfoByMonth" :class="{'cell-active1': kcalType == 'year'}">今年</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>计划</td>
                      <td style="width:27%;font-weight: 800" @click="getCalorificInfoByHour" :class="{'cell-active1': kcalType == 'day'}">{{kcalDetail.dayPlanNumber + ''|| '- -'}}</td>
                      <td style="width:27%;font-weight: 800" @click="getCalorificInfoByDay" :class="{'cell-active1': kcalType == 'month'}">{{kcalDetail.monthPlanNumber + '' || '- -'}}</td>
                      <td style="width:27%;font-weight: 800" @click="getCalorificInfoByMonth" :class="{'cell-active1': kcalType == 'year'}">{{kcalDetail.yearPlanNumber + '' || '- -'}}</td>
                    </tr>
                    <tr>
                      <td>已收</td>
                      <td style="font-weight: 800" @click="getCalorificInfoByHour" :class="{'cell-active1': kcalType == 'day'}">{{kcalDetail.dayCompleteNumber + '' || '- -'}}
                        <img style="vertical-align: middle;" v-if="kcalDetail.dayPlanNumber < kcalDetail.dayCompleteNumber" src="../../assets/up-red.png">
                        <img style="vertical-align: middle;" v-if="kcalDetail.dayPlanNumber > kcalDetail.dayCompleteNumber" src="../../assets/down-green.png">
                      </td>
                      <td style="font-weight: 800" @click="getCalorificInfoByDay" :class="{'cell-active1': kcalType == 'month'}">{{kcalDetail.monthCompleteNumber + '' || '- -'}}
                        <img style="vertical-align: middle;" v-if="kcalDetail.monthPlanNumber < kcalDetail.monthCompleteNumber" src="../../assets/up-red.png">
                        <img style="vertical-align: middle;" v-if="kcalDetail.monthPlanNumber > kcalDetail.monthCompleteNumber" src="../../assets/down-green.png">
                      </td>
                      <td style="font-weight: 800" @click="getCalorificInfoByMonth" :class="{'cell-active1': kcalType == 'year'}">{{kcalDetail.yearCompleteNumber + '' || '- -'}}
                        <img style="vertical-align: middle;" v-if="kcalDetail.yearPlanNumber < kcalDetail.yearCompleteNumber" src="../../assets/up-red.png">
                        <img style="vertical-align: middle;" v-if="kcalDetail.yearPlanNumber > kcalDetail.yearCompleteNumber" src="../../assets/down-green.png">
                      </td>
                    </tr>
                  </tbody>
                </x-table>
              </div>
              <div class="echart-container" style="width:100%;height:250px;">
                <IEcharts ref="myechart" :loading="kcalLoading" :option="kcalOption"></IEcharts>
              </div>
            </div>
            <div class="content" style="margin-bottom: 10px;">
              <div class="title">
                <div class="title-left">硫份统计</div>
                <div class="title-right">单位：%</div>
              </div>
              <div class="table">
                <x-table :full-bordered="false" :cell-bordered="true" :content-bordered="true" style="background-color: #DCF2FF;">
                  <thead>
                      <tr style="font-weight: 800;">
                          <th>&nbsp;</th>
                          <th @click="getSulphurInfoByHour" :class="{'cell-active2': sulphurType == 'day'}">当天</th>
                          <th @click="getSulphurInfoByDay" :class="{'cell-active2': sulphurType == 'month'}">本月</th>
                          <th @click="getSulphurInfoByMonth" :class="{'cell-active2': sulphurType == 'year'}">今年</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>计划</td>
                          <td style="width:27%;font-weight: 800" @click="getSulphurInfoByHour" :class="{'cell-active2': sulphurType == 'day'}">{{sulphurDetail.dayPlanNumber + '' || '- -'}}</td>
                          <td style="width:27%;font-weight: 800" @click="getSulphurInfoByDay" :class="{'cell-active2': sulphurType == 'month'}">{{sulphurDetail.monthPlanNumber + '' || '- -'}}</td>
                          <td style="width:27%;font-weight: 800" @click="getSulphurInfoByMonth" :class="{'cell-active2': sulphurType == 'year'}">{{sulphurDetail.yearPlanNumber + '' || '- -'}}</td>
                      </tr>
                      <tr>
                          <td>已收</td>
                          <td style="font-weight: 800" @click="getSulphurInfoByHour" :class="{'cell-active2': sulphurType == 'day'}">{{sulphurDetail.dayCompleteNumber + '' || '- -'}}
                            <img style="vertical-align: middle;" v-if="sulphurDetail.dayPlanNumber < sulphurDetail.dayCompleteNumber" src="../../assets/up-red.png">
                            <img style="vertical-align: middle;" v-if="sulphurDetail.dayPlanNumber > sulphurDetail.dayCompleteNumber" src="../../assets/down-green.png">
                          </td>
                          <td style="font-weight: 800" @click="getSulphurInfoByDay" :class="{'cell-active2': sulphurType == 'month'}">{{sulphurDetail.monthCompleteNumber + '' || '- -'}}
                            <img style="vertical-align: middle;" v-if="sulphurDetail.monthPlanNumber < sulphurDetail.monthCompleteNumber" src="../../assets/up-red.png">
                            <img style="vertical-align: middle;" v-if="sulphurDetail.monthPlanNumber > sulphurDetail.monthCompleteNumber" src="../../assets/down-green.png">
                          </td>
                          <td style="font-weight: 800" @click="getSulphurInfoByMonth" :class="{'cell-active2': sulphurType == 'year'}">{{sulphurDetail.yearCompleteNumber + '' || '- -'}}
                            <img style="vertical-align: middle;" v-if="sulphurDetail.yearPlanNumber < sulphurDetail.yearCompleteNumber" src="../../assets/up-red.png">
                            <img style="vertical-align: middle;" v-if="sulphurDetail.yearPlanNumber > sulphurDetail.yearCompleteNumber" src="../../assets/down-green.png">
                          </td>
                      </tr>
                  </tbody>
                </x-table>
              </div>
              <div class="echart-container" style="width:100%;height:250px;">
                <IEcharts ref="mychart" :loading="sulphurLoading" :option="sulphurOption"></IEcharts>
              </div>
            </div>
          </div>
        </div>
      </my-frame>
    </div>
</template>

<script>
import { XTable } from "vux";
import IEcharts from "vue-echarts-v3";
import "echarts/lib/chart/bar";
import myFrame from "../../components/myFrame";

export default {
  components: {
    XTable,
    IEcharts,
    myFrame
  },
  data() {
    return {
      kcalType: "day",
      kcalData: {}, //echarts
      kcalLoading: false, //echarts
      kcalDetail: {
        dayPlanNumber: 0,
        dayCompleteNumber: 0,
        monthPlanNumber: 0,
        monthCompleteNumber: 0,
        yearPlanNumber: 0,
        yearCompleteNumber: 0
      },
      kcalOption: {}, //echarts
      sulphurType: "day",
      sulphurData: {}, //echarts
      sulphurLoading: false, //echarts
      sulphurDetail: {
        dayPlanNumber: 0,
        dayCompleteNumber: 0,
        monthPlanNumber: 0,
        monthCompleteNumber: 0,
        yearPlanNumber: 0,
        yearCompleteNumber: 0
      },
      sulphurOption: {}, //echarts
      routes: [
        {
          title: this.$route.query.name + "煤质动态",
          path: "/coalAnalysisDetail"
        }
      ]
    };
  },
  methods: {
    isInteger(num) {
      // 将数值转化为两位小数
      return Number.isInteger(num) ? num : Number(num.toFixed(2));
    },
    compare(property) {
      // 数组对象排序
      return function(obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return value1 - value2; // 升序
      };
    },
    showToast(msg = "获取图表信息失败") {
      this.$vux.toast.text(msg, "middle");
    },
    getCalorificInfo() {
      // 获取各个电厂煤质统计信息
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$service
        .get("/RecDelReport/GetCalorificInfo", { corpID: this.$route.query.id })
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          for (let i = 0; i < res.Data.length; i++) {
            let PlanNumber = this.isInteger(res.Data[i].PlanNumber);
            let CompleteNumber = this.isInteger(res.Data[i].CompleteNumber);
            if (res.Data[i].status == 1) {
              this.kcalDetail.dayPlanNumber = PlanNumber;
              this.kcalDetail.dayCompleteNumber = CompleteNumber;
            } else if (res.Data[i].status == 2) {
              this.kcalDetail.monthPlanNumber = PlanNumber;
              this.kcalDetail.monthCompleteNumber = CompleteNumber;
            } else {
              this.kcalDetail.yearPlanNumber = PlanNumber;
              this.kcalDetail.yearCompleteNumber = CompleteNumber;
            }
          }
        })
        .catch(err => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.showToast("获取热量统计信息失败");
        });
    },
    getCalorificInfoByHour() {
      // 根据小时获取煤质发热量信息
      if (this.kcalLoading) {
        return;
      }
      this.$refs.myechart.clear();
      this.kcalLoading = true;
      this.kcalType = "day";
      this.$service
        .get("/RecDelReport/GetCalorificInfoByHour", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.kcalLoading = false;
          let xAxisData = this.hours;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let kcalData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getHours();
          for (let i = 0; i < length; i++) {
            kcalData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initKcalEchart(
            xAxisData,
            kcalData,
            target,
            this.hoursXAxis.startValue,
            this.hoursXAxis.endValue
          );
        })
        .catch(err => {
          this.kcalLoading = false;
          this.showToast();
        });
    },
    getCalorificInfoByDay() {
      // 根据天数获取煤质发热量信息
      if (this.kcalLoading) {
        return;
      }
      this.$refs.myechart.clear();
      this.kcalLoading = true;
      this.kcalType = "month";
      this.$service
        .get("/RecDelReport/GetCalorificInfoByDay", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.kcalLoading = false;
          let xAxisData = this.days;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let kcalData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getDate();
          for (let i = 0; i < length; i++) {
            kcalData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initKcalEchart(
            xAxisData,
            kcalData,
            target,
            this.daysXAxis.startValue,
            this.daysXAxis.endValue
          );
        })
        .catch(err => {
          this.kcalLoading = false;
          this.showToast();
        });
    },
    getCalorificInfoByMonth() {
      // 根据月份获取煤质发热量信息
      if (this.kcalLoading) {
        return;
      }
      this.$refs.myechart.clear();
      this.kcalLoading = true;
      this.kcalType = "year";
      this.$service
        .get("/RecDelReport/GetCalorificInfoByMonth", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.kcalLoading = false;
          let xAxisData = this.months;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let kcalData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getMonth() + 1;
          for (let i = 0; i < length; i++) {
            kcalData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initKcalEchart(
            xAxisData,
            kcalData,
            target,
            this.monthsXAxis.startValue,
            this.monthsXAxis.endValue
          );
        })
        .catch(err => {
          this.kcalLoading = false;
          this.showToast();
        });
    },
    getSulphurInfo() {
      // 获取各个电厂煤质统计信息
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$service
        .get("/RecDelReport/GetSulphurInfo", { corpID: this.$route.query.id })
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          for (let i = 0; i < res.Data.length; i++) {
            let PlanNumber = this.isInteger(res.Data[i].PlanNumber);
            let CompleteNumber = this.isInteger(res.Data[i].CompleteNumber);
            if (res.Data[i].status == 1) {
              this.sulphurDetail.dayPlanNumber = PlanNumber;
              this.sulphurDetail.dayCompleteNumber = CompleteNumber;
            } else if (res.Data[i].status == 2) {
              this.sulphurDetail.monthPlanNumber = PlanNumber;
              this.sulphurDetail.monthCompleteNumber = CompleteNumber;
            } else {
              this.sulphurDetail.yearPlanNumber = PlanNumber;
              this.sulphurDetail.yearCompleteNumber = CompleteNumber;
            }
          }
        })
        .catch(err => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.showToast("获取硫份统计信息失败");
        });
    },
    getSulphurInfoByHour() {
      // 根据小时获取煤质发热量信息
      if (this.sulphurLoading) {
        return;
      }
      this.$refs.mychart.clear();
      this.sulphurLoading = true;
      this.sulphurType = "day";
      this.$service
        .get("/RecDelReport/GetSulphurInfoByHour", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.sulphurLoading = false;
          let xAxisData = this.hours;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let sulphurData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getHours();
          for (let i = 0; i < length; i++) {
            sulphurData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initSulphurEchart(
            xAxisData,
            sulphurData,
            target,
            this.hoursXAxis.startValue,
            this.hoursXAxis.endValue
          );
        })
        .catch(err => {
          this.sulphurLoading = false;
          this.showToast();
        });
    },
    getSulphurInfoByDay() {
      // 根据天数获取煤质硫份信息
      if (this.sulphurLoading) {
        return;
      }
      this.$refs.mychart.clear();
      this.sulphurLoading = true;
      this.sulphurType = "month";
      this.$service
        .get("/RecDelReport/GetSulphurInfoByDay", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.sulphurLoading = false;
          let xAxisData = this.days;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let sulphurData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getDate();
          for (let i = 0; i < length; i++) {
            sulphurData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initSulphurEchart(
            xAxisData,
            sulphurData,
            target,
            this.daysXAxis.startValue,
            this.daysXAxis.endValue
          );
        })
        .catch(err => {
          this.sulphurLoading = false;
          this.showToast();
        });
    },
    getSulphurInfoByMonth() {
      // 根据月份获取煤质硫份信息
      if (this.sulphurLoading) {
        return;
      }
      this.$refs.mychart.clear();
      this.sulphurLoading = true;
      this.sulphurType = "year";
      this.$service
        .get("/RecDelReport/GetSulphurInfoByMonth", {
          corpID: this.$route.query.id
        })
        .then(res => {
          this.sulphurLoading = false;
          let xAxisData = this.months;
          let target = this.isInteger(res.Data[0].PlanNumber);
          let sulphurData = [];
          let sortedData = res.Data.sort(this.compare("status"));
          let length = new Date().getMonth() + 1;
          for (let i = 0; i < length; i++) {
            sulphurData.push(this.isInteger(sortedData[i].CompleteNumber));
          }
          this.initSulphurEchart(
            xAxisData,
            sulphurData,
            target,
            this.monthsXAxis.startValue,
            this.monthsXAxis.endValue
          );
        })
        .catch(err => {
          this.sulphurLoading = false;
          this.showToast();
        });
    },
    initKcalEchart(xAxisData, kcalData, target, startValue, endValue) {
      // 初始化发热量柱状图
      /**
       *xAxisData  x轴数据
       *kcalData  发热量柱状图数据
       *target  计划量
       *startValue  x轴起始刻度值
       *endValue  x轴结束刻度值
       */
      let option = {
        color: ["#FE801A", "#d81e06"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "5%",
          height: 160,
          containLabel: true
        },
        legend: {
          right: "5%",
          top: 20,
          selectedMode: false,
          data: [
            {
              name: "已收热量"
            },
            {
              name: "计划热量",
              icon:
                "path://M992 544 32 544c-17.664 0-32-14.304-32-32 0-17.664 14.336-32 32-32l960 0c17.696 0 32 14.336 32 32C1024 529.696 1009.696 544 992 544z"
            }
          ]
        },
        xAxis: [
          {
            type: "category",
            data: xAxisData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0
            }
          }
        ],
        dataZoom: [
          {
            show: false,
            type: "inside",
            startValue: startValue,
            endValue: endValue
          }
        ],
        yAxis: [
          {
            splitNumber: 6,
            type: "value",
            max: 6000
          }
        ],
        series: [
          {
            name: "已收热量",
            type: "bar",
            barWidth: "55%",
            data: kcalData
          },
          {
            name: "计划热量",
            type: "line",
            markLine: {
              silent: true,
              animation: false,
              symbol: ["circle", ""],
              label: {
                normal: {
                  show: true,
                  position: "middle"
                }
              },
              data: [
                {
                  yAxis: target,
                  lineStyle: {
                    normal: {
                      type: "solid",
                      width: 1,
                      color: "#d81e06"
                    }
                  }
                }
              ]
            }
          }
        ]
      };
      this.kcalOption = option;
    },
    initSulphurEchart(xAxisData, sulphurData, target, startValue, endValue) {
      // 初始化硫份柱状图
      /**
       *xAxisData  x轴数据
       *kcalData  发热量柱状图数据
       *target  计划量
       *startValue  x轴起始刻度值
       *endValue  x轴结束刻度值
       */
      let option = {
        color: ["#94e0fc", "#d81e06"],
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "5%",
          height: 160,
          containLabel: true
        },
        legend: {
          right: 0,
          top: 20,
          selectedMode: false,
          data: [
            {
              name: "已收硫份"
            },
            {
              name: "计划硫份",
              icon:
                "path://M992 544 32 544c-17.664 0-32-14.304-32-32 0-17.664 14.336-32 32-32l960 0c17.696 0 32 14.336 32 32C1024 529.696 1009.696 544 992 544z"
            }
          ]
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: xAxisData,
            axisLabel: {
              interval: 0
            }
          }
        ],
        dataZoom: [
          {
            show: false,
            type: "inside",
            startValue: startValue,
            endValue: endValue
          }
        ],
        yAxis: [
          {
            splitNumber: 3,
            type: "value",
            max: 3,
            axisLabel: {
              formatter: value => {
                return value == 0 ? 0 : value + "%";
              }
            }
          }
        ],
        series: [
          {
            name: "已收硫份",
            type: "line",
            stack: "总量",
            smooth: true,
            areaStyle: { normal: {} },
            data: sulphurData,
            lineStyle: {
              normal: {
                color: "#03b6f8"
              }
            }
          },
          {
            name: "计划硫份",
            type: "line",
            markLine: {
              silent: true,
              animation: false,
              symbol: ["circle", ""],
              label: {
                normal: {
                  show: true,
                  position: "middle",
                  formatter: () => {
                    return arguments[2] == 0 ? 0 : arguments[2] + "%";
                  }
                }
              },
              data: [
                {
                  yAxis: target,
                  lineStyle: {
                    normal: {
                      type: "solid",
                      width: 1,
                      color: "#d81e06"
                    }
                  }
                }
              ]
            }
          }
        ]
      };
      this.sulphurOption = option;
    }
  },
  computed: {
    hours() {
      // 获取每日24小时
      let hours = [];
      for (let i = 0; i < 24; i++) {
        hours.push(i + 1 + "时");
      }
      return hours;
    },
    days() {
      // 获取当月的天数
      let days = [];
      let now = new Date();
      let nowMonth = now.getMonth();
      let nowYear = now.getYear(); //当前年
      let monthStartDate = new Date(nowYear, nowMonth, 1);
      let monthEndDate = new Date(nowYear, nowMonth + 1, 1);
      let daysNum = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

      for (let i = 0; i < daysNum; i++) {
        days.push(i + 1 + "号");
      }

      return days;
    },
    months() {
      // 获取每年12个月
      let months = [];
      for (let i = 0; i < 12; i++) {
        months.push(i + 1 + "月");
      }
      return months;
    },
    hoursXAxis() {
      // 获取x轴按小时显示时的居中刻度
      let nowHour = new Date().getHours();
      let startValue = 0;
      let endValue = 0;
      if (nowHour <= 9) {
        startValue = 0;
        endValue = 8;
      } else {
        startValue = nowHour - 9;
        endValue = nowHour - 1;
      }
      return {
        startValue: startValue,
        endValue: endValue
      };
    },
    daysXAxis() {
      // 获取x轴按天数显示时的居中刻度
      let nowDate = new Date().getDate();
      let startValue = 0;
      let endValue = 0;
      let median = this.days.length - 8;
      if (nowDate <= 9) {
        startValue = 0;
        endValue = 8;
      } else {
        startValue = nowDate - 9;
        endValue = nowDate - 1;
      }
      return {
        startValue: startValue,
        endValue: endValue
      };
    },
    monthsXAxis() {
      // 获取x轴按月份显示时的居中刻度
      let nowMonth = new Date().getMonth();
      let startValue = 0;
      let endValue = 0;
      if (nowMonth <= 9) {
        startValue = 0;
        endValue = 8;
      } else {
        startValue = nowMonth - 8;
        endValue = nowMonth;
      }
      return {
        startValue: startValue,
        endValue: endValue
      };
    }
  },
  mounted() {
    this.getCalorificInfo();
    this.getCalorificInfoByHour();
    this.getSulphurInfo();
    this.getSulphurInfoByHour();
  }
};
</script>