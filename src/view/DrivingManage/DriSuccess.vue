<template>
<div class="container">
    <div class="wrapper">
        <div class="car-success">
            <div class="success-box">
                <div class="success-image"></div>
                <h3>还车成功</h3>
                <p>行车数据已经提交成功</p>
            </div>
        </div>
    </div>
    <div class="button-box">
        <van-button type="default" :to="'/DrivingManage/DrivingDetails/' + $route.params.id +'/' + $route.params.assignmentId">查看详情</van-button>
        <van-button type="info" to="/DrivingManage/index">返回列表</van-button>
    </div>
    
</div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    created () {
        
    }
}
</script>