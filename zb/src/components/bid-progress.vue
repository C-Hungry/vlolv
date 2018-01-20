<style scoped lang="less">
    .progress-container {
        height:80px;
        position: relative;
        .line {
            height: 30px;
            line-height: 30px;
            display:flex;
            align-items: center;
            .content {
                display: flex;
                align-items: center;
                text-align: center;
            }
            .step {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 6px;
            }
            .step-default {
                color: #999999;
                background-color: #999999; 
            }
            .step-active {
                color: #0076FB;
                background-color: #0076FB;
            }
            .step-current-active {
                border-radius: 10px;
                border:1px solid #0076FB;
                padding:10px;
                background-image: url('../images/radio-selected.png');
                background-repeat: no-repeat;
                background-position: center;
            }
        }
        .info {
            position: absolute;
            left: -50px;
            .field {
                display: inline-block;
                margin-right: 127px; 
                text-align: center;
                div {
                    height: 20px;
                }
            }
            .field:last-child {
                margin-right: 0;
            }
        }
        .text-active {
            color: #0076FB;
        }
        .text-default {
            color: #999999;
        }
    }
</style>
<template>
<div class="progress-container">
    <div class="line">
        <div class="content" v-for="(item,index) in items" v-if="index !== items.length -1">
            <span class="step" v-if="index == 0" :class="{'step-active': currentStep > 0,'step-current-active': currentStep == 0}"></span>
            <span :class="{'text-active': currentStep > index-1,'text-default': currentStep <= index-1}" style="font-size: 16px">--------------------------------------</span>
            <span class="step" :class="{'step-active': currentStep > index,'step-default': currentStep < index,'step-current-active': currentStep == index}"></span>
        </div>
    </div>
    <div class="info">
        <div class="field" v-for="(item,index) in items" :class="{'text-active': currentStep == index-1}">
            <div>{{item.text}}</div>
            <div>{{item.time}}</div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props:[
        "items"
    ],
    mounted () {
        var t = new Date();
        var t1 = t.getTime();
        var t2,t3;
        for (let i = 0;i < this.items.length;i++) {
            t2 = new Date(this.items[i].time).getTime();
            if (i + 1 == this.items.length) {
                t3 = new Date().getTime();
            }
            else {
                t3 = new Date(this.items[i + 1].time).getTime();
            }
            if (t1 > t2 && t1 <= t3) {
                this.currentStep = i -1;
                break;
            }
        }
    },
    data(){
        return {
            currentStep: ''
        };
    },
};
</script>
