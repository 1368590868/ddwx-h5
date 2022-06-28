<template>
<div class="container">
    <div class="wrapper">
        <div class="car-success">
            <div class="success-box">
                <div class="success-image"></div>
                <h3>提交成功</h3>
                <p>审批结果已发送给申请人</p>
            </div>
        </div>
    </div>
    <div class="button-box">
        <van-button type="default" :to="'/CarApproval/ApprovalDetail/' + $route.params.id">查看详情</van-button>
        <van-button type="info" @click="goOrderdetailPage">返回列表</van-button>
    </div>
    
</div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    methods:{
        goOrderdetailPage () {
            this.$store.dispatch('CarApplication/triggerFefresh', true);
            this.$router.push({
                name: 'ApprovalPending',
            });
        }
    },
    
    
}
</script>