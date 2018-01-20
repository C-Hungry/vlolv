<style>
  .my-bided {
    .content {
      border: solid 1px #c8e1fe;
      min-height: 635px;
      padding: 5px;
    }

    .bidded-search {
      padding: 10px;
    }

    .download {
      color: #2d8cf0;
    }

    .download:hover {
      color: #39afff;
    }

    .pages {
      margin-bottom: 15px;
      margin-right: 10px;
    }

    [v-cloak] {
      display: none;
    }
  }
</style>

<template>
  <div class="my-bided">
    <account-tab :titles="['我的投标','待报价']" current="我的投标" v-on:onSelectionChanged="onSelectionChanged"></account-tab>
    <!-- <div class="content"></div> -->
    <div v-if="current=='我的投标'" class="content">
      <div class="bidded-search">
        <Input v-model="searchValue" style="width: 200px;" class="biddedValues" placeholder="项目名称..."></Input>
        <Select v-model="searchType" style="width:150px">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="searchState" style="width:150px">
          <Option v-for="item in allStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" icon="ios-search" @click="search">搜索</Button>
      </div>
      <div class="bidded-list">
        <Table :columns="biddeds" :no-data-text="biddingLoading ? '' : '暂无数据'"
          :loading="biddingLoading" :data="biddedList" style="margin-bottom: 20px;"></Table>
        <Page class-name="pages" @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange" :page-size="pageSize" show-elevator
          show-total show-sizer :total="total" :current="currentIndex" show-elevator align='right'></Page>
      </div>
    </div>
    <div v-if="current=='待报价'" class="content">
      <div class="bidded-search">
        <Input v-model="searchValue" style="width: 200px;" class="biddedValues" placeholder="项目名称..."></Input>

        <Button type="primary" icon="ios-search" @click="searchQuotes">搜索</Button>
      </div>
      <div class="bidded-list">
        <Table v-cloak :columns="quotes" :no-data-text="nonbiddingLoading ? '' : '暂无数据'"
          :loading="nonbiddingLoading" :data="quoteList" style="margin-bottom: 20px;"></Table>
        <Page class-name="pages" @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange" :page-size="pageSize" show-elevator
          show-total show-sizer :total="totals" :current="currentIndexs" show-elevator align='right'></Page>
      </div>
    </div>
  </div>
