<style scoped lang="less">
.register-title {
  background-color: #e7f2ff;
  border-bottom: solid 3px #c8e1fe;
  line-height: 60px;
  padding: 0 20px;
  font-size: 20px;
  font-weight: bold;
  display: block;
}
.register-content {
  border: solid 2px #e7f2ff;
  border-top: 0;
  padding: 0 10%;
}
</style>
<template>
  <div>
    <div class="register-title">
      企业认证
    </div>
    <div class="register-content">
      <br><br><br>
      <register-step v-if="$store.registerModel&&$store.registerModel.id" :current="2" :items="[{index:1,title:'公司信息'},{index:2,title:'营业执照信息'},{index:3,title:'开户行信息'}]"></register-step>
      <register-step v-else :current="3" :items="[{index:1,title:'用户信息'},{index:2,title:'公司信息'},{index:3,title:'营业执照信息'},{index:4,title:'开户行信息'}]"></register-step>
      <br><br><br>
      <Form ref="formregister" :model="data" :rules="rules" :label-width="240">
        <FormItem label="营业执照号码：" prop="licenseCode">
          <Input v-model="data.licenseCode" placeholder="请输入营业执照号码" style="width: 300px;"></Input>&nbsp;&nbsp;（18位英文字母或数字）
        </FormItem>
        <FormItem label="营业执照到期时间：" prop="endDate">
          <DatePicker type="date" v-model="data.endDate" placeholder="请输入营业执照到期时间" style="width: 300px"></DatePicker>&nbsp;&nbsp;
        </FormItem>
        <FormItem label="营业执照附件：" prop="picUrl">
          <Upload :format="['jpg','jpeg','png','bmp','JPG','JPEG','PNG','BMP']" :on-format-error="handleFormatError" :action="baseUrl+'/PlantOpenTender/companyService/PicUpload'" :on-success="handleSuccess" :show-upload-list="false" style="width: 110px; display: inline-block;">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
          <a v-if="data.picUrl" :href="data.picUrlShow" target="_blank">已上传</a>
        </FormItem>
        <FormItem label="注册资本（万元）：" prop="registeredCapital">
          <Input v-model="data.registeredCapital" placeholder="请输入注册资本（万元）" style="width: 300px;"></Input>&nbsp;&nbsp;（10位以内数字）
        </FormItem>
        <FormItem label="实收资本（万元）：" prop="paidUpCapital">
          <Input v-model="data.paidUpCapital" placeholder="请输入实收资本（万元）" style="width: 300px;"></Input>&nbsp;&nbsp;（10位以内数字）
        </FormItem>
        <!-- <FormItem label="币种：" prop="currency">
                <Select v-model="data.currency" style="width:300px">
                    <Option v-for="item in currencyList" :value="item.key" :key="item.key">{{item.value}}</Option>
                </Select>
            </FormItem> -->
        <FormItem label="法人代表姓名：" prop="legalPerson">
          <Input v-model="data.legalPerson" placeholder="请输入法人代表姓名" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过100个字符或50个汉字）
        </FormItem>
        <!-- <FormItem label="法人代表证件类型：" prop="certificateType">
                <Select v-model="data.certificateType" style="width:300px">
                    <Option v-for="item in certificateTypeList" :value="item.key" :key="item.key">{{item.value}}</Option>
                </Select>
            </FormItem> -->
        <FormItem label="法人代表证件号码：" prop="certificateCode">
          <Input v-model="data.certificateCode" placeholder="请输入法人代表证件号码" style="width: 300px;"></Input>&nbsp;&nbsp;（有效的身份证号码）
        </FormItem>
        <FormItem>
          <br>
          <Button type="primary" @click="next()">&nbsp;&nbsp;&nbsp;&nbsp;下一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
          <Button type="primary" @click="pre()">&nbsp;&nbsp;&nbsp;&nbsp;上一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
      <br>
    </div>
  </div>
</template>
<script>
import RegisterStep from "../../components/register-step";
import Config from "../../config/config";

