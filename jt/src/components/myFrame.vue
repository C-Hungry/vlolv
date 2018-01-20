<template>
  <div class="powerPlant-index">
    <x-header slot="header" title="slot:overwrite-title" :left-options="{backText: '返回',preventGoBack: true}" @on-click-back="goBack()">
      <a v-if="closeable" slot="left" v-on:click="close()" style="color: #fff;">关闭</a>
      <div class="overwrite-title-demo" slot="overwrite-title">
        <span v-for="route in routes" :key="route.path">
          <div class="title-item selected" v-if="route.path==$route.path">{{route.title}}</div>
          <div class="title-item" v-else v-on:click="$router.replace(route.path+route.params)">{{route.title}}</div>
        </span>
      </div>
      <a slot="right" class="rightLog" v-for="item in routes" :key="item.name" v-on:click="item.action()" v-if="item.name">{{item.name}}</a>
    </x-header>

    <div class="router-box">
      <slot name="router-box">
        <router-view></router-view>
      </slot>
    </div>
  </div>
</template>

<script>
import { XHeader } from "vux";
export default {
  components: {
    XHeader
  },
  props: ["routes", "closeable"],
  data() {
    return {};
  },
  methods: {
    // jump(url) {
    //   console.log(url)
    //   location.href = url;
    // },
    close() {
      this.$webview.close();
    },
    goBack() {
      var path = this.$route.path;
      this.$router.go(-1);
      setTimeout(() => {
        if (path == this.$route.path) {
          this.$webview.close();
        }
      }, 100);
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.powerPlant-index {
  height: 100%;
  font-size: 14px;
  .vux-header-title-area {
    margin: 0 60px !important;
  }
  .overwrite-title-demo {
    background-color: #28b8f7;
    text-align: center;
    .title-item {
      display: inline-block;
      padding: 7px;
      font-size: 18px;
      color: #abe2fe;
    }
    .title-item.selected {
      color: white;
    }
  }
  .vux-header {
    background-color: #28b8f7;
  }
  .router-box {
    position: absolute;
    top: 46px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f1f2f6;
  }

  .vux-header-back {
    color: white !important;
  }

  .left-arrow:before {
    border: 1px solid white !important;
    border-width: 1px 0 0 1px !important;
  }
  .rightLog {
    color: #e9f5fd !important;
  }
}
</style>
