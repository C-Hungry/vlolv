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
    <account-title title="角色权限"></account-title>
    <div class="content">
      <div class="field">
        <Input v-model="name" placeholder="角色名称" style="width: 200px"></Input>
        <Button type="primary" v-on:click="onQueryClick()">查询</Button>
      </div>
      <div>
        <Table stripe :columns="columns" :data="rows"></Table>
      </div>
      <br>
      <Page :total="totalCount" :page-size="pageSize" @on-change="onPageChange" show-elevator show-total align='right' style="margin-right: 10px;"></Page>
      <Modal v-model="dlgVerify.visible" title="详情" :mask-closable="false" width="800">
        <Form :label-width="200">
          <FormItem label="角色名称：">
            <Input v-model="dlgVerify.displayName" placeholder="请输入..." style="width: 300px"></Input>
          </FormItem>
          <FormItem label="权限：">
            <Tree :data="dlgVerify.allPermissions" show-checkbox @on-check-change="checkePermission" style="border: solid 1px #ddd; border-radius: 5px; padding: 0 10px; max-width: 300px;"></Tree>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" v-on:click="saveRoleInfo()">确定</Button>
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
      name: "",

      pageSize: 10,
      pageIndex: 0,
      totalCount: 0,

      columns: [
        {
          title: "显示名称",
          key: "displayName"
        },
        {
          title: "是否默认",
          render: (h, params) => {
            return h("div", [params.row.isStatic ? "默认" : "非默认"]);
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
                      this.rowCommand("edit", params.row.id);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      rows: [],

      dlgVerify: {
        visible: false,

        id: "",

        displayName: "",

        isDefault: "",

        currentPermissions: [],

        allPermissions: []
      }
    };
  },
  methods: {
    saveRoleInfo() {
      if (!this.dlgVerify.displayName) {
        this.$Message.warning("请输入角色名！");
        return;
      }

      this.$service
        .post("/ZK/role/CreateOrUpdateRole", {
          input: {
            role: {
              id: this.dlgVerify.id,
              displayName: this.dlgVerify.displayName,
              isDefault: this.dlgVerify.isDefault
            },
            grantedPermissionNames: this.dlgVerify.currentPermissions
          }
        })
        .then(res => {
          this.$Message.success("提交成功");
          this.dlgVerify.visible = false;
          this.query();
        });
    },
    checkePermission(checkedNodes) {
      this.dlgVerify.currentPermissions = [];
      for (var i = 0; i < checkedNodes.length; i++) {
        this.dlgVerify.currentPermissions.push(checkedNodes[i].id);
      }
    },
    rowCommand(command, id) {
      if (command == "edit") {
        this.$service
          .post("/ZK/role/GetRoleForEdit", { input: { id: id } })
          .then(res => {
            this.dlgVerify.visible = true;
            this.dlgVerify.id = res.result.role.id;
            this.dlgVerify.displayName = res.result.role.displayName;
            this.dlgVerify.isDefault = res.result.role.isDefault;

            this.dlgVerify.allPermissions = [];

            var permissions = res.result.grantedPermissionNames;
            var initPermissions = function(node) {
              if (node.children.length <= 0) {
                for (var i = 0; i < permissions.length; i++) {
                  if (permissions[i] == node.id) {
                    node.checked = true;
                  }
                }
                return;
              }
              for (var i = 0; i < node.children.length; i++) {
                initPermissions(node.children[i]);
              }
            };

            for (var i = 0; i < res.result.permissions.length; i++) {
              initPermissions(res.result.permissions[i]);
            }
            this.dlgVerify.currentPermissions = permissions;
            this.dlgVerify.allPermissions = res.result.permissions;
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
        .post("/ZK/role/GetPagedRoles", {
          input: {
            roleName: this.name,
            maxResultCount: this.pageSize,
            skipCount: this.pageIndex * this.pageSize
          }
        })
        .then(res => {
          this.$store.unloading();

          this.rows = res.result.items;
          this.totalCount = res.result.totalCount;
        })
        .catch((res)=>{
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