export default {
  components: {
    RegisterStep
  },
  data() {
    return {
      current: 3,

      baseUrl: Config.baseUrl,

      currencyList: [
        { key: -1, value: "请选择" },
        { key: 1, value: "人民币" },
        { key: 2, value: "美元" }
      ],

      certificateTypeList: [
        { key: -1, value: "请选择" },
        { key: 1, value: "身份证" },
        { key: 2, value: "护照" }
      ],

      data: {
        licenseCode: "",
        endDate: "",
        registeredCapital: "",
        paidUpCapital: "",
        legalPerson: "",
        certificateCode: "",
        picUrl: "",
        picUrlShow: "",
        currency: 1,
        certificateType: 1
      },
      rules: {
        licenseCode: [
          { required: true, message: "营业执照号码不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[A-Za-z0-9]{18}$/,
            message: "营业执照号码格式不正确",
            trigger: "blur"
          }
        ],
        endDate: [
          {
            required: true,
            type: "date",
            message: "营业执照到期时间不能为空",
            trigger: "change"
          }
        ],
        registeredCapital: [
          { required: true, message: "注册资本（万元）不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[1-9][0-9]{0,9}$/,
            message: "注册资本（万元）格式不正确",
            trigger: "blur"
          }
        ],
        paidUpCapital: [
          { required: true, message: "实收资本（万元）不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[1-9][0-9]{0,9}$/,
            message: "注册资本（万元）格式不正确",
            trigger: "blur"
          }
        ],
        legalPerson: [
          { required: true, message: "法人代表姓名不能为空", trigger: "blur" },
          {
            type: "method",
            validator: (rule, value, callback, source, options) => {
              if (value.replace(/[^\x00-\xff]/g, "aa").length > 100) {
                callback(["error"]);
                return;
              }
              callback([]);
            },
            message: "法人代表姓名长度过长",
            trigger: "blur"
          }
        ],
        certificateCode: [
          { required: true, message: "法人代表证件号码不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/,
            message: "法人代表证件号码格式不正确",
            trigger: "blur"
          }
        ],
        picUrl: [{ required: true, message: "营业执照附件不能为空", trigger: "blur" }],
        currency: [
          {
            required: true,
            type: "number",
            min: 1,
            message: "请选择币种",
            trigger: "change"
          }
        ],
        certificateType: [
          {
            required: true,
            type: "number",
            min: 1,
            message: "请选择证件类型",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    handleSuccess(res, file) {
      this.data.picUrl = res.result.value;
      this.data.picUrlShow = res.result.key;
    },
    handleFormatError(file) {
      this.$Message.warning("文件格式不正确，请上传jpg、png、bmp格式的图片。");
    },
    next() {
      this.$refs["formregister"].validate(valid => {
        if (valid) {
          this.$store.registerModel.licenseCode = this.data.licenseCode;
          this.$store.registerModel.endDate = this.data.endDate;
          this.$store.registerModel.registeredCapital = this.data.registeredCapital;
          this.$store.registerModel.paidUpCapital = this.data.paidUpCapital;
          this.$store.registerModel.legalPerson = this.data.legalPerson;
          this.$store.registerModel.licenseCode = this.data.licenseCode;
          this.$store.registerModel.certificateCode = this.data.certificateCode;
          this.$store.registerModel.picUrl = this.data.picUrl;
          this.$store.registerModel.picUrlShow = this.data.picUrlShow;
          this.$store.registerModel.currency = this.data.currency;
          this.$store.registerModel.certificateType = this.data.certificateType;

          window.sessionStorage.setItem(
            "registerModel",
            JSON.stringify(this.$store.registerModel)
          );
          this.$router.push("/account/register4");
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    pre() {
      this.$router.push("/account/register2");
    }
  },
  mounted() {
    this.$store.registerModel = JSON.parse(
      window.sessionStorage.getItem("registerModel")
    );

    this.data.licenseCode = this.$store.registerModel.licenseCode;
    this.data.endDate = this.$store.registerModel.endDate;
    this.data.registeredCapital =
      this.$store.registerModel.registeredCapital + "";
    this.data.paidUpCapital = this.$store.registerModel.paidUpCapital + "";
    this.data.legalPerson = this.$store.registerModel.legalPerson;
    this.data.licenseCode = this.$store.registerModel.licenseCode;
    this.data.certificateCode = this.$store.registerModel.certificateCode;
    this.data.picUrl = this.$store.registerModel.picUrl;
    this.data.picUrlShow = this.$store.registerModel.picUrlShow;
    this.data.currency = this.$store.registerModel.currency;
    this.data.certificateType = this.$store.registerModel.certificateType;

    this.$store.registerModel = JSON.parse(
      window.sessionStorage.getItem("registerModel")
    );
  }
};
</script>
