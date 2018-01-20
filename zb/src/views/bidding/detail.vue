<style scoped lang="less">
.bidding-detail-content {
  position: relative;
  min-height: 665px;
  padding-top: 10px;
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
    .item-download:before {
      content: url("../../images/attach.png");
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
      font-size: 16;
      font-weight: bolder;
      padding-left: 15px;
    }
    .content {
      min-height: 80px;
      padding: 20px;
    }
  }
  .detail-button {
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
}
</style>
<template>
<div class="bidding-detail-content">
    <Spin v-if="auditData&&auditData.auditStatus==0" fix>
      <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
    </Spin>
    <Spin v-if="auditData&&auditData.auditStatus==2" fix>
      <div>你的账号企业认证尚未通过，请重新认证！</div>
      <br>
      <Button type="primary" v-on:click="$router.push('/account/register2?id=' + auditData.companyId)">重新认证</Button>
    </Spin>
    <div v-if="auditData&&auditData.auditStatus==1">
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
    <div class="detail-content">
        <div class="detail-content-header">
            招标单位要求
        </div>
        <div class="content">
            {{bidDetailData.tenderBidUnitRequirements || '暂无'}}
        </div>
        <div class="detail-content-header">
            奖罚条款
        </div>
        <div class="content">
            {{ bidDetailData.rewardsAndPunishmentClause || '暂无' }}
        </div>
        <div class="detail-content-header">
            其他要约
        </div>
        <div class="content">
            {{bidDetailData.otherAppointments || '暂无'}}
        </div>
    </div>
    <div class="detail-button">
        <Button type="ghost" @click="isDownload=true" style="width: 300px;margin-right: 30px;color: #0950A0;border-color: #0950A0;" size="large">下载项目附件</Button>
        <Button type="primary" style="width: 300px" :disabled="isDisabled" @click="tobid()" size="large">{{supportText}}</Button>
    </div>
    <Modal v-model="isDownload">
        <p slot="header" style="font-size:14px;text-align:left">
            <span>下载附件</span>
        </p>
        <div style="text-align:center;padding: 0 30px">
            <span v-if="filesList.length==0" style="font-size:14px;">暂无附件</span>
            <Row v-for="(item,index) in filesList" :key="index" style="margin-bottom:5px;font-size:14px;">
              <Col span="18" style="text-align:left">{{item.name}}</Col>
              <Col span="6"><a target="_blank" :href="item.url"><Icon type="ios-cloud-download-outline"></Icon>下载</a></Col>
          </Row>          
        </div>
        <div slot="footer">
            <Button type="primary" @click="isDownload=false">关闭</Button>
        </div>
    </Modal>
     </div>
</div>
</template>
<script>
import Vue from "vue";
import { DateManager, getCompanyInfo } from "../../config/util";
import Config from "../../config/config";
import { BiddingStatusCode } from "../../common/config";
import { getCurrentStep } from "../../common/tools";
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
      isDisabled: true,
      isDownload: false,
      filesList: [],
      supportText: "加载中...",
      myCompanyId: 0,
      auditData: {},
      bidDetailData: {},
      currentStep: 0,
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
      ]
    };
  },
  mounted() {
    this.auditData = getCompanyInfo();
    this.getTenderStatus();
  },
  methods: {
    tobid() {
      this.$router.push({
        path: "/account/tobid",
        query: { id: this.$route.query.id }
      });
    },
    getTenderStatus() {
      let defer1 = this.$service.post(
        "/PlantOpenTender/inviteBidService/GetById",
        { id: this.$route.query.id }
      );
      let defer2 = this.$service.post(
        "/PlantOpenTender/companyService/GetMyCompany",
        {}
      );
      this.$store.loading();
      Promise.all([defer1, defer2])
        .then(data => {
          this.$store.unloading();
          this.bidDetailData = data[0].result;
          let myCompanyInfo = data[1].result;
          this.filesList = [];
          this.bidDetailData.attachments.forEach((item, index) => {
            this.filesList.push({
              name: decodeURI(item.name),
              url:
                Config.baseUrl +
                "/PlantOpenTender/attachmentService/FileDownLoad?name=" +
                item.name +
                "&url=" +
                item.url
            });
          });

          this.progressItems[0].time = data[0].result.publishTime;
          this.progressItems[1].time = data[0].result.startTenderTime;
          this.progressItems[2].time = data[0].result.endTenderTime;
          this.progressItems[3].time = data[0].result.publicityTime;
          this.$service
            .post("/PlantOpenTender/commonService/GetServerTime", {})
            .then(time => {
              let servTime = time.result;
              this.currentStep = getCurrentStep(
                this.progressItems,
                servTime
              );
            });
          // 已发布
          if (data[0].result.status == BiddingStatusCode.published) {
            this.isDisabled = true;
            this.supportText = "投标未开始";
            return;
          } 
          else if (data[0].result.status == BiddingStatusCode.inbidding) {
            // 招标中
            // 供应商已投标
            if (this.auditData.companyType == 1 &&
              this.bidDetailData.tenderBidCompanyIds.indexOf(myCompanyInfo.id) != -1
            ) {
              this.isDisabled = true;
              this.supportText = "已投标";
              return;
            } else if (
              this.auditData.companyType == 1 &&
              this.bidDetailData.tenderBidCompanyIds.indexOf(myCompanyInfo.id) == -1
            ) {
              // 供应商未投标
              this.isDisabled = false;
              this.supportText = "投标";
              return;
            } else if (this.auditData.companyType == 2) {
              // 采购商
              this.isDisabled = true;
              this.supportText = "采购商不可投标";
              return;
            }
          } 
          else if (data[0].result.status == BiddingStatusCode.evaluating ||
                data[0].result.status == BiddingStatusCode.executory ||
                data[0].result.status == BiddingStatusCode.cancelPublicity) 
          {
            // 评标中 公示待生效 已取消公示 
            this.isDisabled = true;
            this.supportText = "投标已结束";
            return;
          } 
          else if (data[0].result.status == BiddingStatusCode.publicity ||
                data[0].result.status == BiddingStatusCode.bidingFailed)
          {
            //已公示  已流标
            this.isDisabled = true;
            this.supportText = "已结束";
            return;
          } 
          else {
            this.isDisabled = true;
            this.supportText = "加载中...";
          }
        })
        .catch(err => {
          this.$store.unloading();
        });
    }
  }
};
</script>