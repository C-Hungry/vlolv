<style lang="less">
.my-bidding-detail-content {
  min-height: 667px;
  .datail-info-header {
    position: relative;
    background-color: #e7f2ff;
    padding: 10px 25px 15px 20px;
    font-size: 14px;
    .title {
      padding: 10px 0 15px 0;
      .title-span1 {
        font-size: 18px;
        font-weight: bolder;
      }
    }
    .download {
      color: #2d8cf0;
    }
    .download:hover {
      cursor: pointer;
      color: #39afff;
    }
    .bidded-number {
      position: absolute;
      right: 30px;
      top: 20px;
      font-size: 16px;
      font-weight: bolder;
      color: red;
    }
    .detail-col-margin {
      margin-bottom: 10px;
    }
    .item-download {
      color: #0950a0;
      font-weight: bolder;
    }
    .item-download:hover {
      color: #39b0ff;
      font-weight: bolder;
    }
    .item-download:before {
      content: url("../../../images/attach.png");
      width: 16px;
      height: 16px;
    }
  }
  .datail-info-content {
    min-height: 80px;
    padding: 40px 0 30px 130px;
    border: 3px solid #e7f2ff;
  }
  .detail-content {
    border: 3px solid #e7f2ff;
    border-top: none;
    .detail-content-header {
      height: 40px;
      line-height: 40px;
      background-color: #e7f2ff;
      font-size: 14px;
      font-weight: bolder;
      padding-left: 15px;
    }
    .content {
      min-height: 80px;
      padding: 20px;
    }
  }
  .button-container {
    padding: 30px 20px 20px 20px;
  }
  .bidded-pub {
    .header {
      height: 48px;
      color: #fff;
      line-height: 48px;
      font-size: 16px;
      font-weight: bolder;
      padding-left: 20px;
      background-color: #286aae;
    }
    .header-sub {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 14px;
      font-weight: bolder;
      background-color: #e7f2ff;
    }
    .detail {
      min-height: 80px;
      padding: 10px 30px;
      font-size:14px;
      border: 3px solid #e7f2ff;
      border-top: none;
    }
  }
  .more {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 3px solid #e7f2ff;
    border-top: none;
  }
  .publish-button {
    width: 100%;
    height: 110px;
    line-height: 100px;
    background-color: #f5f5f5;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #f5f5f5;
    box-shadow: 0 -2px 3px #ccc;
  }
  .row-hover:hover {
    cursor: pointer;
  }
}
</style>
<template>
<div class="my-bidding-detail-content">
    <div class="datail-info-header">
        <div class="title"><span class="title-span1">{{bidDetailData.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span @click="isDownload=true" class="download">
              <Icon type="android-attach" size='16' class="dowloundIcon"></Icon>
              下载附件
            </span></div>
        <!--<div class="bidded-number">已投标： {{bidDetailData.tenderBidCompaniesCount}} 家</div>-->
        <Row type="flex">
            <Col class-name="detail-col-margin" span="6" order="1">招标单位 ：<strong>{{bidDetailData.inviteBidCompanyName}}</strong></Col>
            <Col span="6" order="2">项目编号 ：<strong>{{bidDetailData.number}}</strong></Col>
            <Col span="6" order="3">项目类型 ：<strong>{{bidDetailData.typeName}}</strong></Col>
            <Col span="6" order="4" v-if="bidDetailData.isNeedEarnestMoney">投标保证金 ：<strong>{{bidDetailData.earnestMoney}}元人民币</strong></Col>
            <Col span="6" order="5">&nbsp;&nbsp;&nbsp;联系人 ：<strong>{{bidDetailData.contactPerson}}</strong></Col>
            <Col span="6" order="6">联系方式 ：<strong>{{bidDetailData.contactNumber}}</strong></Col>
        </Row>
    </div>
    <div class="datail-info-content">
        <Steps :current="currentStep">
            <Step v-for="item in progressItems" :title="item.text" :content="item.time | formatTime" :key="item.text"></Step>
        </Steps>
    </div>
    <div v-if="isSupportPublichAndEdit || !sliderToggle" class="detail-content">
        <div class="detail-content-header">
            招标单位要求
        </div>
        <div class="content">
            {{bidDetailData.tenderBidUnitRequirements || "暂无"}}
        </div>
        <div class="detail-content-header">
            奖罚条款
        </div>
        <div class="content">
            {{ bidDetailData.rewardsAndPunishmentClause || "暂无" }}
        </div>
        <div class="detail-content-header">
            其他要约
        </div>
        <div class="content">
            {{bidDetailData.otherAppointments || "暂无"}}
        </div>
    </div>
    <div class="more" v-if="!isSupportPublichAndEdit && sliderToggle" @click="knowMore()">
        更多详情&nbsp;<Icon type="chevron-down"></Icon>
    </div>
    <div class="more" v-if="!isSupportPublichAndEdit && !sliderToggle" @click="knowMore()">
        点击收起&nbsp;<Icon type="chevron-up"></Icon>
    </div>
    <div class="button-container">
        <Button v-if="isSupportPublicity" type="info" :disabled="isPublicityBtnDisabled || candidates.length==0" size="large" style="margin-right: 10px;" @click="publishBidding()">
            发布中标公示
        </Button>
        <!-- 此处暂时规避，服务端word组件COM类报错，未修复 -->
        <!-- <a class="ivu-btn ivu-btn-large ivu-btn-primary" v-if="isSupportBiddedMsg" :href="winBidDownLoadUrl" style="float:right;"><Icon type="ios-cloud-download-outline"></Icon>&nbsp;下载中标公示详情</a> -->
        <!-- <a class="ivu-btn ivu-btn-large ivu-btn-primary" v-if="isSupportPublicity || isSupportBiddedMsg" :href="inviteBidDownLoadlUrl" style="float:right;margin-right:10px;"><Icon type="ios-cloud-download-outline"></Icon>&nbsp;下载投标单位详情</a> -->
        <div style="color:red;margin-top: 15px;" v-if="isPublicityBtnDisabled">未到评标时间，暂不可发布中标公示和查看投标商详情。</div>
        <Button v-if="isSupportBiddedMsg" :type="isShowBiddedMsg ? 'info':'default'" @click="openBiddedMsg()" size="large" style="margin-right: 10px;">中标公示</Button>
        <Button v-if="isSupportBiddedMsg" :type="isShowTenderCorpsList ? 'info':'default'" @click="openTenderCorpsList()" size="large" style="margin-right: 10px;">投标公司列表</Button>
    </div>
    <div v-if="isSupportPublicity">
        <Table :columns="colConfig" @on-selection-change="selectCandidates" :data="companyList" style="margin-bottom: 20px;"></Table>
        <Page :page-size="pageSize" show-elevator show-total show-sizer :total="total" :current="currentIndex" align='right' @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange"></Page>
    </div>
    <div v-if="isSupportBiddedMsg && isShowTenderCorpsList">
        <Table :columns="colConfig2" :data="companyList" style="margin-bottom: 20px;"></Table>
        <Page :page-size="pageSize" show-elevator show-total show-sizer :total="total" :current="currentIndex" align='right' @on-change="pageOnChange" @on-page-size-change="pageOnSizeChange"></Page>
    </div>
    <div class="bidded-pub" v-if="isSupportBiddedMsg && isShowBiddedMsg">
        <div class="header">{{biddedMsg.inviteBidTitle}}</div>
        <div class="detail">
          <Row type="flex">
            <Col span="8" order="1" style="height:30px;font-size:14px;line-height:30px;">招标单位 ：{{biddedMsg.inviteBidCompanyName}}</Col>
            <Col span="8" order="2" style="height:30px;font-size:14px;line-height:30px;">项目编号 ：{{biddedMsg.inviteBidNumber}}</Col>
            <Col span="8" order="2"></Col>
            <Col span="8" order="3" style="height:30px;font-size:14px;line-height:30px;" v-if="biddedMsg.inviteBidEarnestMoney">项目保证金 ：{{biddedMsg.inviteBidEarnestMoney}}</Col>
          </Row>
        </div>
        <div class="header-sub">
            中标候选人
        </div>
        <div class="detail">
          <Row type="flex" v-for="(item,index) in biddedMsg.winBidCandidates" :key="index">
            <Col span="2" order="1" style="height:25px;font-size:14px;line-height:25px;">第{{index + 1}}候选人 ： </Col>
            <Col span="18" order="2" style="height:25px;font-size:14px;line-height:25px;">{{item.tenderBidCompanyName}}</Col>
          </Row>
        </div>
        <div class="header-sub">
            其他说明
        </div>
        <div class="detail">
            {{biddedMsg.explanation || "暂无"}}
        </div>
        <div class="header-sub">
            联系人
        </div>
        <div class="detail">
          <Row type="flex">
            <Col span="8" order="1" style="height:30px;font-size:14px;line-height:30px;">联系人 ：{{biddedMsg.inviteBidContactPerson}}</Col>
            <Col span="8" order="2" style="height:30px;font-size:14px;line-height:30px;">电话 ：{{biddedMsg.inviteBidContactNumber}}</Col>
            <Col span="8" order="2"></Col>
            <Col span="8" order="3" style="height:30px;font-size:14px;line-height:30px;">电子邮件 ：{{biddedMsg.inviteBidEmail}}</Col>
          </Row>
        </div>
    </div>
    <div v-if="isSupportPublichAndEdit" class="publish-button">
      <Button type="primary" style="width: 200px;margin-right: 30px;" size="large" @click="edit()">编辑</Button>
      <Button type="error" style="width: 200px" size="large" @click="publish()">发布</Button>
    </div>
    <Modal v-model="isDownload">
        <p slot="header" style="font-size:14px;text-align:left">
            <span>下载附件</span>
        </p>
        <div style="text-align:center;padding: 0 30px">
          <span v-if="filesList.length == 0" style="font-size:14px;">暂无附件</span>
          <Row v-for="(item,index) in filesList" :key="index" style="margin-bottom:5px;font-size:14px;">
            <Col span="18" style="text-align:left">{{item.name}}</Col>
            <Col span="6"><a :href="item.url"><Icon type="ios-cloud-download-outline"></Icon>下载</a></Col>
          </Row>          
        </div>
        <div slot="footer">
            <Button type="primary" @click="isDownload=false">关闭</Button>
        </div>
    </Modal>
    <Modal v-model="isDownload2">
        <p slot="header" style="font-size:14px;text-align:left">
            <span>下载附件</span>
        </p>
        <div style="text-align:center;padding: 0 30px">
          <span v-if="fileList.length == 0" style="font-size:14px;">暂无附件</span>
          <Row v-for="(item,index) in fileList" :key="index" style="margin-bottom:5px;font-size:14px;">
            <Col span="18" style="text-align:left">{{item.name}}</Col>
            <Col span="6"><a target="_blank" :href="item.url"><Icon type="ios-cloud-download-outline"></Icon>下载</a></Col>
          </Row>          
        </div>
        <div slot="footer">
            <Button type="primary" @click="isDownload2=false">关闭</Button>
        </div>
    </Modal>
</div>
</template>
<script>
import Vue from "vue";
import { DateManager } from "../../../config/util";
import Config from "../../../config/config";
import { getCurrentStep } from "../../../common/tools";
import { BiddingStatusCode } from "../../../common/config";
//过滤器
Vue.filter("formatTime", function(value) {
  if (!value) {
    return "";
  }
  value = DateManager.formatTime(value);
  return value;
});
export default {
  data() {
    return {
      baseurl: Config.baseUrl,
      inviteBidDownLoadlUrl: "",
      winBidDownLoadUrl: "",
      bidDetailData: {},
      biddedMsg: {},
      candidates: [], //选中的候选人信息
      filesList: [],
      fileList: [],
      currentStep: 0,
      total: 0,
      currentIndex: 1,
      pageSize: 10,
      isDownload: false,
      isDownload2: false,
      sliderToggle: true,
      isSupportPublicity: false, //是否支持发布中标公示
      isSupportBiddedMsg: false, //是否支持显示中标公示
      isSupportPublichAndEdit: false, //显示发布该招标信息
      isShowBiddedMsg: true,
      isShowTenderCorpsList: false,
      isPublicityBtnDisabled: false, //招标中可查看投标人列表但不可查看详情
      progressItems: [
        {
          text: "发布时间",
          time: ""
        },
        {
          text: "投标开始时间",
          time: ""
        },
        {
          text: "投标结束时间",
          time: ""
        },
        {
          text: "公示时间",
          time: ""
        }
      ],
      colConfig: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "投标商名称",
          key: "corpName",
          render: (h, params) => {
            return h("div", [
              h("a", {
                class: {
                  "table-title-a": true
                },
                on: {
                  "click": () => {
                    if (this.isPublicityBtnDisabled) {
                      this.$Notice.warning({
                          title: '提示',
                          desc: "未到评标时间，暂不可发布中标公示和查看投标商详情。"
                      });
                      return;
                    }
                    this.openDetail(params.row);
                  }
                }
              },
              params.row.corpName
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
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
                        if (this.isPublicityBtnDisabled) {
                          this.$Notice.warning({
                              title: '提示',
                              desc: "未到评标时间，暂不可发布中标公示和查看投标商详情。"
                          });
                          return;
                        }
                        this.$router.push({
                          path: "/account/my-bid-company-info",
                          query: {
                            id: params.row.id,
                            companyId: params.row.companyId
                          }
                        });
                      }
                      else if (type == "download") {
                        if (this.isPublicityBtnDisabled) {
                          this.$Notice.warning({
                              title: '提示',
                              desc: "未到评标时间，暂不可发布中标公示和查看投标商详情。"
                          });
                          return;
                        }
                        this.fileList = [];
                        for (let i = 0; i < params.row.docPath.length; i++) {
                      		this.fileList.push({
                      			name: decodeURIComponent(params.row.docPath[i].name),
                      			url: Config.baseUrl +　"/PlantOpenTender/attachmentService/FileDownLoad?name="+ params.row.docPath[i].name +"&url=" + params.row.docPath[i].url
                      		})
                        }
                        this.isDownload2 = true;
                      } 
                      else {
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
                        ),
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "download"
                            }
                          },
                          "下载附件"
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
      ],
      colConfig2: [
        {
          title: "投标商名称",
          key: "corpName",
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
              params.row.corpName
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 200,
          align: "center",
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
                        this.$router.push({
                          path: "/account/my-bid-company-info",
                          query: {
                            id: params.row.id,
                            companyId: params.row.companyId
                          }
                        });
                      }
                      else if (type == "download") {
                      	for (let i = 0; i < params.row.docPath.length; i++) {
                      		params.row.docPath[i].name = decodeURIComponent(params.row.docPath[i].name);
                      		params.row.docPath[i].url = Config.baseUrl +　"/PlantOpenTender/attachmentService/FileDownLoad?name="+ params.row.docPath[i].name +"&url=" + params.row.docPath[i].url;
                      	}
                        this.fileList = params.row.docPath;
                        this.isDownload2 = true;
                      } 
                      else {
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
                        ),
                        h(
                          "DropdownItem",
                          {
                            props: {
                              name: "download"
                            }
                          },
                          "下载附件"
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
      ],
      companyList: []
    };
  },
  mounted() {
    this.inviteBidDownLoadlUrl = Config.baseUrl + "/PlantOpenTender/inviteBidService/InviteBidDownLoad?id=" + this.$route.query.id;
    this.getBidDetail();
  },
  methods: {
    getBidDetail() {
      // 根据投标ID ，获取投标详情
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetById", {
          id: this.$route.query.id
        })
        .then(data => {
          // 只有评标中3和取消发布公示6两种状态可发布中标公示，招标中可查看投标公司列表
          this.isSupportPublicity = (data.result.status == BiddingStatusCode.evaluating || 
          data.result.status == BiddingStatusCode.cancelPublicity || 
          data.result.status == BiddingStatusCode.inbidding);
          // 招标中可查看投标公司列表但发布中标公示按钮需置灰
          this.isPublicityBtnDisabled = data.result.status == BiddingStatusCode.inbidding;
          //已公示和公示待生效可查看中标公示信息
          this.isSupportBiddedMsg = (data.result.status == BiddingStatusCode.publicity || 
          data.result.status == BiddingStatusCode.executory);
          //未发布和已取消发布的可以进行编辑和发布
          this.isSupportPublichAndEdit = (data.result.status == BiddingStatusCode.unpublished || 
          data.result.status == BiddingStatusCode.cancelPublished);
          if (this.isSupportPublicity) {
            this.getCompanyList({});
          }
          if (this.isSupportBiddedMsg) {
          	this.getCompanyList({});
            this.getBiddedMsg();
          }
          this.bidDetailData = data.result;
          this.filesList = [];
          for(let i=0;i<this.bidDetailData.attachments.length;i++) {
            this.filesList.push({
              name: decodeURI(this.bidDetailData.attachments[i].name),
              url:  Config.baseUrl +　"/PlantOpenTender/attachmentService/FileDownLoad?name="+ this.bidDetailData.attachments[i].name +"&url=" + this.bidDetailData.attachments[i].url
            })
          }
          this.progressItems[0].time = data.result.publishTime;
          this.progressItems[1].time = data.result.startTenderTime;
          this.progressItems[2].time = data.result.endTenderTime;
          this.progressItems[3].time = data.result.publicityTime;
          this.$service.post("/PlantOpenTender/commonService/GetServerTime",{}).then(time=>{
            let servTime = time.result;
            this.currentStep = getCurrentStep(this.progressItems,servTime);
          })
        });
    },
    getCompanyList(params) {
      let param = {
        inviteBidID: this.$route.query.id,
        pageCondition: {
          pageIndex: params.pageIndex || 0,
          pageSize: params.pageSize || 10
        }
      };
      this.$service
        .post(
          "/PlantOpenTender/tenderBidService/GetTenderCorpsListWithPage",
          param
        )
        .then(data => {
          this.companyList = [];
          for (let i = 0; i < data.result.items.length; i++) {
            this.$set(this.companyList, i, data.result.items[i]);
          }
          this.total = data.result.totalCount;
        });
    },
    getBiddedMsg() {
      this.$service.post("/PlantOpenTender/winBidPublicityService/GetByInviteBidId",{inviteBidId: this.$route.query.id}).then(data=>{
        this.biddedMsg = data.result;
        this.winBidDownLoadUrl = Config.baseUrl + "/PlantOpenTender/winBidPublicityService/WinBidDownLoad?id=" + data.result.id;
        this.biddedMsg.winBidCandidates.sort((a, b) => {
          return a.sortNum - b.sortNum;
        });
      })
    },
    pageOnChange(index) {
      let params = {
        pageIndex: index,
        pageSize: this.pageSize
      };
      this.getBiddingList(params);
    },
    pageOnSizeChange(size) {
      let params = {
        pageIndex: 1,
        pageSize: size
      };
      this.getBiddingList(params);
    },
    knowMore() {
      this.sliderToggle = !this.sliderToggle;
    },
    selectCandidates(data) {
      this.candidates = [];
      for (let i = 0; i < data.length; i++) {
        this.candidates.push(data[i]);
      }
    },
    publishBidding() {
      this.$router.push({
        path: "/account/publish-bidded",
        query: { id: this.$route.query.id, candidates: encodeURI(JSON.stringify(this.candidates)) }
      });
    },
    publish() {
      this.$Modal.confirm({
        title: "发布项目",
        content: "您确定要发布该项目吗？",
        loading: true,
        onOk: () => {
          this.$service
            .post("/PlantOpenTender/inviteBidService/PublishById", {
              id: this.$route.query.id
            })
            .then(res => {
              this.$Message.success("发布成功！");
              this.$Modal.remove();
              this.$router.push("/account/my-bidding")
            })
            .catch(err => {
              this.$Modal.remove();
            })
        }
      });
    },
    edit() {
      this.$router.push({
        path: "/account/edit-bidding",
        query: { id: this.$route.query.id }
      });
    },
    openDetail(row) {
      if (this.isPublicityBtnDisabled) {
        return;
      } else {
        this.$router.push({
          path: "/account/my-bid-company-info",
          query: {
            id: row.id,
            companyId: row.companyId
          }
        });
      }
    },
    openBiddedMsg() {
    	// 打开中标公示详情
    	this.isShowTenderCorpsList = false;
    	this.isShowBiddedMsg = true;
    },
    openTenderCorpsList() {
    	// 打开投标公司列表
    	this.isShowBiddedMsg = false;
    	this.isShowTenderCorpsList = true;
    }
  }
};
</script>
