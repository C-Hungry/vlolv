<style scoped lang="less">
.content {
  border: solid 1px #c8e1fe;
  min-height: 635px;
  padding: 5px;

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
        input {
          height: 30px;
          width: 80%;
          border-radius: 2px;
          text-align: center;
          border: solid 1px #ddd;
        }
      }
    }
  }
}
</style>
<template>
  <div class="index">
    <account-tab :titles="['基本信息','营业执照信息','银行信息']" current="基本信息" v-on:onSelectionChanged="onSelectionChanged"></account-tab>
    <div v-if="current=='基本信息'" class="content">
      <br><br><br>
      <Form v-if="data" :label-width="200">
        <FormItem label="企业名称：">
          {{data.name}}
        </FormItem>
        <FormItem label="企业性质：">
          {{data.natureName}}
        </FormItem>
        <FormItem label="企业所在地：">
          {{data.provinceName+" "+data.cityName+" "+data.countyName}}
        </FormItem>
        <FormItem label="详细地址：">
          {{data.detail}}
        </FormItem>
        <FormItem label="邮政编码：">
          {{data.zipCode}}
        </FormItem>
        <FormItem label="联系人姓名：">
          {{data.adminName}}
        </FormItem>
        <FormItem label="联系人电话：">
          {{data.adminPhone}}
        </FormItem>
        <FormItem label="经营范围：">
          {{data.businessScope}}
        </FormItem>
      </Form>
    </div>
    <div v-if="current=='营业执照信息'" class="content">
      <br><br><br>
      <Form :label-width="200">
        <FormItem label="营业执照号码：">
          {{data.licenseCode}}
        </FormItem>
        <FormItem label="营业执照到期时间：">
          {{data.endDate}}
        </FormItem>
        <FormItem label="营业执照附件：">
          {{data.picUrl?"已上传":"未上传"}}
        </FormItem>
        <FormItem label="注册资本（万元）：">
          {{data.registeredCapital}}
        </FormItem>
        <FormItem label="实收资本（万元）：">
          {{data.paidUpCapital}}
        </FormItem>
        <!-- <FormItem label="币种：">
                                        {{data.currencyName}}
                                    </FormItem> -->
        <FormItem label="法人代表姓名：">
          {{data.legalPerson}}
        </FormItem>
        <FormItem label="法人代表证件类型：">
          {{data.certificateTypeName}}
        </FormItem>
        <FormItem label="法人代表证件号码：">
          {{data.certificateCode}}
        </FormItem>
      </Form>
    </div>
    <div v-if="current=='银行信息'" class="content">
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
      </div>
      <div v-if="data" class="table-rows">
        <div v-for="row in data.bankList" :key="row.id" class="table-row">
          <div class="cell">
            {{row.bankName}}
          </div>
          <div class="cell">
            {{row.branchName}}
          </div>
          <div class="cell">
            {{row.nature}}
          </div>
          <div class="cell">
            {{row.typeName}}
          </div>
        </div>
      </div>
      <br><br>
    </div>
    <Spin v-if="data&&data.auditStatus==0" fix>
      <div>您的账号正在审核中，预计需要1个工作日，请耐心等待！</div>
    </Spin>
    <Spin v-if="data&&data.auditStatus==2" fix>
      <div>你的账号企业认证尚未通过，请重新认证！</div>
      <br>
      <Button type="primary" v-on:click="$router.push('/account/register2?id='+data.id)">重新认证</Button>
    </Spin>
  </div>
</template>
<script>
import AccountTab from "../../../components/account-tab";
import { DateManager } from "../../../config/util";
export default {
  components: { AccountTab },
  data() {
    return {
      current: "基本信息",
      data: null
    };
  },
  methods: {
    onSelectionChanged(title) {
      this.current = title;
    }
  },
  mounted() {
    this.$store.loading();

    this.$service
      .post("/PlantOpenTender/companyService/GetMyCompany", {})
      .then(res => {
        this.data = res.result;
        this.data.endDate = DateManager.formatDate(new Date(this.data.endDate));
        this.$store.unloading();
      })
      .catch(res => {
        this.$store.unloading();
      });
  }
};
</script>