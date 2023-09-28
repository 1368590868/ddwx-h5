<template>
    <div class="main-container" ref="container">
        <van-tabs 
            v-model="menuActiveIndex" 
            :sticky="true" 
            type="card"
            color="#0571ff"
            title-active-color="#ffffff"
            title-inactive-color="#2e2e2e">
            <van-tab title="待处理">
                <van-pull-refresh v-model="waitRefreshLoading" @refresh="waitRefresh" success-text="刷新成功">
                    <van-list 
                        v-model="waitLoading" 
                        :finished="waitFinished" 
                        finished-text="没有更多了..." 
                        @load="getWaitOrderList">

                        <div v-for="(item,index) in waitOrderList" :key="index" class="order-info-item box-container" @click="handleWaitItemClick(item)">
                            <ul>
                                <li class="li-item-long" v-if="item.longDistanceTag === 1">
                                    <i class="order-long"></i>
                                    <span>长途单</span>
                                </li>
                                <li>
                                    <span>出发时间：</span>
                                    <span>{{item.usageDate}}{{'\u00A0'}}{{item.usageTime}}</span>
                                </li>
                                <li>
                                    <span>出{{'\u00A0'}}{{'\u00A0'}}发{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span>{{item.fromAddr}}</span>
                                </li>
                                <li>
                                    <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span class="li-item-content">{{item.toAddr}}</span>
                                </li>
                                <li>
                                    <span>分派司机：</span>
                                    <span>{{item.driver}}</span>
                                </li>
                                <li>
                                    <span>分派车辆：</span>
                                    <span>{{item.carBrand}}{{'\u00A0'}}{{item.carSeries}}</span>
                                </li>
                                <div class="order-status-container">
                                    <i :class="checkStatusImage(item.status)" class="default-icon-i"></i>
                                    <span class="order-status-text">{{checkOrderStatus(item.status)}}</span>
                                </div>
                                <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="历史订单">
                <van-pull-refresh v-model="historyRefreshLoading" @refresh="historyRefresh" success-text="刷新成功">
                    <van-list 
                        v-model="historyLoading" 
                        :finished="historyFinished" 
                        finished-text="没有更多了..." 
                        @load="getHistoryOrderList">

                        <div v-for="(item,index) in historyOrderList" :key="index" class="order-info-item box-container" @click="handleHistoryItemClick(item)">
                            <ul>
                                <li class="li-item-long" v-if="item.longDistanceTag === 1">
                                    <i class="order-long"></i>
                                    <span>长途单</span>
                                </li>
                                <li>
                                    <span>出发时间：</span>
                                    <span>{{item.usageDate}}{{'\u00A0'}}{{item.usageTime}}</span>
                                </li>
                                <li>
                                    <span>出{{'\u00A0'}}{{'\u00A0'}}发{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span>{{item.fromAddr}}</span>
                                </li>
                                <li>
                                    <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span class="li-item-content">{{item.toAddr}}</span>
                                </li>
                                <li>
                                    <span>分派司机：</span>
                                    <span>{{item.driver}}</span>
                                </li>
                                <li>
                                    <span>分派车辆：</span>
                                    <span>{{item.carBrand}}{{'\u00A0'}}{{item.carSeries}}</span>
                                </li>
                                <div class="order-status-container">
                                    <i :class="checkStatusImage(item.status)" class="default-icon-i"></i>
                                    <span class="order-status-text">{{checkOrderStatus(item.status)}}</span>
                                </div>
                                <img :src="checkCarImagePath(item.carBrand, item.carSeries)">
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </div>  
</template>
<script>
import {drivingDrivingList, drivingHistoryList} from '@/api/driving'
import checkCarImagePath from '@/utils/carPath'
import { mapGetters } from 'vuex'

export default {
    name: 'DrivingList',
    computed: mapGetters('CarApplication', ['isFefresh']),

    beforeRouteEnter (to, from, next) {
        if (from.name === 'DriSuccess') {
            to.meta.keepAlive = false;
        } else {
            to.meta.keepAlive = true;
        }
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.container.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'DrivingDetails') {  
            let container = this.$refs.container;
            let top = container.scrollTop;
            from.meta.scrollTop = top;
        }
        next();
    },
    data () {
        return {
            menuActiveIndex:0,

            //待处理
            waitOrderList:[],

            waitRefreshLoading:false,
            waitLoading:false,
            waitFinished:false,

            waitListQuery: {
                pageNum: 1,
                pageSize: 10,
                orderByColumn:"usageDate",
                isAsc:"asc",
                statusList:"1,2,4"
            },
            //历史
            historyOrderList:[],

            historyRefreshLoading:false,
            historyLoading:false,
            historyFinished:false,

            historyListQuery: {
                pageNum: 1,
                pageSize: 10,
                orderByColumn:"usageDate",
                isAsc:"desc",
                statusList:"3,5,7"
            },

            //订单状态字典
            orderStatusOptions:[],
            //车辆图片
            checkCarImagePath,
        }
    },
    created () {
        
    },
    activated () {
        if (this.isFefresh) {
            this.waitRefreshLoading = true;
            this.historyRefreshLoading = true;
            this.waitRefresh();
            this.historyRefresh();

            let timer = setTimeout(() => {
                this.$refs.container.scrollTop = 0;
                clearTimeout(timer);
            }, 0);
            this.$store.dispatch('CarApplication/triggerFefresh', false);
        }
    },
    methods: {
        //获取待处理的订单
        getWaitOrderList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            drivingDrivingList(Object.assign({},this.waitListQuery)).then(({ data }) => {
                if(this.waitRefreshLoading){
                    this.waitOrderList = [];
                    this.waitRefreshLoading = false;
                }
                this.waitLoading = false;
                this.waitOrderList = [...this.waitOrderList, ...data.list];

                if (!data.hasNextPage) {
                    this.waitFinished = true;
                    return;
                }
                this.waitListQuery.pageNum = this.waitListQuery.pageNum + 1;
            }).catch((error) => {
                this.waitLoading = false;
                this.waitFinished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //获取历史订单
        getHistoryOrderList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            drivingHistoryList(Object.assign({},this.historyListQuery)).then(({ data }) => {
                if(this.historyRefreshLoading){
                    this.historyOrderList = [];
                    this.historyRefreshLoading = false;
                }
                this.historyLoading = false;
                this.historyOrderList = [...this.historyOrderList, ...data.list];

                if (!data.hasNextPage) {
                    this.historyFinished = true;
                    return;
                }
                this.historyListQuery.pageNum = this.historyListQuery.pageNum + 1;
            }).catch((error) => {
                this.historyLoading = false;
                this.historyFinished = true;
            }).finally(() => {
                toast.clear();
            });
        },
        //判断订单状态
        checkOrderStatus(status){
            let msg = "";
            switch (status) {
                case '1':
                    msg= "待接单"
                    break
                case '2':
                    msg="待出车"
                    break
                case '3':
                    msg="拒绝接单"
                    break
                case '4':
                    msg="已出车"
                    break
                case '5':
                    msg="已还车"
                    break
                case '6':
                    msg="转派"
                    break
                case '7':
                    msg="已确认"
                    break
                case '8':
                    msg="拒绝再派单"
                    break
                default:
                    break
            }
            return msg;
        },
        //判断订单图标
        checkStatusImage(status){
            if(status === '1'){       //待接单
                return 'order-dsh'
            }else if(status === '2'){     //待出车
                return 'order-dsh'
            }else if(status === '3'){     //拒绝接单
                return 'order-ybh'
            }else if(status === '4'){     //已出车
                return 'order-ycc'
            }else if(status === '5'){     //已还车
                return 'order-yhc'
            }else if(status === '6'){     //转派
                return 'order-ybh'
            }else if(status === '7'){     //已确认
                return 'order-yqr'
            }else if(status === '8'){     //拒绝再派单
                return 'order-ybh'
            }
        },
        //待处理列表条目点击
        handleWaitItemClick(item){
            this.$router.push({
                name: 'DrivingDetails',
                params: { 
                    id:item.id,
                    assignmentId:item.assignmentId,
                }
            });
        },
        //历史列表条目点击
        handleHistoryItemClick(item){
            this.$router.push({
                name: 'DrivingDetails',
                params: { 
                    id:item.id,
                    assignmentId:item.assignmentId,
                }
            });
        },
        //待处理列表刷新
        waitRefresh(){
            this.waitLoading = true;
            this.waitFinished = false;
            this.waitListQuery.pageNum = 1;
            this.getWaitOrderList();
        },
        //历史列表刷新
        historyRefresh(){
            this.historyLoading = true;
            this.historyFinished = false;
            this.historyListQuery.pageNum = 1;
            this.getHistoryOrderList();
        },
    },
}
</script>
<style lang="less" scoped>
.main-container {
   
    .order-info-item {
        margin-bottom: 10px;

        ul {

            li {
                color: #2e2e2e;
                font-size: 14px;
                margin-bottom: 8px;
                display: flex;
                line-height: 18px;

                & span:nth-child(1){
                  min-width: 70px
                }
                & span:nth-child(2){
                    width: calc(100% - 130px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .li-item-long {
                color: #0E3680;
                font-weight: 600;
                position: relative;
                font-size: 14px;

                .order-long {
                    width: 16px;
                    height: 16px;
                    background-size: cover;
                    background-position: center;  
                    background-image:url(/static/order_long.png);
                    position: relative;
                    left: 0px;
                    top: 2px;
                }
            }
        }
        .order-status-container {
            display: flex;
            position: absolute;
            right: 15px;
            top: 12px;
            align-items: center;

            i {
                margin-right: 5px;
            }
            .order-status-text {
                font-size: 12px;
                color: #2e2e2e;
            }
        }
        img {
            width: 64px;
            height: 64px;
            position: absolute;
            right: 15px;
            bottom: 0px;
        }
    }
}
</style>