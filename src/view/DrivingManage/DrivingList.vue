<template>
    <div class="not-class" ref="notClass">
        <van-tabs type="card" :sticky="true" animated>
            <van-tab title="待处理">
                <van-pull-refresh v-model="requestrefresh" @refresh="orderOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="drivingDrivingList">
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
            <van-tab title="历史订单">
                <van-pull-refresh v-model="historyrefresh" @refresh="histyOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="historyLoading" offset="30" :finished="historyFinished" finished-text="没有更多了..." @load="drivingHistoryList">
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
    </div>
</template>
<script>
import {drivingDrivingList, drivingHistoryList} from '@/api/driving'
export default {
    beforeRouteEnter (to, from, next) {
        if (from.name === 'DriSuccess') {
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
        if (to.name === 'DrivingDetails') {   // 去往详情页
            let notClass = this.$refs.notClass;
            let top = notClass.scrollTop;
            from.meta.scrollTop = top;
        }
        next();
    },
    data () {
        return {
            requestrefresh: false,
            requestLoading: false,
            requestFinished: false,
            requestList: {},
            requestKeys: 0,
            requestQuery: {
                pageSize: 10,
                pageNum: 0
            },
            historyrefresh: false,
            historyLoading: false,
            historyFinished: false,
            historyList: {},
            historyQuery: {
                pageSize: 10,
                pageNum: 0
            }
        }

    },
    methods: {
        orderOnRefresh() {
            this.requestFinished = false;
            this.requestQuery.pageNum = 0;
            this.requestLoading = true;
            this.drivingDrivingList();
        },
        histyOnRefresh () {
            this.historyFinished = false;
            this.historyQuery.pageNum = 0;
            this.historyLoading = true;
            this.drivingHistoryList();
        },
        drivingDrivingList() {    // 用车申请未完成列表
            let pageNum = this.requestQuery.pageNum;
            this.requestLoading = true;
            this.requestQuery.pageNum = pageNum + 1;
            drivingDrivingList(this.requestQuery).then(({data}) => {
                if (this.requestrefresh && this.requestQuery.pageNum === 1) {
                    this.requestList = {};
                }
                this.requestrefresh = false;
                if (Object.keys(data).length===0) {
                    this.requestFinished = true;
                }
                this.requestList = this.computedGroupDate(data, 'requestList')
                this.requestLoading = false;
            }).catch(()=>{
                alert('err')
            });
        },
        drivingHistoryList () {  // 用车申请历史订单列表
            let pageNum = this.historyQuery.pageNum;
            this.historyLoading = true;
            this.historyQuery.pageNum = pageNum + 1;
            drivingHistoryList(this.historyQuery).then(({data}) => {
                if (this.historyrefresh && this.historyQuery.pageNum === 1) { 
                    this.historyList = {};
                }
                this.historyrefresh = false;
                if (Object.keys(data).length===0) {
                    this.historyFinished = true;
                }
                this.historyList = this.computedGroupDate(data, 'historyList')
                this.historyLoading = false;
            }).catch(()=>{
                alert('err')
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
        goStartApplyClick () {
            this.$router.push({
                name: 'StartApplying',
                params: { autoId: '0' }
            });
        },
        goOrderDetailClick (autoId) {
            this.$router.push({
                name: 'DrivingDetails',
                params: {autoId}
            });
        },
    },
    created () {
        // this.drivingDrivingList();
        // this.drivingHistoryList();
    }
}
</script>