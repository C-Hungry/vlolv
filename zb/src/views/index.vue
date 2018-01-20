<style lang="less">
.page-index {
  min-height: 380px;
  .container {
    margin-top: 20px;
    position: relative;
    .more {
      position: absolute;
      top: 18px;
      right: 25px;
      font-size: 15px;
      font-weight: bolder;
    }
    .more:hover {
      color: #0097ff;
      cursor: pointer;
    }
  }
  .index span.selected {
    color: red !important;
  }
  .row-hover:hover {
    cursor: pointer;
  }
}
</style>
<template>
    <div class="page-index">
        <div class="container">
            <account-tab :titles="['招标公告','非招标公告']" current="招标公告" v-on:onSelectionChanged="onSelectionChanged"></account-tab>
            <Table :row-class-name="rowClassName" v-if="current=='招标公告'" :no-data-text="biddingLoading ? '' : '暂无数据'" :loading="biddingLoading" @on-row-click="openDetail" :columns="columns" :show-header='false' :data="biddingList"></Table>
            <Table :row-class-name="rowClassName" v-if="current=='非招标公告'" :no-data-text="nonbiddingLoading ? '' : '暂无数据'" :loading="nonbiddingLoading" @on-row-click="openDetail2" :columns="columns" :show-header='false' :data="nonBiddingList"></Table>
            <div class="more" @click="knowmore()">查看更多 >></div>
        </div>
        <div class="container">
            <account-tab :titles="['中标公示']" current="中标公示"></account-tab>
            <div class="more" @click="knowmore2()">查看更多 >></div>
            <Table :row-class-name="rowClassName" :columns="columns2" :no-data-text="biddedLoading ? '' : '暂无数据'" :loading="biddedLoading" @on-row-click="openDetail3" :show-header='false' :data="biddedList"></Table>
        </div>
    </div>
</template>
<script>
import AccountTab from "../components/account-tab.vue";
import { DateManager } from "../config/util";
import { getColorByCode } from "../common/tools";
export default {
  components: {
    AccountTab
  },
  data() {
    return {
      current: "招标公告",
      biddedList: [],
      biddingList: [],
      nonBiddingList: [],
      biddingLoading: false,
      nonbiddingLoading: false,
      biddedLoading:false,
      columns: [
        {
          title: "公司名称",
          key: "title"
        },
        {
          title: "投标状态",
          key: "status",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "record",
                  size: 3,
                  color: params.row.color
                }
              }),
              h(
                "span",
                {
                  style: {
                    color: params.row.color,
                    paddingLeft: "8px"
                  }
                },
                params.row.statusName
              )
            ]);
          }
        },
        {
          title: "时间",
          key: "publishTime",
          width: 120
        }
      ],
      columns2: [
        {
          title: "中标公示",
          key: "title"
        },
        {
          title: "时间",
          key: "publicityTime",
          width: 120
        }
      ]
    };
  },
  mounted() {
    let params = {
      title: "",
      pageIndex: 0,
      pageSize: 5
    };
    this.getBiddedList(params);
    this.getBiddingList(params);
    this.getnonBiddingList(params);
  },
  methods: {
    onSelectionChanged(title) {
      this.current = title;
    },
    knowmore() {
        if (this.current == "招标公告") {
            this.$router.push("/bidding/list");
        } else {
            this.$router.push("/nonbidding/list");
        }
    },
    knowmore2 () {
        this.$router.push("/bidded/list")
    },
    openDetail (data) {
        this.$router.push({path:"/bidding/detail",query: {id: data.id}})
    },
    openDetail2 (data) {
        this.$router.push({path:"/nonbidding/detail",query: {id: data.id}})
    },
    openDetail3 (data) {
        this.$router.push({path:"/bidded/detail",query: {id: data.id}})
    },
    getBiddedList(params) {
      this.biddedLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetWinBidByTitle", {
          dto: params
        })
        .then(data => {
          this.biddedLoading = false;
          this.biddedList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.biddedList, i, data.result.items[i]);
          }
          this.biddedList.map(function(item) {
            item.publicityTime = DateManager.formatDate(
              new Date(item.publicityTime)
            );
          });
        });
    },
    getBiddingList(params) {
      this.biddingLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetInviteBidByTitle", {
          dto: params
        })
        .then(data => {
          this.biddingLoading = false;
          this.biddingList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.biddingList, i, data.result.items[i]);
          }
          this.biddingList.map(function(item) {
            item.publishTime = DateManager.formatDate(
              new Date(item.publishTime)
            );
            item = getColorByCode(item);
            return item;
          });
        });
    },
    getnonBiddingList(params) {
      this.nonbiddingLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetNonInviteBidByTitle", {
          dto: params
        })
        .then(data => {
          this.nonbiddingLoading =false;
          this.nonBiddingList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.nonBiddingList, i, data.result.items[i]);
          }
          this.nonBiddingList.map(function(item) {
            item.publishTime = DateManager.formatDate(
              new Date(item.publishTime)
            );
            item = getColorByCode(item);
            return item;
          });
        });
    },
    rowClassName (row,index) {
      return "row-hover";
    }
  }
};
</script>