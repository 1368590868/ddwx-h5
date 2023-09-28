<template>
    <div class="main-container" ref="container">
        <van-tabs 
            v-model="menuActiveIndex" 
            :sticky="true" 
            type="card"
            color="#0571ff"
            title-active-color="#ffffff"
            title-inactive-color="#2e2e2e">
            <van-tab title="待审批">
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
                                    <span>{{item.simpleFromAddr}}</span>
                                </li>
                                <li>
                                    <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span class="li-item-content">{{item.simpleToAddr}}</span>
                                </li>
                                <li>
                                    <span>优先保障：</span>
                                    <span>{{checkGuarantee(item.guarantee)}}</span>
                                </li>
                                <li>
                                    <span>乘{{'\u00A0'}}{{'\u00A0'}}车{{'\u00A0'}}{{'\u00A0'}}人：</span>
                                    <span class="li-item-content">{{item.userName}}</span>
                                </li>
                                <li>
                                    <span>用车事由：</span>
                                    <span>{{item.reason}}</span>
                                </li>
                                <div class="order-status-container">
                                    <i :class="checkStatusImage(item.status)" class="default-icon-i"></i>
                                    <span class="order-status-text">{{checkOrderStatus(item.status)}}</span>
                                </div>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="已审批">
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
                                    <span>{{item.simpleFromAddr}}</span>
                                </li>
                                <li>
                                    <span>目{{'\u00A0'}}{{'\u00A0'}}的{{'\u00A0'}}{{'\u00A0'}}地：</span>
                                    <span class="li-item-content">{{item.simpleToAddr}}</span>
                                </li>
                                <li>
                                    <span>优先保障：</span>
                                    <span>{{checkGuarantee(item.guarantee)}}</span>
                                </li>
                                <li>
                                    <span>乘{{'\u00A0'}}{{'\u00A0'}}车{{'\u00A0'}}{{'\u00A0'}}人：</span>
                                    <span class="li-item-content">{{item.userName}}</span>
                                </li>
                                <li>
                                    <span>用车事由：</span>
                                    <span>{{item.reason}}</span>
                                </li>
                                <div class="order-status-container">
                                    <i :class="checkStatusImage(item.status)" class="default-icon-i"></i>
                                    <span class="order-status-text">{{checkOrderStatus(item.status)}}</span>
                                </div>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </div>  
</template>
<script>
import { gcywVehicleRequestListPageForH5 } from '@/api/order'
import { getListByParentId } from "@/api/dict";
import { mapGetters } from 'vuex'

export default {
    name:'ApprovalPending',
    computed: mapGetters('CarApplication', ['isFefresh']),

    beforeRouteEnter (to, from, next) {
        if (from.name === "SubSuccess") {
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
        if (to.name === 'ApprovalDetail') {  
            let container = this.$refs.container;
            let top = container.scrollTop;
            from.meta.scrollTop = top;
        }
        next();
    },
    data() {
        return {
            menuActiveIndex:0,

            //待审批
            waitOrderList:[],

            waitRefreshLoading:false,
            waitLoading:false,
            waitFinished:false,

            waitListQuery: {
                pageNum: 1,
                pageSize: 10,
                orderByColumn: "usageDate",
                isAsc: "desc",
            },
            //已审批
            historyOrderList:[],

            historyRefreshLoading:false,
            historyLoading:false,
            historyFinished:false,

            historyListQuery: {
                pageNum: 1,
                pageSize: 10,
                orderByColumn: "usageDate",
                isAsc: "desc",
            },

            //订单状态字典
            orderStatusOptions:[],
            //优先保障字典
            guaranteeOptions:[],
        };
    },
    created () {
        this.getOrderStatusOptions();
        this.getGuaranteeOptions();
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
        //获取订单状态字典
        getOrderStatusOptions(){

            getListByParentId('1522830760585670657').then(({data}) => {
                this.orderStatusOptions = data;
            }).catch((err) => {
                
            })
        },
         //获取优先保障字典
        getGuaranteeOptions(){

            getListByParentId('1679651627836055552').then(({data}) => {
                this.guaranteeOptions = data;
            }).catch((err) => {
                
            })
        },
        //获取待审批的订单
        getWaitOrderList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let  params = {
                reviewCompleted: '0',
            }
            gcywVehicleRequestListPageForH5(Object.assign({}, params,this.waitListQuery)).then(({ data }) => {
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
        //获取已审批订单
        getHistoryOrderList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let  params = {
                reviewCompleted: '1',
            }
            gcywVehicleRequestListPageForH5(Object.assign({}, params,this.historyListQuery)).then(({ data }) => {
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
            let obj = this.orderStatusOptions.find((item) => {
                return item.code == status;
            })
            return !!obj?obj.name:'';
        },
        //判断优先保障
        checkGuarantee(guarantee){
            let obj = this.guaranteeOptions.find((item) => {
                return item.code == guarantee;
            })
            return !!obj?obj.name:'';
        },
        //判断订单图标
        checkStatusImage(status){
            if(status === 1){       //待审核
                return 'order-dsh'
            }else if(status === 2){     //审核中
                return 'order-shz'
            }else if(status === 3){     //已驳回
                return 'order-ybh'
            }else if(status === 4){     //待派单
                return 'order-dpd'
            }else if(status === 5){     //已派单
                return 'order-ypd'
            }else if(status === 6){     //已取消
                return 'order-yqx'
            }else if(status === 7){     //部分接单
                return 'order-yjd'
            }else if(status === 8){     //已接单
                return 'order-yjd'
            }else if(status === 9){     //已出车
                return 'order-ycc'
            }else if(status === 10){    //已还车
                return 'order-yhc'
            }else if(status === 11){    //已确认
                return 'order-yqr'
            }
        },
        //待审核列表条目点击
        handleWaitItemClick(item){
            this.$router.push({
                name: "ApprovalDetail",
                params: { 
                    id:item.id,
                    detailId:item.detailId
                },
            });
        },
        //已审核列表条目点击
        handleHistoryItemClick(item){
            this.$router.push({
                name: "ApprovalDetail",
                params: { 
                    id:item.id,
                    detailId:item.detailId
                },
            });
        },
        //待审核列表刷新
        waitRefresh(){
            this.waitLoading = true;
            this.waitFinished = false;
            this.waitListQuery.pageNum = 1;
            this.getWaitOrderList();
        },
        //已审核列表刷新
        historyRefresh(){
            this.historyLoading = true;
            this.historyFinished = false;
            this.historyListQuery.pageNum = 1;
            this.getHistoryOrderList();
        },
    },
};
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
    }
}
</style>