<style scoped lang="less">
.content {
  border: solid 1px #c8e1fe;
  min-height: 635px;
  padding: 5px;
  .field {
    padding-bottom: 5px;
  }
}
</style>
<template>
  <div>
    <account-title title="企业审核"></account-title>
    <div class="content">
      <div class="field">
        <Input v-model="name" placeholder="企业名称" style="width: 200px"></Input>
        <Button type="primary" v-on:click="onQueryClick()">查询</Button>
      </div>
      <div>
        <Table stripe :columns="columns" :data="rows"></Table>
      </div>
      <br>
      <Page :total="totalCount" :page-size="pageSize" @on-change="onPageChange" show-elevator show-total align='right' style="margin-right: 10px;"></Page>
    </div>
    <Modal v-model="dlgVerify.visible" title="审核" :mask-closable="false" width="800">
      <Form v-if="dlgVerify.data" :label-width="200">
        <FormItem label="企业名称：">
          {{dlgVerify.data.name}}
        </FormItem>
        <FormItem label="企业性质：">
          {{dlgVerify.data.natureName}}
        </FormItem>
        <FormItem label="企业所在地区：">
          {{dlgVerify.data.provinceName}} {{dlgVerify.data.cityName}} {{dlgVerify.data.countyName}}
        </FormItem>
        <FormItem label="详细地址：">
          {{dlgVerify.data.detail}}
        </FormItem>
        <FormItem label="邮政编码：">
          {{dlgVerify.data.zipCode}}
        </FormItem>
        <FormItem label="联系人姓名：">
          {{dlgVerify.data.adminName}}
        </FormItem>
        <FormItem label="联系人电话：">
          {{dlgVerify.data.adminPhone}}
        </FormItem>
        <FormItem label="经营范围：">
          {{dlgVerify.data.businessScope}}
        </FormItem>
        <FormItem label="注册资本（万元）：">
          {{dlgVerify.data.registeredCapital}}
        </FormItem>
        <FormItem label="实收资本（万元）：">
          {{dlgVerify.data.paidUpCapital}}
        </FormItem>
        <FormItem label="法人代表姓名：">
          {{dlgVerify.data.legalPerson}}
        </FormItem>
        <FormItem label="法人代表证件号码：" prop="certificateCode">
          {{dlgVerify.data.certificateCode}}
        </FormItem>
        <FormItem label="营业执照号码：">
          {{dlgVerify.data.licenseCode}}
        </FormItem>
        <FormItem label="营业执照到期时间：">
          {{$utils.formateDate(new Date(dlgVerify.data.endDate), "yyyy-MM-dd")}}
        </FormItem>
        <FormItem label="营业执照附件：">
          <a :href="dlgVerify.data.picUrlShow" target="_blank">{{dlgVerify.data.picUrl?"已上传":"未上传"}}</a>
        </FormItem>
      </Form>
      <Table v-if="dlgVerify.data" :columns="dlgVerify.columns" :data="dlgVerify.data.bankList"></Table>
      <div slot="footer">
        <Button v-if="dlgVerify.isVerify" type="primary" v-on:click="approve()">通过</Button>
        <Button v-if="dlgVerify.isVerify" type="error" v-on:click="refuse()">驳回</Button>
      </div>
    </Modal>
    <Modal v-model="dlgReason.visible" title="审核" :mask-closable="false">
      <Input v-model="dlgReason.text" placeholder="请输入驳回原因"></Input>
      <div slot="footer">
        <Button type="text" v-on:click="dlgReason.visible=false">取消</Button>
        <Button type="primary" v-on:click="refuseCommit()">确定</Button>
      </div>
    </Modal>
  </div>
  </div>
</template>
<script>
import AccountTitle from "../../../components/account-title";

export default {
  components: { AccountTitle },
  data() {
    return {
      dlgReason: {
        visible: false,
        text: ""
      },

      name: "",

      pageSize: 10,
      pageIndex: 0,
      totalCount: 0,

      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "性质",
          key: "companyTypeName"
        },
        {
          title: "联系人",
          key: "adminName"
        },
        {
          title: "审核状态",
          key: "auditStatusName"
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 120,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.rowCommand("detail", params.row.id);
                    }
                  }
                },
                "详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small",
                    disabled: params.row.auditStatus != 0
                  },
                  on: {
                    click: () => {
                      this.rowCommand("verify", params.row.id);
                    }
                  }
                },
                "审核"
              )
            ]);
          }
        }
      ],
      rows: [],

      dlgVerify: {

        visible: false,

        isVerify: true,

        data: null,

        columns: [
          {
            title: "银行名称",
            key: "bankName"
          },
          {
            title: "开户行名称",
            key: "branchName"
          },
          {
            title: "银行账号",
            key: "nature"
          },
          {
            title: "账号类别",
            key: "typeName"
          }
        ]
      }
    };
  },
  methods: {
    approve() {
      this.$service
        .post("/PlantOpenTender/companyService/Audit", {
          id: this.dlgVerify.data.id,
          reason: ""
        })
        .then(res => {
          this.$Message.success("提交成功");
          this.query();
          this.dlgVerify.visible = false;
        });
    },

    refuse() {
      this.dlgReason.text = "";
      this.dlgReason.visible = true;
    },

    refuseCommit() {
      if (!this.dlgReason.text) {
        this.$Message.error("请输入驳回原因");
        return;
      }

      this.$service
        .post("/PlantOpenTender/companyService/Audit", {
          id: this.dlgVerify.data.id,
          reason: this.dlgReason.text
        })
        .then(res => {
          this.dlgVerify.visible = false;
          this.dlgReason.visible = false;
          this.$Message.success("提交成功");
          this.query();
        });
    },

    rowCommand(command, id) {

      if (command == "verify") {
        this.$service
          .post("/PlantOpenTender/companyService/GetCompanyById", { id: id })
          .then(res => {
            this.dlgVerify.data = res.result;
            this.dlgVerify.isVerify = true;
            this.dlgVerify.visible = true;
          });
      }

      if (command == "detail") {
        this.$service
          .post("/PlantOpenTender/companyService/GetCompanyById", { id: id })
          .then(res => {
            this.dlgVerify.data = res.result;
            this.dlgVerify.isVerify = false;
            this.dlgVerify.visible = true;
          });
      }

    },
    onQueryClick() {
      this.pageIndex = 0;
      this.query();
    },
    onPageChange(pageIndex) {
      this.pageIndex = pageIndex - 1;
      this.query();
    },
    query() {
      this.$store.loading();
      this.$service
        .post("/PlantOpenTender/companyService/SearchPaged", {
          search: {
            auditStatus: 0,
            companyType: 0,
            nature: 0,
            name: this.name,
            adminName: "",
            adminPhone: "",
            legalPerson: "",
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            sortConditions: []
          }
        })
        .then(res => {
          this.$store.unloading();
          this.rows = res.result.items;
          this.totalCount = res.result.totalCount;
        })
        .catch(res => {
          this.$store.unloading();
        });
    },
    init() {
      this.query();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
