<template>
    <div class="not-class" ref="notClass">
        <van-tabs type="card" :sticky="true" animated>
            <van-tab title="待处理">
                <van-pull-refresh v-model="requestrefresh" @refresh="orderOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="drivingDrivingList">
                        <div class="list-container" v-for="(item, index) in requestList" :key="index">
                            <div class="log-title">{{item.usageDate }}</div>
                            <ul :class="['list-ul', childItem.longDistanceTag === '1'?'longway':''] " v-for="(childItem, childIndex) in item.children" :key="childIndex" @click="goOrderDetailClick(childItem.id)">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.fromAddr | checkArea()}}</b><b class="b2">{{childItem.toAddr | checkArea()}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.startDate}}</time><span>出发</span><b class="b-status">{{childItem.status | checkStatus()}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.fromAddr.split(' ')[1]}} 到 {{childItem.toAddr.split(' ')[1]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.carBrand}} {{childItem.carNumber}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driver}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="历史订单">
                <van-pull-refresh v-model="historyrefresh" @refresh="histyOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="historyLoading" offset="30" :finished="historyFinished" finished-text="没有更多了..." @load="drivingHistoryList">
                        <div class="list-container" v-for="(item, index) in historyList" :key="index">
                            <div class="log-title">{{item.usageDate }}</div>
                            <ul :class="['list-ul', childItem.longDistanceTag === '1'?'longway':''] " v-for="(childItem, childIndex) in item.children" :key="childIndex" @click="goOrderDetailClick(childItem.id)">
                                <li class="list-li">
                                    <div class="li-address"><b class="b1">{{childItem.fromAddr | checkArea()}}</b><b class="b2">{{childItem.toAddr | checkArea()}}</b></div>
                                    <div class="li-timestu"><time>{{childItem.startDate}}</time><span>出发</span><b class="b-status">{{childItem.status | checkStatus()}}</b></div>
                                </li>
                                <li class="info-label"><span>详细地址：</span><span class="infor-overflow">{{childItem.fromAddr.split(' ')[1]}} 到 {{childItem.toAddr.split(' ')[1]}}</span></li>
                                <li class="info-label"><span>分派车辆：</span><span class="infor-overflow">{{childItem.carBrand}} {{childItem.carNumber}}</span></li>
                                <li class="info-label"><span>分派司机：</span><span>{{childItem.driver}}</span></li>
                                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
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
            requestList: [],
            requestKeys: 0,
            requestQuery: {
                pageSize: 10,
                pageNum: 0,
                orderByColumn:"usageDate",
                isAsc:"desc",
                statusList:"1,2,4"
            },
            historyrefresh: false,
            historyLoading: false,
            historyFinished: false,
            historyList: [],
            historyQuery: {
                pageSize: 10,
                pageNum: 0,
                orderByColumn:"usageDate",
                isAsc:"desc",
                statusList:"3,5"
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
                    this.requestList = [];
                }
                if(!data.hasNextPage){
                    this.requestFinished = true;
                }
                this.requestrefresh = false;
                this.requestLoading = false;
                this.requestList = [...this.requestList, ...this.computedGroupDate(data.list)];
            }).catch(()=>{
                this.requestLoading = false;
            });
        },
        drivingHistoryList () {  // 用车申请历史订单列表
            let pageNum = this.historyQuery.pageNum;
            this.historyLoading = true;
            this.historyQuery.pageNum = pageNum + 1;
            drivingHistoryList(this.historyQuery).then(({data}) => {
                if (this.historyrefresh && this.historyQuery.pageNum === 1) { 
                    this.historyList = [];
                }
                if(!data.hasNextPage){
                    this.historyFinished = true;
                }
                this.historyrefresh = false;
                this.historyLoading = false;
                this.historyList = [...this.historyList, ...this.computedGroupDate(data.list)];
            }).catch(()=>{
                this.historyLoading = false;
            });
        },
        computedGroupDate (arr) { 
            let newArr = [];
            arr.forEach((item) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if(item.usageDate  == newItem.usageDate ) {
                        index = j;
                        return true;
                    }
                })
                if(!isExists) {
                    newArr.push({
                        usageDate : item.usageDate ,
                        children: [item]
                    })
                } else {
                    newArr[index].children.push(item);
                }
            })
            return newArr;
        },
        goOrderDetailClick (autoId) {
            this.$router.push({
                name: 'DrivingDetails',
                params: {autoId}
            });
        },
    },
    filters:{
        checkArea(address){
            return address.split(' ')[0].split("/")[2];
        },
        checkStatus(status){
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
        }
    },
    created () {
        
    }
}
</script>