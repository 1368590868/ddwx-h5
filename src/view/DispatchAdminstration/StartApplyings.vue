<template>
    <div class="apply-container container">
        <!-- <van-nav-bar title="用车申请" left-arrow @click-left="$router.back()" /> -->
        <div class="wrapper">
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
                <div class="form-warpper">
                    <div class="form-block">
                        <div class="block-label"><i class="font_family icon-icon-location-20"></i><span>出发地：</span></div>
                        <van-field required v-model="formData.sFromAddr" readonly right-icon="arrow-down" clickable name="sFromAddr" label="省/市/区：" placeholder="点击选择省市区" @click="showsFormArea=true" />
                        <van-popup v-model="showsFormArea" position="bottom">
                            <van-area :value="formData.sFromAddrActive" name="sFromAddrActive" @confirm="sFromAddrConfirm" @cancel="showsFormArea = false" :area-list="areaList" />
                        </van-popup>
                        <van-field required v-model="formData.sFromAddrDetail" name="sFromAddrDetail" label="详细地址：" maxlength="50" placeholder="请输入详细地址" :rules="[{ required: true}]" />
                    </div>



                    <div class="form-block">
                        <div class="block-label"><i class="icon font_family icon-icon-destination-20"></i><span>目的地：</span></div>
                        <van-field required v-model="formData.sTargetAddr" readonly right-icon="arrow-down" clickable name="sTargetAddr" label="省/市/区：" placeholder="点击选择省市区" @click="showsTargArea=true" />
                        <van-popup v-model="showsTargArea" position="bottom">
                            <van-area :value="formData.sTargetAddrActive" name="sTargetAddrActive" @confirm="sTargetAddrConfirm" @cancel="showsTargArea = false" :area-list="areaList" />
                        </van-popup>
                        <van-field required v-model="formData.sTargetAddrDetail" name="sTargetAddrDetail" label="详细地址：" maxlength="50" placeholder="请输入详细地址" :rules="[{ required: true}]" />
                    </div>
                    <div class="form-block">
                        <div class="block-label"><i class="icon font_family icon-icon-date-20"></i><span>出发时间：</span></div>
                        <van-field required v-model="formData.dDepartureTime" readonly clickable name="dDepartureTime" label="出发日期：" placeholder="请选择出发日期" @click="showsTimeArea = true" />
                        <van-calendar v-model="showsTimeArea" :min-date="new Date()" @confirm="TimeAreaConfirm"></van-calendar>

                        <van-field required v-model="formData.dDepartureTimeDetail" readonly right-icon="arrow-down" clickable name="dDepartureTimeDetail" label="出发时间：" @click="showsTimeDetail=true;selectMinTime()"  placeholder="请选择出发时间" :rules="[{ required: true, message: '请选择出发时间' }]" />
                        <van-popup v-model="showsTimeDetail" position="bottom">
                            <van-datetime-picker v-model="formData.dDepartureTimeDetail" @change="selectMinTime" :min-hour="minHour" :min-minute="minMinute" type="time" @confirm="TimeDetailConfirm" @cancel="showsTimeDetail=false"></van-datetime-picker>
                        </van-popup>
                    </div>
                </div>

                <div class="form-button">
                    <van-button block type="info" native-type="submit">下一步</van-button>
                </div>
            </van-form>
            
        </div>
    </div>
