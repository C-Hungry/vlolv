<style scoped lang="less">
  .tobid-index {
    min-height: 667px;
    position: relative;
    .company-info,
    .bidding-info {
      width: 100%;
      padding: 20px;
      background: rgb(231, 242, 255);
    }
    .download {
      cursor: pointer;
      color: #2d8cf0;
    }
    .download:hover {
      color: #39afff;
    }


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
  <div class="tobid-index">
    <Spin v-if="auditData&&auditData.auditStatus==0" fix>
      <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
    </Spin>
    <Spin v-if="auditData&&auditData.auditStatus==2" fix>
      <div>你的账号企业认证尚未通过，请重新认证！</div>
      <br>
      <Button type="primary" v-on:click="$router.push('/account/register2?id='+auditData.companyId)">重新认证</Button>
    </Spin>
    <div v-if="auditData&&auditData.auditStatus==1">
      <div class="bidded-info">
        <div class="datail-info-header">
          <div class="title">
            <span class="title-span1">{{params.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span @click="isDownload=true" class="download">
              <Icon type="android-attach" size='16' class="dowloundIcon"></Icon>
              下载附件
            </span>
          </div>
          <!--<div class="bidded-number">已投标： {{params.tenderBidCompaniesCount}} 家</div>-->
          <Row type="flex">
            <Col class-name="detail-col-margin" span="6" order="1">招标单位 ：
            <strong>{{params.inviteBidCompanyName}}</strong>
            </Col>
            <Col span="6" order="2">项目编号 ：
            <strong>{{params.number}}</strong>
            </Col>
            <Col span="6" order="3">项目类型 ：
            <strong>{{params.typeName}}</strong>
            </Col>
            <Col span="6" order="4">
            <strong>投标保证金 ： {{params.earnestMoney}}元人民币
            </strong>
            </Col>
            </strong>
            </Col>
            <Col span="6" order="5">&nbsp;&nbsp;&nbsp;联系人 ：
            <strong>{{params.contactPerson}}</strong>
            </Col>
            <Col span="6" order="6">联系方式 ：
            <strong>{{params.contactNumber}}</strong>
            </Col>
          </Row>
        </div>
      </div>

      <div class="bidding-info">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="投标说明：" prop='tenderRemark'>
            <Input v-model="formValidate.tenderRemark" type="textarea" :autosize="{minRows: 2,maxRows:10}" placeholder="非必填...字数不得多余40个文字。"></Input>
          </FormItem>

          <FormItem label="附件：" prop="fileList">
            <Upload ref="" style="width:550px;" :on-success="handleSuccess" :on-remove="handleRemove" :action="baseUrl+'/PlantOpenTender/tenderBidService/TenderUpload'"
              :on-exceeded-size="handleMaxSize" :default-file-list="formValidate.fileList" :max-size="5120" :before-upload="handleBeforeUpload"
              :on-format-error="handleFormatError" :format="['jpg','jpeg','png','rar','zip','doc','docx','pdf']">
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
            <Button type="primary" @click='updata("formValidate")' :disabled='onOff'>提交</Button>
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
        ti: '',
        // 服务器时间
        servTime: '',
        // 投标id
        tenderBidID: this.$route.query.tenderBidID ? this.$route.query.tenderBidID : 0,
        // 招标项目id
        id: this.$route.query.id ? this.$route.query.id : 0,
        tenderBidStatus: 1,
        params: {},
        auditData: {},
        baseUrl: Config.baseUrl,
        // 下载列表数组
        filesLists: [],
        //  按钮禁止控制开关
        onOff: false,
        // 下载模态框显示开关
        isDownload: false,
        //  投标人 信息 
        formValidate: {
          tenderRemark: "",
          linkMan: "",
          linkPhon: "",
          linkEmail: "",
          // 上传列表数组
          fileList: [],
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
          }],
          fileList: [{
              required: true,
              type: 'array',
              min: 1,
              message: '上传附件不能为空',
              trigger: 'change'
            },
            {
              type: 'array',
              max: 5,
              message: '上传数量不能超过5个',
              trigger: 'change'
            }
          ],
        }
      }
    },
    mounted() {
      var r = this.$route.query.tenderBidID;
      if (!r || r == undefined) {
        this.getMyCompany();
      } else {
        this.getFormValidate();
      }
      this.getBidDetail();
      this.auditData = getCompanyInfo();
    },
    methods: {
      // 提交函数
      updata(name) {
        var param = {
          'id': this.tenderBidID,
          "tenderRemark": this.formValidate.tenderRemark,
          "linkMan": this.formValidate.linkMan,
          "linkPhon": this.formValidate.linkPhon,
          "linkEmail": this.formValidate.linkEmail,
          "inviteBidID": this.id,
          'tenderBidStatus': this.tenderBidStatus,
          "docPath": this.formValidate.fileList
        };

        var updataUrl = '/PlantOpenTender/tenderBidService/SaveTenderBid';
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.getTimes()) {
              this.$Notice.warning({
                title: '该招标项目投标时间已结束！请查看其它招标项目'
              });
            } else {
              this.$Modal.confirm({
                title: '确定',
                content: '<p>确定参与此次招标项目？</>',
                loading: true,
                onOk: () => {
                  this.onOff = !this.onOff;
                  this.$service.post(updataUrl, {
                    param
                  }).then((res) => {
                    this.$Modal.remove();
                    this.$Message.success('投标成功!');
                    this.$router.push("/account/my-bidded");
                  }).catch(err=>{
                    this.$Modal.remove();
                  });
                },
                onCancel: () => {
                  this.$Message.info("已取消！");
                }
              });
            }
          } else {
            this.$Message.error('请输入正确信息!');
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

          data.fileList = data.docPath;
          data.fileList.map(item => {
            item.name = decodeURI(item.name);
            return item;
          });
          this.formValidate = data;
        });
      },
      //  获取本公司信息
      getMyCompany() {
        this.$service
          .post("/PlantOpenTender/companyService/GetMyCompany", {})
          .then(data => {
            var userData = data.result.user;
            this.formValidate.linkMan = userData.name;
            this.formValidate.linkPhon = userData.phoneNumber;
            this.formValidate.linkEmail = userData.emailAddress;
          });
      },
      cancel() {
        window.history.go(-1);
      },
      // 验证上传文件格式函数
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传正确格式的文件。'
        });
      },
      // 文件上传成功后返回地址函数            
      handleSuccess(res) {
        this.formValidate.fileList.push({
          name: res.result[0].key,
          url: res.result[0].value
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "超出文件大小限制",
          desc: "文件 " + file.name + " 太大，不能超过 5M。"
        });
      },
      // 限制上传文件数量函数
      handleBeforeUpload(file) {
        if (this.formValidate.fileList == undefined || this.formValidate.fileList == null) {
          this.formValidate.fileList = [];
        }
        if (this.formValidate.fileList.length > 4) {
          this.$Notice.warning({
            title: "最多上传5个文件",
            desc: "上传文件不能超过5个。"
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
        // 根据id获取投标项目详情
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
      filesList() {
        return this.formValidate.fileList;
      }
    },
    watch: {
      filesList() {
        setTimeout(() => {
          this.$refs["formValidate"].validateField("fileList");
        });
      }
    }
  };
</script>