<style lang="less">
.bidding-content {
  width: 100%;
  min-height: 667px;
  padding-bottom: 18px;
  .ivu-table .bidded-col {
    background-image: url("../../images/bidded.png");
    background-size: 100% 100%;
  }
  .ivu-table:after {
    width: 0 !important;
  }
  .row-hover:hover {
    cursor: pointer;
  }
}
</style>
<template>
<div class="bidding-content">
    <Input v-model="searchValue" size="large" style="width: 350px;margin-bottom: 20px">
        <span slot="prepend">项目名称</span>
        <Button slot="append" @click="search()">搜索</Button>
    </Input>
    <Table :row-class-name="rowClassName" :no-data-text="biddingLoading ? '' : '暂无数据'" :loading="biddingLoading" :columns="columns1" :data="biddingList" @on-row-click="openDetail" style="margin-bottom: 20px;border-left: none;"></Table>
    <Page @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange" :page-size="pageSize" show-total show-sizer :total="total" :current="pageIndex" show-elevator align='right'></Page>
</div>
</template>
<script>
import { DateManager } from "../../config/util";
import { getColorByCode } from "../../common/tools";
export default {
  data() {
    return {
      total: 0,
      biddingList: [],
      biddingLoading: false,
      searchValue: "",
      pageIndex: 1,
      pageSize: 10,
      columns1: [
        {
          title: "项目名称",
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
      ]
    };
  },
  mounted() {
    this.getbiddingList({});
  },
  methods: {
    search() {
      let params = {
        title: this.searchValue,
      };
      this.getbiddingList(params);
    },
    openDetail(data) {
      this.$router.push({path:"/bidding/detail",query: {id: data.id}});
    },
    getbiddingList(params) {
      let param = {
        title: params.title || "",
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 10
      };
      this.biddingLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetInviteBidByTitle", {
          dto: param
        })
        .then(data => {
          this.biddingLoading = false;
          this.total = data.result.totalCount;
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
    pageOnChange(index) {
      this.pageIndex = index;
      let params = {
        title: this.searchValue,
        pageIndex: index - 1,
        pageSize: this.pageSize
      };
      this.getbiddingList(params);
    },
    pageOnSizeChange(size) {
      this.pageSize = size;
      let params = {
        title: this.searchValue,
        pageIndex: 0,
        pageSize: size
      };
      this.getbiddingList(params);
    },
    rowClassName (row,index) {
      return "row-hover";
    }
  }
};
</script>
