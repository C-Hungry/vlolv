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
      <register-step :current="1" :items="[{index:1,title:'用户信息'},{index:2,title:'公司信息'},{index:3,title:'营业执照信息'},{index:4,title:'开户行信息'}]"></register-step>
      <br><br><br>
      <Form ref="formRegister" :model="data" :rules="rules" :label-width="240">
        <FormItem label="业务类型：" prop="companyType">
          <RadioGroup v-model="data.companyType">
            <Radio label="1">我是供应商（供应商可对招标进行投标）</Radio><br>
            <Radio label="2">我是采购商（采购商可发布招标信息，并对招标项目发布中标公示）</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户名：" prop="userName">
          <Input v-model="data.userName" placeholder="请输入用户名" style="width: 300px;"></Input>&nbsp;&nbsp;（6到20位英文字母或数字）
        </FormItem>
        <FormItem label="密码：" prop="password">
          <Input type="password" v-model="data.password" placeholder="请输入密码" style="width: 300px;"></Input>&nbsp;&nbsp;（6到20位英文字母或数字）
        </FormItem>
        <FormItem label="确认密码：" prop="confirm">
          <Input type="password" v-model="data.confirm" placeholder="请输入确认密码" style="width: 300px;"></Input>&nbsp;&nbsp;（6到20位英文字母或数字）
        </FormItem>
        <FormItem label="姓名：" prop="name">
          <Input v-model="data.name" placeholder="请输入姓名" style="width: 300px;"></Input>&nbsp;&nbsp;（不超过100个字符或50个汉字）
        </FormItem>
        <FormItem label="手机号：" prop="phoneNumber">
          <Input v-model="data.phoneNumber" placeholder="请输入手机号" style="width: 300px;"></Input>&nbsp;&nbsp;（11位手机号码）
        </FormItem>
        <FormItem label="邮箱：" prop="emailAddress">
          <Input v-model="data.emailAddress" placeholder="请输入邮箱" style="width: 300px;"></Input>&nbsp;&nbsp;（例如：example@163.com）
        </FormItem>
        <FormItem label="注册协议：">
          <Checkbox v-model="data.agree">我已阅读并同意</Checkbox>
          <a href="javascript:void(0);" v-on:click="dlgAgreement.visible=true">《阳光采购业务办理授权委托协议》</a>
        </FormItem>
        <FormItem>
          <Button type="primary" :disabled="!data.agree" @click="next()">&nbsp;&nbsp;&nbsp;&nbsp;下一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
      <Modal v-model="dlgAgreement.visible" title="注册协议" :mask-closable="false" width="1000">
        <div>
          <br>
          <div style="text-align: center;">
            <h2>《阳光采购业务办理授权委托协议》</h2>
          </div>
          <br>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎阅读电子招标投标系统（以下简称平台）服务条款协议(下称“本协议”)。本协议阐述之条款和条件适用于您使用本平台所提供的电子招投标活动的各种工具和服务(下称“服务”)。
          </p>
          <br>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.谁可使用本平台 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本平台仅供能够根据相关法律订立具有法律约束力的合约，作为潜在供应商的公司和个人及其它招投标相关的工作人员使用。如不符合本项条件，请勿使用“服务”。本平台可随时自行全权决定驳回向任何单位和个人提供“服务”。“服务”不会提供给被暂时停止或终止资格的本平台注册会员。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.接受条款 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以任何方式进入本平台即表示您同意已经签订本协议，且您将接受本协议的条款约束。本平台可随时决定更改“条款”。如“条款”有任何变更，本平台将在其网上刊载公告，通知予您。如您不同意相关变更，必须停止使用“服务”。经修订的“条款”一经在本平台公布后，立即自动生效。您应在登录后仔细阅读修订后的“条款”，并有权选择或停止继续使用“服务”；一旦您继续使用“服务”，则表示您已接受经修订的“条款”，当您与本平台发生争议时，应以最新的服务协议为准。除另有明确声明外，任何使“服务”范围扩大或功能增强的新内容均受本协议约束。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.收费 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本平台保留在根据第2条通知您后，收取“服务”费用的权利。您因进行投标或获取相关信息等向本平台运营方获取有偿服务或接触本平台服务器而发生的所有应纳税赋，以及相关硬件、软件、通讯、网络服务及其他方面的费用均由您自行承担。本平台保留在无需发出书面通知、仅在本平台网上公示的情况下，暂时或永久地更改或停止部分或全部“服务”的权利。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.您的资料 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“您的资料”包括您在注册、投标、澄清、评标等过程中，以任何网络形式向本平台传送的任何资料，包括数据、文本、照片、图画、影像、词句或其他材料。您应对“您的资料”负全部责任，倘若本平台认为“您的资料”可能使我方承担任何法律或道义上的责任，则本平台可自行全权决定对“您的资料”采取我方认为必要或适当的任何行动，包括但不限于删除该类资料。您特此保证，您对提交给本平台的“您的资料”拥有全部合法权利。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.注册</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.1注册义务 在本平台注册，意味着您同意：</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a) 根据本平台刊载的会员资料表格的要求，提供关于您或贵公司的真实、准确、完整和反映当前情况的资料；</p> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) 维持并及时更新会员资料，使其保持真实、准确、完整和反映当前情况。倘若您提供任何不真实、不准确、不完整或不能反映当前情况的资料，或本平台有合理理由怀疑资料不真实、不准确、不完整或不能反映当前情况，本平台有权暂停或终止您的注册身份及资料，并驳回您在目前或将来对“服务”(或其任何部份) 以任何形式使用。如您代表一家公司或其他法律主体在本平台登记，则您声明和保证，您有权使该公司或其他法律主体受本协议“条款”约束。</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2会员注册名、密码和保密 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.1在登记过程中，您将选择会员注册名和密码。您须自行负责对您的会员注册名和密码保密，且须对您在会员注册名和密码下发生的所有活动承担责任。您同意：</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(a) 如发现任何人未经授权使用您的会员注册名或密码，或发生违反保密规定和约定的任何其他情况，您会立即通知本平台；及 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(b) 确保您在每个上网时段结束时，以正确步骤离开本平台。本平台不能也不会对因您未能遵守本款规定而发生的任何损失或损毁负责。 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.3关于您的资料的规则 您同意，您供给本平台的资料 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a. 不会有欺诈（包括制造谣言、传播谣言等）成份； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b. 不会侵犯任何第三者的版权、专利、商标、商业秘密或其他知识产权，或隐私权、名誉权； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c. 不会违反任何法律、法规、条例或规章； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d. 不会含有诽谤（包括商业诽谤）、非法恐吓或非法骚扰的内容； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e. 不会含有淫秽、或包含任何色情内容； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f. 不会含有蓄意毁坏、恶意干扰、秘密地截取或侵占任何系统、数据或个人资料的任何病毒、伪装破坏程序、电脑蠕虫、定时程序炸弹或其他电脑程序； </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;g.您同意不会：（I）在与任何连锁信件、大量胡乱邮寄的电子邮件、滥发电子邮件或任何复制或多余的信息有关的方面使用“服务”；(II) 未经其他人士同意，利用“服务”收集其他人士的电子邮件地址及其他资料；或 (III) 利用“服务”制作虚假的电子邮件地址，或以其他形式试图在发送人的身份或信息的来源方面误导其他人士。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6.您授予本平台运营方的许可使用权 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您授予本平台运营方有权合理地使用"您的资料"。本平台承诺，您在投标过程中来往的所有文件将被依法保密。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7.系统完整性</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您同意，您不得使用任何装置、软件或例行程序干预或试图干预本平台的正常运作。您不得采取对任何将不合理或不合比例的庞大负载加诸本平台网络结构的行动。您不得向任何第三者披露您的密码，或与任何第三者共用您的密码，或为任何未经批准的目的使用您的密码。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8.不作商业性利用</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您同意，您不得对任何资料作商业性利用，包括但不限于在未经本平台运营方书面批准的情况下，复制在本平台上展示的任何资料，包括系统的功能结构和画面等。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9.终止或访问限制 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您同意，在本平台未向您收费的情况下，可自行全权决定以任何理由 (包括但不限于本平台认为您已违反本协议的字面意义和精神，或您以不符合本协议的字面意义和精神的方式行事)终止您的“服务”密码、账户 (或其任何部份) 或您对“服务”的使用，并删除和丢弃您在使用“服务”中提交的 “您的资料”。您同意，在本平台向您收费的情况下，本平台应基于合理的怀疑且不经电子邮件通知的情况下实施上述终止服务的行为。本平台同时可自行全权决定，在发出通知或不发出通知的情况下，随时停止提供“服务”或其任何部分。您同意，根据本协议的任何规定终止您使用“服务”之措施可在不发出事先通知的情况下实施，并承认和同意，本平台可立即使您的帐户无效，或撤销您的帐户以及在您的帐户内的所有相关资料和档案，和/或禁止您进一步接入该等档案或“服务”。帐号终止后本平台没有义务为您保留原帐号中或与之相关的任何信息，或转发任何未曾阅读或发送的信息给您或第三方。此外，您同意，本平台不会就终止您接入“服务”而对您或任何第三者承担任何责任。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.服务“按现状”提供 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本平台不能随时预见到任何技术上的问题或其他困难。该等困难可能会导致数据损失或其他服务中断。为此，您明确理解和同意，您使用“服务”的风险由您自行承担。“服务”以“按现状”和“按可得到”的基础提供。本平台明确声明不作出任何种类的所有明示或暗示的保证，包括但不限于关于适销性、适用于某一特定用途和无侵权行为等方面的保证。本平台对下述内容不作保证：(i)“服务”会符合您的要求；(ii)“服务”不会中断，且适时、安全和不带任何错误；(iii) 通过使用“服务”而可能获取的结果将是准确的；及 (iv) 您通过“服务”而获得的体验是合理的。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11.无代理关系 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您与本平台仅为独立订约人关系。本协议无意结成或创设任何代理、合伙、合营、雇用。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;12.不可抗力 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;对于因本平台合理控制范围以外的原因，包括但不限于自然灾害、罢工或骚乱、暴动、战争行为、政府行为、通讯或其他设施故障或严重伤亡事故等，致使本平台延迟或未能履约的，本平台不对您承担任何责任。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13.其他规定 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本协议各方面应受中华人民共和国大陆地区法律的管辖。倘若本协议任何规定被裁定为无效或不可强制执行，该项规定应被撤销，而其余规定应予执行。条款标题仅为方便参阅而设，并不以任何方式界定、限制、解释或描述该条款的范围或限度。本平台未就您或其他人士的某项违约行为采取行动，并不表明本平台撤回就任何继后或类似的违约事件采取行动的权利。</p>
          <br> 
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14.诉讼 </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因本协议或本服务所引起或与其有关的任何争议应向本平台所在地法院提起诉讼，并以中华人民共和国法律为管辖法律。</p>

          <br>
        </div>
        <div slot="footer">
          <Button type="primary" @click="dlgAgreement.visible=false">确定</Button>
        </div>
      </Modal>
      <br>
    </div>
  </div>
