<template>
    <div class="main-container">
        <div class="order-info-container box-container">
            <div class="driver-info">
                <span class="driver-name">{{carInfo.driver.substr(0,1)}}师傅</span>
                <span class="driver-career">驾驶司机</span>
                <span class="evaluate-status">已评价</span>
                <i class="over-evaluate-status default-icon-i"></i>

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
                    <van-rate v-model="carInfo.evaluateLevel" color="#ffd21e"  size="16px" readonly/>
                    <span class="evaluate-text">{{evaluateTextRule(carInfo.evaluateLevel)}}</span>
                </li>
                <li>
                    <span>驾驶水平：</span>
                    <van-rate v-model="carInfo.evaluateDriver" color="#ffd21e"  size="16px" readonly/>
                    <span class="evaluate-text">{{evaluateTextRule(carInfo.evaluateDriver)}}</span>
                </li>
                <li>
                    <span>服务态度：</span>
                    <van-rate v-model="carInfo.evaluateService" color="#ffd21e"  size="16px" readonly/>
                    <span class="evaluate-text">{{evaluateTextRule(carInfo.evaluateService)}}</span>
                </li>
                <li>
                    <span>车内环境：</span>
                    <van-rate v-model="carInfo.evaluateIncar" color="#ffd21e"  size="16px" readonly/>
                    <span class="evaluate-text">{{evaluateTextRule(carInfo.evaluateIncar)}}</span>
                </li>
            </ul>
            <div class="evaluate-content">
                <span>评价描述：</span>
                <div>{{carInfo.evaluateContent || '未填写'}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import checkCarImagePath from '@/utils/carPath'

export default {
    name:'EvaluateDetail',

    data () {
        return {
            orderInfo:{},
            carInfo:{},
            checkCarImagePath,
        }
    },
    created () {
        this.orderInfo = JSON.parse(this.$route.params.orderInfo);
        this.carInfo = JSON.parse(this.$route.params.carInfo);

        this.carInfo.evaluateLevel = Number(this.carInfo.evaluateLevel);
        this.carInfo.evaluateDriver = Number(this.carInfo.evaluateDriver);
        this.carInfo.evaluateService = Number(this.carInfo.evaluateService);
        this.carInfo.evaluateIncar = Number(this.carInfo.evaluateIncar);
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
            .over-evaluate-status {
                background-image:url(/static/over_evaluate.png);
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
                        min-width: 70px
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
        margin-bottom: 10px;
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
            span {
                color: #2e2e2e;
                font-size: 14px;
            }
            div {
                margin-top: 4px;
                background-color:#f6f6f6;
                font-size: 14px;
                color: #2e2e2e;
                padding: 9px 12px;
                border-radius: 3px;
            }
        }
    }
}
</style>