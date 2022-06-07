<template>
        <div class="not-class" ref="notClass">
            <van-tabs type="card" :sticky="true"  v-model="activeIndex"  :animated="true" offset-top="0px">
                <van-tab title="待审批" :name="0">
                    <van-pull-refresh v-model="requestrefresh" @refresh="orderOnRefresh"  animation-duration="500" success-text="刷新成功">
                        <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="orderRequestList">
                            <div class="list-container" v-for="(item, index) in approvalOrderList">
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
                <van-tab title="已审批" :name="1">
                    <van-pull-refresh v-model="historyrefresh" @refresh="histyOnRefresh"  animation-duration="500" success-text="刷新成功">
                        <van-list v-model="historyLoading" offset="30" :finished="historyFinished" finished-text="没有更多了..." @load="orderHistoryOrderList">
                            <div class="list-container" v-for="(item, index) in approvaledOrderList">
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
        </div>
</template>
<script>
import {approvalOrderList, approvaledOrderList} from '@/api/order'
import {mapGetters} from 'vuex'
export default {
    computed: mapGetters('CarApplication', ['isFefresh']),
    beforeRouteEnter (to, from, next) {
        if (from.name === 'SubSuccess') {
            to.meta.keepAlive = false;
        } else {
            to.meta.keepAlive = true;
        };
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.notClass.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },    
    beforeRouteLeave (to, from, next) {
        if (to.name === 'Approvaldetails') {   // 去往详情页
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

            approvalOrderList: {},
            requestKeys: 0,
            requestQuery: {
                pageSize: 10,
                pageIndex: 0
            },
            historyrefresh: false,
            historyLoading: false,
            historyFinished: false,
            approvaledOrderList: {},
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
        histyOnRefresh(){
            this.historyFinished = false;
            this.historyQuery.pageIndex = 0;
            this.historyLoading = true;
            this.orderHistoryOrderList();
        },
        orderRequestList() {    // 用车审批待审批列表
            let pageIndex = this.requestQuery.pageIndex;
            this.requestLoading = true;
            this.requestQuery.pageIndex = pageIndex + 1;
            approvalOrderList(this.requestQuery).then(({data}) => {
                if (this.requestrefresh && this.requestQuery.pageIndex === 1) {
                    this.approvalOrderList = {};
                };
                this.requestrefresh = false;
                if (Object.keys(data).length===0) {
                    this.requestFinished = true;
                };
                this.approvalOrderList = this.computedGroupDate(data, 'approvalOrderList')
                this.requestLoading = false;
            }).catch(()=>{
                alert("错误");
            });
        },
        orderHistoryOrderList () {  // 用车审批已审批列表
            let pageIndex = this.historyQuery.pageIndex;
            this.historyLoading = true;
            this.historyQuery.pageIndex = pageIndex + 1;
            approvaledOrderList(this.historyQuery).then(({data}) => {
                if (this.historyrefresh && this.historyQuery.pageIndex === 1) { 
                    this.approvaledOrderList = {};
                };
                this.historyrefresh = false;
                if (Object.keys(data).length===0) {
                    this.historyFinished = true;
                };
                this.approvaledOrderList = this.computedGroupDate(data, 'approvaledOrderList')
                this.historyLoading = false;
            }).catch(()=>{
                done(false);
            });
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
        goOrderDetailClick (autoId) {
            this.$router.push({
                name: 'Approvaldetails',
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