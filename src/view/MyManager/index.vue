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
                <li>
                    <i class="icon font_family icon-icon-destination-20"></i>
                    <span class="card-text">短信开关</span>
                    <div class="sms-control">
                        <van-field :label="checkSmsStatus()" label-align="right">
                            <template #input>
                                <van-switch v-model="isDefualtTag" size="20" @change="handleDefaultTagChage()" />
                            </template>
                        </van-field>
                    </div>
                </li>
            
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
    import {userModifys} from '@/api/auth'
export default {
    mixins: [platform],
    computed: mapGetters(['userInfo']),

    data () {
        return {
            isDefualtTag:true,
            smsFlag:'',
        }
    },
    mounted() {
        this.smsFlag=this.userInfo.smsFlag;
        this.isDefualtTag=this.smsFlag==='0'?true:false;
    },
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
        },
        checkSmsStatus(){
            return this.smsFlag==='0'?'接收短信':'不收短信'
        },
        handleDefaultTagChage(){
            if(this.smsFlag==='0'){
                this.changeSmsStatus('1');
            }else if(this.smsFlag==='1'){
                this.changeSmsStatus('0');
            }
        },
        changeSmsStatus(smsFlag){
            let paramsArr = [];
            let obj = {};
            this.$set(obj, 'id', this.userInfo.id);
            this.$set(obj, 'smsFlag', smsFlag);
            paramsArr.push(obj);

            userModifys(paramsArr).then(({message}) => {
                this.$toast.success(message)

                this.smsFlag=smsFlag;
                this.$store.dispatch('auth/changeSmsStatus',this.smsFlag);
            }).catch((err) => {
            
            }) 
        }
    }

}
</script>
<style lang="less" scoped>
.suggest-icon{
    vertical-align: middle;
    margin-right: 3px;
}
.my-card-ul :nth-child(4) {
    position: relative;
}
.sms-control {
    display: inline-block;
    position: absolute;
    right: -25px;
    top: -5px;
}
.bu {
    margin-top: 20px;
}
</style>
