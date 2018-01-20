<template>
  <div class="detail-index">
    <myFrame :routes="routes">
      <div slot="router-box">
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
          <cell-box v-if="orderList.length<totalCount">
            <div class="table-box" style="min-height: 38px;">
              <div class="table-cell-first" @click="LoadMore()">查看更多</div>
            </div>
          </cell-box>
          <cell-box v-if="orderList.length==0">
            <div class="table-box" style="min-height: 38px;">
              <div class="table-cell-first">暂无数据</div>
            </div>
          </cell-box>
        </group>
        <br>
      </div>
    </myFrame>
  </div>
</template>

<script>
import myFrame from "../../../components/myFrame.vue";
import { Group, CellBox, LoadMore } from "vux";

export default {
  components: {
    myFrame,
    Group,
    CellBox,
    LoadMore
  },
  data() {
    return {
      CorpID: this.$route.query.corpid ? this.$route.query.corpid : "1",

      currentYear: this.$route.query.year ? this.$route.query.year : "2017",

      orderList: [],
      totalCount: 0,
      currentCount: 10,
      routes: [
        {
          path: "/orderplan",
          title: "订单统计"
        }
      ]
    };
  },
  watch: {
    currentYear(val) {
      this.query();
    }
  },
  methods: {
    orderDetail(item) {
      this.$router.push("/OrderDetails/basic?OrderId=" + item.OrderId);
    },
    query() {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$service
        .get("/RecDelReport/GetElectricByOrderDetailInfo", {
          CorpID: this.CorpID,
          pageIndex: 0,
          pageSize: this.currentCount,
          year: this.currentYear
        })
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.orderList = res.Data.OrderDetailInfo;
          this.totalCount = res.Data.TotalCount;
        });
    },
    LoadMore() {
      this.currentCount += 10;
      this.query();
    }
  },
  mounted() {
    this.query();
  }
};
</script>

<style scoped lang="less">
.detail-index {
  font-size: 14px;
  background-color: #f1f2f6;

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