</template>
<script>
import RegisterStep from "../../components/register-step";

export default {
  components: {
    RegisterStep
  },
  data() {
    return {
      current: 1,

      dlgAgreement: {
        visible: false
      },

      data: {
        companyType: "1",
        userName: "",
        password: "",
        confirm: "",
        name: "",
        phoneNumber: "",
        emailAddress: "",
        agree: false
      },
      rules: {
        companyType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[A-Za-z0-9]+$/,
            message: "用户名格式不正确",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "用户名长度应为6到20位",
            trigger: "blur"
          },
          {
            type: "method",
            validator: (rule, value, callback, source, options) => {
              
              this.$service.post("/PlantOpenTender/companyService/IfUserNameExsit",{ Name: value }).then(res=>{
                if(res.result){
                  callback(new Error(""));
                }
                else{
                  callback();
                }
              });
            },
            message: "用户名重复",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[A-Za-z0-9]+$/,
            message: "密码格式不正确",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "密码长度应为6到20位",
            trigger: "blur"
          }
        ],
        confirm: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^[A-Za-z0-9]+$/,
            message: "密码格式不正确",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            max: 20,
            message: "密码长度应为6到20位",
            trigger: "blur"
          },
          {
            type: "method",
            validator: (rule, value, callback, source, options) => {
              if (value != this.data.password) {
                callback(["error"]);
                return;
              }
              callback([]);
            },
            message: "两次输入的密码不一致",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            type: "method",
            validator: (rule, value, callback, source, options) => {
              if (value.replace(/[^\x00-\xff]/g, "aa").length > 100) {
                callback(["error"]);
                return;
              }
              callback([]);
            },
            message: "用户姓名长度过长",
            trigger: "blur"
          }
        ],
        phoneNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            type: "pattern",
            pattern: /^1\d{10}$/,
            message: "请输入11位手机号码",
            trigger: "blur"
          }
        ],
        emailAddress: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    next() {
      this.$refs["formRegister"].validate(valid => {
        if (valid) {
          this.$store.registerModel.companyType = this.data.companyType;
          this.$store.registerModel.user.userName = this.data.userName;
          this.$store.registerModel.user.password = this.data.password;
          this.$store.registerModel.user.confirm = this.data.confirm;
          this.$store.registerModel.user.name = this.data.name;
          this.$store.registerModel.user.phoneNumber = this.data.phoneNumber;
          this.$store.registerModel.user.emailAddress = this.data.emailAddress;
          this.$store.registerModel.user.agree = this.data.agree;

          window.sessionStorage.setItem(
            "registerModel",
            JSON.stringify(this.$store.registerModel)
          );

          this.$router.push("/account/register2");
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    loadData() {
      this.data.companyType = this.$store.registerModel.companyType;
      this.data.userName = this.$store.registerModel.user.userName;
      this.data.password = this.$store.registerModel.user.password;
      this.data.confirm = this.$store.registerModel.user.confirm;
      this.data.name = this.$store.registerModel.user.name;
      this.data.phoneNumber = this.$store.registerModel.user.phoneNumber;
      this.data.emailAddress = this.$store.registerModel.user.emailAddress;
      this.data.agree = this.$store.registerModel.user.agree;
    }
  },
  mounted() {
    if (window.sessionStorage.getItem("registerModel")) {
      this.$store.registerModel = JSON.parse(
        window.sessionStorage.getItem("registerModel")
      );

      this.loadData();
    } else {
      this.$store.registerModel = {
        bankList: [],
        user: {
          userName: "",
          password: "",
          name: "",
          phoneNumber: "",
          emailAddress: "",
          id: 0
        },
        companyType: -1,
        companyTypeName: "",
        name: "",
        nature: -1,
        natureName: "",
        province: -1,
        provinceName: "",
        city: -1,
        cityName: "",
        county: -1,
        countyName: "",
        detail: "",
        zipCode: "",
        adminName: "",
        adminPhone: "",
        businessScope: "",
        licenseCode: "",
        picUrl: "",
        picUrlShow: "",
        endDate: "",
        registeredCapital: 0,
        paidUpCapital: 0,
        currency: 1,
        currencyName: "",
        legalPerson: "",
        certificateType: 1,
        certificateTypeName: "",
        certificateCode: "",
        // "userId": 0,
        // "auditTime": "",
        auditStatus: 0,
        auditStatusName: "",
        reason: "",
        id: 0
      };

      this.loadData();
    }
  }
};
</script>
