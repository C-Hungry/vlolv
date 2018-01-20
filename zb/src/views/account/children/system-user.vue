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
    <Modal v-model="dlgVerify.visible" title="详情" :mask-closable="false" width="800">
      <Form v-if="dlgVerify.data" :label-width="200">
        <FormItem label="用户名：">
          {{dlgVerify.data.userName}}
        </FormItem>
        <!-- <FormItem label="密码：">
                    {{dlgVerify.data.password}}
                  </FormItem> -->
        <FormItem label="姓名：">
          {{dlgVerify.data.name}}
        </FormItem>
        <FormItem label="手机号：">
          {{dlgVerify.data.phoneNumber}}
        </FormItem>
        <FormItem label="邮箱：">
          {{dlgVerify.data.emailAddress}}
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" v-on:click="dlgVerify.visible=false">确定</Button>
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
          title: "用户名",
          key: "userName"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "类型",
          key: "companyTypeName"
        },
        {
          title: "联系方式",
          key: "phoneNumber"
        },
        {
          title: "邮箱",
          key: "emailAddress"
        },
        {
          title: "账户状态",
          render: (h, params) => {
            return h("div", [params.row.isActive ? "已启用" : "已停用"]);
          }
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
              params.row.isActive
                ? h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.rowCommand("disable", params.row.id);
                        }
                      }
                    },
                    "停用"
                  )
                : h(
                    "Button",
                    {
                      props: {
                        type: "text",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          this.rowCommand("enable", params.row.id);
                        }
                      }
                    },
                    "启用"
                  )
            ]);
          }
        }
      ],
      rows: [],

      dlgVerify: {
        visible: false,

        data: null
      }
    };
  },
  methods: {
    rowCommand(command, id) {
      if (command == "detail") {
        this.$service
          .post("/ZK/user/GetUserForEdit", { input: { id: id } })
          .then(res => {
            this.dlgVerify.data = res.result.user;
            this.dlgVerify.visible = true;
          });
      }

      if (command == "enable") {
        this.$Modal.confirm({
          title: "提示",
          content: "确认启用此用户？",
          onOk: () => {
            this.$service.post("/ZK/user/EnabledUser", { id: id }).then(res => {
              this.dlgVerify.data = res.result.user;
              this.$Message.success("提交成功");
              this.query();
            });
          },
          onCancel: () => {}
        });
      }

      if (command == "disable") {
        this.$Modal.confirm({
          title: "提示",
          content: "确认停用此用户？",
          onOk: () => {
            this.$service.post("/ZK/user/DisableUser", { id: id }).then(res => {
              this.dlgVerify.data = res.result.user;
              this.$Message.success("提交成功");
              this.query();
            });
          },
          onCancel: () => {}
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
        .post("/PlantOpenTender/companyService/GetUsers", {
          input: {
            name: this.name,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex
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
