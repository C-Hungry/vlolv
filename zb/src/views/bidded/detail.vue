<style scoped lang="less">
.bidded-detail-index {
  position: relative;
  min-height: 667px;
  .bidded-info-tittle {
    padding: 10px 0;
  }
  .bidded-detail-tittle {
    background: rgb(40, 106, 174);
    height:48px;
    padding: 12px 15px;
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
  .bidded-company-tittle > div:nth-of-type(1) {
    background: rgb(231, 242, 255);
  }
  .bidded-company-tittle > div:nth-of-type(1) {
    font-weight: 800 !important;
    font-size: 16px !important;
    padding: 10px;
  }
  .bidded-company-tittle > .company-info > p {
    padding: 20px 15px;
    border-bottom: 1px solid #dddddd;
  }
  .company-info {
    width: 100%;
    padding: 10px 20px 20px;
  }
  .ivu-row-flex-space-between {
    margin-top: 15px;
  }

  .ivu-form-item {
    margin-bottom: 15px;
  }
  .look-for {
    cursor: pointer;
    color: rgb(29, 106, 174);
    text-decoration: underline;
  }
  .ivu-row-flex-space-between span {
    font-size: 13px;
  }
  .bidded-company-tittle .bank-info {
    padding: 18px;
  }
  .ivu-table:after {
    width: 0 !important;
  }
  
  .ivu-table th {
    background-color: rgb(192, 211, 255) !important;
  }
}
</style>
<template>
  <div class="bidded-detail-index">
    <Spin v-if="auditData&&auditData.auditStatus==0" fix>
      <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
    </Spin>
    <Spin v-if="auditData&&auditData.auditStatus==2" fix>
      <div>你的账号企业认证尚未通过，请重新认证！</div>
      <br>
      <Button type="primary" v-on:click="$router.push('/account/register2?id='+auditData.companyId)">重新认证</Button>
    </Spin>
    <div style="border: 3px solid #e7f2ff;" v-if="auditData&&auditData.auditStatus==1">
    <div class="bidded-detail-tittle">{{inviteData.title}} 
    <a class="ivu-btn ivu-btn-small ivu-btn-text" v-if="isShowDownloadBtn" :href="tenderDetailUrl" style="float:right;background-color:#FFF;color:#286aae;"><Icon type="ios-cloud-download-outline"></Icon>&nbsp;下载中标公示详情</a>
    </div>
    <div class="bidded-detail-content">
      <div class="company-info">
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="7">招标单位 ：
          <span>{{inviteData.inviteBidCompanyName}}</span>
          </Col>
          <Col span="5" align='left'>招标类型 ：
          <span>{{inviteData.typeName}}</span>
          </Col>
          <Col span="5">
          <span></span>
          </Col>
          <Col span="5" align='right'>
          <span></span>
          </Col>
        </Row>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="7">招标编号 ：
          <span>{{inviteData.number}}</span>
          </Col>
          <Col span="5" align='left'>项目保证金 ：
          <span>{{inviteData.earnestMoney}}</span>
          元人民币
          </Col>
          <Col span="5">
          <span></span>
          </Col>
          <Col span="5" align='right'>
          <span></span>
          </Col>
        </Row>
      </div>
      <div class="bidded-company-tittle">
        <div>中标候选人</div>
        <div class="company-info">
          <Row v-for="(item, index) in winData.winBidCandidates" :key="item.id" type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">{{winBidCandidatesOrderName(index)}}
            <span>{{item.tenderBidCompanyName}}</span>
            </Col>
          </Row>
        </div>
      </div>

      <div class="bidded-company-tittle">
        <div>其他说明</div>
        <div class="company-info">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="24" style="border-bottom:1px inset rgb(221,221,221);padding-bottom:5px;">
            <span style="word-break: break-all;" >公示说明 ：{{winData.explanation||"暂无"}}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">联系人 ：
            <span>{{winData.inviteBidContactPerson}}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">电话 ：
            <span>{{winData.inviteBidContactNumber}}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">电子邮箱 ：
            <span>{{winData.inviteBidEmail}}</span>
            </Col>
          </Row>
        </div>
      </div>
      <div class="bidded-company-tittle">
        <div>附件下载</div>
        <div class="company-info">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">
            <div v-if="inviteData.attachments.length<=0">暂无</div>
            <div v-for="attach in inviteData.attachments" :key="attach.id">
              <Icon type="android-attach" size='20' color='#0c53a1' class="dowloundIcon"></Icon>
              <a :href="attach.url" target="_blank">{{decodeURI(attach.name)}}</a>
            </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
import config from '../../config/config';
import { getCompanyInfo } from "../../config/util";
export default {
  data() {
    return {
      auditData: {},
      tenderDetailUrl: "",
      isShowDownloadBtn: false,
      inviteData: {
        attachments: [],
      },
      winData: {
        winBidCandidates: [],
      }
    };
  },
  methods: {
    winBidCandidatesOrderName(index) {
      var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      return "第" + arr[index] + "候选人：";
    }
  },
  mounted() {
    this.$store.loading();
    this.auditData = getCompanyInfo();
    if(!this.$route.query.id){
      return;
    };
    this.$service
      .post("/PlantOpenTender/inviteBidService/GetById", { id: this.$route.query.id })
      .then(res => {
        this.$store.unloading();
        this.inviteData = res.result;

        for(var i = 0; i < this.inviteData.attachments.length; i++){
          this.inviteData.attachments[i].url = config.baseUrl 
          + "/PlantOpenTender/attachmentService/FileDownLoad?url=" 
          + this.inviteData.attachments[i].url
          + "&name=" + this.inviteData.attachments[i].name;
        }
      });
    this.$service
      .post("/PlantOpenTender/winBidPublicityService/GetByInviteBidId", {
        inviteBidId: this.$route.query.id
      })
      .then(res => {
        this.isShowDownloadBtn = true,
        this.$store.unloading();        
        this.winData = res.result;
        this.tenderDetailUrl = config.baseUrl + "/PlantOpenTender/winBidPublicityService/WinBidDownLoad?id=" + res.result.id;
        this.winData.winBidCandidates.sort((a, b) => {
          return a.sortNum - b.sortNum;
        });
      }).catch(err=>{
        this.isShowDownloadBtn = false,
        this.$store.unloading();      
      });
  }
};
</script>