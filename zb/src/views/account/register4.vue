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

  .table-title {
    background-color: #e7f2ff;
    height: 50px;
    display: flex;
    .column {
      flex: 1;
      line-height: 50px;
      text-align: center;
    }
  }
  .table-rows {
    .table-row {
      border-bottom: solid 1px #ddd;
      height: 50px;
      display: flex;
      .cell {
        flex: 1;
        line-height: 50px;
        text-align: center;
        input,
        select {
          height: 30px;
          width: 80%;
          border-radius: 2px;
          text-align: center;
          border: solid 1px #ddd;
        }
        select {
          width: auto;
        }
      }
    }
  }
}
</style>
<template>
  <div style="min-height: 695px;">
    <div class="register-title">
      企业认证
    </div>
    <div class="register-content">
      <br><br><br>
      <register-step v-if="$store.registerModel&&$store.registerModel.id" :current="3" :items="[{index:1,title:'公司信息'},{index:2,title:'营业执照信息'},{index:3,title:'开户行信息'}]"></register-step>
      <register-step v-else :current="4" :items="[{index:1,title:'用户信息'},{index:2,title:'公司信息'},{index:3,title:'营业执照信息'},{index:4,title:'开户行信息'}]"></register-step>
      <br><br><br>
      <Form ref="formregister" :label-width="240">
        <div class="table-title">
          <div class="column">
            银行名称
          </div>
          <div class="column">
            开户行名称
          </div>
          <div class="column">
            银行账号
          </div>
          <div class="column">
            账号类别
          </div>
          <div class="column">
            操作
          </div>
        </div>
        <div class="table-rows">
          <div v-for="bank in bankList" :key="bank.nature" class="table-row">
            <div class="cell">
              {{bank.bankName}}
            </div>
            <div class="cell">
              {{bank.branchName}}
            </div>
            <div class="cell">
              {{bank.nature}}
            </div>
            <div class="cell">
              {{bank.typeName}}
            </div>
            <div class="cell">
              <a v-on:click="delBank(bank)" href="javascript:void(0);">删除</a>
            </div>
          </div>
          <div v-if="newBankForm" class="table-row">
            <div class="cell">
              <Input v-model="newBankForm.bankName" placeholder="请输入银行名称" style="width: 80%;"></Input>
            </div>
            <div class="cell">
              <Input v-model="newBankForm.branchName" placeholder="请输入开户行名称" style="width: 80%;"></Input>
            </div>
            <div class="cell">
              <Input v-model="newBankForm.nature" placeholder="请输入银行账号" style="width: 80%;"></Input>
            </div>
            <div class="cell">
              <Select v-model="newBankForm.type" style="width:80%;">
                  <Option v-for="item in bankAccountTypeList" :value="item.key" :key="item.key">{{item.value}}</Option>
              </Select>
            </div>
            <div class="cell">
              <a v-on:click="saveNewBank()" href="javascript:void(0);">保存</a>
            </div>
          </div>
          <div class="table-row">
            <div class="cell">
              <a v-on:click="newBank()" href="javascript:void(0);">+ 新增</a>
            </div>
          </div>
        </div>
        <FormItem>
          <br>
          <Button type="primary" @click="submit()">&nbsp;&nbsp;完成认证&nbsp;&nbsp;</Button>
          <Button type="primary" @click="pre()">&nbsp;&nbsp;&nbsp;&nbsp;上一步&nbsp;&nbsp;&nbsp;&nbsp;</Button>
        </FormItem>
      </Form>
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
      current: 4,

      bankAccountTypeList: [{ key: -1, value: "请选择" }],

      newBankForm: {
        companyId: 0,
        bankName: "",
        branchName: "",
        nature: "",
        type: -1,
        typeName: "",
        id: 0
      },
      bankList: [
        // {
        //   "companyId": 0,
        //   "bankName": "中国银行",
        //   "branchName": "高新支行",
        //   "nature": "6101234654798752",
        //   "type": 0,
        //   "typeName": "个人账户",
        //   "id": 0
        // },
      ]
    };
  },
  methods: {
    delBank(bank) {
      var index = this.bankList.indexOf(bank);
      if (index >= 0) {
        this.bankList.splice(index, 1);
      }
    },
    newBank() {
      this.newBankForm = {
        companyId: 0,
        bankName: "",
        branchName: "",
        nature: "",
        type: -1,
        typeName: "",
        id: 0
      };
    },
    saveNewBank() {
      if (!this.newBankForm.bankName) {
        this.$Message.error("请输入银行名称");
        return;
      }
      if (!this.newBankForm.branchName) {
        this.$Message.error("请输入支行名称");
        return;
      }
      if (!this.newBankForm.nature) {
        this.$Message.error("请输入银行账号");
        return;
      }
      if (!new RegExp(/^(\d{16}|\d{19})$/).test(this.newBankForm.nature)) {
        this.$Message.error("请输入16位或19位银行账号");
        return;
      }
      if (this.newBankForm.type == -1) {
        this.$Message.error("请选择账号类型");
        return;
      }

      for (var i = 0; i < this.bankList.length; i++) {
        if (this.bankList[i].nature == this.newBankForm.nature) {
          this.$Message.error("银行账号重复");
          return;
        }
      }

      this.newBankForm.typeName = this.getBankAccountTypeName()
      this.bankList.push(this.newBankForm);

      this.$store.registerModel.bankList = this.bankList;
      window.sessionStorage.setItem(
        "registerModel",
        JSON.stringify(this.$store.registerModel)
      );
      this.newBankForm = null;
    },
    submit() {
      this.$store.registerModel.bankList = this.bankList;
      window.sessionStorage.setItem(
        "registerModel",
        JSON.stringify(this.$store.registerModel)
      );

      if (this.$store.registerModel.id) {
        this.$service
          .post("/PlantOpenTender/companyService/AddOrUpdate", {
            Company: this.$store.registerModel
          })
          .then(res => {
            this.$Message.success("修改成功");
            this.$store.registerModel = null;
            window.sessionStorage.removeItem("registerModel");
            this.$router.push("/account/account-info");
          });
      } else {
        this.$service
          .post("/PlantOpenTender/companyService/CompanyRegister", {
            Company: this.$store.registerModel
          })
          .then(res => {
            this.$Message.success("注册成功");
            this.$store.registerModel = null;
            window.sessionStorage.removeItem("registerModel");
            this.$router.push("/account/account-info");
          });
      }
    },
    pre() {
      this.$router.push("/account/register3");
    },
    getBankAccountTypeName(){
      var item = null;
      for(var i = 0; i < this.bankAccountTypeList.length; i++){
        if(this.bankAccountTypeList[i].key == this.newBankForm.type) return this.bankAccountTypeList[i].value;
      }
      return "";
    }
  },
  mounted() {
    this.$store.registerModel = JSON.parse(
      window.sessionStorage.getItem("registerModel")
    );

    this.bankList = this.$store.registerModel.bankList;

    this.$service
      .post("/PlantOpenTender/dictionaryService/GetOptions", {
        type: 1,
        code: encodeURIComponent("银行账户类别")
      })
      .then(res => {
        this.bankAccountTypeList = res.result;
        this.bankAccountTypeList.splice(0, 0, { key: -1, value: "请选择" });
      });
  }
};
</script>
