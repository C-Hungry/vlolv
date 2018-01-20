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

    .datail-info {
        padding: 10px 25px 15px 20px;
        font-size: 14px;
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
        padding: 10px 10px;
        background: rgb(231, 242, 255);
    }

    .bidded-info-step {
        padding: 30px;
    }

    .bidded-company-info {
        font-size: 14px;
        text-indent: 2rem;
        padding: 15px 0 15px 0;
    }

    .bidded-company-tittle>div {
        padding: 15px;
        font-size: 14px;
        font-weight: 600;
    }
</style>

<template>
    <div class="index">
        <div class="bidded-detail">
            <div class="bidded-info-tittle">
                <span>投标详情</span>
                <!-- 编辑撤销功能暂且隐藏 -->
                <!-- <span class="edit" @click='editInfo'>编辑</span>
                <span class="recall" @click='recallPro'>撤销</span> -->
            </div>
            <div class="bidded-detail-content">
                <div class="company-info">
                    <div class="datail-info-header">
                        <Row>
                            <Col class-name="detail-col-margin" span="24" order="1">投标说明 ： {{bidDetail.tenderRemark|| "暂无"}}
                            </Col>
                        </Row>
                        <Row>
                            <Col class-name="detail-col-margin" span="6" order="1">附件 ：
                            <Icon type="android-attach" size='20' color='#0c53a1' class="dowloundIcon"></Icon>
                            <a @click="isDownloads=true" class="download">项目附件可供下载</a>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6" order="6">联系人 ：
                            <strong>{{bidDetail.linkMan}}</strong>
                            </Col>
                            <Col span="6" order="6">联系方式 ：
                            <strong>{{bidDetail.linkPhon}}</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6" order="6">邮箱 ：
                            <strong>{{bidDetail.linkEmail}}</strong>
                            </Col>
                        </Row>
                    </div>
                </div>

                <Modal v-model="isDownloads">
                    <p slot="header" style="font-size:14px;text-align:left">
                        <span>下载附件</span>
                    </p>
                    <div style="text-align:center;padding: 0 30px">
                        <span v-if="filesLists.length == 0" style="font-size:14px;">暂无附件</span>
                        <Row v-for="(item,index) in filesLists" :key="index" style="margin-bottom:5px;font-size:14px;">
                            <Col span="18" style="text-align:left">{{item.name}}</Col>
                            <Col span="6">
                            <a :href="item.url">
                                <Icon type="ios-cloud-download-outline"></Icon>下载</a>
                            </Col>
                        </Row>
                    </div>
                    <div slot="footer">
                        <Button type="primary" @click="isDownloads=false">关闭</Button>
                    </div>
                </Modal>


                <!-- <img class="bidded-logo" src="../../../images/已流标.png" alt=""> -->
            </div>
        </div>
        <div v-if="isSupportShowBiddedInfo">
            <div class="bidded-info-tittle">
                <span>中标详情</span>
            </div>
            <div class="bidded-info">
                <div class="bidded-company-tittle">
                    <div>中标候选人</div>
                </div>
                <div class="">
                    <div class="bidded-company-info">
                        <Row v-for="(item, index) in winData.winBidCandidates" :key="item.id" type="flex" justify="space-between" class="code-row-bg">
                            <Col span="7">第{{index+1}}候选人 ：
                            <strong>{{item.tenderBidCompanyName}}</strong>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div class="bidded-company-tittle">
                    <div>其他说明</div>
                </div>
                <div class="datail-info">
                    <Row>
                        <Col class-name="detail-col-margin" span="24" order="1" style="border-bottom:1px inset rgb(221,221,221);padding-bottom:5px;">
                        <strong style="word-break: break-all;">公示说明 ：{{winData.explanation||"暂无"}}</strong>
                        </Col>
                    </Row>
                    <Row style="padding-top:5px;">
                        <Col span="6" order="6">联系人 ：
                        <strong>{{winData.inviteBidContactPerson}}</strong>
                        </Col>
                        <Col span="6" order="6">联系方式 ：
                        <strong>{{winData.inviteBidContactNumber}}</strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="6" order="6">邮箱 ：
                        <strong>{{winData.inviteBidEmail}}</strong>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
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
                    <!--<div class="bidded-number">已投标： {{proDetail.tenderBidCompaniesCount}} 家</div>-->
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
                        <strong>投标保证金 ： {{proDetail.earnestMoney}}元人民币
                        </strong>
                        </Col>
                        </strong>
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
                <div>招标单位要求</div>
                <p class="bidded-company-info">
                    {{proDetail.tenderBidUnitRequirements || '暂无'}}
                </p>
            </div>

            <div class="bidded-company-tittle">
                <div>罚款条款</div>
                <p class="bidded-company-info">
                    {{proDetail.rewardsAndPunishmentClause || '暂无'}}
                </p>
            </div>

            <div class="bidded-company-tittle">
                <div>其他邀约</div>
                <p class="bidded-company-info">
                    {{proDetail.otherAppointments || '暂无'}}
                </p>
            </div>
        </div>
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
    import { DateManager } from "../../../config/util";
    import { getCurrentStep } from "../../../common/tools";
    import { BidStatusCode } from "../../../common/config";
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
                isSupportShowBiddedInfo: false,
                tenderBidID: this.$route.query.tenderBidID,
                id: this.$route.query.id,
                currentStep: 0,
                bidDetail: {},
                filesList: [],
                filesLists: [],
                proDetail: {},
                docPath: {},
                winData: {
                    winBidCandidates: [],
                },
                isDownload: false,
                isDownloads: false,
                attachments: {},
                progressItems: [{
                        text: "发布时间",
                        time: ""
                    },
                    {
                        text: "投标开始时间",
                        time: ""
                    },
                    {
                        text: "投标结束时间",
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
            editInfo() {
                this.$router.push({
                    path: "/account/tobid",
                    query: {
                        tenderBidID: this.tenderBidID,
                        id: this.id
                    }
                });
            },
            getWinBid() {
                this.$store.loading();
                this.$service
                    .post("/PlantOpenTender/winBidPublicityService/GetByInviteBidId", {
                        inviteBidId: this.id
                    }).then(res => {
                        this.$store.unloading();
                        this.winData = res.result;
                        this.winData.winBidCandidates.sort((a, b) => {
                            return a.sortNum - b.sortNum;
                        });

                    });
            },
            recallPro() {
                const title = '确定';
                const content = '<p>确认撤销吗？</p>';
                const repealUrl = '/PlantOpenTender/tenderBidService/CancelTerderBid';
                this.$Modal.confirm({
                    title: title,
                    content: content,
                    onOk: () => {
                        // this.$store.loading();
                        this.$service.post(repealUrl, {
                            tenderBidID: this.tenderBidID
                        }).then((res) => {
                            this.$store.unloading();
                            this.$Message.success("撤销成功！");
                            this.getBidDetail();
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('已取消');
                    }
                });
            },
            getBidDetail() {
                var url = "/PlantOpenTender/tenderBidService/GetTenderBidDetail";
                // 根据投标ID
                this.$store.loading();
                this.$service.post(url, {
                    tenderBidID: this.tenderBidID
                }).then((res) => {
                    this.$store.unloading();
                    var data = res.result;
                    this.bidDetail = data;
                    this.isSupportShowBiddedInfo = this.bidDetail.tenderBidStatus == BidStatusCode.beBidded;
                    this.proDetail = data.inviteBidDetail;
                    this.progressItems[0].time = this.proDetail.publishTime;
                    this.progressItems[1].time = this.proDetail.startTenderTime;
                    this.progressItems[2].time = this.proDetail.endTenderTime;
                    this.progressItems[3].time = this.proDetail.publicityTime;
                    this.$service.post("/PlantOpenTender/commonService/GetServerTime", {}).then(time => {
                        let servTime = time.result;
                        this.currentStep = getCurrentStep(this.progressItems, servTime);
                    })
                    this.filesLists = [];

                    for (let i = 0; i < data.docPath.length; i++) {
                        this.filesLists.push({
                            name: decodeURI(data.docPath[i].name),
                            url: Config.baseUrl + 　
                                "/PlantOpenTender/attachmentService/FileDownLoad?name=" + data.docPath[
                                    i].name + "&url=" + data.docPath[i].url
                        })
                    }
                    this.filesList = [];

                    for (let i = 0; i < this.proDetail.attachments.length; i++) {
                        this.filesList.push({
                            name: decodeURI(this.proDetail.attachments[i].name),
                            url: Config.baseUrl + 　
                                "/PlantOpenTender/attachmentService/FileDownLoad?name=" + this.proDetail
                                .attachments[i].name + "&url=" + this.proDetail.attachments[i].url
                        })
                    }
                    if (this.isSupportShowBiddedInfo) {
                        this.getWinBid();
                    }
                }).catch((res) => {
                    history.go(-1);
                });

            }
        }
    };
</script>