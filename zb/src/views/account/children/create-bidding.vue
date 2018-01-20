<style lang="less" scoped>
.index {
  min-height: 657px;
  .form-container {
    padding: 30px 80px 20px 60px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: #e7f2ff;
    .require:before {
      content: "*";
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed3f14;
    }
    .require-position85 {
      position: absolute;
      left: -85px;
    }
    .require-position110 {
      position: absolute;
      left: -110px;
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
    <div class="index">
      <Spin v-if="auditData&&auditData.auditStatus==0" fix>
        <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
      </Spin>
      <Spin v-if="auditData&&auditData.auditStatus==2" fix>
        <div>你的账号企业认证尚未通过，请重新认证！</div>
        <br>
        <Button type="primary" v-on:click="$router.push('/account/register2?id='+auditData.companyId)">重新认证</Button>
      </Spin>
      <div v-if="auditData&&auditData.auditStatus==1">
        <h2>项目信息</h2>
        <div class="form-container">
            <Form :label-width="140" ref="projectData" :model="projectData" :rules="projectRules">
                <Row type="flex" :gutter="80">
                    <Col span="12" order="1">
                        <FormItem label="项目编号 ： ">
                            <Input placeholder="非必填" v-model="projectData.number"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" order="2">
                        <FormItem prop="title" label="项目标题 ： ">
                            <Input placeholder="请输入" v-model="projectData.title"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" order="3">
                        <FormItem prop="type" label="项目类型 ： ">
                            <Cascader trigger="click" :data="cascaderData" v-model="projectData.type" @on-change="cascaderChange" @on-visible-change="cascaderVisibleChange"></Cascader>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <div v-if="(isShow && projectData.type.length) || isAllShow">
            <h2>{{difConfig.unitTitle}}</h2> 
            <div class="form-container">
                <Form :label-width="140" ref="unitData" :model="unitData" :rules="unitRules">
                    <Row type="flex" :gutter="80">
                        <Col span="12" order="1">
                            <FormItem prop="unitName" :label="difConfig.unitName + ' ：' ">
                                <Input placeholder="请输入" disabled v-model="unitData.unitName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12" order="2">
                            <FormItem prop="userName" label="联系人 ： ">
                                <Input placeholder="请输入" v-model="unitData.userName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12" order="2">
                            <FormItem prop="tel" label="联系电话 ： ">
                                <Input placeholder="请输入" v-model="unitData.tel"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12" order="2">
                            <FormItem prop="mail" label="邮箱 ： ">
                                <Input placeholder="请输入" v-model="unitData.mail"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <h2>项目要求</h2>
            <div class="form-container">
                <Form :label-width="140" ref="demandData" :model="demandData" :rules="demandRules">
                    <Row type="flex" :gutter="80">
                        <Col span="12" order="1">
                            <FormItem :label="difConfig.time1Name + ' ： '">
                              <span class="require" :class="difConfig.time1Name == '报价时间'?'require-position85':'require-position110'"></span>
                              <Row type="flex">
                                  <Col span="11" style="padding: 0">
                                      <FormItem prop="startTenderTime">
                                          <DatePicker type="datetime" :options="demandRules.disableOptions" placeholder="开始时间" v-model="demandData.startTenderTime"></DatePicker>
                                      </FormItem>
                                  </Col>
                                  <Col span="2" style="text-align: center;padding:0;">-</Col>
                                  <Col span="11" style="padding: 0">
                                      <FormItem prop="endTenderTime">
                                          <DatePicker type="datetime" :options="demandRules.disableOptions" placeholder="结束时间" v-model="demandData.endTenderTime"></DatePicker>
                                      </FormItem>
                                  </Col>
                              </Row>
                            </FormItem>
                        </Col>
                        <Col span="12" order="2">
                            <FormItem prop="publicityTime" :label="difConfig.time2Name + ' ： '">
                                <DatePicker type="datetime" :options="demandRules.disableOptions" v-model="demandData.publicityTime" placeholder="请填写日期时间" style="width: 160px"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="12" order="3">
                            <FormItem prop="money" label="是否需要保证金 ： ">
                                <Input v-model="demandData.money" v-show="demandData.isNeedEarnestMoney == 'yes'" style="width: 100px;position:absolute;left:90px;">
                                    <span slot="append">元</span>
                                </Input>
                                <RadioGroup v-model="demandData.isNeedEarnestMoney">
                                    <Radio label="yes">是</Radio>
                                    <Radio label="no">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
            <h2>项目附件</h2>
            <div class="form-container">
                <Form ref="uploadList" :label-width="140" :model="uploadList" :rules="projectData.type[0] == 100?uploadRules:uploadRules2">
                    <FormItem prop="fileList" label="附件 ： ">
                        <Upload ref="upload" 
                            :format="['jpg','jpeg','png','zip','rar','doc','docx','pdf']"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :on-success="handleSuccess"
                            :on-remove="handleRemove"
                            :before-upload="beforeUpload"
                            :default-file-list="uploadList.fileList"
                            :max-size="5120"
                            :action="baseUrl">
                        <Button type="text" size="large" icon="ios-cloud-upload-outline" style="color: #007ACC">上传附件</Button>
                        </Upload>
                    </FormItem>
                </Form>
                </Form>
            </div>
            <h2>其他要求</h2>
            <div class="form-container">
                <Form :label-width="140" ref="othersData" :model="othersData" :rules="othersRules">
                    <FormItem prop="demand" :label="difConfig.demandName + ' ： '">
                        <Input type="textarea" v-model="othersData.demand" placeholder="请输入..."></Input>
                    </FormItem>
                    <FormItem prop="clause" label="奖扣条款 ： ">
                        <Input type="textarea" v-model="othersData.clause" placeholder="请输入..."></Input>
                    </FormItem>
                    <FormItem  prop="other" label="其他要约 ： ">
                        <Input type="textarea" v-model="othersData.other" placeholder="请输入..."></Input>
                    </FormItem>
                </Form>
            </div>
            <h2 v-if="difConfig.isShowOnly">选择供应商</h2>
            <div class="form-container" v-if="difConfig.isShowOnly">
                <Row type="flex" :gutter="80">
                    <Col span="12" order="1">
                        <Form :label-width="140" ref="othersData" :model="othersData" :rules="othersRules">
                            <FormItem prop="provideCompany" label="选择供应商 : ">
                                <Select v-model="othersData.provideCompany" filterable placement="top">
                                    <Option v-for="item in supplierList" :value="item.key" :key="item.key">{{ item.value }}</Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
        
        <div class="detail-button">
            <Button type="primary" style="width: 200px;margin-right: 30px;" size="large" @click="save()">保存</Button>
            <Button type="error" style="width: 200px" size="large" @click="saveAndPublish()">保存并发布</Button>
        </div>
    </div>
  </div>
</template>
<script>
import { getUserInfo, getCompanyInfo } from "../../../config/util";
import config from "../../../config/config";
export default {
  data() {
    //  验证邮箱函数
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
    //  验证三级级联函数
    const validateProjectData = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("项目类型不能为空"));
      } else {
        callback();
      }
    };
    // 验证供应商选择函数
    const validateSupplier = (rule, value, callback) => {
      if (!value) {
        callback(new Error("单一来源项目必须选择供应商"));
      } else {
        callback();
      }
    };
    return {
      baseUrl: config.baseUrl + "/PlantOpenTender/inviteBidService/UploadAttachments",
      isShow: false,
      isAllShow: false,
      auditData: {},
      projectData: {
        number: "",
        title: "",
        type: []
      },
      projectRules: {
        title: [
          { required: true, message: "项目标题不能为空", trigger: "blur" },
          { type: "string", max: 40, message: "字数不能超过40个", trigger: "blur" }
        ],
        type: [
          {
            required: true,
            validator: validateProjectData,
            trigger: "change"
          }
        ]
      },
      unitData: {
        unitName: "",
        userName: "",
        tel: "",
        mail: ""
      },
      unitRules: {
        unitName: [{ required: true, message: "单位名称不能为空", trigger: "blur" }],
        userName: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
        tel: [{ required: true,message: "联系电话不能为空", trigger: "blur" },{ validator: validatePhone, trigger: "blur" }],
        mail: [{ required: true,message: "邮箱地址不能为空",  trigger: "blur" },{ validator: validateEmail, trigger: "blur" }]
      },
      demandData: {
        startTenderTime: "",
        endTenderTime: "",
        publicityTime: "",
        isNeedEarnestMoney: "yes",
        money: ""
      },
      demandRules: {
        startTenderTime: [
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
        endTenderTime: [
          {
            type: "method",
            validator: (rule, value, callback) => {
              try {
                let t = value.getTime();
                let now = this.demandData.startTenderTime || new Date().getTime();
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
        publicityTime: [
          {
            required: true,
            type: "method",
            validator: (rule, value, callback) => {
              try {
                let t = value.getTime();
                let now = this.demandData.endTenderTime || new Date().getTime();
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
            message: "公示时间不能早于投标/报价结束时间",
            trigger: "change"
          },
          {
            required: true,
            type: "date",
            message: "请选择日期和时间",
            trigger: "change"
          }
        ],
        money: [
          {
            required: true,
            type: "method",
            validator: (rule, value, callback) => {
              if (!value&&this.demandData.isNeedEarnestMoney == "yes") {
                callback(new Error("请输入保证金"));
              } 
              else{
                callback();
              }
            },
            message: "请输入保证金",
            trigger: "blur"
          },
          {
            type: "method",
            validator: (rule, value, callback) => {
              if (value && (isNaN(parseFloat(value)) || !isFinite(value))) {
                callback(new Error("请输入数字"));
              }
              else{
                callback();
              }
            },
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        disableOptions: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          }
        }
      },
      othersData: {
        demand: "",
        clause: "",
        other: "",
        provideCompany: 0
      },
      othersRules: {
        demand: [
          { type: "string", max: 200, message: "字数不能超过200个", trigger: "blur" }
        ],
        clause: [
          { type: "string", max: 200, message: "字数不能超过200个", trigger: "blur" }
        ],
        other: [
          { type: "string", max: 200, message: "字数不能超过200个", trigger: "blur" }
        ],
        provideCompany: [{ required: true,validator: validateSupplier, trigger: "blur" }]
      },
      uploadRules: {
        fileList: [{ required: true, type: 'array', min: 1, message: '招标项目上传附件不能为空', trigger: 'change' },
                    { type: 'array', max: 5, message: '上传数量不能超过5个', trigger: 'change' }]
      },
      uploadRules2: {
        fileList: []
      },
      uploadList:{
        fileList: []
      },
      difConfig: {
        unitTitle: "", //招标单位信息 ｜采购单位信息
        unitName: "", // 招标单位 ｜ 采购单位
        time1Name: "", //投标报名时间 ｜报价时间
        time2Name: "", //开标时间 ｜ 公示时间
        // isShowQuote: true, //是否显示报价form
        demandName: "", //投标单位要求 ｜ 报价单位要求
        isShowOnly: "" //单一来源是否显示选择供应商
      },
      cascaderData: [],
      supplierList: []
    };
  },
  mounted() {
    this.auditData = getCompanyInfo();
    this.getMyCompany();
    this.getUserInfo();
    this.getTypeList();
    this.getSupplierList();
    if (this.$router.currentRoute.path == "/account/edit-bidding") {
      this.isAllShow = true;
      this.getEditDetail();
    }
  },
  methods: {
    getEditDetail() {
      this.$service
        .post("/PlantOpenTender/inviteBidService/GetById", {
          id: this.$route.query.id
        })
        .then(data => {
          this.projectData.id = data.result.id;
          this.projectData.title = data.result.title;
          this.projectData.number = data.result.number;
          this.$service.post("/PlantOpenTender/dictionaryService/GetPathById",{id: data.result.typeId}).then(data=>{
            let list = [];
            list[0] = data.result.id;
            if (data.result.child) {
              list[1] = data.result.child.id;
              if (data.result.child.child) {
                list[2] = data.result.child.child.id
              }
            }
            this.projectData.type = list;
            this.cascaderChange(list);
          });

          this.unitData.unitName = data.result.inviteBidCompanyName;
          this.unitData.userName = data.result.contactPerson;
          this.unitData.tel = data.result.contactNumber;
          this.unitData.mail = data.result.email;
          this.demandData.startTenderTime = new Date(data.result.startTenderTime);
          this.demandData.endTenderTime = new Date(data.result.endTenderTime);
          this.demandData.publicityTime = new Date(data.result.publicityTime);
          this.demandData.isNeedEarnestMoney = data.result.isNeedEarnestMoney
            ? "yes"
            : "no";
          this.demandData.money = data.result.earnestMoney == 0 ? "" : data.result.earnestMoney.toString();
          this.othersData.demand = data.result.tenderBidUnitRequirements;
          this.othersData.clause = data.result.rewardsAndPunishmentClause;
          this.othersData.other = data.result.otherAppointments;
          this.othersData.provideCompany = data.result.tenderBidCompanyId;
          this.uploadList.fileList = data.result.attachments;
          this.uploadList.fileList.map(item=> {
            item.name = decodeURI(item.name);
            return item;
          });
        });
    },
    getMyCompany() {
      this.$service
        .post("/PlantOpenTender/companyService/GetMyCompany", {})
        .then(data => {
          this.unitData.unitName = data.result.name;
        });
    },
    getUserInfo() {
      this.$service
        .post("/ZK/profile/GetCurrentUserProfileForEdit", {})
        .then(data => {
          this.unitData.userName = data.result.name;
          this.unitData.mail = data.result.emailAddress;
          this.unitData.tel = data.result.phoneNumber;
        });
    },
    getParams() {
      var params = {
        number: this.projectData.number,
        title: this.projectData.title,
        typeId: this.projectData.type[this.projectData.type.length - 1],
        contactPerson: this.unitData.userName,
        contactNumber: this.unitData.tel,
        email: this.unitData.mail,
        startTenderTime: this.demandData.startTenderTime,
        endTenderTime: this.demandData.endTenderTime,
        publicityTime: this.demandData.publicityTime,
        tenderBidUnitRequirements: this.othersData.demand,
        rewardsAndPunishmentClause: this.othersData.clause,
        otherAppointments: this.othersData.other,
        attachments: this.uploadList.fileList,
        isNeedEarnestMoney: this.demandData.isNeedEarnestMoney == "yes",
        earnestMoney: parseInt(this.demandData.money) || 0
      };
      if(this.$router.currentRoute.path == "/account/edit-bidding") {
        params.id = this.projectData.id;
      }
      if (this.difConfig.isShowOnly) {
        params.tenderBidCompanyId = this.othersData.provideCompany;
      }
      return params;
    },
    getTypeList() {
      // 获取可选类型列表
      this.$service
        .post("/PlantOpenTender/dictionaryService/GetInviteBidTypeTree", {})
        .then(data => {
          var list = data.result;
          var params = [];

          var formate = function(items) {
            items.forEach(item => {
              item.value = item.id;
              item.label = item.name;
              if (item.children && item.children instanceof Array) {
                formate(item.children);
              }
            });
          };
          formate(data.result);
          this.cascaderData = data.result;
        });
    },
    getSupplierList() {
      // 获取供应商列表
      this.$service
        .post("/PlantOpenTender/companyService/GetSupplierList", {})
        .then(data => {
          this.supplierList = data.result;
        });
    },
    validateAll() {
      const validateNames = [
        "projectData",
        "unitData",
        "demandData",
        "uploadList",
        "othersData"
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
    save() {
      //保存
      let validate = this.validateAll();
      if (validate) {
        this.$Modal.confirm({
          title: "确认保存该项目",
          content: "<p style='font-size: 14px;'>您确定保存该项目吗？</p>",
          loading: true,
          onOk: () => {
            let params = this.getParams();
            let url = this.$router.currentRoute.path == "/account/edit-bidding" ? "/PlantOpenTender/inviteBidService/Update" : "/PlantOpenTender/inviteBidService/Add";
            this.$service
              .post(url, {
                dto: params
              })
              .then(data => {
                this.$Modal.remove();
                this.$Message.success("项目保存成功");
                this.$router.push("/account/my-bidding");
              });
          }
        });
      }
    },
    saveAndPublish() {
      //保存并发布
      let validate = this.validateAll();
      if (validate) {
        this.$Modal.confirm({
          title: "确认发布该项目",
          content: "<p style='font-size: 14px;'>您确定发布该项目吗？</p>",
          loading: true,
          onOk: () => {
            let params = this.getParams();
            let url = this.$router.currentRoute.path == "/account/edit-bidding" ? "/PlantOpenTender/inviteBidService/UpdateAndPublish" : "/PlantOpenTender/inviteBidService/AddAndPublish";
            this.$service
              .post(url, {
                dto: params
              })
              .then(data => {
                this.$Modal.remove();
                this.$Message.success("项目发布成功");
                this.$router.push("/account/my-bidding");
              });
          }
        });
      }
    },
    cascaderChange(val) {
      this.projectData.type = val;
      this.difConfig.projectTitle = val[0] == 100 ? "招标项目信息" : "询价项目信息";
      this.difConfig.unitTitle = val[0] == 100 ? "招标单位信息" : "采购单位信息";
      this.difConfig.unitName = val[0] == 100 ? "招标单位" : "采购单位";
      this.difConfig.time1Name = val[0] == 100 ? "投标报名时间" : "报价时间";
      this.difConfig.time2Name = val[0] == 100 ? "开标时间" : "公示时间";
      this.difConfig.isShowQuote = val[0] == 100;
      this.difConfig.demandName = val[0] == 100 ? "投标单位要求" : "报价单位要求";
      //todo 此处需处理
      this.difConfig.isShowOnly = val[0] == 101 && val[1] == 1011;
    },
    cascaderVisibleChange(state) {
      this.isShow = !state;
    },
    handleSuccess(response) {
      this.uploadList.fileList.push({
        name: response.result[0].name,
        url: response.result[0].url
      });
    },
    handleRemove(file) {
      let index;
      for (let i = 0; i < this.uploadList.fileList.length; i++) {
        try {
          if (this.uploadList.fileList[i].url == file.response.result[0].url) {
            index = i;
            break;
          }
        } catch (error) {
          if (this.uploadList.fileList[i].url == file.url) {
            index = i;
            break;
          }
        }
        
      }
      this.uploadList.fileList.splice(index, 1);
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
      if (this.uploadList.fileList.length > 4) {
        this.$Notice.warning({
          title: "最多上传5个文件",
          desc: "上传文件不能超过5个。"
        });
        return false
      }
      if (this.uploadList.fileList.length > 0) {
        for ( let i = 0;i<this.uploadList.fileList.length;i++ ) {
          if ( file.name == this.uploadList.fileList[i].name ) {
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
    isNeedEarnestMoney(){
      return this.demandData.isNeedEarnestMoney;
    },
    filesList() {
      return this.uploadList.fileList;
    }
  },
  watch:{
    isNeedEarnestMoney(){
      this.$refs["demandData"].validateField("money");
    },
    filesList(){
      this.$refs["uploadList"].validateField("fileList");
    }
  }
};
</script>