<template>
    <div class="not-class" ref="notClass">
        <van-tabs type="card" :sticky="true" animated>
            <van-tab title="待审批">
                <van-pull-refresh v-model="requestrefresh" @refresh="orderOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="getDataChangeOrderWait">
                        <div class="list-container" v-for="(item, index) in requestList" :key="index">
                            <div class="log-title">{{parseTime(item.submitTimeStr,"{y}-{m}-{d}")}}</div>
                            <ul class="list-ul" v-for="(childItem, childIndex) in item.children" :key="childIndex" @click="handleWaitOrderClick(childItem)">
                                <li class="li-top"><span>{{childItem.unitName}}</span><span>{{childItem.reqNo}}</span></li>
                                <li class="li-item"><span>申请部门：</span><span>{{childItem.deptName}}</span></li>
                                <li class="li-item"><span>申请人：</span><span>{{childItem.reqUserName}}</span></li>
                                <li class="li-item"><span>问题描述：</span><span>{{childItem.reqDesc}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
            <van-tab title="已审批">
                <van-pull-refresh v-model="historyrefresh" @refresh="historyOnRefresh"  animation-duration="500" success-text="刷新成功">
                    <van-list v-model="historyLoading" offset="30" :finished="historyFinished" finished-text="没有更多了..." @load="getDataChangeOrderHistory">
                        <div class="list-container" v-for="(item, index) in historyList" :key="index">
                            <div class="log-title">{{parseTime(item.submitTimeStr,"{y}-{m}-{d}")}}</div>
                            <ul class="list-ul" v-for="(childItem, childIndex) in item.children" :key="childIndex" @click="handleHistoryOrderClick(childItem)">
                                <li class="li-top"><span>{{childItem.unitName}}</span><span>{{childItem.reqNo}}</span></li>
                                <li class="li-item"><span>申请部门：</span><span>{{childItem.deptName}}</span></li>
                                <li class="li-item"><span>申请人：</span><span>{{childItem.reqUserName}}</span></li>
                                <li class="li-item"><span>问题描述：</span><span>{{childItem.reqDesc}}</span></li>
                            </ul>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import {gcywChangeRequestActivitiList} from '@/api/dataChange'

export default {
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            let timer = setTimeout(() => {
                vm.$refs.notClass.scrollTop = to.meta.scrollTop;
                clearTimeout(timer);
            }, 0);
        });
    },
    beforeRouteLeave (to, from, next) {
        if (to.name === 'ChangeExamineDetail') {   // 去往详情页
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
            requestQuery: {
                pageSize: 10,
                pageNum: 1,
            },

            historyrefresh: false,
            historyLoading: false,
            historyFinished: false,

            historyList: [],
            historyQuery: {
                pageSize: 10,
                pageNum: 1,
            }
        }
    },
    created () {
       
    },
    activated () {
        if(this.$route.params.refresh){
            this.requestrefresh = true;
            this.historyrefresh = true;
            this.orderOnRefresh();
            this.historyOnRefresh();
        }
    },
    methods: {
        //获取变更工单待审批数据
        getDataChangeOrderWait(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                auditFlag:'0',
            }
            gcywChangeRequestActivitiList(Object.assign({}, params,this.requestQuery)).then(({data}) => {
                if(this.requestrefresh){
                    this.requestList = [];
                    this.requestrefresh = false;
                }
                this.requestLoading = false;
                this.requestList = [...this.requestList,...this.computedGroupDate(data.list)];
                
                if(!data.hasNextPage){
                    this.requestFinished = true;
                }else{
                    this.requestQuery.pageNum = this.requestQuery.pageNum + 1;
                }
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
        },

        //获取变更工单已审批数据
        getDataChangeOrderHistory(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                auditFlag:'1',
            }
            gcywChangeRequestActivitiList(Object.assign({}, params,this.historyQuery)).then(({data}) => {
                if(this.historyrefresh){
                    this.historyList = [];
                    this.historyrefresh = false;
                }
                if(!data.hasNextPage){
                    this.historyFinished = true;
                }else{
                    this.historyQuery.pageNum = this.historyQuery.pageNum + 1;
                }
                this.historyLoading = false;
                this.historyList = [...this.historyList,...this.computedGroupDate(data.list)];
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
        },
        computedGroupDate (arr) { 
            let newArr = [];
            arr.forEach((item) => {
                let index = -1;
                let isExists = newArr.some((newItem, j) => {
                    if(this.parseTime(item.submitTimeStr,"{y}-{m}-{d}")  == this.parseTime(newItem.submitTimeStr,"{y}-{m}-{d}")) {
                        index = j;
                        return true;
                    }
                })
                if(!isExists) {
                    newArr.push({
                        submitTimeStr : item.submitTimeStr ,
                        children: [item]
                    })
                } else {
                    newArr[index].children.push(item);
                }
            })
            return newArr;
        },
        //待审核列表点击
        handleWaitOrderClick (childItem) {
            this.$router.push({
                name: 'ChangeExamineDetail',
                params: {
                    obj:childItem,
                    type:'0',
                }
            });
        },
        //已审核列表点击
        handleHistoryOrderClick (childItem) {
            this.$router.push({
                name: 'ChangeExamineDetail',
                 params: {
                    obj:childItem,
                    type:'1',
                }
            });
        },
        //待审核列表刷新
        orderOnRefresh() {
            this.requestFinished = false;
            this.requestLoading = true;
            this.requestQuery.pageNum = 1;
            this.getDataChangeOrderWait();
        },
        //已审核列表刷新
        historyOnRefresh () {
            this.historyFinished = false;
            this.historyLoading = true;
            this.historyQuery.pageNum = 1;
            this.getDataChangeOrderHistory();
        },
    },
}
</script>
<style lang="less" scoped>
.list-ul {
    padding: 5px 15px;

    .li-top {
        font-size: 15px;
        display: flex;
        line-height: 30px;
        justify-content: space-between;

        & span:nth-child(1){
            font-weight: 700;
        }
    }
    .li-item {
        font-size: 14px;
        line-height: 30px;
        overflow: hidden;
		text-overflow: ellipsis;
        white-space: nowrap;
    }
}

</style>