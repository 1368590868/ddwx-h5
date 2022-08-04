<template>
    <div class="apply-container container">
        <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
            <div class="form-warpper">
                <div class="form-block">
                    <div class="block-label"><i class="font_family icon-icon-location-20"></i><span>出发地：</span></div>
                    <van-field required v-model="formData.sFromAddr" readonly right-icon="arrow-down" clickable name="sFromAddr" label="省/市/区：" placeholder="点击选择省市区" :rules="[{ required: true }]" @click="showsFormArea=true" />
                    <van-popup v-model="showsFormArea" round position="bottom">
                        <van-cascader
                            v-model="formData.sFromAddrActive"
                            title="请选择所在地区"
                            :options="provinceOptions"
                            :field-names="fieldNames"
                            @close="showsFormArea = false"
                            @change="onFromChange"
                            @finish="onFromFinish"/>
                    </van-popup>
                    <van-field required v-model="formData.sFromAddrDetail" name="sFromAddrDetail" label="详细地址：" maxlength="50" placeholder="请输入详细地址" :rules="[{ required: true}]" />
                   <div class="address-control"> 
                        <div class="address-button" @click="handleSetDefaultClick('1')">
                            <i class="icon-set-address "></i>
                            <span>设为常用地址</span>
                        </div>
                        <div class="address-button" @click="handleDefaultClick('1')">
                            <i class="icon-default-address"></i>
                            <span>常用出发地址</span>
                        </div>
                    </div>
                </div>
                <div class="form-block">
                    <div class="block-label"><i class="icon font_family icon-icon-destination-20"></i><span>目的地：</span></div>
                    <van-field required v-model="formData.sTargetAddr" readonly right-icon="arrow-down" clickable name="sTargetAddr" label="省/市/区：" placeholder="点击选择省市区" :rules="[{ required: true}]" @click="showsTargetArea=true" />
                    <van-popup v-model="showsTargetArea" round position="bottom">
                        <van-cascader
                            v-model="formData.sTargetAddrActive"
                            title="请选择所在地区"
                            :options="provinceOptions"
                            :field-names="fieldNames"
                            @close="showsTargetArea = false"
                            @change="onTargetChange"
                            @finish="onTargetFinish"/>
                    </van-popup>
                    <van-field required v-model="formData.sTargetAddrDetail" name="sTargetAddrDetail" label="详细地址：" maxlength="50" placeholder="请输入详细地址" :rules="[{ required: true}]" />
                    <div class="address-control"> 
                        <div class="address-button" @click="handleSetDefaultClick('2')">
                            <i class="icon-set-address "></i>
                            <span>设为常用地址</span>
                        </div>
                        <div class="address-button" @click="handleDefaultClick('2')">
                            <i class="icon-default-address"></i>
                            <span>常用目的地址</span>
                        </div>
                    </div>
                </div>
                <div class="form-block">
                    <div class="block-label"><i class="icon font_family icon-icon-date-20"></i><span>出发时间：</span></div>
                    <van-field required v-model="formData.dDepartureTime" readonly clickable name="dDepartureTime" label="出发日期：" placeholder="请选择出发日期" @click="showsTimeArea = true" />
                    <van-calendar v-model="showsTimeArea" :min-date="new Date()" @confirm="TimeAreaConfirm"></van-calendar>
                    <div class="block-label"><van-icon name='warning-o' color="#ff976a"></van-icon><span>可用车辆提醒：</span></div>
                    <div class="block-content"><span>{{carTotalCount}} (车辆) - {{carSubscribeCount}} (已预约) - {{carAcceptCount}} (已受理) = {{carUsableCount}} (可用)</span></div>
                    <van-field required v-model="formData.dDepartureTimeDetail" readonly right-icon="arrow-down" clickable name="dDepartureTimeDetail" label="出发时间：" @click="showsTimeDetail=true;selectMinTime()"  placeholder="请选择出发时间" :rules="[{ required: true, message: '请选择出发时间' }]" />
                    <van-popup v-model="showsTimeDetail" position="bottom">
                        <van-datetime-picker v-model="formData.dDepartureTimeDetail" @change="selectMinTime" :min-hour="minHour" :min-minute="minMinute" type="time" @confirm="TimeDetailConfirm" :filter="timefilter" @cancel="showsTimeDetail=false"></van-datetime-picker>
                    </van-popup>
                </div>
            </div>
            <div class="form-button">
                <van-button block type="info" native-type="submit">下一步</van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
    import {parseTime} from '@/utils/index'
    import {gcywVehicleRequestDispatchList} from '@/api/order'
    import {getCarCount} from '@/api/dispatch'
    import {commonAddressListAll,gcjcDivisionList,addCommonAddress} from "@/api/mine/commonAddress"
    import eventBus from '@/utils/eventBus.js'
    import keepPages from '@/view/mixins/keepPages'

    export default {
        name:"StartApplying",
        mixins: [keepPages],
       
        data() {
            return {
                id:"",
                minMinute: 0,   // 最小时间
                minHour: 0,
                carTotalCount:0,
                carSubscribeCount:0,
                carAcceptCount:0,
                carUsableCount:0,
                
                formData: {
                    fromId:'',
                    targetId:'',

                    sFromAddrActive: '',  // 
                    sTargetAddrActive: '',// 

                    sFromAddrDetail: '',      // 出发地详细地址 ,
                    sTargetAddrDetail: '',    // 目的地详细地址
                    dDepartureTimeDetail: "", // 发出时间 {h}:{i}

                    sFromAddr: '',      // (string, optional): 出发地 ,
                    sTargetAddr: '',    // (string, optional): 目的地
                    dDepartureTime: "", // (string, optional): 出发时刻 ,

                    fromProvinceId:"",//出发地省份ID
                    fromCityId:"",  //出发地城市id
                    fromAreaId:"",  //出发地区县id

                    targetProvinceId:"",//目的地省份ID
                    targetCityId:"",  //目的地城市id
                    targetAreaId:"",  //目的地区县id
                },
                showsFormArea: false,  // 打开出发地弹窗
                showsTargetArea: false,  // 打开目的地弹窗
                showsTimeArea: false, // 打开出发日期
                showsTimeDetail: false, // 打开出发时间

                //省级数据
                provinceOptions:[],
                //市级数据
                cityOptions:[],
                //区级数据
                areaOptions:[],
                //定义字段省市区取值字段名称
                fieldNames: {
                    text: 'divisionName',
                    value: 'divisionId',
                    children: 'children',
                },
            }
        },
        created(){
            this.id = this.$route.params.id;

            if(this.id==='0'){
                this.$nextTick(() => {
                    this.formData.dDepartureTime = parseTime(Date.now(), '{y}-{m}-{d}');
                })
                this.getProvinceOptions(0);
                this.getDefaultAddress();
                this.getCarCount(this.formData.dDepartureTime)
            }else{  
                this.orderGetOrderDetail(); // 如果有id则是再来一单的操作
            }
        },
        activated(){
            //选择常用地址回调
            eventBus.$off('defaultAddress');
            eventBus.$on('defaultAddress',function(item){
                this.setFromAndTargetAddress(item);
            }.bind(this));
        },
        methods: {
            //获取出发地和目的地默认地址
            async getDefaultAddress(){
                await commonAddressListAll({defualtTag:"1"}).then(({data}) => {
                    data.forEach((item) => {
                        this.setFromAndTargetAddress(item);
                    })
                }).catch((err) => {
                    
                })
            },
            //获取省级数据
            async getProvinceOptions(pid){
                await gcjcDivisionList({pid}).then(({data}) => {
                    this.provinceOptions = data.list;
                }).catch((err) => {

                })
            },
            //获取市级数据
            async getCityOptions(pid,type){
                await gcjcDivisionList({pid}).then(({data}) => {
                    this.cityOptions = data.list;
                    this.provinceOptions.forEach((item) => {
                        if(type==='from'){
                            if(item.divisionId===this.formData.fromProvinceId){
                                this.$set(item, 'children', this.cityOptions);
                            }
                        }else{
                            if(item.divisionId===this.formData.targetProvinceId){
                                this.$set(item, 'children', this.cityOptions);
                            }
                        }
                    })
                }).catch((err) => {

                })
            },
            //获取区级数据
            async getAreaOptions(pid,type){
                await gcjcDivisionList({pid}).then(({data}) => {
                    this.areaOptions = data.list;
                    let province = this.provinceOptions.find((item) => {
                        if(type==='from'){
                            return item.divisionId===this.formData.fromProvinceId;
                        }else{
                            return item.divisionId===this.formData.targetProvinceId;
                        }
                    })
                    province.children.forEach((item) => {
                        if(type==='from'){
                            if(item.divisionId===this.formData.fromCityId){
                                this.$set(item, 'children', this.areaOptions);
                            }
                        }else{
                            if(item.divisionId===this.formData.targetCityId){
                                this.$set(item, 'children', this.areaOptions);
                            }
                        }
                    })
                }).catch((err) => {

                })
            },
            //选择时间过滤器
            timefilter(type, options){
                if (type === 'minute') {
                    return options.filter((option) => option % 15 === 0);
                }
                return options;
            },
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
                getCarCount({usageDate:params}).then(({data}) =>{
                    if(data.length!=0){
                        this.carTotalCount = data[0].tasscount
                        this.carSubscribeCount = data[0].nasscount
                        this.carAcceptCount = data[0].sasscount
                        this.carUsableCount = data[0].tasscount - data[0].nasscount -data[0].sasscount
                    }
                })
            },
            onSubmit (values) {
                this.$store.dispatch('CarApplication/setOneDataAction', this.formData).then(() => {
                    if (this.id !=='0') {   // 复制订单
                        this.$router.push({name: 'PerfectInfo', query: {id:this.id}});
                    } else {   // 正常提交
                        this.$router.push({name: 'PerfectInfo'});
                    }
                });
            },

            // 复制订单操作！
            orderGetOrderDetail () {
                gcywVehicleRequestDispatchList({id:this.id}).then(({data}) => {
                    if (data?.list?.length <= 0) {
                        return
                    }
                    let obj = data.list[0];

                    this.formData.sFromAddrActive = obj.fromAreaId.split(',')[2];  
                    this.formData.sTargetAddrActive = obj.toAreaIdd.split(',')[2];

                    this.formData.sFromAddrDetail = obj.fromAddr.split(' ')[1];
                    this.formData.sTargetAddrDetail = obj.toAddr.split(' ')[1];
                    this.formData.dDepartureTime = parseTime(Date.now(), '{y}-{m}-{d}');

                    this.formData.sFromAddr = obj.fromAddr.split(' ')[0];
                    this.formData.sTargetAddr = obj.toAddr.split(' ')[0];
                    this.formData.dDepartureTimeDetail = parseTime(Date.now() + 1000*60*60, '{h}:{i}');

                    this.formData.fromProvinceId = obj.fromAreaId.split(',')[0];
                    this.formData.fromCityId = obj.fromAreaId.split(',')[1];
                    this.formData.fromAreaId = obj.fromAreaId.split(',')[2];

                    this.formData.targetProvinceId = obj.toAreaIdd.split(',')[0];
                    this.formData.targetCityId = obj.toAreaIdd.split(',')[1];
                    this.formData.targetAreaId = obj.toAreaIdd.split(',')[2];

                    this.$store.dispatch('CarApplication/setCopyDataAction', obj);
                    this.getProvinceOptions(0);
                    this.getCarCount(this.formData.dDepartureTime);
                });
            },
            //出发地省市区选择监听
            onFromChange({  value, selectedOptions, tabIndex }){
                if(tabIndex===0){
                    this.getCityOptions(value,'from');
                    this.formData.fromProvinceId = value;
                }else if(tabIndex===1){
                    this.getAreaOptions(value,'from');
                    this.formData.fromCityId = value;
                }else if(tabIndex===2){
                    this.formData.fromAreaId = value;
                }
            },
            // 出发地全部选项选择完毕后
            onFromFinish({  value, selectedOptions, tabIndex }) {
                if(tabIndex === 2){
                    this.showsFormArea = false;
                    this.formData.sFromAddr = selectedOptions.map((option) => option.divisionName).join('/');
                }
            },
            //目的地省市区选择监听
            onTargetChange({  value, selectedOptions, tabIndex }){
                if(tabIndex===0){
                    this.getCityOptions(value,'target');
                    this.formData.targetProvinceId = value;
                }else if(tabIndex===1){
                    this.getAreaOptions(value,'target');
                    this.formData.targetCityId = value;
                }else if(tabIndex===2){
                    this.formData.targetAreaId = value;
                }
            },
            //目的地全部选项选择完毕后
            onTargetFinish({  value, selectedOptions, tabIndex }) {
                if(tabIndex === 2){
                    this.showsTargetArea = false;
                    this.formData.sTargetAddr = selectedOptions.map((option) => option.divisionName).join('/');
                }
            },
            //出发地和目的地地址设置
            setFromAndTargetAddress(item){
                if(item.addressType==="1"){
                    this.formData.fromId = item.id;
                    this.formData.sFromAddr = item.areaLongName;
                    this.formData.sFromAddrDetail = item.address;
                    this.formData.sFromAddrActive = item.areaId
                    this.formData.fromProvinceId = item.provinceId;
                    this.formData.fromCityId = item.cityId;
                    this.formData.fromAreaId = item.areaId
                }else if(item.addressType==="2"){
                    this.formData.targetId = item.id;
                    this.formData.sTargetAddr = item.areaLongName;
                    this.formData.sTargetAddrDetail = item.address;
                    this.formData.sTargetAddrActive = item.areaId
                    this.formData.targetProvinceId = item.provinceId;
                    this.formData.targetCityId = item.cityId;
                    this.formData.targetAreaId = item.areaId
                }
            },
            //设为常用地址
            handleSetDefaultClick(addressType){
                let form = {
                    id:addressType==='1'?this.formData.fromId:this.formData.targetId,
                    deleteTag: '0', //保存：0;删除：1
                    defualtTag:"1",//是否默认0否 1是
                    name:"",    //别名
                    address:addressType==='1'?this.formData.sFromAddrDetail:this.formData.sTargetAddrDetail, //详细地址
                    provinceId:addressType==='1'?this.formData.fromProvinceId:this.formData.targetProvinceId,//省份ID
                    cityId:addressType==='1'?this.formData.fromCityId:this.formData.targetCityId,  //城市id
                    areaId:addressType==='1'?this.formData.fromAreaId:this.formData.targetAreaId,  //区县id
                    addressType:addressType,//地址类型 1出发地 2目的地
                    areaLongName:addressType==='1'?this.formData.sFromAddr:this.formData.sTargetAddr,//区县长名称
                };
                addCommonAddress(Object.assign({},form)).then(({message}) => {
                    this.$notify({
                        type: 'success',
                        message: message
                    });
                }).catch((err) => {
                    
                })
            },
            //常用地址点击
            handleDefaultClick(addressType){
                this.$router.push({
                    name: 'DefalultAddress',
                    params: {
                       addressType
                    },
                })
            }
        },
    }
</script>

<style>
.defatul-button {
    font-size: 14px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin: 10px 20px 10px 20px;
    line-height: 30px;
    border: 0.5px solid #cccccc;
    border-radius: 50px;
}
.address-control {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: right;
}
.address-button {
    padding:0px 10px;
    font-size: 14px;
    line-height: 30px;
    margin-right: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 0.5px solid #cccccc;
    border-radius: 50px;
}                           
</style>