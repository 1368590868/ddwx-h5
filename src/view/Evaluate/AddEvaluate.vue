<template>
    <div class="main-container">
        <div class="order-info-container box-container">
            <div class="driver-info">
                <span class="driver-name">{{carInfo.driver.substr(0,1)}}师傅</span>
                <span class="driver-career">驾驶司机</span>
                <span class="evaluate-status">未评价</span>
                <i class="wait-evaluate-status default-icon-i"></i>

                <ul>
                    <li>
                        <span>时{{'\u3000'}}{{'\u3000'}}间：</span>
                        <span>{{orderInfo.usageTimeStr}}</span>
                    </li>
                    <li>
                        <span>出{{'\u00A0'}}{{'\u00A0'}}发{{'\u00A0'}}{{'\u00A0'}}地：</span>
                        <span>{{orderInfo.fromAddr}}</span>
                    </li>
                    <li>
                        <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                        <span>{{orderInfo.toAddr}}</span>
                    </li>
                </ul>
            </div>
            <div class="car-info">
                <ul>
                    <li>
                        <span>分派车辆：</span>
                        <span>{{carInfo.carBrand}} {{carInfo.carSeries}}</span>
                    </li>
                    <li>
                        <span>车牌号码：</span>
                        <span>{{carInfo.carNumber}}</span>
                    </li>
                </ul>
                <img :src="checkCarImagePath(carInfo.carBrand, carInfo.carSeries)">
            </div>
        </div>
        <div class="evaluate-info-container box-container">
            <ul>
                <li>
                    <span>总体评分：</span>
                    <van-rate v-model="evaluateLevel" color="#ffd21e"  size="16px"/>
                    <span class="evaluate-text">{{evaluateTextRule(evaluateLevel)}}</span>
                </li>
                <li>
                    <span>驾驶水平：</span>
                    <van-rate v-model="evaluateDriver" color="#ffd21e"  size="16px"/>
                    <span class="evaluate-text">{{evaluateTextRule(evaluateDriver)}}</span>
                </li>
                <li>
                    <span>服务态度：</span>
                    <van-rate v-model="evaluateService" color="#ffd21e"  size="16px"/>
                    <span class="evaluate-text">{{evaluateTextRule(evaluateService)}}</span>
                </li>
                <li>
                    <span>车内环境：</span>
                    <van-rate v-model="evaluateIncar" color="#ffd21e"  size="16px"/>
                    <span class="evaluate-text">{{evaluateTextRule(evaluateIncar)}}</span>
                </li>
            </ul>
            <div class="evaluate-content">
                <van-field
                    v-model="evaluateContent"
                    type="textarea"
                    maxlength="200"
                    placeholder="评价描述（非必填）"
                    show-word-limit/>
            </div>
        </div>
        <div class="default-button-container-two">
            <van-button block type="default" @click="handleEvaluateCancel" round>返回</van-button>
            <van-button block type="info" @click="handleEvaluateConfirm" round>提交评价</van-button>
        </div>
    </div>
</template>
<script>
import checkCarImagePath from '@/utils/carPath'
import {gcywRequestEvaluateSave} from '@/api/order'

