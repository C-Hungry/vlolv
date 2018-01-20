<style lang="less">
.bidding {
  .content {
    border: solid 1px #c8e1fe;
    padding: 5px;
    min-height: 635px;
  }
  .bidding-search {
    padding-bottom: 5px;
  }
  .pages {
    margin-right: 10px;
  }
}
</style>
<template>
    <div class="bidding">
        <account-title title="我的招标"></account-title>
        <div class="content">
            <div class="bidding-search">
                <Input v-model="searchValue" style="width: 200px;" class="biddedValues" placeholder="请输入"></Input>
                <Select v-model="searchType" style="width:150px">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select v-model="searchState" style="width:150px">
                    <Option v-for="item in allStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Button type="primary" icon="ios-search" @click="search">搜索</Button>
                <Button type="error" icon="plus-round" style="float:right;" @click="createBidding()">新建项目</Button>
            </div>
            <div class="bidding-list">
                <Table :no-data-text="biddingLoading ? '' : '暂无数据'" :loading="biddingLoading" :columns="biddingHeader" :data="biddingList" style="margin-bottom: 20px;"></Table>
                <Page @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange" :page-size="pageSize" show-total show-sizer :total="total" :current="pageIndex" show-elevator align='right'></Page>
            </div>

        </div>
    </div>
