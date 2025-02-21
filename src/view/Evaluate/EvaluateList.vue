<template>
    <div class="main-container" ref="container">
        <van-pull-refresh v-model="refreshLoading" @refresh="orderOnRefresh" success-text="刷新成功">
            <van-list 
                v-model="requestLoading" 
                :finished="requestFinished" 
                finished-text="没有更多了..." 
                @load="getEvaluateList">
                
                <div class="evaluate-list-title">已完成订单</div>

                <div v-for="(item,index) in requestList" :key="index" class="evaluate-item-container box-container">
                    <div class="evaluate-item">
                        <ul>
                            <li>
                                <span>时{{'\u3000'}}{{'\u3000'}}间：</span>
                                <span>{{item.usageTimeStr}}</span>
                            </li>
                            <li>
                                <span>出{{'\u00A0'}}{{'\u00A0'}}发{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                <span>{{item.simpleFromAddr}}</span>
                            </li>
                            <li>
                                <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                <span>{{item.simpleToAddr}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="car-info-item" v-for="(carInfoItem,carInfoIndex) in item.reqAssignments" :key="carInfoIndex">
                        <ul>
                            <li>
                                <span>分派司机：</span>
                                <span>{{carInfoItem.driver.substr(0,1)}}师傅</span>
                            </li>
                            <li>
                                <span>分派车辆：</span>
                                <span>{{carInfoItem.carBrand}} {{carInfoItem.carSeries}}</span>
                            </li>
                        </ul>
                        <span class="evaluate-status">{{!carInfoItem.evaluateLevel?'未评价':'已评价'}}</span>
                        <i :class="[!carInfoItem.evaluateLevel?'wait-evaluate-status':'over-evaluate-status','default-icon-i']"></i>
                        <div class="car-info-bottom">
                            <img :src="checkCarImagePath(carInfoItem.carBrand, carInfoItem.carSeries)">
                            <van-rate v-if="!!carInfoItem.evaluateLevel" v-model="carInfoItem.evaluateLevel" color="#ffd21e" readonly size="16px"/>
                            <span v-if="!carInfoItem.evaluateLevel" class="evaluate-go" @click="handleAddEvaluate(item,carInfoItem)">评价</span>
                            <span v-if="!!carInfoItem.evaluateLevel" class="evaluate-see" @click="handleSeeEvaluate(item,carInfoItem)">查看</span>
                        </div>
                    </div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script>
import { orderRequestList } from '@/api/order'
import checkCarImagePath from '@/utils/carPath'

export default {
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.container.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'AddEvaluate' || to.name === 'EvaluateDetail') {  
            let container = this.$refs.container;
            let top = container.scrollTop;
            from.meta.scrollTop = top;
        }
        next();
    },
    data () {
        return {
            requestLoading: false,
            requestFinished: false,
            refreshLoading: false,

            requestList: [],
            requestQuery: {
                pageSize: 10,
                pageNum: 1,
            },
            checkCarImagePath,
        }
    },
    created () {
       
    },
    activated () {
        if(this.$route.params.refresh){
            this.refreshLoading = true;
            this.orderOnRefresh();
        }
    },
    methods: {
        //获取评价列表数据
        getEvaluateList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                estatus:'1',
            }
            orderRequestList(Object.assign({}, params,this.requestQuery)).then(({data}) => {
                if(this.refreshLoading){
                    this.requestList = [];
                    this.refreshLoading = false;
                }
                this.requestLoading = false;
                this.requestList = [...this.requestList, ...data.list];

                this.requestList.forEach((item) => {
                    item.reqAssignments.forEach((itemChild) => {
                        itemChild.evaluateLevel = Number(itemChild.evaluateLevel);
                    })
                })
                if(!data.hasNextPage){
                    this.requestFinished = true;
                }else{
                    this.requestQuery.pageNum = this.requestQuery.pageNum + 1;
                }
            }).catch((err) => {
                this.requestLoading = false;
                this.requestFinished = true;
            }).finally(() => {
                toast.clear();
            })
        },
        //评价点击
        handleAddEvaluate(parentItem,childItem){
            this.$router.push({
                name: 'AddEvaluate',
                params: {
                    orderInfo:JSON.stringify(parentItem),
                    carInfo:JSON.stringify(childItem),                 
                },
            })
        },
        //查看评价点击
        handleSeeEvaluate(parentItem,childItem){
            this.$router.push({
                name: 'EvaluateDetail',
                params: {
                    orderInfo:JSON.stringify(parentItem),
                    carInfo:JSON.stringify(childItem),                     
                },
            })
        },
        //评价列表列表刷新
        orderOnRefresh() {
            this.requestFinished = false;
            this.requestLoading = true;
            this.requestQuery.pageNum = 1;
            this.getEvaluateList();
        },
    },
}
</script>
<style lang="less" scoped>
.main-container {
    .evaluate-list-title {
        width: 100%;
        height: 34px;
        padding-left: 16px;
        line-height: 34px;
        font-size: 14px;
        color: #434951;
    }
    .evaluate-item-container {
        margin-bottom: 10px;

        .evaluate-item {
            ul {
                padding-bottom: 5px;
                border-bottom: 1px solid #f0f0f0;

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
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
        .car-info-item {
            padding-top: 10px;
            position: relative;
            border-bottom: 1px solid #f0f0f0;

            ul {
                padding-bottom: 5px;

                li{
                    font-size: 14px;
                    color: #2e2e2e;
                    margin-bottom: 8px;
                }
            }
            .evaluate-status {
                position: absolute;
                right: 0;
                top: 10px;
                font-size: 12px;
                color: #2e2e2e;
            }
            .wait-evaluate-status {
                background-image:url(/static/wait_evaluate.png);
                position: absolute;
                right: 40px;
                top: 10px;
            }
            .over-evaluate-status {
                background-image:url(/static/over_evaluate.png);
                position: absolute;
                right: 40px;
                top: 10px;
            }
            .car-info-bottom {
                width: 100%;
                height: 64px;
                display: flex;
                text-align: center;
                position: relative;
                align-items: center;

                img {
                    width: 64px;
                    height: 64px;
                }
                .van-rate {
                    margin-left: 16px;
                }
                .evaluate-go {
                    display: block;
                    line-height: 26px;
                    width: 97px;
                    height: 26px;
                    background: #0571ff;
                    border-radius: 50px;
                    color: #ffffff;
                    position: absolute;
                    right: 0;
                    font-size: 14px;
                }
                .evaluate-see {
                    display: block;
                    line-height: 26px;
                    width: 97px;
                    height: 26px;
                    border: 1px solid #0571ff;
                    border-radius: 50px;
                    color: #0571ff;
                    position: absolute;
                    right: 0;
                    font-size: 14px;
                }
            }
        }
        .car-info-item:last-child {
            border-bottom: none;
        }
    }
}   

</style>