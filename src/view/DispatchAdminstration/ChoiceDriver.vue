<template>
    <div class="ChoiceDriver">
        <!-- <van-nav-bar title="请选择车辆" left-arrow @click-left="$router.back()" /> -->
        <p class="titleVeh"><span>分派司机</span></p>
        <div class="overflow-auto" ref="notClass">
            <van-pull-refresh v-model="requestRefreshLoading" @refresh="requestRefresh" success-text="刷新成功">
                <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="getAvailableDriver">
                    <van-radio-group v-model="radio" >
                        <div class="van-radio-groups" v-for="(item, index) in list" :key="index" @click="radioClick(item)">
                            <van-radio :name="item.id">
                            </van-radio>
                            <p class="pImg-lefts">
                                <span>{{item.name}}</span>
                            </p> 
                            <p class="pImg-rights">
                                <span>电话：{{item.phone}}</span>
                            </p>
                        </div>
                    </van-radio-group>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="button-box">
                <van-button block type="default" @click="returnChoiceVehicie" v-if="typeDriver != 'Driver'">车辆选择</van-button>
                <van-button block type="default" @click="returnChoiceVehicie" v-if="typeDriver === 'Driver'">上一步</van-button>
            <van-button block type="info" @click="determine">确定司机</van-button>
        </div>
    </div>
</template>
<script>
import {getAvailableDriver} from '@/api/dispatch'
import {mapGetters} from 'vuex'
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
            requestLoading: false,
            requestFinished: false,
            requestRefreshLoading: false,
            radio: '',
            radioData: {},
            list: [],
            requestQuery: {
                pageSize: 10,
                pageNum: 0
            },
            typeDriver: ''
        }
    },
    computed: {
        ...mapGetters('details',['Details']),
    },
    methods:{
        requestRefresh () {
            //清空
            this.requestLoading = false;
            this.requestQuery.pageNum = 0;
            //重新加载
            this.requestRefreshLoading = false;
            this.getAvailableDriver();
        },
        radioClick (val) {
            this.radioData = val;
            this.radio = val.id;
        },
        getAvailableDriver () {
            let pageNum = this.requestQuery.pageNum;
            this.requestLoading = true;
            this.requestQuery.pageNum = pageNum + 1;
            let params = {autoId:this.$route.params.autoId?this.$route.params.autoId:'',
            startTime: this.Details.dDepartureTime}
            getAvailableDriver(Object.assign({},this.requestQuery,params)).then(({data}) => {
                if(this.requestRefreshLoading && this.requestQuery.pageNum === 1){
                    this.list = [];
                }
                this.requestRefreshLoading = false;
                if (data.length===0) {
                    this.requestFinished = true;
                }
                this.requestLoading = false;
                let list = this.list;
                this.list = list.concat(data);
            }).catch(()=>{
                console.log('err')
            });
        },
        returnChoiceVehicie () {
            this.$router.go(-1);
        },
        determine () {
            let radio = this.radio;
            if(!radio){
                this.$toast("请选择司机！");
                return
            }
            this.$store.dispatch("details/setChoiceDriver", this.radioData);
            let type = '1';
            if(this.typeDriver === 'Driver'){
                type = '2';
            }else if(this.typeDriver === 'addDriver'){
                type = '10'; //新增
            }else{
                type = '1';
            }
            this.$router.push({
                name: 'details',
                params: {type: type}
            });
        }
    },
    created () {
        let typeDriver = this.$route.params.typeDriver;
        this.typeDriver = typeDriver
        this.getAvailableDriver();
    }
}
</script>
<style scoped lang="less">
.ChoiceDriver{
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-flex-direction: column;
    overflow: hidden;
    .overflow-auto {
        height: 100%;
        overflow: auto;
    }
    .titleVeh{
        width: 100%;
        height: 30px;
        line-height: 30px;
        background: #f2f4f8;
        span{
            margin-left: 14px;
            font-size: 13px;
        }
    }
    .van-radio-groups{
            width: 95%;
            height: 68px;
            border-bottom: 1px solid #ccc; 
            margin: 0 auto;
        .van-radio{
            float: left;
            width: 6%;
            margin-left: 0px;
            margin-top: 20px;
            .van-radio__icon--checked{
                .van-icon{
                    width: 16px;
                    height: 16px;
                }
            }
        }
        .pImg-lefts{
            width: 40%;
            float: left;
            margin-left: 10px;
            span{
                float: left;
                line-height: 64px;
                font-size: 14px;
                color: #2e2e2e;
            }
        }
        .pImg-rights{
            width: 40%;
            float: right;
            margin-right: 10px;
            span{
                float: right;
                line-height: 64px;
                font-size: 14px;
                color: #2e2e2e;
            }
        }
    }
}
</style>