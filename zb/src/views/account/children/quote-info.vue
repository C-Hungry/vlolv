<style scoped lang="less">
    .index {
        position: relative;
    }

    .bidded-detail {
        position: relative;
    }


    .datail-info-header {
        position: relative;
        background-color: #e7f2ff;
        padding: 10px 25px 15px 20px;
        font-size: 14px;
        .title {
            padding: 10px 0 15px 0;
            .title-span1 {
                font-size: 18px;
                font-weight: bolder;
            }
        }
        .download {
            cursor: pointer;
            color: #2d8cf0;
        }
        .download:hover {
            color: #39afff;
        }
        .bidded-number {
            position: absolute;
            right: 30px;
            top: 20px;
            font-size: 16px;
            font-weight: bolder;
            color: red;
        }
        .detail-col-margin {
            margin-bottom: 10px;
        }
        .item-download {
            color: #0950a0;
            font-weight: bolder;
        }
    }

    .download {
        color: #2d8cf0;
    }

    .download:hover {
        color: #39afff;
    }

    .bidded-detail-tittle,
    .bidded-info-tittle {
        padding: 10px 0;
    }

    .bidded-detail-content,
    .bidded-company-tittle>div {
        background: rgb(231, 242, 255);
    }

    .bidded-info-tittle>span {
        font-size: 16px;
        font-weight: bold;
    }

    .bidded-logo {
        position: absolute;
        top: 0;
        right: 0;
    }

    .bidded-info {
        border: 3px solid #e7f2ff;
    }

    .company-info,
    {
        width: 100%;
        padding: 10px 20px;
        background: rgb(231, 242, 255);
    }

    .bidded-info-step {
        padding: 30px;
    }

    .bidded-company-info {
        text-indent: 2rem;
        padding: 15px;
    }

    .bidded-company-tittle>div {
        padding: 15px;
        font-size: 14px;
        font-weight: 600;
    }

    .detail-button {
        width: 100%;
        height: 110px;
        line-height: 100px;
        background-color: #f5f5f5;
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 0;
        border-top: 1px solid #f5f5f5;
        box-shadow: 0 -2px 3px #ccc;
    }
