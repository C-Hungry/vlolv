<style scoped lang="less">
.index{
    background-color: #E7F2FF;
    height: 60px;
    color: #0950A0;
    border-bottom: solid 3px #C8E1FE;
    line-height: 60px;
    font-size: 16px;
    font-weight: bold;
    padding: 0 10px;
}
</style>
<template>
<div class="index">
    {{title}}
</div>
</template>
<script>
export default {
    props:[
        "title"
    ],
    data(){
        return {};
    },
};
</script>
