<template>
    <div class="apply-container container">
        <!-- <div class="wrapper"> -->
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
                        <div class="block-label"><van-icon name='warning-o' color="#ff976a"></van-icon><span>可用车辆提醒：</span></div>
                        <div class="block-content"><span>{{carTotalCount}} (车辆) - {{carSubscribeCount}} (已预约) - {{carAcceptCount}} (已受理) = {{carUsableCount}} (可用)</span></div>
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
            
        <!-- </div> -->
    </div>
</template>
<script>
    import {parseTime} from '@/utils/index'
    import {mapGetters} from 'vuex'
    import {orderGetOrderDetail} from '@/api/order'
    import {getCarCount} from '@/api/dispatch'

    export default {
        computed: mapGetters('CarApplication', ['CarOneHist']),
        data() {
            let AraeList = this.$store.getters.AraeList;
            let nowDate = new Date();
            return {
                minMinute: 0,   // 最小时间
                minHour: 0,
                carTotalCount:0,
                carSubscribeCount:0,
                carAcceptCount:0,
                carUsableCount:0,
                formData: {
                    sFromAddrActive: '110108',  // 默认海淀区
                    sTargetAddrActive: '110108',// 默认海淀区

                    sFromAddrDetail: '铁科院',      // 出发地详细地址 ,
                    sTargetAddrDetail: '国铁集团',    // 目的地详细地址
                    dDepartureTimeDetail: parseTime(nowDate.getTime() + 1000*60*60, '{h}:{i}'), // 发出时间 {h}:{i}

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
                let hour = this.formData.dDepartureTimeDetail.split(':')[0];
                let nowDate = new Date(),
                    nowHour = nowDate.getHours();
                if (new Date(this.formData.dDepartureTime).getTime() > nowDate.getTime()) {
                    this.minMinute = 0;
                    this.minHour = 0;
                    return 0;
                }
                this.minHour = nowDate.getHours();
                this.minMinute = (hour == nowHour)? nowDate.getMinutes():0;
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
                this.getCarCount(this.formData.dDepartureTime)
                this.selectMinTime();
                this.formData.dDepartureTimeDetail = "";    // 重新选择日期
            },
            TimeDetailConfirm (value) { // 出发时间 {h}:{i}
                this.formData.dDepartureTimeDetail = value;  // 10:10
                this.showsTimeDetail = false;
            },
            getCarCount(params){
                getCarCount({departureDate:params}).then(({data}) =>{
                    this.carTotalCount = data.totalcount
                    this.carSubscribeCount = data.subscribeCount
                    this.carAcceptCount = data.acceptCount
                    this.carUsableCount = data.totalcount - data.subscribeCount -data.acceptCount
                })
            },
            onSubmit (values) {
                let autoId = this.$route.params.autoId;
                this.$store.dispatch('CarApplication/setOneDataAction', this.formData).then(() => {
                    if (autoId !=='0') {   // 复制订单
                        this.$router.push({name: 'PerfectInfo', query: {autoId}});
                    } else {   // 正常提交
                        this.$router.push({name: 'PerfectInfo'});
                    };
                });
            },


            // 复制订单操作！
            orderGetOrderDetail (autoId) {
                orderGetOrderDetail({autoId}).then(({data}) => {
                    
                    this.formData.sFromAddrActive = this.getAddrActive(data.sFromAddr.split(',')[2]);  // 默认海淀区
                    this.formData.sTargetAddrActive = this.getAddrActive(data.sTargetAddr.split(',')[2]);// 默认海淀区

                    this.formData.sFromAddrDetail = data.sFromAddr.split(',')[3];
                    this.formData.sTargetAddrDetail = data.sTargetAddr.split(',')[3];
                    // this.formData.dDepartureTimeDetail = parseTime(data.dDepartureTime, '{h}:{i}');

                    this.formData.sFromAddr = data.sFromAddr.split(',').slice(0, 3).join('/');
                    this.formData.sTargetAddr = data.sTargetAddr.split(',').slice(0, 3).join('/');
                    // this.formData.dDepartureTime = parseTime(data.dDepartureTime, '{y}-{m}-{d}');
                    this.$store.dispatch('CarApplication/setCopyDataAction', data);
                });
            },
            getAddrActive (name) {
                let county_list = this.areaList.county_list;
                let index = Object.values(county_list).indexOf(name);
                return Object.keys(county_list)[index];
            }
        },
        created () {
            let autoId = this.$route.params.autoId;

            if (Object.keys(this.CarOneHist).length) {
                this.formData = Object.assign({}, this.CarOneHist);
            };
            if (autoId!=='0') {   // 如果有autoId则是再来一单的操作
                this.orderGetOrderDetail(autoId);
            }
            this.getCarCount(this.formData.dDepartureTime)
        }
    }
</script>