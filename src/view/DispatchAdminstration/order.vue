<template>
        <!-- <van-nav-bar title="调度管理" left-arrow @click-left="$router.back()" /> -->
    <div class="not-class" ref="notClass">
        <van-tabs type="card" :sticky="true"  :animated="true" offset-top="0px">
            <van-tab title="待派单">
                <van-pull-refresh v-model="dispatchRefreshLoading" @refresh="dispatchRefresh" success-text="刷新成功">
                    <van-list v-model="dispatchLoading" offset="30" :finished="dispatchFinished" finished-text="没有更多了..." @load="dispatchDispatchList">
                        <div class="list-container" v-for="(item, index) in dispatchList" :key="index">
                            <div class="log-title">{{index}}</div>
                            <ul :class="['list-ul', childItem.cLongDistance === '是'?'longway':''] " v-for="(childItem, childIndex) in item" :key="childIndex" @click="goOrderDetailClick(childItem.nAutoId, '0')">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.sFromAddr.split(',')[2]}}</b><b class="b2">{{childItem.sTargetAddr.split(',')[2]}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.dDepartureTime | timeAgo('{h}:{i}')}}</time><span>出发</span><b class="b-status">{{childItem.state}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.sFromAddr.split(',')[3]}} 到 {{childItem.sTargetAddr.split(',')[3]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.hopeCarType}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driverName}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.sReqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="已派单">
                <van-pull-refresh v-model="dispatchedRefreshLoading" @refresh="dispatchedRefresh" success-text="刷新成功">
                    <van-list v-model="dispatchedLoading" offset="30" :finished="dispatchedFinished" finished-text="没有更多了..." @load="dispatchDispatchedList">
                        <div class="list-container" v-for="(item, index) in dispatchedList" :key="index">
                            <div class="log-title">{{index}}</div>
                            <ul :class="['list-ul', childItem.cLongDistance === '是'?'longway':''] " v-for="(childItem, childIndex) in item" :key="childIndex" @click="goOrderDetailClick(childItem.nAutoId, '0')">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.sFromAddr.split(',')[2]}}</b><b class="b2">{{childItem.sTargetAddr.split(',')[2]}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.dDepartureTime | timeAgo('{h}:{i}')}}</time><span>出发</span><b class="b-status">{{childItem.state}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.sFromAddr.split(',')[3]}} 到 {{childItem.sTargetAddr.split(',')[3]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.brand + ' ' + childItem.sArrangedCar}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driverName}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.sReqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="历史订单">
                <van-pull-refresh v-model="historyRefreshLoading" @refresh="historyRefresh" success-text="刷新成功">
                    <van-list v-model="historyLoading" offset="30" :finished="historyFinished" finished-text="没有更多了..." @load="dispatchHistoryList">
                        <div class="list-container" v-for="(item, index) in historyList" :key="index">
                            <div class="log-title">{{index}}</div>
                            <ul :class="['list-ul', childItem.cLongDistance === '是'?'longway':''] " v-for="(childItem, childIndex) in item" :key="childIndex" @click="goOrderDetailClick(childItem.nAutoId, '5')">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.sFromAddr.split(',')[2]}}</b><b class="b2">{{childItem.sTargetAddr.split(',')[2]}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.dDepartureTime | timeAgo('{h}:{i}')}}</time><span>出发</span><b class="b-status">{{childItem.state}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.sFromAddr.split(',')[3]}} 到 {{childItem.sTargetAddr.split(',')[3]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.brand + ' ' + childItem.sArrangedCar}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driverName}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.sReqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>

        <div class="add-btn" @click="artificial"></div>

    </div>
