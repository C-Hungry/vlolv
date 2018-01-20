<style scoped lang="less">
.index {
  .step-items {
    display: flex;
    .step-item {
      flex: 1;
      text-align: center;
      .step-title {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        line-height: 40px;
        text-align: center;
        color: white;
        font-size: 24px;
        font-weight: bold;
        background-color: #dddddd;
      }
      .step-title2 {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
      }
      .step-banner {
        margin-top: 15px;
        height: 5px;
        background-color: #dddddd;
      }
      .current {
        background-color: #2b6aae;
      }
    }
  }
}
</style>
<template>
<div class="index">
      <div class="step-items">
        <div v-for="item in items" class="step-item" :key="item.index">
          <div v-if="item.index==current" class="step-title current">{{item.index}}</div>
          <div v-else class="step-title">{{item.index}}</div>
          <div class="step-title2">
            &nbsp;&nbsp;{{item.title}}
          </div>
          <div v-if="item.index==current" class="step-banner current"></div>
          <div v-else class="step-banner"></div>
        </div>
      </div>
</div>
</template>
<script>
export default {
  props: ["items", "current"],
  data() {
    return {};
  }
};
</script>