</style>
<template>
    <div class="index">

        <div class="bidded-info-tittle">
            <span>项目详情</span>
        </div>
        <div class="bidded-info">

            <div class="bidded-info-content">



                <div class="datail-info-header">
                    <div class="title">
                        <span class="title-span1">{{proDetail.title}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span @click="isDownload=true" class="download">
                            <Icon type="android-attach" size='16' class="dowloundIcon"></Icon>
                            下载附件
                        </span>
                    </div>
                    <!--<div class="bidded-number">已报价： {{proDetail.tenderBidCompaniesCount}} 家</div>-->
                    <Row type="flex">
                        <Col class-name="detail-col-margin" span="6" order="1">招标单位 ：
                        <strong>{{proDetail.inviteBidCompanyName}}</strong>
                        </Col>
                        <Col span="6" order="2">项目编号 ：
                        <strong>{{proDetail.number}}</strong>
                        </Col>
                        <Col span="6" order="3">项目类型 ：
                        <strong>{{proDetail.typeName}}</strong>
                        </Col>
                        <Col span="6" order="4">
                        <strong></strong>
                        </Col>
                        <Col span="6" order="5">&nbsp;&nbsp;&nbsp;联系人 ：
                        <strong>{{proDetail.contactPerson}}</strong>
                        </Col>
                        <Col span="6" order="6">联系方式 ：
                        <strong>{{proDetail.contactNumber}}</strong>
                        </Col>
                    </Row>
                </div>

                <div class="bidded-info-step" style="padding-left:180px;">
                    <Steps :current="currentStep">
                        <Step v-for="item in progressItems" :title="item.text" :content="item.time | formatTime" :key="item.text"></Step>
                    </Steps>
                </div>

            </div>
            <div class="bidded-company-tittle">
                <div>报价单位要求</div>
                <p class="bidded-company-info">
                    {{proDetail.tenderBidUnitRequirements ||'暂无'}}
                </p>
            </div>

            <div class="bidded-company-tittle">
                <div>罚款条款</div>
                <p class="bidded-company-info">
                    {{proDetail.rewardsAndPunishmentClause ||'暂无'}}
                </p>
            </div>

            <div class="bidded-company-tittle">
                <div>其他要约</div>
                <p class="bidded-company-info">
                    {{proDetail.otherAppointments ||'暂无'}}
                </p>
            </div>
        </div>
        <div class="detail-button" >
            <Button type="ghost" @click="isDownload=true" style="width: 300px;margin-right: 30px;color: #0950A0;border-color: #0950A0;"
                size="large">下载项目附件</Button>
            <Button type="primary" style="width: 300px" :disabled="isDisabled" @click="tobidQuote" size="large">{{supportText}}</Button>
        </div>
        <!-- 下载列表模态框 -->
        <Modal v-model="isDownload">
            <p slot="header" style="font-size:14px;text-align:left">
                <span>下载附件</span>
            </p>
            <div style="text-align:center;padding: 0 30px">
                <span v-if="filesList.length == 0" style="font-size:14px;">暂无附件</span>
                <Row v-for="(item,index) in filesList" :key="index" style="margin-bottom:5px;font-size:14px;">
                    <Col span="18" style="text-align:left">{{item.name}}</Col>
                    <Col span="6">
                    <a target="_blank" :href="item.url">
                        <Icon type="ios-cloud-download-outline"></Icon>下载</a>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="primary" @click="isDownload=false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import Config from "../../../config/config";
    import {DateManager} from "../../../config/util";
    import { getCurrentStep } from "../../../common/tools";
    import { BiddingStatusCode } from "../../../common/config";
    //过滤器
    Vue.filter('formatTime', function (value) {
        if (!value) {
            return ''
        }
        value = DateManager.formatTime(value);
        return value;
    })
    export default {
        data() {
            return {
                tenderBidID: this.$route.query.tenderBidID,
                id: this.$route.query.id,
                bidDetail: {},
                proDetail: {},
                filesList: [],
                isDownload: false,
                currentStep: 0,
                isDisabled: true,
                supportText: '加载中...',
                docPath: {},
                attachments: {},
                progressItems: [{
                        text: "发布时间",
                        time: ""
                    },
                    {
                        text: "报价开始时间",
                        time: ""
                    },
                    {
                        text: "报价结束时间",
                        time: ""
                    },
                    {
                        text: "公示时间",
                        time: ""
                    }
                ]
            }
        },
        mounted() {
            this.getBidDetail();
        },
        methods: {
            getBidDetail() {
                var url = "/PlantOpenTender/inviteBidService/GetById";
                // 根据ID 获取招标信息
                var id = this.id;
                this.$store.loading();
                this.$service.post(url, {
                    id
                }).then((res) => {
                    this.$store.unloading();
                    var data = res.result;
                    this.proDetail = res.result;
                    this.progressItems[0].time = data.publishTime;
                    this.progressItems[1].time = data.startTenderTime;
                    this.progressItems[2].time = data.endTenderTime;
                    this.progressItems[3].time = data.publicityTime;
                    this.$service.post("/PlantOpenTender/commonService/GetServerTime", {}).then(time => {
                        let servTime = time.result;
                        this.currentStep = getCurrentStep(this.progressItems, servTime);
                    })
                    this.filesList = [];
                    for (let i = 0; i < data.attachments.length; i++) {
                        this.filesList.push({
                            name: decodeURI(data.attachments[i].name),
                            url: Config.baseUrl + 　
                                "/PlantOpenTender/attachmentService/FileDownLoad?name=" +
                                encodeURIComponent(this.proDetail
                                    .attachments[i].name) + "&url=" + encodeURIComponent(this.proDetail
                                    .attachments[i].url)
                        })
                    }

                    if (data.status == BiddingStatusCode.inbidding) {
                        this.isDisabled = false;
                        this.supportText = "报价";
                        return;
                    }  
                    else if (data.status == BiddingStatusCode.published) {
                        this.isDisabled = true;
                        this.supportText = "报价未开始";
                        return;
                    }
                    else {
                        this.isDisabled = true;
                        this.supportText = "报价已结束";
                    }
                }).catch((res) => {
                    this.$router.push('/account/my-bidded');
                });
            },
            tobidQuote() {
                this.$router.push({
                    path: "/account/tobid-quote",
                    query: {
                        id: this.id
                    }
                });
            }
        }
    };
</script>