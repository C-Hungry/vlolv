<style scoped lang="less">
  .quote-index {
    min-height: 667px;
    .company-info,
    .bidding-info {
      width: 100%;
      padding: 20px;
      background: rgb(231, 242, 255);
    }
    .download {
      color: #2d8cf0;
    }
    .download:hover {
      color: #39afff;
    }

    .title {
      font-weight: 600;
      font-size: 16px;
    }

    .bidded-number {
      font-size: 16px;
      font-weight: bolder;
      color: red;
    }

    .ivu-row-flex-space-between {
      margin-top: 15px;
    }
    .ivu-form-item-label {
      width: 100px!important;
    }
    .ivu-form-item-content {
      margin-left: 100px!important;
    }
    .ivu-form-item {
      margin-bottom: 25px;
    }

    .ivu-row-flex-space-between span {
      font-weight: 600;
      font-size: 15px;
    }

    .bidding-info {
      margin-top: 20px;
    }

    .updatas-btn,
    #updatas {
      color: #0950a0;
    }

    #updatas {
      border-bottom: 1px solid #0950a0;
      margin-bottom: 1px;
    }

    .format-support {
      color: gray;
      font-size: 11px;
    }

    .ivu-btn {
      background: transparent;
      border: none;
    }

    .ivu-btn-primary {
      background: rgb(9, 80, 160);
    }
  }
