<style scoped lang="less">
.content {
  border: solid 1px #c8e1fe;
  min-height: 635px;
  padding: 5px;
}
</style>
<template>
  <div class="index">
    <account-title title="账号基本信息"></account-title>
    <div class="content">
      <br><br><br>
      <Form ref="formregister" :label-width="200">
        <FormItem label="用户名：">
          {{data.userName}}
        </FormItem>
        <FormItem label="姓名：">
          {{data.name}}
        </FormItem>
        <FormItem label="手机号：">
          {{data.phoneNumber}}
        </FormItem>
        <FormItem label="邮箱：">
          {{data.emailAddress}}
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import AccountTitle from "../../../components/account-title";

export default {
  components: { AccountTitle },
  data() {
    return {
      data: {
        name: "",
        surname: "",
        userName: "",
        emailAddress: "",
        phoneNumber: "",
        timezone: ""
      }
    };
  },
  mounted() {
    this.$store.loading();
    this.$service
      .post("/ZK/profile/GetCurrentUserProfileForEdit", {})
      .then(res => {
        this.$store.unloading();
        this.data = res.result;
      })
      .catch(res=>{
        this.$store.unloading();
      });
  }
};
</script>
