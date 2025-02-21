<template>
    <div class="container">
        <div class="from-container">
            <div class="form-title">
                <i></i>
                <span>出发地</span>
            </div>
            <van-field v-model="formData.sFromAddr" 
                readonly 
                right-icon="arrow-down" 
                clickable 
                name="sFromAddr" 
                label="省/市/区：" 
                placeholder="请选择省市区" 
                @click="showsFormArea=true" />
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
            <van-field v-model="formData.sFromAddrDetail" 
                name="sFromAddrDetail" 
                label="详细地址：" 
                maxlength="50" 
                placeholder="请输入街道名称、门牌号"/>
            <div class="address-list" @click="handleListClick('1')">
                <i></i>
                <span>地址列表</span>
            </div>
            <div class="address-set-default" @click="handleSetDefaultClick('1')">
                <i></i>
                <span>设为常用</span>
            </div>
        </div>
        <div class="to-container">
            <div class="to-title">
                <i></i>
                <span>目的地</span>
            </div>
            <van-field v-model="formData.sTargetAddr" 
                readonly 
                right-icon="arrow-down" 
                clickable 
                name="sTargetAddr" 
                label="省/市/区：" 
                placeholder="请选择省市区" 
                @click="showsTargetArea=true" />
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
            <van-field v-model="formData.sTargetAddrDetail" 
                name="sTargetAddrDetail" 
                label="详细地址：" 
                maxlength="50" 
                placeholder="请输入街道名称、门牌号" />
            <div class="address-list" @click="handleListClick('2')">
                <i></i>
                <span>地址列表</span>
            </div>
            <div class="address-set-default" @click="handleSetDefaultClick('2')">
                <i></i>
                <span>设为常用</span>
            </div>
        </div>
        <div class="time-container">
            <div class="time-title">
                <i></i>
                <span>出发时间</span>
            </div>
            <van-field v-model="startDateAndTime" 
                readonly 
                right-icon="arrow-down" 
                clickable 
                name="sTargetAddr" 
                placeholder="请选择日期/时间" 
                @click="showsTimeArea=true" />
            <van-calendar v-model="showsTimeArea" 
                :min-date="new Date()" 
                @confirm="timeAreaConfirm">
            </van-calendar>
            <van-popup v-model="showsTimeDetail" position="bottom">
                <van-datetime-picker v-model="formData.usageTime"
                    type="time" 
                    :filter="timefilter" 
                    :min-hour="checkMinHour()" 
                    :min-minute="checkMinMinute()"
                    @confirm="timeDetailConfirm" 
                    @cancel="showsTimeDetail=false"
                    @change="onTimeChange"/>
            </van-popup>
        </div>
        <div class="bottom-container">
            <div class="car-count">
                <span>可用车辆：</span>
                <span>{{carUsableCount}}{{'\u00A0'}}</span>
                <span>/{{'\u00A0'}}{{carTotalCount}}</span>
            </div>
            <div class="button-next" @click="handleNextClick()">下一步</div>
        </div>
    </div>
</template>
<script>
import {gcjcDivisionList,addCommonAddress,commonAddressListAll} from "@/api/mine/commonAddress"
import { gcywVehicleRequestDispatchList } from '@/api/order';
import {getCarCount} from '@/api/dispatch'
import {parseTime} from '@/utils/index'
import eventBus from '@/utils/eventBus.js'
import keepPages from '@/view/mixins/keepPages'

