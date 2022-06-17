<template>
    <div class="apply-container container">
        <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-location-20"></i>
                    <span>出发地：</span><span class="info-address">{{form.fromAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-destination-20"></i>
                    <span>目的地：</span><span class="info-address">{{form.toAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-date-20"></i>
                    <span>时间：<i></i></span><span>{{form.usageDate}}&nbsp;{{form.usageTime}}</span>
                </li>
            </ul>
            <div class="form-warpper">
                <van-field center required v-model="form.reason" name="reason" readonly right-icon="arrow-down" clickable label="用车事由：" :rules="[{ required: true }]"  placeholder="点击选择用车事由" @click="nReasonShowPicker=true" />
                <van-popup v-model="nReasonShowPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="nReasonActiveIndex" :columns="dictReqReason" @confirm="nReasonConfirm" @cancel="nReasonShowPicker=false" />
                </van-popup>

                <van-field center required v-model="form.demand" name="demand" readonly right-icon="arrow-down" clickable label="用车需求：" :rules="[{ required: true }]" placeholder="点击选择用车需求" @click="nRangeShowPicker=true" />
                <van-popup v-model="nRangeShowPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="nRangeActiveIndex" :columns="dictReqRange" @confirm="nRangeConfirm" @cancel="nRangeShowPicker=false" />
                </van-popup>

                <van-field center required v-model="form.timeLength" name="timeLength" type="digit" label="用车时长：" placeholder="请输入用车时长" :rules="[{ required: true}]">
                    <template #extra><span>小时</span></template>
                </van-field>

                <van-field center required name="longDistanceTag" label="是否长途：">
                    <template #input>
                        <van-radio-group v-model="form.longDistanceTag" direction="horizontal">
                            <van-radio name="1">是</van-radio>
                            <van-radio name="0">否</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>

                <van-field center required v-model="form.userName" name="userName" label="乘车人：" placeholder="请输入乘车人" :rules="[{ required: true }]" />
                <van-field center required v-model="form.phone" name="phone" type="tel" label="联系电话：" placeholder="请输入联系电话" :rules="[{ required: true }, {pattern, message: '联系电话输入错误!'}]" />
                <van-field center required v-model="form.hopeBrandName" name="hopeBrand" readonly right-icon="arrow-down" clickable label="期望车型：" :rules="[{ required: true}]" placeholder="点击选择期望车型" @click="sHopeCartyPicker=true" />
                <van-popup v-model="sHopeCartyPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="sHopeCartyActiveIndex" :columns="dictModelType" @confirm="sHopeCartyConfirm" @cancel="sHopeCartyPicker=false" />
                </van-popup>

                <van-field center required v-model="form.usagePersons" name="usagePersons"  type="digit" label="乘坐人数：" placeholder="请输入乘坐人数" :rules="[{ required: true}]">
                    <template #extra><span>人</span></template>
                </van-field>
                <van-field class="form-textarea" v-model="form.remark" name="remark" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入备注" show-word-limit />
            </div>
            <van-popup v-model="assigneeShow" position="bottom">
                <van-cascader
                    v-model="form.assignee"
                    title="请选择审批人"
                    :options="assigneeList"
                    :field-names="fieldNames"
                    @close="assigneeShow = false"
                    @change="onChange"
                    @finish="onFinish"/>
            </van-popup>
            <div class="form-button">
                <van-button block type="info" :disabled="!Object.keys(CarOneData).length" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {addVehicleRequest,activitiAssigneeListByType} from '@/api/order'
    import {getListByParentId} from '@/api/dict'

    export default {
        computed: {
            ...mapGetters(['userInfo']),
            ...mapGetters('CarApplication', ['CarOneData', 'CarCopData','CarOneHist']),
        },
        data() {
            return {
                pattern: /^1[34578]\d{9}$/,

                dictReqReason:[],   //用车事由
                dictReqRange:[],   //用车需求
                dictModelType:[],   //期望车型

                nReasonShowPicker: false,   // 用车事由弹窗
                nRangeShowPicker: false,    // 用车需求弹窗
                sHopeCartyPicker: false,    // 期望车型弹窗
                assigneeShow:false,         //选择审批人弹框

                nReasonActiveIndex: 0,      // 用车事由默认
                nRangeActiveIndex: 0,       // 用车需求默认
                sHopeCartyActiveIndex: 0,   // 期望车型默认

                assigneeList:[],    //工作流数据
                //定义工作流取值字段名称
                fieldNames: {
                    text: 'name',
                    value: 'code',
                    children: 'children',
                },
               
                form:{
                    fromAddr: "",  //出发地点 北京市/北京/海淀区 铁科院
                    fromAreaId: "",
                    toAddr: "",    //目的地
                    toAreaIdd: "",
                    usageDate: "",    //用车日期
                    usageTime: "",     //用车时间
                    reason: "",        //用车事由
                    reasonCode: "",        
                    demand: "",           //用车需求
                    demandCode: "",
                    timeLength: "",        //预计时长
                    longDistanceTag: "0",      //是否长途
                    userName: "",  //乘车人
                    phone: "",      //联系电话
                    hopeBrand: "",     //期望车型
                    hopeBrandName:"",
                    usagePersons: "",  //乘坐人数
                    remark: "",  //备注
                    source: "2",      //来源 1PC 2APP
                    procDefId: "",
                    assignee: "",
                }
            }
        },
        methods: {
            //获取车型字典
            dictGetModelType () {
                getListByParentId("101801").then(({data}) => {
                    this.dictModelType = data;

                    if (Object.keys(this.CarCopData).length) {
                        let obj =  this.dictModelType.find((item) => {
                            return item.code === this.form.hopeBrand;
                        })
                        this.form.hopeBrandName = obj.name;
                    }
                }).catch((err) => {
                    
                })
            },
            //获取用车需求字典
            dictGetReqRange () {
                getListByParentId("10018").then(({data}) => {
                    this.dictReqRange = data;

                    if (Object.keys(this.CarCopData).length) {
                        let obj =  this.dictReqRange.find((item) => {
                            return item.code === this.form.demandCode;
                        })
                        this.form.demand = obj.name;
                    }
                }).catch((err) => {
                    
                })
            },
            //获取用车事由字典
            dictGetReqReason () {
                getListByParentId("1016").then(({data}) => {
                    this.dictReqReason = data;

                    if (Object.keys(this.CarCopData).length) {
                        let obj =  this.dictReqReason.find((item) => {
                            return item.code === this.form.reasonCode;
                        })
                        this.form.reason = obj.name;
                    }
                }).catch((err) => {
                    
                })
            },
            onFailed() {},
            nReasonConfirm(values) {
                this.form.reason = values.name;
                this.form.reasonCode = values.code;
                this.nReasonShowPicker = false;
            },
            nRangeConfirm (values) {
                this.form.demand = values.name;
                this.form.demandCode = values.code;
                this.nRangeShowPicker = false;
            },
            sHopeCartyConfirm (values) {    // 期望车型
                this.form.hopeBrandName = values.name;
                this.form.hopeBrand = values.code;
                this.sHopeCartyPicker = false;
            },
            onSubmit (values) {
                activitiAssigneeListByType({type: '用车审批'}).then( ({data}) => {
                    if(!data.procDefId){
                        this.vehicleInfoAdd();
                    }else if(!!data.procDefId){
                        this.form.procDefId = data.procDefId;
                        if(!!data.assignee){
                            this.form.assignee = data.assignee;
                            this.vehicleInfoAdd();
                        }else{
                            this.assigneeList =this.getAssigneeData(data.assigneeList);
                            this.assigneeShow = true;
                        }
                    }
                })
            },
            //递归去除空children
            getAssigneeData(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children.length < 1) {
                        // children若为空数组，则将children设为undefined
                        data[i].children = undefined;
                    } else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.getAssigneeData(data[i].children);
                    }
                }
                return data;
            },
            //选择监听
            onChange({  value, selectedOptions, tabIndex }){
                
            },
            //全部选项选择完毕后
            onFinish({  value, selectedOptions, tabIndex }) {
                let obj = selectedOptions[selectedOptions.length-1];
                if(obj.type === "5"){
                    this.assigneeShow = false;
                    this.form.assign = obj.code;
                    this.vehicleInfoAdd();
                }else{
                    this.$notify({
                        type: 'warning',
                        message: '请选择审批人!',
                    });
                }
            },
            //提交数据
            vehicleInfoAdd(){
                let toast = this.$toast.loading({
                    duration: 0,
                    message: "提交中..",
                    forbidClick: true
                });
                addVehicleRequest(Object.assign({}, this.form)).then(({data}) => {
                    toast.clear();
                    this.$store.dispatch('CarApplication/clearOneDataAction');
                    this.$router.push({name: 'SubSuccess', params: {autoId: data}});
                }).catch((err) => {
                    this.$toast.fail("提交失败!");
                })
            },
        },
        created () {
            this.dictGetReqReason();
            this.dictGetReqRange();
            this.dictGetModelType();

            if (!Object.keys(this.CarOneData).length) {
                this.$notify({
                    type: 'warning',
                    message: '请先填写用车申请基本信息!',
                    onClose: ()=> {
                        this.$router.back();
                    }
                });
            };
            this.form.userName = this.userInfo.username;
            this.form.phone = this.userInfo.phone;

            this.form.fromAddr = this.CarOneHist.sFromAddr + ' ' + this.CarOneHist.sFromAddrDetail;
            this.form.fromAreaId = this.CarOneHist.fromProvinceId + ',' + this.CarOneHist.fromCityId + ','+ this.CarOneHist.fromAreaId;
            this.form.toAddr = this.CarOneHist.sTargetAddr + ' ' +this.CarOneHist.sTargetAddrDetail
            this.form.toAreaIdd = this.CarOneHist.targetProvinceId + ',' + this.CarOneHist.targetCityId + ','+ this.CarOneHist.targetAreaId;
            this.form.usageDate= this.CarOneHist.dDepartureTime;
            this.form.usageTime= this.CarOneHist.dDepartureTimeDetail;

            
            if (Object.keys(this.CarCopData).length) {
                this.form.reasonCode = this.CarCopData.reasonCode;
                this.form.demandCode = this.CarCopData.demandCode;
                this.form.timeLength = this.CarCopData.timeLength;
                this.form.longDistanceTag = this.CarCopData.longDistanceTag + "";
                this.form.userName = this.CarCopData.userName;
                this.form.phone = this.CarCopData.phone;
                this.form.hopeBrand = this.CarCopData.hopeBrand;
                this.form.hopeBrandName = this.CarCopData.hopeBrandName;
                this.form.usagePersons = this.CarCopData.usagePersons;
                this.form.remark = this.CarCopData.remark;
            }
        }
    }
</script>