<style lang="less">
.bidded-content {
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
<div class="bidded-content">
    <Input v-model="searchValue" size="large" style="width: 350px;margin-bottom: 20px">
        <span slot="prepend">项目名称</span>
        <Button slot="append" @click="search()">搜索</Button>
    </Input>
    <Table :row-class-name="rowClassName" :no-data-text="biddedLoading ? '' : '暂无数据'" :loading="biddedLoading" :columns="columns1" :data="biddedList" @on-row-click="openDetail" style="margin-bottom: 20px;border-left: none;"></Table>
    <Page @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange" :page-size="pageSize" show-total show-sizer :total="total" :current="pageIndex" show-elevator align='right'></Page>
</div>
</template>
<script>
import { DateManager } from "../../config/util";
export default {
  data() {
    return {
      total: 0,
      biddedList: [],
      biddedLoading: false,
      searchValue: "",
      pageIndex: 1,
      pageSize: 10,
      columns1: [
        {
          title: "项目名称",
          key: "title"
        },
        {
          title: "时间",
          width: 200,
          key: "publicityTime"
        }
      ]
    };
  },
  mounted() {
    this.getbiddedList({});
  },
  methods: {
    search() {
      let params = {
        title: this.searchValue,
      };
      this.getbiddedList(params);
    },
    openDetail(data) {
      this.$router.push({path:"/bidded/detail",query: {id: data.id}});
    },
    getbiddedList(params) {
      let param = {
        title: params.title || "",
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 10
      };
      this.biddedLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetWinBidByTitle", {
          dto: param
        })
        .then(data => {
          this.biddedLoading = false;
          this.total = data.result.totalCount;
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
    pageOnChange(index) {
      this.pageIndex = index;
      let params = {
        title: this.searchValue,
        pageIndex: index - 1,
        pageSize: this.pageSize
      };
      this.getbiddedList(params);
    },
    pageOnSizeChange(size) {
      this.pageSize = size;
      let params = {
        title: this.searchValue,
        pageIndex: 0,
        pageSize: size
      };
      this.getbiddedList(params);
    },
    rowClassName (row,index) {
      return "row-hover";
    }
  }
};
</script>
