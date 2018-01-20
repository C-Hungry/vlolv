<template>
  <div class="powerPlant-index">
    <myFrame :routes="routes"></myFrame>
  </div>
</template>

<script>
import myFrame from "../../components/myFrame.vue";
export default {
  components: {
    myFrame
  },
  data() {
    return {
      routes: [
        {
          path: "/powerplant/detail",
          params:
            "?corpid=" +
            (this.$route.query.corpid ? this.$route.query.corpid : "1"),
          title: "电厂数据"
        },
        {
          path: "/powerplant/info",
          params:
            "?corpid=" +
            (this.$route.query.corpid ? this.$route.query.corpid : "1"),
          title: "基本信息"
        }
      ]
    };
  },
  mounted() {},
};
</script>

<style scoped lang="less">

</style>