</template>
<script>
import AccountTitle from "../../../components/account-title";
import { DateManager, getCompanyInfo } from "../../../config/util";
import { getColorByCode } from "../../../common/tools";
import { BiddingStatusCode } from "../../../common/config";
export default {
  components: {
    AccountTitle
  },
  data() {
    return {
      total: 0,
      allStatus: [],
      searchValue: "",
      searchType: -1,
      searchState: -1,
      pageIndex: 1,
      pageSize: 10,
      biddingList: [],
      biddingLoading: false,
      auditData: {},
      typeList: [
        {
          value: -1,
          label: "全部类型"
        },
        {
          value: 100,
          label: "招标"
        },
        {
          value: 101,
          label: "非招标"
        }
      ],
      biddingHeader: [
        {
          title: "招标项目标题",
          key: "title",
          render: (h, params) => {
            return h("div", [
              h("a", {
                class: {
                  "table-title-a": true
                },
                on: {
                  "click": () => {
                    this.openDetail(params.row.id);
                  }
                }
              },
              params.row.title
              )
            ]);
          }
        },
        {
          title: "类型",
          key: "typeName",
          width: 140
        },
        {
          title: "已投标",
          key: "tenderBidCompaniesCount",
          width: 100
        },
        {
          title: "状态",
          key: "statusName",
          width: 130,
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
                    paddingLeft: "5px",
                    color: params.row.color
                  }
                },
                params.row.statusName
              )
            ]);
          }
        },
        {
          title: "发布时间",
          key: "publishTime",
          width: 110
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          render: (h, params) => {
            return h("div", [
              h(
                "Dropdown",
                {
                  props: {
                    trigger: "click",
                    transfer: true
                  },
                  on: {
                    "on-click": type => {
                      if (type == "show") {
                        this.detail(params.row.id);
                      } else if (type == "publish") {
                        this.publish(params.row.id);
                      } else if (type == "edit") {
                        this.edit(params.row.id);
                      } else if (type == "delete") {
                        this.delete(params.row.id);
                      } else if (type == "cancel") {
                        this.cancel(params.row.id);
                      } else if (type == "cancelPublish") {
                        this.cancelPublish(params.row.id);
                      } else if (type == "cancelCompleted") {
                        this.cancelCompleted(params.row.id);
                      } else {
                        return;
                      }
                    }
                  },
                  scopedSlots: {
                    list: function(props) {
                      return h("DropdownMenu", [
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "show"
                            }
                          },
                          "查看"
                        ), (params.row.status != BiddingStatusCode.unpublished && params.row.status != BiddingStatusCode.cancelPublished) ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "publish"
                            }
                          },
                          "发布"
                        ), params.row.status != BiddingStatusCode.published ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "cancelPublish"
                            }
                          },
                          "取消发布"
                        ), (params.row.status != BiddingStatusCode.unpublished && params.row.status != BiddingStatusCode.published &&  params.row.status != BiddingStatusCode.cancelPublished) ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "edit"
                            }
                          },
                          "编辑"
                        ), params.row.status != BiddingStatusCode.bidingFailed ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "edit"
                            }
                          },
                          "重新发布"
                        ), params.row.status != BiddingStatusCode.executory ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "cancelCompleted"
                            }
                          },
                          "撤销公示"
                        ),(params.row.status != BiddingStatusCode.unpublished && params.row.status != BiddingStatusCode.cancelPublished) ? "" :
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "delete"
                            }
                          },
                          "删除"
                        )
                      ]);
                    }
                  }
                },
                [
                  h(
                    "a",
                    {
                      style: {
                        color: "black"
                      },
                      props: {
                        href: "javascript:void(0);",
                      }
                    },
                    [
                      "详情",
                      h("Icon", {
                        style: {
                          marginLeft: "5px"
                        },
                        props: {
                          type: "arrow-down-b",
                          color: "black"
                        }
                      })
                    ]
                  )
                ]
              )
            ]);
          }
        }
      ]
    };
  },
  mounted() {
    this.$store.loading();
    this.auditData = getCompanyInfo();
    this.getBiddingList({});
    this.getAllStatus();
    this.searchType = this.typeList[0].value;
  },
  methods: {
    getAllStatus() {
      this.$service.post("/PlantOpenTender/inviteBidService/GetAllStatus",{}).then(data=>{
        this.allStatus = [];
        for (let i=0;i<data.result.length;i++) {
          let obj = {
            value: data.result[i].key,
            label: data.result[i].value
          };
          this.allStatus.push(obj);
        }
        this.searchState = this.allStatus[0].value;
      })
    },
    getBiddingList(params) {
      let param = {
        typeId: params.typeId || -1, //招标项目类型Id -1为全部 ,
        status: params.status || [-1], //招标项目状态 -1
        title: params.title || "",
        pageIndex: params.pageIndex || 0,
        pageSize: params.pageSize || 10
      };
      this.biddingLoading = true;
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetByCondition", {
          dto: param
        })
        .then(data => {
          this.$store.unloading();
          this.biddingLoading = false;
          this.total = data.result.totalCount;
          this.biddingList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.biddingList, i, data.result.items[i]);
          }
          this.biddingList.map(function(item) {
            if (item.publishTime != null) {
              item.publishTime = DateManager.formatDate(new Date(item.publishTime));
            }
            item = getColorByCode(item);
            return item;
          });
        }).catch(err=>{
          this.$store.unloading();
        })
    },
    search() {
      let params = {
        typeId: this.searchType,
        status: [this.searchState],
        title: this.searchValue
      };
      this.getBiddingList(params);
    },
    openDetail(id) {
      this.$router.push({path:"/account/my-bidding-detail",query: {id: id}});
    },
    detail(id) {
      this.$router.push({
        path: "/account/my-bidding-detail",
        query: { id: id }
      });
    },
    publish(id) {
      this.$Modal.confirm({
        title: "发布项目",
        content: "您确定发布该项目吗？",
        loading: true,
        onOk: () => {
          this.$service
            .post("/PlantOpenTender/inviteBidService/PublishById", {
              id: id
            })
            .then(res => {
              this.$Modal.remove();
              let params = {
                typeId: this.searchType,
                status: [this.searchState],
                title: this.searchValue,
                pageIndex: this.pageIndex-1,
                pageSize: this.pageSize
              };
              this.getBiddingList(params);
              this.$Message.success("发布成功！");
            }).catch(err=>{
              this.$Modal.remove();
            });
        }
      });
    },
    edit(id) {
      this.$router.push({
        path: "/account/edit-bidding",
        query: { id: id }
      });
    },
    delete(id) {
      this.$Modal.confirm({
        title: "删除项目",
        content: "您确定删除该项目吗？",
        loading: true,
        onOk: () => {
          this.$service
            .post("/PlantOpenTender/inviteBidService/DeleteById", {
              id: id
            })
            .then(res => {
              this.$Modal.remove();
              let params = {
                typeId: this.searchType,
                status: [this.searchState],
                title: this.searchValue,
                pageIndex: this.pageIndex-1,
                pageSize: this.pageSize
              };
              this.getBiddingList(params);
              this.$Message.success("删除成功！");
            }).catch(err=>{
              this.$Modal.remove();
            });
        }
      });
    },
    cancelPublish(id) {
      this.$Modal.confirm({
        title: "取消发布",
        content: "您确定取消发布该项目吗？",
        loading: true,
        onOk: () => {
          this.$service
            .post("/PlantOpenTender/inviteBidService/CancelById", {
              id: id
            })
            .then(res => {
              this.$Modal.remove();
              let params = {
                typeId: this.searchType,
                status: [this.searchState],
                title: this.searchValue,
                pageIndex: this.pageIndex - 1,
                pageSize: this.pageSize
              };
              this.getBiddingList(params);
              this.$Message.success("取消成功！");
            }).catch(err=>{
              this.$Modal.remove();
            });
        }
      });
    },
    cancelCompleted(id) {
      this.$Modal.confirm({
        title: "撤销公示",
        content: "您确定撤销公示吗？",
        loading: true,
        onOk: () => {
          this.$service
            .post("/PlantOpenTender/winBidPublicityService/CancelByInviteBidId", {
              inviteBidId: id
            })
            .then(res => {
              this.$Modal.remove();
              let params = {
                typeId: this.searchType,
                status: [this.searchState],
                title: this.searchValue,
                pageIndex: this.pageIndex - 1,
                pageSize: this.pageSize
              };
              this.getBiddingList(params);
              this.$Message.success("撤销成功！");
            }).catch(()=>{
              this.$Modal.remove();
            });
        }
      });
    },
    onSelectionChanged(title) {
      this.current = title;
    },
    createBidding() {
      if (this.auditData.auditStatus == 0) {
        this.$Modal.info({
          title: "企业审核",
          content: "您的账号正在审核中，预计需要1个工作日，请耐心等待！",
          okText: "我知道了"
        })
      }
      else if (this.auditData.auditStatus == 2) {
        this.$Modal.confirm({
          title: "企业信息认证失败",
          content: "你的账号企业认证尚未通过，请重新认证！",
          okText: "重新认证",
          cancelText: "取消",
          onOk: () => {
            window.VueRootInstance.$children[0].$router.push('/account/register2?id=' + this.auditData.companyId)
          }
        })
      } 
      else {
        this.$router.push("/account/create-bidding");
      }
    },
    pageOnChange(index) {
      this.pageIndex = index;
      let params = {
        typeId: this.searchType,
        status: [this.searchState],
        title: this.searchValue,
        pageIndex: index - 1,
        pageSize: this.pageSize
      };
      this.getBiddingList(params);
    },
    pageOnSizeChange(size) {
      this.pageSize = size;
      let params = {
        typeId: this.searchType,
        status: [this.searchState],
        title: this.searchValue,
        pageIndex: 0,
        pageSize: size
      };
      this.getBiddingList(params);
    }
  }
};
</script>