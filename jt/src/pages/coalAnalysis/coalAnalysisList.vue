<style lang="less" scoped>
.analysis-container {
  background-color: #ffffff;
  padding: 8px;
  margin-top: 50px;
  .title {
    text-align: left;
    font-size: 16px;
    font-weight: 800;
    margin-bottom: 10px;
  }
  .table {
    .cell-active {
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
.no-data,
.data-failed {
  color: #757575;
  text-align: center;
  margin-top: 165px;
}
</style>

<template>
  <div>
    <my-frame :routes="routes">
      <div slot="router-box">
        <tab :line-width=2 active-color="#28B8F7" custom-bar-width="80px" v-model="tabIndex" style="position: fixed;top:46px;width:100%;z-index:100">
          <tab-item class="vux-center" v-for="(item, index) in tabList" @on-item-click="tabChange(index)" :key="index">{{item}}</tab-item>
        </tab>
        <div class="analysis-container" v-if="!isloadingFailed && !loading && filialeList.length > 0">
          <div class="title">
            煤质统计
          </div>
          <div class="table">
            <x-table :full-bordered="false" :cell-bordered="true" :content-bordered="true" style="background-color:#DCF2FF;">
              <thead>
                <tr style="font-weight: 800;">
                  <th style="min-width:100px;">电厂名称</th>
                  <th>&nbsp;</th>
                  <th>热值(kcal)</th>
                  <th>硫份(%)</th>
                </tr>
              </thead>
              <tbody v-for="(item,index) in filialeList" :key="index" @click="openDetail(item.CorpID,item.CorpName,index)" :class="{'cell-active': activeIndex == index}">
                <tr>
                  <td rowspan="2" style="font-weight: 800">{{ item.CorpName.length > 4 ? item.CorpName.substring(0,4) + '...' : item.CorpName}}</td>
                  <td>计划</td>
                  <td style="font-weight: 800">{{item.PlanCalorific  + '' || '- -'}}</td>
                  <td style="font-weight: 800">{{item.PlanSulphur  + '' || '- -'}}</td>
                </tr>
                <tr>
                  <td>实收</td>
                  <td style="font-weight: 800">{{item.ActualCalorific  + '' || '- -'}}
                    <img style="vertical-align: middle;" v-if="item.PlanCalorific < item.ActualCalorific" src="../../assets/up-red.png">
                    <img style="vertical-align: middle;" v-if="item.PlanCalorific > item.ActualCalorific" src="../../assets/down-green.png">
                  </td>
                  <td style="font-weight: 800">{{item.ActualSulphur  + '' || '- -'}}
                    <img style="vertical-align: middle;" v-if="item.PlanSulphur < item.ActualSulphur" src="../../assets/up-red.png">
                    <img style="vertical-align: middle;" v-if="item.PlanSulphur > item.ActualSulphur" src="../../assets/down-green.png">
                  </td>
                </tr>
              </tbody>
            </x-table>
          </div>
        </div>
        <div class="no-data" v-if="!isloadingFailed && !loading && filialeList.length == 0">
          <img style="width:70px;" src="../../assets/icon_special_nodata.png" alt="no-data"/><br />
          <span>暂无数据</span>
        </div>
        <div class="data-failed" v-if="isloadingFailed">
          <img style="width:70px;" src="../../assets/icon_special_failure.png" alt="failed"/><br />
          <span>加载失败</span><br />
          <x-button style="width:110px;color:#3BA1F4;border:1px solid #3BA1F4;margin-top:4px;" :mini="true" :plain="true" action-type="button" @click.native="getFilialeList(tabIndex + 1)">重新加载</x-button>
        </div>
      </div>
    </my-frame>
  </div>
</template>

<script>
import { Tab, TabItem, XTable, LoadMore, Sticky, XButton } from "vux";
import myFrame from "../../components/myFrame";
import config from "../../config/config";
import { getToken } from "../../config/utils";

export default {
  components: {
    XTable,
    XButton,
    LoadMore,
    Tab,
    TabItem,
    Sticky,
    myFrame
  },
  data() {
    return {
      loading: true,
      isloadingFailed: false,
      tabIndex: 0,
      currentIndex: 0,
      tabList: ["当日", "本月", "今年"],
      activeIndex: -1,
      filialeList: [], //分公司统计列表
      routes: [
        {
          title: "各电厂煤质统计",
          path: "/coalAnalysisList"
        }
      ]
    };
  },
  methods: {
    isInteger(num) {
      return Number.isInteger(num) ? num : Number(num.toFixed(2));
    },
    tabChange(index) {
      if (this.currentIndex == index) {
        return;
      } else {
        this.currentIndex = index;
        this.getFilialeList(index + 1);
      }
    },
    getFilialeList(status = 1) {
      this.loading = true;
      this.isloadingFailed = false;
      // this.$vux.loading.show();
      this.$webview.loading("show");
      // 获取各个电厂煤质统计信息
      this.$service
        .get("/RecDelReport/GetMediumInfo", { status: status })
        .then(res => {
          this.loading = false;
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.filialeList = [];
          for (let i = 0; i < res.Data.length; i++) {
            this.filialeList.push({
              CorpID: res.Data[i].CorpID,
              CorpName: res.Data[i].CorpName,
              PlanCalorific: this.isInteger(res.Data[i].PlanCalorific),
              ActualCalorific: this.isInteger(res.Data[i].ActualCalorific),
              PlanSulphur: this.isInteger(res.Data[i].PlanSulphur),
              ActualSulphur: this.isInteger(res.Data[i].ActualSulphur)
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.isloadingFailed = true;
          this.$webview.loading("hide");
          // this.$vux.loading.hide();
        });
    },
    openDetail(id, name, index) {
      if (id == -1) {
        return;
      }
      this.activeIndex = index;
      setTimeout(() => {
        this.$router.push({
          path: "/coalAnalysisDetail",
          query: {
            id: id,
            name: name
          }
        });
      }, 100);
    }
  },
  mounted() {
    if (getToken("sid")) {
      this.getFilialeList();
    } else {
      this.$vux.alert.show({
        title: "提示",
        content: "获取当前登录用户信息失败",
        buttonText: "关闭"
      });
      this.loading = false;
      this.isloadingFailed = true;
    }
  }
};
</script>
