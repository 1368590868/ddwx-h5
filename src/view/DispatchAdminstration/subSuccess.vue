<template>
<div class="container">
    <div class="wrapper">
        <div class="car-success">
            <div class="success-box">
                <div class="success-image"></div>
                <h3>指派成功</h3>
                <p>指派结果已经发送给司机</p>
            </div>
        </div>
    </div>
    <div class="button-box">
        <van-button type="default" :to="'/DispatchAdminstration/details/3'">查看详情</van-button>
        <van-button type="info" to="/DispatchAdminstration/index">返回列表</van-button>
    </div>
    
</div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    modules: {
    }
}
</script>