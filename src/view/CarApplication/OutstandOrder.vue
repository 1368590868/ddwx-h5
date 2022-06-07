<template>
    <div class="not-class" ref="notClass">
        <van-tabs type="card" :sticky="true" v-model="activeIndex"  :animated="true" offset-top="0px">
            <van-tab title="未完成" :name="0">
                <van-pull-refresh v-model="requestrefresh" @refresh="orderOnRefresh" animation-duration="500" success-text="刷新成功">
                    <van-list v-model="requestLoading" offset="30" :finished="requestFinished" :immediate-check="true" finished-text="没有更多了..." @load="orderRequestList">
                        <div class="list-container" v-for="(item, index) in requestList">
                            <div class="log-title">{{index}}</div>
                            <ul :class="['list-ul', childItem.cLongDistance === '是'?'longway':''] " v-for="(childItem, childIndex) in item" :key="childIndex" @click="goOrderDetailClick(childItem.nAutoId)">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.sFromAddr.split(',')[2]}}</b><b class="b2">{{childItem.sTargetAddr.split(',')[2]}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.dDepartureTime | timeAgo('{h}:{i}')}}</time><span>出发</span><b class="b-status">{{childItem.state}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.sFromAddr.split(',')[3]}} 到 {{childItem.sTargetAddr.split(',')[3]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.brand}} {{childItem.sArrangedCar}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driverName}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.sReqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="历史订单" :name="1">
                <van-pull-refresh v-model="historyrefresh" @refresh="histyOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="historyLoading" offset="30" :finished="historyFinished"  :immediate-check="true" finished-text="没有更多了..." @load="orderHistoryOrderList">
                        <div class="list-container" v-for="(item, index) in historyList">
                            <div class="log-title">{{index}}</div>
                            <ul :class="['list-ul', childItem.cLongDistance === '是'?'longway':''] " v-for="(childItem, childIndex) in item" :key="childIndex" @click="goOrderDetailClick(childItem.nAutoId)">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.sFromAddr.split(',')[2]}}</b><b class="b2">{{childItem.sTargetAddr.split(',')[2]}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.dDepartureTime | timeAgo('{h}:{i}')}}</time><span>出发</span><b class="b-status">{{childItem.state}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.sFromAddr.split(',')[3]}} 到 {{childItem.sTargetAddr.split(',')[3]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.brand}} {{childItem.sArrangedCar}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driverName}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.sReqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
        <div class="add-btn" @click="goStartApplyClick"></div>
    </div>
</template>
<script>
import {orderRequestList, orderHistoryOrderList} from '@/api/order'
import {mapGetters} from 'vuex'
export default {
    computed: mapGetters('CarApplication', ['isFefresh']),
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.notClass.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'Orderdetails') {   // 去往详情页
            let notClass = this.$refs.notClass;
            let top = notClass.scrollTop;
            from.meta.scrollTop = top;
        };
        next();
    },
    data () {
        return {
            activeIndex: 0,

            requestrefresh: false,
            requestLoading: false,
            requestFinished: false,

            requestList: {},
            requestKeys: 0,
            requestQuery: {
                pageSize: 10,
                pageIndex: 0
            },

            historyrefresh: false,
            historyLoading: false,
            historyFinished: false,
            historyList: {},
            historyQuery: {
                pageSize: 10,
                pageIndex: 0
            }
        }
    },
    methods: {
        orderOnRefresh() {
            this.requestFinished = false;
            this.requestQuery.pageIndex = 0;
            this.requestLoading = true;
            this.orderRequestList();
        },
        histyOnRefresh () {
            this.historyFinished = false;
            this.historyQuery.pageIndex = 0;
            this.historyLoading = true;
            this.orderHistoryOrderList();
        },
        orderRequestList() {    // 用车申请未完成列表
            let pageIndex = this.requestQuery.pageIndex;
            this.requestLoading = true;
            this.requestQuery.pageIndex = pageIndex + 1;
            orderRequestList(this.requestQuery).then(({data}) => {
                if (this.requestrefresh && this.requestQuery.pageIndex === 1) {
                    this.requestList = {};
                };
                this.requestrefresh = false;
                if (Object.keys(data).length===0) {
                    this.requestFinished = true;
                };
                this.requestList = this.computedGroupDate(data, 'requestList')
                this.requestLoading = false;
            }).catch(()=>{
                console.log('err')
            });
        },
        orderHistoryOrderList () {  // 用车申请历史订单列表
            let pageIndex = this.historyQuery.pageIndex;
            this.historyLoading = true;
            this.historyQuery.pageIndex = pageIndex + 1;
            orderHistoryOrderList(this.historyQuery).then(({data}) => {
                if (this.historyrefresh && this.historyQuery.pageIndex === 1) { 
                    this.historyList = {};
                };
                this.historyrefresh = false;
                if (Object.keys(data).length===0) {
                    this.historyFinished = true;
                };
                this.historyList = this.computedGroupDate(data, 'historyList')
                this.historyLoading = false;
            }).catch(()=>{
                alert('err')
            });;
        },
        computedGroupDate (data, dataKey) { 
            let list = this[dataKey];
            for (let key in data){
                if (Object.keys(list).includes(key)) {
                    list[key] = list[key].concat(data[key]);
                } else {
                    list[key] = data[key];
                };
            };
            return list;
        },
        goStartApplyClick () {
            this.$router.push({
                name: 'StartApplying',
                params: {autoId: '0'}
            });
        },
        goOrderDetailClick (autoId) {
            this.$router.push({
                name: 'Orderdetails',
                params: {autoId}
            });
        },
    },
    activated () {
        if (this.isFefresh) {
            if (this.activeIndex) {
                this.historyrefresh = true;
                this.histyOnRefresh();
            } else {
                this.requestrefresh = true;
                this.orderOnRefresh();
            };
            
            let timer = setTimeout(() => {
                this.$refs.notClass.scrollTop = 0;
                clearTimeout(timer);
            },0);
            this.$store.dispatch('CarApplication/triggerFefresh', false);
        };
    },
}
</script>