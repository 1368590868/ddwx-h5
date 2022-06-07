<template>
    <div class="ChoiceVehicies">
        <!-- <van-nav-bar title="请选择车辆" left-arrow @click-left="$router.back()" /> -->
        <p class="titleVeh"><span>分派车辆时注意所在地限行法规</span></p>
        <div class="list_overflow" ref="notClass">
            <van-pull-refresh v-model="requestRefreshLoading" @refresh="requestRefresh" success-text="刷新成功">
                <van-list v-model="requestLoading" offset="30" :finished="requestFinished" finished-text="没有更多了..." @load="getAvailableCar">
                    <van-radio-group v-model="radio" >
                        <div class="van-radio-groups" v-for="(item, index) in list" :key="index" @click="radioClick(item)">
                            <van-radio :name="item.carNumber">
                            </van-radio>
                            <p class="pImg-left">
                                <img :src="carPic+'?carModel='+item.brand+' '+item.carType" alt="">
                                <span>{{item.carNumber}}</span>
                            </p> 
                            <p class="pImg-right">
                                <span>{{item.brand}}</span>
                            </p>
                        </div>
                    </van-radio-group>
                </van-list>
            </van-pull-refresh>
        </div>
        <div class="button-box">
                <van-button block type="default" @click="returnDetails" v-if="typeVehicie != 'Vehicie'">返回详情</van-button>
                <van-button block type="default" @click="returnDetails" v-if="typeVehicie === 'Vehicie'">上一步</van-button>
            <van-button block type="info" @click="determine">确定车辆</van-button>
        </div>
    </div>
</template>
<script>
import {getAvailableCar, carPic} from '@/api/dispatch'
export default {
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
        if (to.name === 'ChoiceDriver') {   // 去往详情页
            let notClass = this.$refs.notClass;
            let top = notClass.scrollTop;
            from.meta.scrollTop = top;
        };
        next();
    },
    data () {
        return {
            carPic,
            requestLoading: false,
            requestFinished: false,
            requestRefreshLoading: false,
            radio: '',
            radioData: '',
            list: [],
            requestQuery: {
                pageSize: 10,
                pageIndex: 0
            },
            typeVehicie: '',
        }
    },
    methods:{
        requestRefresh () {
            //清空
            this.requestRefreshLoading = true;
            this.requestFinished = false;
            this.requestLoading = true;
            this.requestQuery.pageIndex = 0;
            //重新加载
            this.getAvailableCar();
        },
        radioClick (val) {
            this.radioData = val;
            this.radio = val.carNumber;
        },
        getAvailableCar () {
            let pageIndex = this.requestQuery.pageIndex;
            this.requestLoading = true;
            this.requestQuery.pageIndex = pageIndex + 1;
            getAvailableCar(this.requestQuery).then(({data}) => {
                if(this.requestRefreshLoading && this.requestQuery.pageIndex === 1){
                    this.list = [];
                }
                this.requestRefreshLoading = false;
                if (data.length===0) {
                    this.requestFinished = true;
                };
                this.requestLoading = false;
                let list = this.list;
                this.list = list.concat(data);
            }).catch(()=>{
                console.log('err')
            });
        },
        returnDetails () {
            this.$router.go(-1);
        },
        determine () {
            let radio = this.radio;
            if(!radio){
                this.$toast("请选择车型！");
                return
            }
            this.$store.dispatch("details/setChoiceVehicie", this.radioData);
            this.$store.dispatch("details/setOverflowHeight", this.overflowHeight);
            let typeDriver = '0';
            if(this.typeVehicie === 'Vehicie'){
                typeDriver = 'Driver';
            }else if(this.typeVehicie === 'addVehicie') {
                typeDriver = 'addDriver'; //新增
            }else{
                typeDriver = '0';
            }
            this.$router.push({
                name: 'ChoiceDriver',
                params: {typeDriver: typeDriver}
            });
        }
    },
    created () {
        let typeVehicie = this.$route.params.typeVehicie;
        this.typeVehicie = typeVehicie
        this.getAvailableCar();
    }
}
</script>
<style scoped lang="less">
.ChoiceVehicies{
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-flex-direction: column;
    overflow: hidden;
    .list_overflow{
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
        .pImg-left{
            width: 50%;
            float: left;
            img{
                float: left;
                width: 64px;
                height: 64px;
            }
            span{
                float: left;
                line-height: 64px;
                font-size: 14px;
                color: #2e2e2e;
            }
        }
        .pImg-right{
            width: 33%;
            float: right;
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