</template>
<script>
  import AccountTab from "../../../components/account-tab";
  import { DateManager } from "../../../config/util";
  import { getColorByCode2 } from "../../../common/tools";
  import { BidStatusCode } from "../../../common/config";
  export default {
    components: {
      AccountTab
    },
    data() {
      return {
        total: 0,
        totals: 0,
        allStatus: [],
        currentIndex: 1,
        currentIndexs: 1,
        pageSize: 10,
        bidded: {},
        biddingLoading: false,
        nonbiddingLoading: false,
        current: "我的投标",
        searchValue: "",
        searchType: -1,
        searchState: -1,
        typeList: [{
            value: -1,
            label: "全部类型"
          },
          {
            value: 100,
            label: "招标类"
          },
          {
            value: 101,
            label: "非招标类"
          }
        ],
        biddeds: [{
            title: "已投标项目标题",
            key: "title",
            render: (h, params) => {
              return h("div", [
                h("a", {
                  class: {
                    "table-title-a": true
                  },
                  on: {
                    "click": () => {
                      this.openDetail(params.row);
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
            key: "inviteBidTypeStr",
            width: 140,
            align: "left"
          },
//        {
//          title: "已投标",
//          key: "tenderCnt",
//          width: 100,
//          align: "left"
//        },
          {
            title: "投标状态",
            key: "statusStr",
            width: 130,
            align: "left",
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
                  "span", {
                    style: {
                      marginLeft: '5px',
                      color: params.row.color
                    }
                  },
                  params.row.statusStr
                )
              ]);
            }
          },
          {
            title: "投标时间",
            key: "createTime",
            width: 110,
            align: "left"
          },
          {
            title: "操作",
            key: "action",
            align: "left",
            width: 100,
            render: (h, params) => {
              return h("div", [
                h(
                  "Dropdown", {
                    props: {
                      trigger: "click",
                      transfer: true
                    },
                    on: {
                      "on-click": command => {
                        // params.row.instanceId  该id 为招标项目id可通过该id查询单个招标项目信息
                        //     params.row.id  该id为投标id  可通过该id去查询投标人信息
                        this.rowCommand(
                          command,
                          params.row.id,
                          params.row.inviteBidID,
                          params.row.statusStr
                        );
                      }
                    },
                    scopedSlots: {
                      list: function (props) {
                        return h("DropdownMenu", [
                          h(
                            "DropdownItem", {
                              props: {
                                name: "show"
                              }
                            },
                            "查看"
                          ), params.row.tenderBidStatus != BidStatusCode.hasBid ? '' :
                          h(
                            "DropdownItem", {
                              props: {
                                name: "edit"
                              }
                            },
                            "编辑"
                          ), params.row.tenderBidStatus != BidStatusCode.hasBid ? '' :
                          h(
                            "DropdownItem", {
                              props: {
                                name: "repeal"
                              }
                            },
                            "撤销"
                          )
                        ]);
                      }
                    }
                  }, [
                    h(
                      "a", {
                        style: {
                          color: "black"
                        },
                        props: {
                          href: "javascript:void(0);",
                          color: "black"
                        }
                      }, [
                        "详情",
                        h("Icon", {
                          style: {
                            marginLeft: "10px"
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
        ],
        //  投标信息列表
        biddedList: [],
        quotes: [{
            title: "已投标项目标题",
            key: "title",
            width: 450,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  class: {
                    "table-title-a": true
                  },
                  on: {
                    "click": () => {
                      this.openQuoteDetail(params.row);
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
            width: 200,
            align: "center"
          },
          {
            title: "报价状态",
            key: "status",
            width: 200,
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
                  "span", {
                    style: {
                      color: params.row.color,
                      paddingLeft: "8px"
                    }
                  },
                  params.row.status
                )
              ]);
            }
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            width: 160,
            render: (h, params) => {
              return h("div", [
                h(
                  "Dropdown", {
                    props: {
                      trigger: "click",
                      transfer: true
                    },
                    on: {
                      "on-click": command => {
                        this.rowCommand(
                          command,
                          params.row.id,
                        );
                      }
                    },
                    scopedSlots: {
                      list: function (props) {
                        return h("DropdownMenu", [
                          h(
                            "DropdownItem", {
                              props: {
                                name: "showQuote"
                              }
                            },
                            "查看"
                          )
                        ]);
                      }
                    }
                  }, [
                    h(
                      "a", {
                        style: {
                          color: "black"
                        },
                        props: {
                          href: "javascript:void(0);"
                        }
                      }, [
                        "详情",
                        h("Icon", {
                          style: {
                            marginLeft: "10px"
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
        ], //  待报价信息列表        
        quoteList: [],
      };
    },
    mounted() {
      this.listInit();
      this.getAllStatus();
    },
    methods: {
      getAllStatus() {
        this.$service.post("/PlantOpenTender/tenderBidService/GetAllStatus",{}).then(data=>{
          this.allStatus = [];
          for (let i=0;i<data.result.length;i++) {
            if (data.result[i].key != BidStatusCode.executory) {
              let obj = {
                value: data.result[i].key,
                label: data.result[i].value
              };
              this.allStatus.push(obj)
            }
          }
          this.searchState = this.allStatus[0].value;
        })
      },
      getBiddingList(params) {
        this.biddingLoading = true;
        this.$store.loading();
        // 获取投标列表信息
        let param = {
          inviteBidTypeID: params.inviteBidTypeID || -1, //招标项目类型Id -1为全部 ,
          tenderBidStatus: [params.tenderBidStatus || -1], //招标项目状态 -1
          title: params.title || "",
          pageIndex: params.pageIndex || 0,
          pageSize: params.pageSize || 10
        };
        if (params.tenderBidStatus == BidStatusCode.evaluating) {
          param.tenderBidStatus = [2,3];
        }
        if (params.tenderBidStatus == 0) {
          param.tenderBidStatus = [0];
        }
        var biddedUrl = "/PlantOpenTender/tenderBidService/GetListWithPage";
        this.$service
          .post(biddedUrl, {
            tenderBidPageDto: param
          })
          .then(res => {
            this.biddingLoading = false;
            this.$store.unloading();
            var data = res.result;
            this.total = data.totalCount;
            this.biddedList = [];
            for (let i = 0; i < data.items.length; i++) {
              this.$set(this.biddedList, i, data.items[i]);
            }
            this.biddedList.map(function (item) {
              item.createTime = DateManager.formatDate(new Date(item.createTime));
              item = getColorByCode2(item);
              return item;
            });
          }).catch(err=>{
            this.biddingLoading = false;
            this.$store.unloading();
          });
      },
      getQuotesList(params) {
        this.nonbiddingLoading = true;
        // 获取报价详情列表
        let param = {
          title: params.title || "",
          pageIndex: params.pageIndex || 0,
          pageSize: params.pageSize || 10
        };
        this.$store.loading();
        var biddedUrl =
          "/PlantOpenTender/tenderBidService/GetWaitToQuoteList";
        this.$service.post(biddedUrl, {
          dto: param
        }).then((res) => {
          this.nonbiddingLoading = false;
          this.$store.unloading();
          var data = res.result;
          this.totals = data.totalCount;
          this.quoteList = [];
          for (let i = 0; i < data.items.length; i++) {
            this.$set(this.quoteList, i, data.items[i]);
          }
          this.quoteList.map(function (item) {
            item.createTime = DateManager.formatDate(new Date(item.createTime));
            if (item.status == "待报价") {
              item.color = "#ff8933";
            }
            return item;
          });
        }).catch(err=>{
          this.nonbiddingLoading = false;
          this.$store.unloading();
        });
      },
      //  投标列表搜索函数
      search() {
        let param = {
          'title': this.searchValue,
          'inviteBidTypeID': this.searchType,
          'tenderBidStatus': this.searchState
        };
        this.getBiddingList(param);
      },
      //  待报价列表搜索函数      
      searchQuotes() {
        let param = {
          title: this.searchValue,
          inviteBidTypeID: 1011,
          tenderBidStatus: 0,
          pageIndex: 0,
          pageSize: 10
        };
        this.getQuotesList(param);
      },
      onSelectionChanged(title) {
        this.current = title;
        if (title == '待报价') {
          this.getQuotesList({
            'pageIndex': 0,
            'pageSize': 10
          });
        } else {
          this.getBiddingList({
            'inviteBidTypeID': -1, //招标项目类型Id -1为全部 ,
            "tenderBidStatus": -1, //招标项目状态 -1
            'pageIndex': 0,
            'pageSize': 10
          });
        }
      },
      // 投标列表初始化函数
      listInit() {
        let param = {
          typeId: -1, //招标项目类型Id -1为全部 ,
          status: -1, //招标项目状态 -1
          pageIndex: 0,
          pageSize: 10
        };
        this.getBiddingList(param);
      },
      openDetail(data) {
        this.$router.push({
          path: "/account/my-bid-detail",
          query: {
            tenderBidID: data.id,
            id: data.inviteBidID
          }
        });
      },
      openQuoteDetail(data) {
        this.$router.push({
          path: "/account/quote-info",
          query: {
            id: data.id
          }
        });
      },
      //  依据每行传的参数进行判断所要执行相应的函数
      rowCommand(command, nId, pId, pStr) {
        let query = {
          tenderBidID: nId,
          id: pId
        }
        //  查看详情函数
        if (command == "show") {
          this.$router.push({
            path: "/account/my-bid-detail",
            query
          });
        };
        //  编辑相应数据函数
        if (command == "edit") {
          if (pStr == '已报价') {
            this.$router.push({
              path: "/account/tobid-quote",
              query
            })
          } else {
            this.$router.push({
              path: "/account/tobid",
              query
            })
          };

        };
        // 针对投标信息进行撤销h函数
        if (command == "repeal") {
          const title = "确定";
          const content = "<p>确认撤销吗？</p>";
          const repealUrl = "/PlantOpenTender/tenderBidService/CancelTerderBid";
          this.$Modal.confirm({
            title: title,
            content: content,
            onOk: () => {
              this.$service
                .post(repealUrl, {
                  tenderBidID: nId,
                }).then(res => {
                  this.$store.unloading();
                  this.$Message.info(res.result);
                  this.currentIndex = 1;
                  this.listInit();
                }).catch(res => {
                  this.listInit();
                });
            },
            onCancel: () => {
              this.$store.unloading();
            }
          });
        };
        // 待报价查看详情函数
        if (command == "showQuote") {
          this.$router.push({
            path: "/account/quote-info",
            query: {
              id: nId
            }
          });
        };
        if (command == "editQuote") {
          this.$router.push({
            path: "/account/tobid-quote",
            query: {
              id: nId
            }
          });
        }
      },
      pageOnChange(index) {
        let param = {
          typeId: this.searchType,
          status: this.searchState,
          title: this.searchValue,
          pageIndex: index - 1,
          pageSize: this.pageSize
        };

        if (this.current == '我的投标') {
          this.currentIndex = index;
          this.getBiddingList(param);
        } else {
          this.currentIndexs = index;
          this.getQuotesList({
            title: this.searchValue,
            pageIndex: index - 1,
            pageSize: this.pageSize
          });
        }
      },
      pageOnSizeChange(size) {
        let param = {
          typeId: this.searchType,
          status: this.searchState,
          title: this.searchValue,
          pageIndex: 0,
          pageSize: size
        };
        if (this.current == '我的投标') {
          this.getBiddingList(param);
        } else {
          this.getQuotesList({
            title: this.searchValue,
            pageIndex: 0,
            pageSize: size
          });
        }
      }
    }
  };
</script>