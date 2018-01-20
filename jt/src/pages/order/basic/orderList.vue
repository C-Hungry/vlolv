<template>
  <div class="Allorder-list">
    <myFrame :routes="routes">
      <div slot="router-box">
        <div class="order-list">
          <x-table :cell-bordered="false" style="background-color:#e8f8ff;">
            <thead>
              <tr>
                <th>时间</th>
                <th>计划量</th>
                <th>已发(T)</th>
                <th>完成(T)</th>
              </tr>
            </thead>
            <tbody v-for="(item,index) in orderList" :key="index">
              <tr @click="info(item)">
                <td>{{item.Time||"-"}}</td>
                <td>{{item.FPValue||"-"}}</td>
                <td>{{item.HasSendWeight||"-"}}</td>
                <td style="position:relative">{{item.CompleteWeight}}
                  <img class="pic-log" src="../../../assets/rarrow.svg">
                </td>
              </tr>
            </tbody>
            <tbody v-if="!over&&orderList.length!=0">
              <tr @click="loadMore">
                <td colspan="4">查看更多</td>
              </tr>
            </tbody>
            <tbody v-else-if="orderList.length==0">
              <tr style="color:#ccc">
                <td colspan="4">————暂无数据...————</td>
              </tr>
            </tbody>

            <tbody v-if="over && orderList.length > 0">
              <tr style="color:grey">
                <td colspan="4">-完-</td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </div>
    </myFrame>
  </div>
</template>

<script>
  import {
    XTable,
    LoadMore
  } from "vux";
  import myFrame from "../../../components/myFrame";
  export default {
    components: {
      XTable,
      LoadMore,
      myFrame
    },
    data() {
      return {
        OrderId: this.$route.query.OrderId,
        receiverId: this.$route.query.receiverId,

        state: this.$route.query.state,
        sendName: decodeURIComponent(this.$route.query.sendName),
        over: false,
        totalCount: 0,
        currentCount: 10,
        routes: [{
          path: "/OrderDetails/OrderList",
          title: "订单统计"
        }],
        orderList: []
      };
    },
    methods: {
      loadMore() {
        this.totalCount++;
        this.loadOrderDayInfo();
      },
      info(item) {
        if (this.state == "1") {
          console.log("汽运");
          this.$webview.notice("运单列表", {
            startTime: item.Time,
            endTime: item.Time,
            sendName: this.sendName,
            receiverId: parseInt(this.receiverId),
            orderId: parseInt(this.OrderId)
          });
        } else {
          console.log("铁运");
          this.$webview.notice("火车批次", {
            startTime: item.Time,
            endTime: item.Time,
            sendName: this.sendName,
            receiverId: parseInt(this.receiverId),
            orderId: parseInt(this.OrderId)
          });
        }
      },
      loadOrderDayInfo() {
        // this.$vux.loading.show();
        this.$webview.loading("show");
        this.$service
          .get("/RecDelReport/GetBuyOrderDetailByDay", {
            OrderId: this.OrderId,
            pageIndex: this.totalCount,
            pageSize: this.currentCount
          })
          .then(res => {
            console.log(res.Data);
            let lists = res.Data;
            if (lists.length < this.currentCount) {
              this.over = true;
            }
            for (let i = 0; i < lists.length; i++) {
              this.orderList.push(lists[i]);
            }
            // this.$vux.loading.hide();
            this.$webview.loading("hide");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    mounted() {
      this.loadOrderDayInfo();
      console.log(this.sendName);
    }
  };

</script>

<style scoped lang="less">
  .Allorder-list {
    /* 订单列表 */
    .vux-header,
    .vux-button-group>a.vux-button-group-current {
      background: #28b7f7;
      color: white;
    }
    .vux-header .vux-header-title {
      font-size: 16px !important;
      color: red;
    }
    .order-list {
      background: #e8f8ff;
      padding: 0 10px;
      tbody tr td {
        width: 50px;
        font-size: 13px;
        text-overflow: ellipsis;
        /* for IE */
        -moz-text-overflow: ellipsis;
        /* for Firefox,mozilla */
        overflow: hidden;
        white-space: nowrap;
        /* text-align: left */
      }
      .pic-log {
        position: absolute;
        top: 11px;
        right: -5px;
      }
    }
  }

</style>
