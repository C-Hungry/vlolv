<template>
  <div class="buyOrderNew">
    <myFrame :routes="routes" :closeable="true">
      <div slot="router-box">
        <div class="form-detail">
          <group gutter="0" class="group">
            <cell title="选择合同：" is-link>
              <div v-on:click="dlgContract.visible = true" slot="default">
                {{dlgContract.contractName}}
              </div>
            </cell>
          </group>
          <group gutter="0" class="group">
            <cell title="合同量：" :value="buyOrder.Number+'吨'"></cell>
            <!-- <x-input title="合同量：" v-model="buyOrder.Number" text-align="right">
              <span slot="right">吨</span>
            </x-input> -->
            <cell title="合同日期：">
              <div slot="default">
                <span v-if="buyOrder.StartDate&&buyOrder.EndDate">
                  {{buyOrder.StartDate+"至"+buyOrder.EndDate}}
                </span>
                <span v-else>
                  请选择
                </span>
              </div>
            </cell>
            <x-input title="订单名称：" v-model="buyOrder.OrderName" text-align="right"></x-input>
          </group>
          <group gutter="0" class="group">
            <cell title="煤种：" :value="dlgContract.coalName"></cell>
          </group>
          <group gutter="0" class="group">
            <cell-box>
              <div v-on:click="dlgDetail.visible=!dlgDetail.visible" class="cellbox-content">
                其它信息&nbsp;<img height="15" v-bind:style="{ transform: dlgDetail.visible ? 'rotate(180deg)':'rotate(0deg)'}" src="../../assets/more_unfold.png" style="vertical-align: middle;" />
              </div>
            </cell-box>
          </group>
          <group gutter="0" v-if="dlgDetail.visible" class="group">
            <cell title="发货方：" :value="buyOrder.Consigner.Name"></cell>
            <cell title="联系人：">
              <div slot="default">
                {{buyOrder.Consigner.Linkman}}
                <img height="20" v-on:click="callSomeBody(buyOrder.Consigner.Mobile)" src="../../assets/tel-small.png" style="vertical-align: middle;" />
              </div>
            </cell>
            <cell title="发货区域：" :value="buyOrder.Consigner.AreaName"></cell>
            <cell-box>
            </cell-box>
            <cell title="收货方：" :value="buyOrder.Receiver.Name"></cell>
            <cell title="联系人：">
              <div slot="default">
                {{buyOrder.Receiver.Linkman}}
                <img height="20" v-on:click="callSomeBody(buyOrder.Receiver.Mobile)" src="../../assets/tel-small.png" style="vertical-align: middle;" />
              </div>
            </cell>
            <cell title="收货区域：" :value="buyOrder.Receiver.AreaName"></cell>
          </group>
        </div>
        <div class="bottom">
          <a class="button" v-on:click="saveBuyOrder()">
            保存
          </a>
          <a class="button" v-on:click="saveBuyOrderAndNewTransport()">
            保存并新增承运商
          </a>
        </div>
        <popup v-model="dlgContractDate.visible" position="bottom" max-height="50%">
          <popup-header :show-bottom-border="false" title="请选择合同日期" left-text="取消" @on-click-left="dlgContractDate.visible = false" right-text="确定" @on-click-right="chooseContractDate()"></popup-header>
          <group gutter="0">
            <datetime title="开始日期：" v-model="dlgContractDate.start"></datetime>
            <datetime title="结束日期：" v-model="dlgContractDate.end"></datetime>
          </group>
        </popup>
        <popup v-model="dlgContract.visible" position="bottom" max-height="50%">
          <popup-header :show-bottom-border="false" title="请选择合同"></popup-header>
          <group gutter="0">
            <cell-box v-for="contract in dlgContract.list" :key="contract.contractNumber">
              <div v-on:click="chooseContract(contract)" style="width: 100%; text-align: center;">{{contract.contractName}}</div>
            </cell-box>
          </group>
        </popup>
      </div>
    </myFrame>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  CellBox,
  XInput,
  Selector,
  PopupPicker,
  Datetime,
  TransferDom,
  Popup,
  PopupHeader
} from "vux";
import myFrame from "../../components/myFrame.vue";
export default {
  components: {
    myFrame,
    TransferDom,
    Popup,
    Group,
    Cell,
    CellBox,
    XInput,
    Selector,
    PopupPicker,
    Datetime,
    PopupHeader
  },
  data() {
    return {
      dlgDetail: {
        visible: false
      },
      dlgContract: {
        visible: false,
        list: [],
        contractNumber: "",
        contractName: "",
        coalName: ""
      },
      dlgContractDate: {
        visible: false,
        start: "",
        end: ""
      },
      buyOrder: {
        Consigner: {
          Id: 0,
          Name: "",
          Linkman: "",
          Mobile: "",
          AreaId: 0,
          AreaName: ""
        },
        Receiver: {
          Id: 0,
          Name: "",
          Linkman: "",
          Mobile: "",
          AreaId: 0,
          AreaName: ""
        },
        OrderName: "",
        TotalNumber: 0,
        //订单量
        Number: 0,
        CoalName: "0",
        StartDate: "",
        EndDate: "",
        CarType: 0,
        DispatchRestrict: 0,
        IsDispatchInArea: true,
        IsHaveGPS: true,
        IsRequireReceipt: true,
        IsThreePartyApprovedCar: true
      },
      routes: [
        {
          path: "/buyOrderNew",
          title: "新增订单"
        }
      ],
      value: ""
    };
  },
  methods: {
    saveBuyOrder(callback) {
      if (!this.dlgContract.contractNumber) {
        this.$vux.toast.text("请选择合同！", "default");
      }
      // if (!this.buyOrder.Number) {
      //   this.$vux.toast.text("请输入合同量！", "default");
      // }
      if (!this.buyOrder.OrderName) {
        this.$vux.toast.text("请输入订单名称！", "default");
      }
      // if (!(this.buyOrder.StartDate && this.buyOrder.EndDate)) {
      //   this.$vux.toast.text("请输入合同日期！", "default");
      // }
      this.buyOrder.CoalName = this.dlgContract.coalName;
      this.$service
        .get("/BuyOrder/AddNewBuyOrder", {
          orderDetail: JSON.stringify(this.buyOrder)
        })
        .then(res => {
          console.log(res);
          if (res.Status == 0) {
            this.$vux.toast.text(res.Msg, "default");
            return;
          }
          this.$vux.toast.text("新增成功！", "default");
          if (callback) {
            callback(res.Msg);
          } else {
            this.$router.go(-1);
          }
        });
    },
    saveBuyOrderAndNewTransport() {
      this.saveBuyOrder(orderId => {
        this.$webview.notice("新增托运", {
          orderId,
          OrderName: this.buyOrder.OrderName,
          ConsignerName: this.buyOrder.Consigner.Name,
          ReceiverName: this.buyOrder.Receiver.Name
        });
      });
    },
    callSomeBody(mobile) {
      this.$webview.notice("打电话", {
        telPhoneNum: mobile
      });
    },
    chooseContractDate() {
      this.buyOrder.StartDate = this.dlgContractDate.start;
      this.buyOrder.EndDate = this.dlgContractDate.end;
      this.dlgContractDate.visible = false;
    },
    chooseContract(contract) {
      this.dlgContract.contractNumber = contract.contractNumber;
      this.dlgContract.contractName = contract.contractName;
      this.dlgContract.coalName = contract.coalName;
      this.getContractDetail(this.dlgContract.contractNumber);
      this.dlgContract.visible = false;
    },
    getContractDetail(contractNumber) {
      // this.$vux.loading.show();
      this.$webview.loading("show");
      this.$service
        .get("/BuyOrder/GetBuyOrderDetailByContractNumber", {
          contractNumber: contractNumber
        })
        .then(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
          this.buyOrder = res.Data;
          this.buyOrder.Number = this.buyOrder.TotalNumber;
          this.buyOrder.OrderName = this.dlgContract.contractName;
          this.buyOrder.StartDate = this.buyOrder.StartDate.substring(0, 10);
          this.buyOrder.EndDate = this.buyOrder.EndDate.substring(0, 10);
          this.dlgContractDate.start = this.buyOrder.StartDate;
          this.dlgContractDate.end = this.buyOrder.EndDate;
        })
        .catch(res => {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
        });
    }
  },
  mounted() {
    // this.$vux.loading.show();
    this.$webview.loading("show");
    this.$service
      .get("/BuyOrder/GetContractProfilesByCorpId", {})
      .then(res => {
        this.dlgContract.list = res.Data;
        if (this.dlgContract.list.length > 0) {
          this.dlgContract.contractNumber = this.dlgContract.list[0].contractNumber;
          this.dlgContract.contractName = this.dlgContract.list[0].contractName;
          this.dlgContract.coalName = this.dlgContract.list[0].coalName;
          this.getContractDetail(this.dlgContract.contractNumber);
        } else {
          // this.$vux.loading.hide();
          this.$webview.loading("hide");
        }
      })
      .catch(res => {
        // this.$vux.loading.hide();
        this.$webview.loading("hide");
      });
  }
};
</script>

<style lang="less">
.buyOrderNew {
  .form-detail {
    position: absolute;
    top: 0;
    bottom: 50px;
    right: 0;
    left: 0;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0;
    padding-bottom: 10px;
    .cellbox-content {
      text-align: center;
      display: block;
      width: 100%;
    }
    .group {
      margin: 10px;
      margin-bottom: 0;
    }
  }
  .bottom {
    position: absolute;
    height: 50px;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    .button {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
    .button:first-child {
      background-color: white;
      color: #28b8f7;
      border: solid 1px #28b8f7;
    }
    .button:last-child {
      background-color: #28b8f7;
      color: white;
    }
  }
  .vux-label {
    white-space: nowrap;
  }
  .weui-cell {
    font-size: 16px;
  }
}
</style>
