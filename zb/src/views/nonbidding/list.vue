<style lang="less">
.nonbidding-content {
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
<div class="nonbidding-content">
    <Input v-model="searchValue" size="large" style="width: 350px;margin-bottom: 20px">
        <span slot="prepend">项目名称</span>
        <Button slot="append" @click="search()">搜索</Button>
    </Input>
    <Table :row-class-name="rowClassName" :columns="columns1" :no-data-text="nonbiddingLoading ? '' : '暂无数据'" :loading="nonbiddingLoading" :data="nonbiddingList" @on-row-click="openDetail" style="margin-bottom: 20px;border-left: none;"></Table>
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
      nonbiddingList: [],
      nonbiddingLoading: false,
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
    this.getnonbiddingList({});
  },
  methods: {
    search() {
      let params = {
        title: this.searchValue,
      };
      this.getnonbiddingList(params);
    },
    openDetail(data) {
      this.$router.push({path:"/nonbidding/detail",query: {id: data.id}});
    },
    getnonbiddingList(params) {
      let param = {
        title: params.title || "",
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 10
      };
      this.nonbiddingLoading =true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetNonInviteBidByTitle", {
          dto: param
        })
        .then(data => {
          this.nonbiddingLoading =false;
          this.total = data.result.totalCount;
          this.nonbiddingList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.nonbiddingList, i, data.result.items[i]);
          }
          this.nonbiddingList.map(function(item) {
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
      this.getnonbiddingList(params);
    },
    pageOnSizeChange(size) {
      this.pageSize = size;
      let params = {
        title: this.searchValue,
        pageIndex: 0,
        pageSize: size
      };
      this.getnonbiddingList(params);
    },
    rowClassName (row,index) {
      return "row-hover";
    }
  }
};
</script>