</template>
<script>
import {dispatchDispatchList, dispatchDispatchedList, historyList} from '@/api/dispatch'
export default {
    beforeRouteEnter (to, from, next) {
        if (from.name === 'SubSuccess') {
            to.meta.keepAlive = false;
        } else {
            to.meta.keepAlive = true;
        }
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.notClass.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'details') {   // 去往详情页
            let notClass = this.$refs.notClass;
            let top = notClass.scrollTop;
            from.meta.scrollTop = top;
        }
        next();
    },
    data () {
        return {
            dispatchLoading: false,
            dispatchFinished: false,
            dispatchRefreshLoading: false,
            dispatchList: {},
            dispatchQuery: {
                pageSize: 20,
                pageNum: 0
            },

            dispatchedLoading: false,
            dispatchedFinished: false,
            dispatchedRefreshLoading: false,
            dispatchedList: {},
            dispatchedQuery: {
                pageSize: 10,
                pageNum: 0
            },

            historyLoading: false,
            historyFinished: false,
            historyRefreshLoading: false,
            historyList: {},
            historyQuery: {
                pageSize: 10,
                pageNum: 0
            }
        }

    },
    methods: {
        dispatchRefresh () {
            //清空
            this.dispatchFinished = false;
            this.dispatchQuery.pageNum = 0;
            //重新加载
            this.dispatchRefreshLoading = true;
            this.dispatchDispatchList();
        },
        historyRefresh () {
            //清空
            this.historyFinished = false;
            this.historyQuery.pageNum = 0;
            //重新加载
            this.historyRefreshLoading = true;
            this.dispatchHistoryList();
        },
        dispatchedRefresh () {
            //清空
            this.dispatchedFinished = false;
            this.dispatchedQuery.pageNum = 0;
            //重新加载
            this.dispatchedRefreshLoading = true;
            this.dispatchDispatchedList();
        },
        dispatchDispatchList() {    // 待派单
            let pageNum = this.dispatchQuery.pageNum;
            this.dispatchLoading = true;
            this.dispatchQuery.pageNum = pageNum + 1;
            dispatchDispatchList(this.dispatchQuery).then(({data}) => {
                if(this.dispatchRefreshLoading && this.dispatchQuery.pageNum === 1){
                    this.dispatchList = {};
                }
                this.dispatchRefreshLoading = false;
                if (Object.keys(data).length===0) {
                    this.dispatchFinished = true;
                }
                this.dispatchLoading = false;
                this.dispatchList = this.computedGroupDate(data, 'dispatchList')
            });
        },
        dispatchDispatchedList () {  // 已派单
            let pageNum = this.dispatchedQuery.pageNum;
            this.dispatchedLoading = true;
            this.dispatchedQuery.pageNum = pageNum + 1;
            dispatchDispatchedList(this.dispatchedQuery).then(({data}) => {
                if(this.dispatchedRefreshLoading && this.dispatchedQuery.pageNum === 1){
                    this.dispatchedList = {};
                }
                this.dispatchedRefreshLoading = false;
                if (Object.keys(data).length===0) {
                    this.dispatchedFinished = true;
                }
                this.dispatchedLoading = false;
                this.dispatchedList = this.computedGroupDate(data, 'dispatchedList')
            });
        },
        dispatchHistoryList () {  // 历史订单
            let pageNum = this.historyQuery.pageNum;
            this.historyLoading = true;
            this.historyQuery.pageNum = pageNum + 1;
            historyList(this.historyQuery).then(({data}) => {
                if(this.historyRefreshLoading && this.historyQuery.pageNum === 1){
                    this.historyList = {};
                }
                this.historyRefreshLoading = false;
                if (Object.keys(data).length===0) {
                    this.historyFinished = true;
                }
                this.historyLoading = false;
                this.historyList = this.computedGroupDate(data, 'historyList')
            });
        },
        computedGroupDate (data, dataKey) { 
            let list = this[dataKey];
            for (let key in data){
                if (Object.keys(list).includes(key)) {
                    list[key] = list[key].concat(data[key]);
                } else {
                    list[key] = data[key];
                }
            }
            return list;
        },
        artificial () {
            this.$router.push({
                name: 'StartApplyings',
                params: {autoId: '0',type: '0'}
            });
        },
        goOrderDetailClick (autoId,type) {
            this.$store.dispatch('details/setAutoId', autoId)
            this.$router.push({
                name: 'details',
                params: {type: type, autoId}
            });
        }
    },
    created () {
        
    }
}
</script>