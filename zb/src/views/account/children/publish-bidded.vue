<style lang="less" scoped>
.container {
  min-height: 667px;
  .datail-info-header {
    background-color: #e7f2ff;
    padding: 10px 25px 25px 20px;
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
    .detail-col-margin {
      margin-bottom: 10px;
    }
    .item-download {
      color: #0950a0;
      font-weight: bolder;
    }
    .item-download:before {
      content: url("../../../images/attach.png");
      width: 16px;
      height: 16px;
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
  .content {
    background-color: #e7f2ff;
    padding: 20px 60px;
    margin: 15px auto;
    .require:before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
    .require-position {
      position: absolute;
      left: -95px;
    }
  }
  .candidate {
    margin: 15px auto;
    .candidate-header {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      font-weight: bolder;
      margin-bottom: 3px;
      background-color: #e7f2ff;
      .col-first {
        text-align: center;
        border-right: 3px solid #ffffff;
      }
      .col {
        padding: 0 20px;
      }
    }
    .candidate-content {
      min-height: 40px;
      line-height: 40px;
      font-size: 14px;
      background-color: #e7f2ff;
      margin-bottom: 3px;
      .col-first {
        text-align: center;
        font-size: 14px;
        font-weight: bolder;
        border-right: 3px solid #ffffff;
      }
      .col {
        padding: 0 20px;
      }
      .arrow {
        color: #007acc;
      }
      .arrow:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
    <div class="container">
        <div class="datail-info-header">
            <div class="title"><span class="title-span1">{{bidDetailData.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span @click="isDownload=true" class="download">
              <Icon type="android-attach" size='16' class="dowloundIcon"></Icon>
              下载附件
            </span></div>
            <Row type="flex">
                <Col class-name="detail-col-margin" span="6" order="1">招标单位 ：<strong>{{bidDetailData.inviteBidCompanyName}}</strong></Col>
                <Col span="6" order="2">项目编号 ：<strong>{{bidDetailData.number}}</strong></Col>
                <Col span="6" order="3">项目类型 ：<strong>{{bidDetailData.typeName}}</strong></Col>
                <Col span="6" order="4" v-if="bidDetailData.isNeedEarnestMoney">投标保证金 ：<strong>{{bidDetailData.earnestMoney}}元人民币</strong></Col>
                <Col span="6" order="5">&nbsp;&nbsp;&nbsp;联系人 ：<strong>{{bidDetailData.contactPerson}}</strong></Col>
                <Col span="6" order="6">联系方式 ：<strong>{{bidDetailData.contactNumber}}</strong></Col>
            </Row>
        </div>
        <h2 style="margin-top: 10px;">已选候选人</h2>
        <div class="candidate">
            <Row class-name="candidate-header">
                <Col class-name="col-first col" span="3">候选人</Col>
                <Col class-name="col" span="6">投标公司名称</Col>
                <Col class-name="col"span="15">投标说明</Col>
            </Row>
            <Row class-name="candidate-content"  v-for="(item,index) in candidateList" :key="item.id">
                <Col class-name="col-first col" span="3">第{{index + 1}}候选人</Col>
                <Col class-name="col" span="6">{{item.corpName}}<span class="arrow" @click="up(index)" v-if="index>0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="arrow-up-c"></Icon>上移</span><span class="arrow" @click="down(index)" v-if="index<candidateList.length-1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="arrow-down-c"></Icon>下移</span></Col>
                <Col class-name="col" span="15">{{item.tenderRemark}}</Col>
            </Row>
        </div>
        <!-- <Table :row-class-name="tableInfoRowClass" :columns="colList" :data="candidateList"></Table> -->
        <h2>中标公示</h2>
        <div class="content">
            <Form :label-width="120" ref="publishData" :model="publishData" :rules="publishRules">
                <Row type="flex" :gutter="80">
                    <Col span="24" order="1">
                        <FormItem prop="explanation" label="公示说明  : ">
                            <Input  type="textarea" placeholder="非必填" v-model="publishData.explanation"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" order="2">
                        <FormItem label="公示有效期 ： ">
                          <span class="require require-position"></span>
                            <Row type="flex">
                                <Col span="11" style="padding: 0">
                                    <FormItem prop="startExpiryDate">
                                        <DatePicker type="datetime" :options="disableOptions" placeholder="开始时间" v-model="publishData.startExpiryDate"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="2" style="text-align: center;padding:0;">-</Col>
                                <Col span="11" style="padding: 0">
                                    <FormItem prop="endExpiryDate">
                                        <DatePicker type="datetime" :options="disableOptions" placeholder="结束时间" v-model="publishData.endExpiryDate"></DatePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                    <Col span="12" order="3">
                        <FormItem prop="inviteBidContactPerson" label="联系人 ： ">
                            <Input placeholder="请输入" v-model="publishData.inviteBidContactPerson"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" order="4">
                        <FormItem prop="inviteBidContactNumber" label="联系电话 ： ">
                            <Input placeholder="请输入" v-model="publishData.inviteBidContactNumber"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" order="5">
                        <FormItem prop="inviteBidEmail" label="邮箱 ： ">
                            <Input placeholder="请输入" v-model="publishData.inviteBidEmail"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <h2>项目附件</h2>
        <div class="content">
            <Form ref="uploadList" :label-width="120" :model="publishData" :rules="typeId == 100 ? publishRules: publishRules2">
                <FormItem prop="attachments" label="附件 ： ">
                    <Upload ref="upload" 
                        :format="['jpg','jpeg','png','zip','rar','doc','docx','pdf']"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :on-success="handleSuccess"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        :max-size="5120"
                        :action="baseUrl">
                    <Button type="text" size="large" icon="ios-cloud-upload-outline" style="color: #007ACC">上传附件</Button>
                    </Upload>
                </FormItem>
            </Form>
        </div>
        <div class="detail-button">
            <Button type="primary" style="width: 200px;margin-right: 30px;" size="large" @click="publish()">发布</Button>
            <Button type="error" style="width: 200px" size="large" @click="$router.go(-1)">取消</Button>
        </div>
        <Modal v-model="isDownload">
          <p slot="header" style="font-size:14px;text-align:left">
              <span>下载附件</span>
          </p>
          <div style="text-align:center;padding: 0 30px">
            <span v-if="filesList.length == 0" style="font-size:14px;">暂无附件</span>
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
</template>
<script>
import config from "../../../config/config";
export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      let Emreg = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
      if (!value) {
        callback(new Error("请输入邮箱"));
      }
      if (!Emreg.test(value)) {
        callback(new Error("请输入正确格式邮箱"));
      } else {
        callback();
      }
    };
    //  验证联系电话函数
    const validatePhone = (rule, value, callback) => {
      let filter = /^1\d{10}$/;
      if (!value) {
        callback(new Error("联系电话不能为空"));
      }
      if (!filter.test(value)) {
        callback(new Error("请输入正规格式联系电话"));
      } else {
        callback();
      }
    };
    return {
      baseUrl: config.baseUrl + "/PlantOpenTender/inviteBidService/UploadAttachments",
      bidDetailData: {},
      filesList: [],
      isDownload: false,
      typeId: 100,
      publishData: {
        inviteBidId: 0,
        winBidCandidates: [
        ],
        explanation: "",
        startExpiryDate: "",
        endExpiryDate: "",
        inviteBidContactPerson: "",
        inviteBidContactNumber: "",
        inviteBidEmail: "",
        attachments: []
      },
      candidateList: [],
      disableOptions: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      publishRules: {
        startExpiryDate: [
          {
            type: "method",
            validator: (rule, value, callback) => {
              try {
                let t = value.getTime();
                let now = new Date().getTime();
                if (t < now) {
                  callback(["error"]);
                } 
                else{
                  callback();
                }
              } catch (error) {
                callback();
              }
            },
            message: "开始时间不能早于当前时间",
            trigger: "change"
          },
          {
            required: true,
            type: "date",
            message: "请选择日期和时间",
            trigger: "change"
          }
        ],
        endExpiryDate: [
          {
            type: "method",
            validator: (rule, value, callback) => {
              try {
                let t = value.getTime();
                let now = this.publishData.startExpiryDate || new Date().getTime();
                if (t <= now) {
                  callback(["error"]);
                } 
                else{
                  callback();
                }
              } catch (error) {
                callback();
              }
            },
            message: "结束时间不能早于开始时间",
            trigger: "change"
          },
          {
            required: true,
            type: "date",
            message: "请选择日期和时间",
            trigger: "change"
          }
        ],
        inviteBidContactPerson: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        inviteBidContactNumber: [
          { required: true, message: "联系电话不能为空", trigger: "blur" },
          { type: "method",validator: validatePhone,message: "联系电话格式不正确"}
        ],
        inviteBidEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "method",validator: validateEmail,message: "邮箱格式不正确" ,trigger: "blur"}
        ],
        attachments: [{ required: true, type: 'array', min: 1, message: '招标项目上传附件不能为空', trigger: 'change' },
          { type: 'array', max: 5, message: '上传数量不能超过5个', trigger: 'change' }
        ]
      },
      publishRules2: {
        attachments: []
      }
    };
  },
  mounted() {
    this.getBidDetail();
    try {
      this.candidateList = JSON.parse(decodeURI(this.$route.query.candidates));
    } catch (error) {
      this.candidateList = [];
    }
  },
  methods: {
     validateAll() {
      const validateNames = [
        "publishData",
        "uploadList",
      ];
      let validate = true;
      for (let i = 0; i < validateNames.length; i++) {
        this.$refs[validateNames[i]].validate(valid => {
          if (!valid) {
            validate = false;
          }
        });
      }
      return validate;
    },
    publish() {
      let validate = this.validateAll();
      if (validate) {
        this.$Modal.confirm({
          title: "确定发布中标公示",
          content: "您确认要发布项目公示吗？",
          loading: true,
          onOk: () => {
            this.getPrams();
            this.$service
                .post("/PlantOpenTender/winBidPublicityService/Publish", {
                dto: this.publishData
                })
                .then(data => {
                    this.$Modal.remove();
                    this.$Message.success("中标公示发布成功！");
                    this.$router.push("/account/my-bidding");
                });
          }
        });
      } 
    },
    up(index) {
      var a = this.candidateList[index];
      var b = this.candidateList[index - 1];
      this.candidateList.splice(index, 1, b);
      this.candidateList.splice(index - 1, 1, a);
    },
    down(index) {
      var a = this.candidateList[index];
      var b = this.candidateList[index + 1];
      this.candidateList.splice(index, 1, b);
      this.candidateList.splice(index + 1, 1, a);
    },
    getPrams() {
      this.publishData.inviteBidId = this.bidDetailData.id;
      this.publishData.winBidCandidates = [];
      for (let i = 0; i < this.candidateList.length; i++) {
        let item = {
          id: this.candidateList[i].id,
          sortNum: i
        };
        this.publishData.winBidCandidates.push(item);
      }
    },
    getBidDetail() {
      // 根据投标ID ，获取投标详情
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetById", {
          id: this.$route.query.id
        })
        .then(data => {
          this.bidDetailData = data.result;
          this.filesList = [];
          for(let i=0;i<this.bidDetailData.attachments.length;i++) {
            this.filesList.push({
              name: decodeURI(this.bidDetailData.attachments[i].name),
              url:  config.baseUrl +　"/PlantOpenTender/attachmentService/FileDownLoad?name="+ this.bidDetailData.attachments[i].name +"&url=" + this.bidDetailData.attachments[i].url
            })
          }
          this.$service.post("/PlantOpenTender/dictionaryService/GetPathById",{id: data.result.typeId}).then(data=>{
            this.typeId = data.result.id;
          });
          this.publishData.inviteBidContactPerson = data.result.contactPerson;
          this.publishData.inviteBidContactNumber = data.result.contactNumber;
          this.publishData.inviteBidEmail = data.result.email;
        });
    },
    handleSuccess(response) {
      this.publishData.attachments.push({
        name: response.result[0].name,
        url: response.result[0].url
      });
    },
    handleRemove(file) {
      let index;
      for (let i = 0; i < this.publishData.attachments.length; i++) {
        if (this.publishData.attachments[i].url == file.response.result[0].url) {
          index = i;
          break;
        }
      }
      this.publishData.attachments.splice(index, 1);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正确",
        desc:
          "文件 " + file.name + " 格式不正确，只支持zip、rar、doc、docx、pdf、jpeg、jpg、png 格式。"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超过 5M。"
      });
    },
    beforeUpload(file) {
      if (this.publishData.attachments.length >4 ) {
        this.$Notice.warning({
          title: "最多上传5个文件",
          desc: "上传文件不能超过5个。"
        });
        return false
      }
      if (this.publishData.attachments.length > 0) {
        for ( let i = 0;i<this.publishData.attachments.length;i++ ) {
          if ( file.name == this.publishData.attachments[i].name ) {
            this.$Notice.warning({
              title: "上传文件重复",
              desc: "不可上传同一份文件"
            });
            return false;
          }
        }
      }
    }
  },
  computed:{
    uploadList() {
      return this.publishData.attachments;
    }
  },
  watch:{
    uploadList(){
      this.$refs["uploadList"].validateField("attachments");
    }
  }
};
</script>
