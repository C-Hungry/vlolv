<template>
  <div class="info-index">
    <group>
      <cell-box>
        <div style="width: 100%;">
          <span style="font-weight: bold;">公司信息</span>
          <span v-if="baseInfo.GroupType==1" style="color: #28B8F7; float: right;">集团公司</span>
        </div>
      </cell-box>
      <cell title="公司全称：" :value="baseInfo.corp_name"></cell>
      <cell title="公司简称：" :value="baseInfo.corp_short_name"></cell>
      <cell title="公司地址：" :value="baseInfo.address"></cell>
      <cell-box>
        <div style="width: 100%; display: flex;">
          <div class="vux-cell-bd vux-cell-primary">
            <div class="vux-label">公司电话：</div>
          </div>
          <div class="weui-cell__ft" style="position: relative;">
            {{baseInfo.mobile}}
            <a @click="callSomebody(baseInfo.mobile)" style="position: absolute; right: 0; top: 2px; float: right;">
              <img class="tel" src="../../../assets/phone.svg" width="15" height="15">
            </a>
          </div>
        </div>
      </cell-box>
      <!-- <cell title="公司电话：" :value="baseInfo.mobile"></cell> -->
      <cell title="联系人：" :value="baseInfo.linkman"></cell>
      <cell title="上级单位：" :value="baseInfo.ParentCorpName"></cell>
      <cell title="公司类型：" :value="baseInfo.TypeStr"></cell>
      <cell title="公司纳税号：" :value="baseInfo.TaxNumber"></cell>
      <cell title="所属大区：" :value="baseInfo.BelongDistrict"></cell>
    </group>
    <group>
      <cell-box>
        <span style="font-weight: bold;">发货信息</span>
      </cell-box>
      <cell-box is-link>
        <div style="width: 100%; display: flex;" @click="goToNative('收货方')">
          <div class="vux-cell-bd vux-cell-primary">
            <div class="vux-label">收货方：</div>
          </div>
          <div class="cell-box-value">
            {{baseInfo.ReceiverNumber}}个
          </div>
        </div>
      </cell-box>
      <cell-box is-link>
        <div style="width: 100%; display: flex;" @click="goToNative('承运方')">
          <div class="vux-cell-bd vux-cell-primary">
            <div class="vux-label">承运方：</div>
          </div>
          <div class="cell-box-value">
            {{baseInfo.ShipperNumber}}个
          </div>
        </div>
      </cell-box>
      <cell-box is-link>
        <div style="width: 100%; display: flex;" @click="goToNative('发货方')">
          <div class="vux-cell-bd vux-cell-primary">
            <div class="vux-label">发货方：</div>
          </div>
          <div class="cell-box-value">
            {{baseInfo.ConsignerNumber}}个
          </div>
        </div>
      </cell-box>
    </group>
    <br>
  </div>
</template>

<script>
import { Group, Cell, CellBox, XHeader } from "vux";
export default {
  components: {
    Group,
    Cell,
    CellBox,
    XHeader
  },
  data() {
    return {
      baseInfo: {
        TypeStr: "加载中",
        ParentCorpName: null,
        BelongDistrict: "加载中",
        ReceiverNumber: 0,
        ConsignerNumber: 0,
        ShipperNumber: 0,
        id: 0,
        identity: "加载中",
        code: "加载中",
        corp_name: "加载中",
        corp_short_name: "加载中",
        type: 0,
        address: "加载中",
        telephone: "加载中",
        linkman: "加载中",
        mobile: "加载中",
        approved: 0,
        IsDeleted: 0,
        CreateBy: 0,
        CreateTime: "加载中",
        UpdateBy: 0,
        UpdateTime: "加载中",
        IDCode: "加载中",
        GroupType: 0,
        TaxNumber: "加载中",
        PID: null
      }
    };
  },
  methods: {
    callSomebody(mobile) {
      this.$webview.notice("打电话", { telPhoneNum: mobile });
    },
    goToNative(type) {
      var corpid = this.$route.query.corpid ? this.$route.query.corpid : "1";
      this.$webview.notice("合作单位", { corptype: type, corpID: corpid });
    }
  },
  mounted() {
    var corpid = this.$route.query.corpid ? this.$route.query.corpid : "1";
    // this.$vux.loading.show();
    this.$webview.loading("show");
    this.$service
      .get("/RecDelReport/GetElectricBaseInfo", {
        CorpID: corpid
      })
      .then(res => {
        this.baseInfo = res.Data;
        // this.$vux.loading.hide();
        this.$webview.loading("hide");
      });
  }
};
</script>

<style lang="less">
.info-index {
  font-size: 14px;
  background-color: #f1f2f6;
  .weui-cell__ft {
    flex: 2;
    word-break: break-all;
    text-align: left;
    font-size: 14px;
  }
  .vux-label {
    white-space: nowrap;
    font-size: 14px;
  }
  .cell-box-value {
    flex: 1;
    text-align: right;
    padding: 0 20px;
    color: #999999;
    font-size: 14px;
  }
}
</style>