export default {
    name:'AddEvaluate',

    data () {
        return {
            orderInfo:{},
            carInfo:{},
            checkCarImagePath,
            //总体评价
            evaluateLevel:4,
            //司机平分
            evaluateDriver:4,
            //服务平分
            evaluateService:4,
            //车内平分
            evaluateIncar:4,
            //评价内容
            evaluateContent:'',
        }
    },
    created () {
        this.orderInfo = JSON.parse(this.$route.params.orderInfo);
        this.carInfo = JSON.parse(this.$route.params.carInfo);
    },
    methods: {
        //评价文字显示规则
        evaluateTextRule(level){
            if(level === 1){
                return '非常不满意';
            }else if(level === 2){
                return '不满意';
            }else if(level === 3){
                return '一般';
            }else if(level === 4){
                return '比较满意';
            }else if(level === 5){
                return '非常满意';
            }
            return '';
        },  
        //返回点击
        handleEvaluateCancel(){
            this.$router.go(-1);
        },
        //提交评价点击
        handleEvaluateConfirm(){
            if(!this.evaluateLevel){
                this.$notify({
                    type: 'warning',
                    message: '请选择总体评分满意度!',
                });
                return
            }
            if(!this.evaluateDriver){
                this.$notify({
                    type: 'warning',
                    message: '请选择驾驶水平评价满意度!',
                });
                return
            }
            if(!this.evaluateService){
                this.$notify({
                    type: 'warning',
                    message: '请选择服务态度评价满意度!',
                });
                return
            }
            if(!this.evaluateIncar){
                this.$notify({
                    type: 'warning',
                    message: '请选择车内环境评价满意度!',
                });
                return
            }
            this.$dialog.confirm({
                title: '提示',
                message: '是否提交评价?',
            }).then(() => {
                this.gcywRequestEvaluateSave();
            }).catch(() => {
           
            });
            
        },
        gcywRequestEvaluateSave(){
            let evaluateArr = [];

            let obj = {};
            this.$set(obj, 'reqassId', this.carInfo.id);
            this.$set(obj, 'evaluateLevel', this.evaluateLevel);
            this.$set(obj, 'evaluateDriver', this.evaluateDriver);
            this.$set(obj, 'evaluateService', this.evaluateService);
            this.$set(obj, 'evaluateIncar', this.evaluateIncar);
            this.$set(obj, 'evaluateContent', this.evaluateContent);
            evaluateArr.push(obj)

            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            gcywRequestEvaluateSave(evaluateArr).then(({message}) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.push({
                    name: 'EvaluateList',
                    params: {
                        refresh:true,
                    }
                });
            }).catch((err) => {
                this.$toast.fail("提交评价失败!");
            }).finally(() => {
                toast.clear();
            })
        }
    },
}
</script>
<style lang="less" scoped>
.main-container {
    padding-top: 10px;

    .order-info-container {
        margin-bottom: 10px;

        .driver-info {
            position: relative;
            margin-bottom: 8px;

            .driver-name {
                font-size: 24px;
                color: #121833;
                font-weight: 500;
            }
            .driver-career {
                font-size: 14px;
                color: #121833;
                margin-left: 12px;
            }
            .evaluate-status {
                font-size: 12px;
                color: #2e2e2e;
                position: absolute;
                right: 0px;
                top: 10px;
            }
            .wait-evaluate-status {
                background-image:url(/static/wait_evaluate.png);
                position: absolute;
                right: 40px;
                top: 10px;
            }
            ul {
                padding-bottom: 5px;
                border-bottom: 1px solid #f0f0f0;
                margin-bottom: 18px;
                margin-top: 8px;

                li{
                    font-size: 14px;
                    color: #2e2e2e;
                    margin-bottom: 8px;
                    display: flex;

                    & span:nth-child(1){
                        width: 70px
                    }
                    & span:nth-child(2){
                        width: calc(100% - 70px);
                    }
                }
            }
        }
        .car-info {
            position: relative;

            ul {
                padding-bottom: 5px;
                margin-top: 8px;

                li{
                    font-size: 14px;
                    color: #2e2e2e;
                    margin-bottom: 8px;
                }
            }
            img {
                width: 64px;
                height: 64px;
                position: absolute;
                right: 0px;
                top: -10px;
            }
        }
    }
    .evaluate-info-container {
        margin-bottom: 64px;
        padding: 12px 12px 15px 20px;
        
        ul {
            margin-top: 8px;

            li{
                font-size: 14px;
                color: #2e2e2e;
                margin-bottom: 20px;
                display: flex;
                position: relative;
                align-items: center;

                .van-rate {
                    margin-left: 5px;
                    margin-top: 2px;
                }
                .evaluate-text {
                    position: absolute;
                    right: 0px;
                }
            }
            & li:nth-child(1) {
                font-weight: 600;
            }
        }
        .evaluate-content {

            .van-cell {
                margin-top: 10px;
                padding: 0px;
                border: 1px solid #f4f4f4;
            }
            ::v-deep.van-field__control {
                padding: 5px;
                min-height: 85px;
            }
        }
    }
}
</style>