<style scoped lang="less">
.index{
    background-color: #E7F2FF;
    height: 60px;
    border-bottom: solid 3px #C8E1FE;
    padding: 0 10px;
    span.item{
        line-height: 60px;
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        padding: 0 10px;
        cursor: pointer;
        color: #898B8D;
    }
    span.selected{
        color: #0950A0;
    }
}
</style>
<template>
<div class="index">
    <span v-for="title in titles" :key="title" v-on:click="onSelectionChanged(title)">
        <span v-if="title==myCurrent" class="item selected">{{title}}</span>
        <span v-else class="item">{{title}}</span>
    </span>
</div>
</template>
<script>
export default {
    props:[
        "titles",
        "current",
    ],
    data(){
        return {
            myCurrent: '',
        };
    },
    methods:{
        onSelectionChanged(title){
            this.myCurrent = title;
            this.$emit("onSelectionChanged", title);
        },
    },
    mounted(){
        this.myCurrent = this.current;
    }
};
</script>
