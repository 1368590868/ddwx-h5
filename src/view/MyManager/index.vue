<template>
    <div class="container">
        <div class="my-card">
            <dl class="my-card-dl">
                <dt>{{userInfo.name}}</dt>
                <dd>所属单位：{{userInfo.companyName}}</dd>
            </dl>
        </div>
        <div class="my-card-content">
            <ul class="my-card-ul">
                <li right-icon="arrow"><i class="icon font_family icon-icon-title-20"></i><span class="card-text">所属部门：{{userInfo.officeName}}</span></li>
                <li><i class="icon font_family icon-icon-contacts-20"></i><span class="card-text">联系方式：<b class="phone-class" @click="teleponeClick(userInfo.phone)">{{userInfo.phone}}</b></span></li>
                <li><i class="icon font_family icon-icon-version-20"></i><span class="card-text">版本信息：v1.0.2</span></li>
            
            </ul>
            <div class="bu">
                <van-button  @click="goSuggestion" type="info" block>意见反馈</van-button>
                <van-button  @click="goAddress" type="info" block>常用地址</van-button>
                <!-- <van-button type="default" block>修改密码</van-button> -->
                <!-- <van-button plain type="info" block>退出登录</van-button> -->
                <!-- <van-button plain type="info" block @click="$router.push({name: 'jsapi'})">跳往测试</van-button>  -->
            </div>
        </div>
    </div>

</template>
<script>
    import {mapGetters} from 'vuex'
    import platform from '@/view/mixins/platform'
export default {
    mixins: [platform],
    computed: mapGetters(['userInfo']),
    methods:{
        goSuggestion(){
            this.$router.push({
                name: 'Suggestion',
            });
        },
        goAddress(){
             this.$router.push({
                path: '/address',
            });
        }
    }

}
</script>
<style lang="less" scoped>
.suggest-icon{
    vertical-align: middle;
    margin-right: 3px;
}

</style>