</style>
<template>
  <div class="quote-index">
    <Spin v-if="auditData&&auditData.auditStatus==0" fix>
      <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
    </Spin>
    <Spin v-if="auditData&&auditData.auditStatus==2" fix>
      <div>你的账号企业认证尚未通过，请重新认证！</div>
      <br>
      <Button type="primary" v-on:click="$router.push('/account/register2?id='+auditData.companyId)">重新认证</Button>
    </Spin>
    <div v-if="auditData&&auditData.auditStatus==1">
      <!-- 展示采购商信息 -->
      <div class="company-info">
        <Row>
          <Col span="18">
          <span class="title">{{params.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <Icon type="android-attach" size='20' color='#0c53a1' class="dowloundIcon"></Icon>
          <a @click="isDownload=true" class="download">下载项目文件</a>
          </Col>
          <!--<Col span="6" align='right' >
            <span class="bidded-number">已报价:&nbsp;{{params.tenderBidCompaniesCount}}&nbsp;家</span>
          </Col>-->
        </Row>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="7">采购单位:
          <span>{{params.inviteBidCompanyName}}</span>
          </Col>
          <Col span="5" align='left'>项目编号:
          <span>{{params.number}}</span>
          </Col>
          <Col span="5" align='center'>项目类型:
          <span>{{params.typeName}}</span>
          </Col>
          <Col span="5" align='right'>投标保证金:
          <span>{{params.earnestMoney}}</span>万元</Col>
        </Row>
        <Row type="flex" justify="space-between" class="code-row-bg">
          <Col span="7">联系人:
          <span>{{params.contactPerson}}</span>
          </Col>
          <Col span="5" align='left'>联系方式:
          <span>{{params.contactNumber}}</span>
          </Col>
          <Col span="5">
          <span></span>
          </Col>
          <Col span="5" align='right'>
          <span></span>
          </Col>
        </Row>
      </div>
      <div class="bidding-info">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="报价说明：" prop='tenderRemark'>
            <Input v-model="formValidate.tenderRemark" type="textarea" :autosize="{minRows: 2,maxRows:10}" placeholder="非必填...字数不得多余40个文字。"></Input>
          </FormItem>

          <FormItem label="附件：" prop='fileList'>
            <Upload ref="" style="width:550px;" :on-success="handleSuccess" :before-upload="handleBeforeUpload" :on-remove="handleRemove"
              :on-format-error="handleFormatError" :default-file-list="formValidate.fileList" :format="['jpg','jpeg','png','rar','zip','doc','docx','pdf']"  :on-exceeded-size="handleMaxSize" 
              :max-size="5120" :action="baseUrl+'/PlantOpenTender/tenderBidService/TenderUpload'">
              <Button class="updatas-btn" type="text" icon="ios-cloud-upload-outline" style="width:100px;">
                <span id="updatas">上传附件</span>
              </Button>
              <span class="format-support">(支持拓展名:.RAR .ZIP .DOC .DOCX .PDF .JPG ...文件内容最大不可超过5MB!)</span>

            </Upload>
          </FormItem>

          <FormItem label="联系人:" class="dis-inline" prop="linkMan">
            <Input v-model="formValidate.linkMan" placeholder="请输入联系人"></Input>
          </FormItem>

          <FormItem label="电话：" class="dis-inline" prop="linkPhon">
            <Input v-model="formValidate.linkPhon" placeholder="请输入电话"></Input>
          </FormItem>
          <div>

            <FormItem label="邮箱：" class="dis-inline" prop="linkEmail">
              <Input v-model="formValidate.linkEmail" placeholder="请输入邮箱"></Input>
            </FormItem>
          </div>

          <FormItem>
            <Button type="primary" @click='updata("formValidate")' :disabled='onOff'>报价</Button>
            <Button type="ghost" @click='cancel' style="margin-left: 8px;background: rgb(9, 80, 160);color:#fff;">取消</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 下载列表模态框 -->
      <Modal v-model="isDownload">
        <p slot="header" style="font-size:14px;text-align:left">
          <span>下载附件</span>
        </p>
        <div style="text-align:center;padding: 0 30px">
          <span v-if="filesLists.length == 0" style="font-size:14px;">暂无附件</span>
          <Row v-for="(item,index) in filesLists" :key="index" style="margin-bottom:5px;font-size:14px;">
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
  </div>
</template>
<script>
  import Config from "../../../config/config";
  import { getCompanyInfo } from "../../../config/util";

  export default {

    data() {
      //  验证邮箱函数
      const validateEmail = (rule, value, callback) => {
        // let Emreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        let Emreg =
          /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
        if (!value) {
          callback(new Error('请输入邮箱'));
        }
        if (!Emreg.test(value)) {
          callback(new Error('请输入正确格式邮箱'));
        } else {
          callback();
        }
      };
      //  验证联系电话函数            
      const validatePhone = (rule, value, callback) => {
        let filter = /^1\d{10}$/;
        if (!value) {
          callback(new Error('联系电话不能为空'));
        }
        if (!filter.test(value)) {
          callback(new Error('请输入正规格式联系电话'));
        } else {
          callback();
        }
      };

      return {
        tenderBidID: this.$route.query.tenderBidID ? this.$route.query.tenderBidID : 0,
        id: this.$route.query.id ? this.$route.query.id : 0,
        params: {},
        baseUrl: Config.baseUrl,
        filesLists: [],
        onOff: false,
        ti: '',
        auditData: {},
        servTime: '',
        isDownload: false,
        tenderBidStatus: 1,
        formValidate: {
          tenderRemark: "",
          linkMan: "",
          linkPhon: "",
          linkEmail: "",
          filesList: []
        },
        ruleValidate: {
          tenderRemark: [{
            type: "string",
            max: 40,
            message: "字数不能超过40个",
            trigger: "blur"
          }],
          linkPhon: [{
            required: true,
            validator: validatePhone,
            trigger: 'blur'
          }],
          linkEmail: [{
            required: true,
            validator: validateEmail,
            trigger: 'blur'
          }],
          linkMan: [{
            required: true,
            message: "联系人不能为空",
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      // this.$store.loading();
      this.auditData = getCompanyInfo();
      var r = this.$route.query.tenderBidID;
      if (!r || r == undefined) {
        this.getMyCompany();
      } else {
        this.getFormValidate();
      }
      this.getBidDetail();
    },
    methods: {
      updata(name) {
        var param = {
          'id': this.tenderBidID,
          "tenderRemark": this.formValidate.tenderRemark,
          "linkMan": this.formValidate.linkMan,
          "linkPhon": this.formValidate.linkPhon,
          "linkEmail": this.formValidate.linkEmail,
          'tenderBidStatus': this.tenderBidStatus,
          "inviteBidID": this.id,
          "docPath": this.formValidate.fileList
        };
        let updataUrl = '/PlantOpenTender/tenderBidService/SaveTenderBid';
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.getTimes()) {
              this.$Notice.warning({
                title: '该招标项目投标时间已结束！请查看其它招标项目'
              });
            } else {
              this.$Modal.confirm({
                title: '确定',
                content: '<p>确定参与此次项目？</>',
                loading: true,
                onOk: () => {
                  this.onOff = true;
                  this.$service.post(updataUrl, {
                    param
                  }).then((res) => {
                    this.$Modal.remove();
                    this.$Message.success('报价成功!');
                    this.$router.push("/account/my-bidded");
                  }).catch(err=>{
                    this.$Modal.remove();
                  });
                },
                onCancel: () => {
                  this.$Message.info("已取消！");
                }
              })
            }
          } else {
            this.$Message.error('请输入正确信息!');
          }
        });
      },
      //  获取本公司信息
      getMyCompany() {
        this.$store.loading();
        this.$service
          .post("/PlantOpenTender/companyService/GetMyCompany", {})
          .then(data => {
            this.$store.unloading();
            var userData = data.result.user;
            this.formValidate.linkMan = userData.name;
            this.formValidate.linkPhon = userData.phoneNumber;
            this.formValidate.linkEmail = userData.emailAddress;
          });
      },
      cancel() {
        window.history.go(-1);
      },
      handleFormatError() {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件格式不正确，请上传正确格式文件。'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "超出文件大小限制",
          desc: "文件 " + file.name + " 太大，不能超过 5M。"
        });
      },
      handleSuccess(res, file) {
        this.formValidate.fileList.push({
          'name': res.result[0].key,
          'url': res.result[0].value
        });
      },
      handleBeforeUpload(file) {
        if (this.formValidate.fileList == undefined || this.formValidate.fileList == null) {
          this.formValidate.fileList = [];
        }
        if (this.formValidate.fileList.length > 4) {
          this.$Notice.warning({
            title: '最多只能上传 5 个文件。',
            desc: "文件 " + file.name + " 太大，不能超过 5M。"
          });
          return false;
        }
        if (this.formValidate.fileList.length > 0) {
          for ( let i = 0;i<this.formValidate.fileList.length;i++ ) {
            if ( file.name == this.formValidate.fileList[i].name ) {
              this.$Notice.warning({
                title: "上传文件重复",
                desc: "不可上传同一份文件"
              });
              return false;
            }
          }
        }
      },
      handleRemove(file) {
        let index;
        for (let i = 0; i < this.formValidate.fileList.length; i++) {
          try {
            if (this.formValidate.fileList[i].url == file.response.result[0].url) {
              index = i;
              break;
            }
          } catch (error) {
            if (this.formValidate.fileList[i].url == file.url) {
              index = i;
              break;
            }
          }

        }
        this.formValidate.fileList.splice(index, 1);
      },
      getBidDetail() {
        // 根据id获取报价项目详情
        var id = this.id;
        var bidDetailUrl = "/PlantOpenTender/inviteBidService/GetById";

        this.$service.post(bidDetailUrl, {
          id
        }).then((res) => {
          this.$store.unloading();
          var datas = res.result;
          this.params = datas;
          this.ti = new Date(datas.endTenderTime);
          this.filesLists = [];
          for (let i = 0; i < datas.attachments.length; i++) {
            this.filesLists.push({
              name: decodeURI(datas.attachments[i].name),
              url: Config.baseUrl + 　
                "/PlantOpenTender/attachmentService/FileDownLoad?name=" + datas.attachments[
                  i].name + "&url=" + datas.attachments[i].url
            })
          }
        });
      },
      getFormValidate() {
        // 获取投标发布时的的投标信息
        var formUrl = "/PlantOpenTender/tenderBidService/GetTenderBidByID";
        var tenderBidID = this.tenderBidID;
        this.$service.post(formUrl, {
          tenderBidID
        }).then((res) => {
          this.$store.unloading();
          var data = res.result;
          this.formValidate = data;
          data.fileList = data.docPath;
          data.fileList.map(item => {
            item.name = decodeURI(item.name);
            return item;
          });

        });
      },
      // 获取当前时间与投标结束时间做对比 返回布尔值
      getTimes() {
        this.$service.post("/PlantOpenTender/commonService/GetServerTime", {}).then(time => {
          this.servTime = time.result;
        })
        let t = new Date(this.servTime);
        if (t.getTime() > this.ti.getTime()) {
          return true;
        } else {
          return false;
        }
      }
    },
    computed: {
      file() {
        return this.formValidate.fileList;
      }
    },
    watch: {
      file() {
        setTimeout(() => {
          this.$refs["formValidate"].validateField("fileList");
        })
      }
    }

  };
</script>