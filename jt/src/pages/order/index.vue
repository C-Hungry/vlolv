<template>
  <div class="powerPlant-index">
    <myFrame :routes="routes"></myFrame>
  </div>
</template>

<script>
  import myFrame from "../../components/myFrame";
  export default {
    components: {
      myFrame
    },
    data() {
      return {
        routes: [{
            path: "/OrderDetails/basic",
            params: "?OrderId=" + this.$route.query.OrderId + "&receiverId=" + this.$route.query.receiverId,
            title: "订单数据"
          },
          {
            path: "/OrderDetails/info",
            params: "?OrderId=" + this.$route.query.OrderId + "&receiverId=" + this.$route.query.receiverId,
            title: "基本信息"
          }
        ]
      };
    },
    mounted() {

    }
  };

</script>

<style scoped lang="less">


</style>
