<style lang="less">
  .bidded-company-index {
    font-size: 14px;
    min-height: 653px;
    .bidded-info-tittle {
      padding: 10px 0;
    }
    .download {
      color: #2d8cf0;
    }
    .download:hover {
      color: #39afff;
    }
    .bidded-detail-tittle span:nth-of-type(1),
    .bidded-info-tittle>span {
      font-size: 16px!important;
      font-weight: 800!important;
    }
    .bidded-detail-content,
    .bidded-company-tittle>div:nth-of-type(1) {
      background: rgb(231, 242, 255);
    }
    .bidded-company-tittle>div:nth-of-type(1) {
      font-weight: 600!important;
      font-size: 14px!important;
      padding: 10px;
    }

    .bidded-info {
      border: 3px solid #e7f2ff;
    }
    .company-info,
    {
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
      font-weight: 600;
      font-size: 14px;
    }
    .bidded-company-tittle .bank-info {
      padding: 18px;
    }
    .ivu-table:after {
      width: 0 !important;
    }
  }
</style>

<template>
  <div class="bidded-company-index">
    <div class="bidded-detail">
      <div class="bidded-info-tittle">
        <span>投标详情</span>
      </div>
      <div class="bidded-detail-content">
        <div class="company-info">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">投标说明：
            <span>{{proDetail.tenderRemark}}</span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">附件：
            <Icon type="android-attach" size='20' color='#0c53a1' class="dowloundIcon"></Icon>
            <a @click="isDownload=true" class="download">附件可供下载</a>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">联系人：
            <span>{{proDetail.linkMan}}</span>
            </Col>
            <Col span="5" align='left'>联系方式：
            <span>{{proDetail.linkPhon}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='linkEmail'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">邮箱：
            <span>{{proDetail.linkEmail}}</span>
            </Col>
          </Row>
        </div>

      </div>
    </div>
    <div class="bidded-info-tittle">
      <span>公司详情</span>
    </div>
    <div class="bidded-info">
      <div class="bidded-company-tittle">
        <div>{{companyDetail.name}}</div>
        <div class="company-info">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">企业性质：
            <span>{{companyDetail.natureName}}</span>
            </Col>
            <Col span="5" align='left'>企业所在地：
            <span>{{companyDetail.provinceName+" "+companyDetail.cityName+" "+companyDetail.countyName}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">联系人电话：
            <span>{{companyDetail.adminPhone}}</span>
            </Col>
            <Col span="5" align='left'>详细地址：
            <span>{{companyDetail.detail}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">邮政编码：
            <span>{{companyDetail.zipCode}}</span>
            </Col>
            <Col span="5" align='left'>联系人姓名：
            <span>{{companyDetail.adminName}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">经营范围：
            <span>{{companyDetail.businessScope}}</span>
            </Col>
          </Row>
        </div>
      </div>
      <div class="bidded-company-tittle">
        <div>营业执照</div>
        <div class="company-info">
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">统一企业信用代码(纳税号)：
            <span>{{companyDetail.licenseCode}}</span>
            </Col>
            <Col span="5" align='left'>营业执照到期时间：
            <span>{{companyDetail.endDate| formatTime}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">营业执照附件：
            <span class="look-for" @click='modalLook=true'>
              查看
            </span>
            <Modal v-model="modalLook" width="1200" height='650'>
              <p slot="header">
                <span>附件信息</span>
              </p>
              <div style="text-align:center">
                <img style="width:100%;height:635px;" :src="companyDetail.picUrlShow" alt="">
              </div>
              <div slot="footer">
                <!-- <Button type="error" size="large" long :loading="modal_loading" @click="del">删除</Button> -->
              </div>
            </Modal>
            </Col>
            <Col span="5" align='left'>注册资本(万元)：
            <span>{{companyDetail.registeredCapital}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">实收资本(万元)：
            <span>{{companyDetail.paidUpCapital}}</span>
            </Col>
            <Col span="5" align='left'>币种：
            <span>{{companyDetail.currencyName}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">法人代表姓名：
            <span>{{companyDetail.legalPerson}}</span>
            </Col>
            <Col span="5" align='left'>法人证件类型：
            <span>{{companyDetail.certificateTypeName}}</span>
            </Col>
            <Col span="5">
            <span></span>
            </Col>
            <Col span="5" align='right'>
            <span></span>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" class="code-row-bg">
            <Col span="7">法人证件号码：
            <span>{{companyDetail.certificateCode}}</span>
            </Col>
          </Row>
        </div>
      </div>
      <div class="bidded-company-tittle">
        <div>银行信息</div>
        <div class="bank-info">
          <Table :columns="bankInfo" :loading="biddedLoading" style="border-left: none;border-right: none;" :data="bankLists"></Table>
        </div>
      </div>
    </div>
    <Modal v-model="isDownload">
      <p slot="header" style="font-size:14px;text-align:left">
        <span>下载附件</span>
      </p>
      <div style="text-align:center;padding: 0 30px">
        <span v-if="filesList.length == 0" style="font-size:14px;">暂无附件</span>
        <Row v-for="(item,index) in filesList" :key="index" style="margin-bottom:5px;font-size:14px;">
          <Col span="18" style="text-align:left">{{item.name}}</Col>
          <Col span="6">
          <a target="_blank" :href="item.url">
            <Icon type="ios-cloud-download-outline"></Icon>下载</a>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" @click="isDownload=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Config from "../../../config/config";
  import {
    DateManager
  } from "../../../config/util";
  //过滤器
  Vue.filter('formatTime', function (value) {
    if (!value) {
      return ''
    }
    value = DateManager.formatTime(value);
    return value;
  })
  export default {
    data() {
      return {
        modalLook: false,
        proDetail: {},
        isDownload: false,
        filesList: [],
        biddedLoading: false,
        companyDetail: {},
        picLink: '',
        id: this.$route.query.companyId,
        tenderBidID: this.$route.query.id,
        bankInfo: [{
            title: '银行名称',
            key: 'name'
          },
          {
            title: '开户行名称',
            key: 'bankNames'
          },
          {
            title: '账户号码',
            key: 'accountNum'
          },
          {
            title: '账户类别',
            key: 'accountType'
          }
        ],
        bankLists: [{
          name: '',
          bankNames: '',
          accountNum: '',
          accountType: ''
        }]
      }
    },
    mounted() {
      this.getBidDetail();
    },
    methods: {
      getBidDetail() {
        this.biddedLoading = true;
        var proDetailUrl = "/PlantOpenTender/tenderBidService/GetTenderBidByID";
        var companyUrl = "/PlantOpenTender/companyService/GetCompanyById";
        this.$service.post(proDetailUrl, {
          tenderBidID: this.tenderBidID
        }).then((res) => {
          this.$store.unloading();
          var datas = res.result;
          this.proDetail = datas;
          this.filesList = [];
          for (let i = 0; i < datas.docPath.length; i++) {
            this.filesList.push({
              name: decodeURI(datas.docPath[i].name),
              url: Config.baseUrl + 　"/PlantOpenTender/attachmentService/FileDownLoad?name=" + datas.docPath[
                i].name + "&url=" + datas.docPath[i].url
            })
          }
        });
        this.$service.post(companyUrl, {
          id: this.id
        }).then((res) => {
          this.biddedLoading = false;
          this.$store.unloading();
          var data = res.result;
          this.companyDetail = data;
          var r = data.bankList;
          for (var i = 0; i < r.length; i++) {
            this.bankLists[i].name = r[i].bankName;
            this.bankLists[i].bankNames = r[i].branchName;
            this.bankLists[i].accountNum = r[i].nature;
            this.bankLists[i].accountType = r[i].typeName;
          }
        }).catch((res) => {
          // this.$router.push('/account/my-bidding-detail');
        });
      }
    }
  };
</script>