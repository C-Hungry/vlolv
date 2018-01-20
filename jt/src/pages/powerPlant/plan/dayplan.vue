<template>
  <div class="detail-index">
    <myFrame :routes="routes">
      <div slot="router-box">
        <group>
          <cell-box>
            <div class="table-box table-header">
              <div class="table-cell-first">时间</div>
              <div class="table-cell">计划量</div>
              <div class="table-cell">已发</div>
              <div class="table-cell">完成</div>
            </div>
          </cell-box>
          <cell-box v-for="item in dayPlanList" :key="item.Time" is-link>
            <div class="table-box" @click="dayPlanDetail(item)">
              <div class="table-cell-first">{{item.Time}}</div>
              <div class="table-cell">{{item.FPValue}}</div>
              <div class="table-cell">{{item.HasSendWeight}}</div>
              <div class="table-cell">{{item.CompleteWeight}}</div>
            </div>
          </cell-box>
          <cell-box v-if="dayPlanList.length<totalCount">
            <div class="table-box">
              <div class="table-cell-first" @click="LoadMore()">查看更多</div>
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

      Kanban: {
        ReceiverName: ""
      },

      dayPlanList: [],
      totalCount: 0,
      currentCount: 10,
      routes: [
        {
          path: "/dayplan",
          title: "日统计"
        }
      ]
    };
  },
  methods: {
    query() {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$service
        .get("/RecDelReport/GetElectricDetailInfoByDayWithPage", {
          CorpID: this.CorpID,
          pageIndex: 0,
          pageSize: this.currentCount,
          dayNumber: 999
        })
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.dayPlanList = res.Data;
          this.totalCount = res.TotalCount;
        });
    },
    LoadMore() {
      this.currentCount += 10;
      this.query();
    },
    dayPlanDetail(item) {
      this.$webview.notice("电厂详情", {
        startTime: item.Time,
        endTime: item.Time,
        sendName: this.Kanban.ReceiverName,
        receiverId: parseInt(this.CorpID)
      });
    }
  },
  mounted() {
    this.query();

    this.$service
      .get("/RecDelReport/GetElectircDetailInfoTop", {
        CorpID: this.CorpID
      })
      .then(res => {
        this.Kanban = res.Data;
      });
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