</template>
<script>
    import {parseTime} from '@/utils/index'
    import {mapGetters} from 'vuex'
    import {orderGetOrderDetail} from '@/api/order';
    export default {
        computed: mapGetters('details', ['CarOneHist']),
        data() {
            let AraeList = this.$store.getters.AraeList;
            let nowDate = new Date();
            return {
                minMinute: 0,   // 最小时间
                minHour: 0,

                formData: {
                    sFromAddrActive: '110108',  // 默认海淀区
                    sTargetAddrActive: '110108',// 默认海淀区

                    sFromAddrDetail: '铁科院',      // 出发地详细地址 ,
                    sTargetAddrDetail: '国铁集团',    // 目的地详细地址
                    dDepartureTimeDetail: parseTime(nowDate, '{h}:{i}'), // 发出时间 {h}:{i}

                    sFromAddr: '北京市/北京市/海淀区',      // (string, optional): 出发地 ,
                    sTargetAddr: '北京市/北京市/海淀区',    // (string, optional): 目的地
                    dDepartureTime: parseTime(nowDate, '{y}-{m}-{d}'), // (string, optional): 出发时刻 ,
                },
                showsFormArea: false,  // 打开出发地弹窗
                showsTargArea: false,  // 打开目的地弹窗
                showsTimeArea: false, // 打开出发日期
                showsTimeDetail: false, // 打开出发时间
                
                areaList: AraeList
            }
        },
        methods: {
            selectMinTime () {
                // let hour = this.formData.dDepartureTimeDetail.split(':')[0];
                // let nowDate = new Date(),
                //     nowHour = nowDate.getHours();
                // if (new Date(this.formData.dDepartureTime).getTime() > nowDate.getTime()) {
                //     this.minMinute = 0;
                //     this.minHour = 0;
                //     return 0;
                // }
                // this.minHour = nowDate.getHours();
                // this.minMinute = (hour == nowHour)? nowDate.getMinutes():0;
            },

            onFailed(errInfo) {
                // console.log(errInfo);
            },
            sFromAddrConfirm(values) {
                this.formData.sFromAddrActive = values[values.length - 1].code;
                this.formData.sFromAddr = values.filter((item) => !!item).map((item) => item.name).join('/');
                this.showsFormArea = false;
            },
            sTargetAddrConfirm  (values){
                this.formData.sTargetAddrActive = values[values.length - 1].code;
                this.formData.sTargetAddr = values.filter((item) => !!item).map((item) => item.name).join('/');
                this.showsTargArea = false;
            },

            TimeAreaConfirm (value) {   // 出发日期
                this.formData.dDepartureTime = parseTime(value, '{y}-{m}-{d}');
                this.showsTimeArea = false;
            },
            TimeDetailConfirm (value) { // 出发时间 {h}:{i}
                this.formData.dDepartureTimeDetail = value;  // 10:10
                this.showsTimeDetail = false;
            },
            onSubmit (values) {
                let autoId = this.$route.params.autoId;
                let type = this.$route.params.type;
                this.$store.dispatch('details/setOneDataAction', this.formData).then(() => {
                    if (autoId != '0' && type != '0') {   //    
                        this.$router.push({name: 'details', params: {type: '4'}});
                    } else {
                        if(autoId != '0'){
                            this.$router.push({name: 'artificials', params: {autoId}});  // 待派车复制订单
                        }else{
                            this.$router.push({name: 'artificials', params: {autoId: '0'}});  // 新增
                        }
                    }
                });
            },
            // 复制订单操作！
            orderGetOrderDetail (autoId) {
                orderGetOrderDetail({autoId}).then(({data}) => {
                    
                    this.formData.sFromAddrActive = this.getAddrActive(data.sFromAddr.split(',')[2]);  // 默认海淀区
                    this.formData.sTargetAddrActive = this.getAddrActive(data.sTargetAddr.split(',')[2]);// 默认海淀区

                    this.formData.sFromAddrDetail = data.sFromAddr.split(',')[2];
                    this.formData.sTargetAddrDetail = data.sTargetAddr.split(',')[2];

                    this.formData.sFromAddr = data.sFromAddr.split(',').slice(0, 3).join('/');
                    this.formData.sTargetAddr = data.sTargetAddr.split(',').slice(0, 3).join('/');
                    
                    this.$store.dispatch('details/setCopyDataAction', data);
                });
            },
            getAddrActive (name) {
                let county_list = this.areaList.county_list;
                let index = Object.values(county_list).indexOf(name);
                return Object.keys(county_list)[index];
            }
        },
        created () {
            if (Object.keys(this.CarOneHist).length) {
                this.formData = Object.assign({}, this.CarOneHist);
            }
            let autoId = this.$route.params.autoId;
            if(autoId != '0'){
                this.orderGetOrderDetail(autoId);
            }
        }
    }
</script>