export default {
    name: 'DispathApply',
    mixins: [keepPages],

    data() {
        return {
            //复制订单id
            id:"",
            //出发日期和时间
            startDateAndTime:'',
            //可用车辆
            carUsableCount:0,
            //总车辆
            carTotalCount:0,
            //临时存储出发时刻
            tempDepartureTime:'',
            //临时存储出发时间(小时)
            tempHour:'',      

            formData: {
                fromId:'',
                targetId:'',

                sFromAddrActive: '',   
                sTargetAddrActive: '', 

                sFromAddrDetail: '',      // 出发地详细地址 ,
                sTargetAddrDetail: '',    // 目的地详细地址
                usageTime: "", // 发出时间 {h}:{i}

                sFromAddr: '',      // (string, optional): 出发地 ,
                sTargetAddr: '',    // (string, optional): 目的地
                usageDate: "", // (string, optional): 出发时刻 ,

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
    created() {     //type = 0 新建调度单 type = 2 复制调度单 type = 3 改派 type = 5 派单
        this.id = this.$route.params.id;

        if(this.id==='0'){
            this.$nextTick(() => {
                this.formData.usageDate = parseTime(Date.now(), '{y}-{m}-{d}');
                this.tempDepartureTime = parseTime(Date.now(), '{y}-{m}-{d}');
                this.initUsageTime();
            })
            this.getProvinceOptions(0);
            this.getDefaultAddress();
            this.$store.dispatch('DispathOrder/clearCopyDataAction');
        }else{  
            this.orderGetOrderDetail(); // 如果id不等于'0'则是复制订单
        }
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
        //获取可用车辆数
        getCarCount(params){
            getCarCount({usageDate:params}).then(({data}) =>{
                if(data.length!=0){
                    this.carTotalCount = data[0].tasscount
                    this.carUsableCount = data[0].tasscount - data[0].nasscount -data[0].sasscount
                }
            })
        },
        //初始化出发时间
        initUsageTime(){
            let hh = new Date().getHours();
            let mf = new Date().getMinutes();

            let diff = mf % 5;

            if(diff !== 0 ){
                diff = 5 - diff;
            }
            if(mf < 55){
                mf = mf + diff + 5;
            }else if(mf === 55){
                mf = 0;
                hh = hh +1;
            }else{
                mf = 5;
                hh = hh +1;
            }
            if(mf < 10){
                mf = '0'+ mf;
            }
            if(mf == 60){
                mf = '00'
                hh = hh + 1;
            }
            if(hh < 10){
                hh = '0'+ hh;
            }
            if(hh == 24){
                hh = '00'
            }
            this.formData.usageTime = hh +':'+ mf;
            this.startDateAndTime = this.formData.usageDate + ' ' + this.formData.usageTime;
            this.getCarCount(this.formData.usageDate)

            if(hh.toString().startsWith('0')){
                this.tempHour = hh.substr(1);
            }else{
                this.tempHour = hh;
            }
        },
        //设置最小小时
        checkMinHour(){
            if(this.tempDepartureTime === this.parseTime(new Date().getTime(),'{y}-{m}-{d}')){
                return new Date().getHours();
            }
            return ''
        },
        //设置最小分钟
        checkMinMinute(){
            if(this.tempDepartureTime === this.parseTime(new Date().getTime(),'{y}-{m}-{d}')){
                if(this.tempHour == new Date().getHours()){
                    return new Date().getMinutes();
                }
            }
            return ''
        },
        onTimeChange(picker){
            let pickerArr = picker.getValues();
            
            if(pickerArr[0].startsWith('0')){
                pickerArr[0] = pickerArr[0].substr(1);
            }
            this.tempHour = pickerArr[0];
        },
        //选择时间过滤器
        timefilter(type, options){
            if (type === 'minute') {
                return options.filter((option) => option % 5 === 0);
            }
            return options;
        },
        //选择出发日期确定
        timeAreaConfirm (value) {  
            this.tempDepartureTime = parseTime(value, '{y}-{m}-{d}');
            this.showsTimeArea = false;
            this.showsTimeDetail = true;
        },
        //选择时间确定
        timeDetailConfirm (value) {
            this.formData.usageTime = value;  
            this.formData.usageDate = this.tempDepartureTime;
            this.showsTimeDetail = false;
            this.startDateAndTime = this.formData.usageDate + ' ' + this.formData.usageTime;
            this.getCarCount(this.formData.usageDate)
        },
        // 复制订单操作！
        orderGetOrderDetail () {
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                id:this.id,
            }
            gcywVehicleRequestDispatchList(params).then(({data}) => {
                if (data?.list?.length <= 0) {
                    return
                }
                let obj = data.list[0];

                this.formData.sFromAddrActive = obj.fromAreaId.split(',')[2];  
                this.formData.sTargetAddrActive = obj.toAreaIdd.split(',')[2];

                this.formData.sFromAddrDetail = obj.fromAddr.split(' ')[1];
                this.formData.sTargetAddrDetail = obj.toAddr.split(' ')[1];
                this.formData.usageDate = parseTime(Date.now(), '{y}-{m}-{d}');

                this.formData.sFromAddr = obj.fromAddr.split(' ')[0];
                this.formData.sTargetAddr = obj.toAddr.split(' ')[0];
                this.startDateAndTime = this.formData.usageDate + ' ' + this.formData.usageTime;

                this.formData.fromProvinceId = obj.fromAreaId.split(',')[0];
                this.formData.fromCityId = obj.fromAreaId.split(',')[1];
                this.formData.fromAreaId = obj.fromAreaId.split(',')[2];

                this.formData.targetProvinceId = obj.toAreaIdd.split(',')[0];
                this.formData.targetCityId = obj.toAreaIdd.split(',')[1];
                this.formData.targetAreaId = obj.toAreaIdd.split(',')[2];

                this.$store.dispatch('DispathOrder/setCopyDataAction', obj);
                this.getProvinceOptions(0);
                this.initUsageTime();
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
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
        //地址列表点击
        handleListClick(addressType){
            this.$router.push({
                name: 'DispathDefaultAddress',
                params: {
                    addressType
                },
            })
        },
        //下一步点击
        handleNextClick(){
            if(!this.formData.sFromAddr){
                 this.$notify({
                    type: 'warning',
                    message: '请选择出发地省市区!',
                });
                return
            }
            if(!this.formData.sFromAddrDetail){
                 this.$notify({
                    type: 'warning',
                    message: '请填写出发地详细地址!',
                });
                return
            }
            if(!this.formData.sTargetAddr){
                 this.$notify({
                    type: 'warning',
                    message: '请选择目的地省市区!',
                });
                return
            }
            if(!this.formData.sTargetAddrDetail){
                 this.$notify({
                    type: 'warning',
                    message: '请填写目的地详细地址!',
                });
                return
            }
            if(!this.startDateAndTime){
                 this.$notify({
                    type: 'warning',
                    message: '请选择出发时间',
                });
                return
            }
            this.$store.dispatch('DispathOrder/setOneDataAction', this.formData).then(() => {
                this.$router.push({
                    name: 'DispathPerfect',
                    params: this.$route.params,
                    query: this.$route.query,
                })
            });
        },
    },
}
</script>

<style lang='less' scoped>
.container {
    background: #f2f4f8;
    box-sizing: border-box;
    padding-top: 10px;
    position: relative;
    overflow-y: auto;

    .from-container {
        height: 190px;
        background: #ffffff;
        border-radius: 7px;
        margin: 0px 8px 10px 8px;
        box-sizing: border-box;
        padding: 0 10px 12px 10px;
        position: relative;

        .form-title {
            display: flex;
            align-items: center;
            height: 48px;

            i {
                width: 20px;
                height: 20px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/icon_loaction_from.png);
            }
            span {
                margin-left: 4px;
                font-size: 14px;
                color: #272b31;
                font-weight: 600;;
            }
        }
        .van-cell {
            border-bottom: 1px solid #f0f0f0;
            padding-left: 10px;
            padding-right: 10px;
        }
        .address-list {
            width: 106px;
            height: 28px;
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            line-height: 28px;
            text-align: center;
            float: right;
            margin-top: 10px;
            position: relative;
          
            i { 
                position: absolute;
                width: 20px;
                height: 20px;
                left: 14px;
                top: 4px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/list_address.png);
            }
            span {
                position: absolute;
                right: 20px;
                font-size: 12px;
                color: #2e2e2e;
            }
        }
        .address-set-default {
            width: 106px;
            height: 28px;
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            line-height: 28px;
            text-align: center;
            float: right;
            margin-top: 10px;
            position: relative;
            margin-right: 5px;
          
            i { 
                position: absolute;
                width: 20px;
                height: 20px;
                left: 14px;
                top: 4px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/normal_address.png);
            }
            span {
                position: absolute;
                right: 20px;
                font-size: 12px;
                color: #2e2e2e;
            }
        }
    }
    .to-container {
        height: 190px;
        background: #ffffff;
        border-radius: 7px;
        margin: 0px 8px 10px 8px;
        box-sizing: border-box;
        padding: 0 10px 12px 10px;

        .to-title {
            display: flex;
            align-items: center;
            height: 48px;

            i {
                width: 20px;
                height: 20px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/icon_location_to.png);
            }
            span {
                margin-left: 4px;
                font-size: 14px;
                color: #272b31;
                font-weight: 600;;
            }
        }
        .van-cell {
            border-bottom: 1px solid #f0f0f0;
            padding-left: 10px;
            padding-right: 10px;
        }
        .address-list {
            width: 106px;
            height: 28px;
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            line-height: 28px;
            text-align: center;
            float: right;
            margin-top: 10px;
            position: relative;
          
            i { 
                position: absolute;
                width: 20px;
                height: 20px;
                left: 14px;
                top: 4px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/list_address.png);
            }
            span {
                position: absolute;
                right: 20px;
                font-size: 12px;
                color: #2e2e2e;
            }
        }
        .address-set-default {
            width: 106px;
            height: 28px;
            border: 1px solid #f0f0f0;
            border-radius: 16px;
            line-height: 28px;
            text-align: center;
            float: right;
            margin-top: 10px;
            position: relative;
            margin-right: 5px;
          
            i { 
                position: absolute;
                width: 20px;
                height: 20px;
                left: 14px;
                top: 4px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/normal_address.png);
            }
            span {
                position: absolute;
                right: 20px;
                font-size: 12px;
                color: #2e2e2e;
            }
        }
    }
    .time-container {
        background: #ffffff;
        border-radius: 7px;
        margin: 0px 8px 64px 8px;
        box-sizing: border-box;
        padding: 0 10px 25px 10px;

        .time-title {
            display: flex;
            align-items: center;
            height: 48px;

            i {
                width: 20px;
                height: 20px;
                background-size: cover;
                background-position: center;  
                background-image:url(/static/start_time.png);
            }
            span {
                margin-left: 4px;
                font-size: 14px;
                color: #272b31;
                font-weight: 600;;
            }
        }
        .van-cell {
            border-bottom: 1px solid #f0f0f0;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
    .bottom-container {
        width: 100%;
        height: 54px;
        line-height: 54px;
        background: #ffffff;
        position: fixed;
        bottom: 0px;
        padding: 8px;
        box-sizing: border-box;
        
        .car-count {
            float: left;
            line-height: 38px;
            margin-left: 20px;

            & span:nth-child(1){
                color: #2e2e2e;
                font-size: 14px;
            }
            & span:nth-child(2){
                color: #0571ff;
                font-size: 22px;
            }
            & span:nth-child(3){
                color: #2e2e2e;
                font-size: 14px;
            }
        }
        .button-next {
            float: right;
            width: 175px;
            line-height: 38px;
            background: #0571ff;
            border-radius: 50px;
            color: #ffffff;
            text-align: center;
            font-size: 14px;
        }
    }
}                      
</style>