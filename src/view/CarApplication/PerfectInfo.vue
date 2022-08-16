<template>
    <div class="apply-container container">
        <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-location-20"></i>
                    <span>出发地：</span><span class="info-address">{{ form.fromAddr }}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-destination-20"></i>
                    <span>目的地：</span><span class="info-address">{{ form.toAddr }}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-date-20"></i>
                    <span>时间：<i></i></span><span>{{ form.usageDate }}&nbsp;{{ form.usageTime }}</span>
                </li>
            </ul>
            <div class="form-warpper">
                <van-field center required v-model="form.reason" name="reason" readonly right-icon="arrow-down"
                    clickable label="用车事由：" :rules="[{ required: true }]" placeholder="点击选择用车事由"
                    @click="nReasonShowPicker = true" />
                <van-popup v-model="nReasonShowPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="nReasonActiveIndex"
                        :columns="dictReqReason" @confirm="nReasonConfirm" @cancel="nReasonShowPicker = false" />
                </van-popup>

                <van-field center required v-model="form.demand" name="demand" readonly right-icon="arrow-down"
                    clickable label="用车需求：" :rules="[{ required: true }]" placeholder="点击选择用车需求"
                    @click="nRangeShowPicker = true" />
                <van-popup v-model="nRangeShowPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="nRangeActiveIndex" :columns="dictReqRange"
                        @confirm="nRangeConfirm" @cancel="nRangeShowPicker = false" />
                </van-popup>

                <van-field center required v-model="form.timeLength" name="timeLength" type="digit" label="用车时长："
                    placeholder="请输入用车时长" :rules="[{ required: true }]">
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

                <van-field center required v-model="form.userName" name="userName" label="乘车人：" placeholder="请输入乘车人"
                    maxlength="5" :rules="[{ required: true }]" />
                <van-field center required v-model="form.phone" name="phone" type="tel" label="联系电话："
                    placeholder="请输入联系电话" :rules="[{ required: true }, { pattern, message: '联系电话输入错误!' }]" />
                <van-field center required v-model="form.hopeBrandName" name="hopeBrand" readonly
                    right-icon="arrow-down" clickable label="期望车型：" :rules="[{ required: true }]" placeholder="点击选择期望车型"
                    @click="sHopeCartyPicker = true" />
                <van-popup v-model="sHopeCartyPicker" position="bottom">
                    <van-picker show-toolbar value-key="name" :default-index="sHopeCartyActiveIndex"
                        :columns="dictModelType" @confirm="sHopeCartyConfirm" @cancel="sHopeCartyPicker = false" />
                </van-popup>

                <van-field center required v-model="form.usagePersons" name="usagePersons" type="digit" label="乘坐人数："
                    maxlength="2" placeholder="请输入乘坐人数" :rules="[{ required: true }]">
                    <template #extra><span>人</span></template>
                </van-field>
                <van-field class="form-textarea" v-model="form.remark" name="remark" rows="2" autosize type="textarea"
                    maxlength="50" placeholder="请输入备注" show-word-limit />
            </div>
            <van-popup v-model="assigneeShow" position="bottom">
                <!-- <van-cascader
                    v-model="form.assignee"
                    title="请选择审批人"
                    :options="assigneeList"
                    :field-names="fieldNames"
                    @close="assigneeShow = false"
                    @change="onChange"
                    @finish="onFinish"/> -->
                <div class="popup-title">请选择审批人</div>
                <van-tree-select :active-id.sync="activeIds" :main-active-index.sync="activeIndex" :items="assigneeList" />
                <van-button class="van-button-sure" @click="handleTreeSelect">确定</van-button>
            </van-popup>

            <div class="form-button">
                <van-button block type="info" :disabled="!Object.keys(CarOneData).length" native-type="submit">提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { addVehicleRequest, activitiAssigneeListByType } from '@/api/order'
import { getListByParentId } from '@/api/dict'

export default {
    computed: {
        ...mapGetters(['userInfo']),
        ...mapGetters('CarApplication', ['CarOneData', 'CarCopData', 'CarOneHist']),
    },
    data() {
        return {
            pattern: /^1[3456789]\d{9}$/,

            dictReqReason: [],   //用车事由
            dictReqRange: [],   //用车需求
            dictModelType: [],   //期望车型

            nReasonShowPicker: false,   // 用车事由弹窗
            nRangeShowPicker: false,    // 用车需求弹窗
            sHopeCartyPicker: false,    // 期望车型弹窗
            assigneeShow: false,         //选择审批人弹框

            nReasonActiveIndex: 0,      // 用车事由默认
            nRangeActiveIndex: 0,       // 用车需求默认
            sHopeCartyActiveIndex: 1,   // 期望车型默认

            assigneeList: [],    //工作流数据
            //定义工作流取值字段名称
            fieldNames: {
                text: 'name',
                value: 'code',
                children: 'children',
            },

            form: {
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
                timeLength: "2",        //预计时长
                longDistanceTag: "0",      //是否长途
                userName: "",  //乘车人
                phone: "",      //联系电话
                hopeBrand: "",     //期望车型
                hopeBrandName: "",
                usagePersons: "1",  //乘坐人数
                remark: "",  //备注
                source: "2",      //来源 1PC 2APP
                procDefId: "",
                assignee: "",
            },
            activeIds: [],
            activeIndex: 0,
        }
    },
    methods: {
        //获取车型字典
        dictGetModelType() {
            getListByParentId("101801").then(({ data }) => {
                this.dictModelType = data;
                this.form.hopeBrandName = data[this.sHopeCartyActiveIndex].name;
                this.form.hopeBrand = data[this.sHopeCartyActiveIndex].code;

                if (Object.keys(this.CarCopData).length) {
                    this.sHopeCartyActiveIndex = this.dictModelType.findIndex((item) => {
                        return item.code === this.form.hopeBrand;
                    });
                    let obj = this.dictModelType.find((item) => {
                        return item.code === this.form.hopeBrand;
                    });
                    this.form.hopeBrandName = obj.name;
                }
            }).catch((err) => {

            })
        },
        //获取用车需求字典
        dictGetReqRange() {
            getListByParentId("10018").then(({ data }) => {
                this.dictReqRange = data;
                this.form.demand = data[this.nRangeActiveIndex].name;
                this.form.demandCode = data[this.nRangeActiveIndex].code;

                if (Object.keys(this.CarCopData).length) {
                    this.nRangeActiveIndex = this.dictReqRange.findIndex((item) => {
                        return item.code === this.form.demandCode;
                    });
                    let obj = this.dictReqRange.find((item) => {
                        return item.code === this.form.demandCode;
                    })
                    this.form.demand = obj.name;
                }
            }).catch((err) => {

            })
        },
        //获取用车事由字典
        dictGetReqReason() {
            getListByParentId("1016").then(({ data }) => {
                this.dictReqReason = data;
                this.form.reason = data[this.nReasonActiveIndex].name;
                this.form.reasonCode = data[this.nReasonActiveIndex].code;

                if (Object.keys(this.CarCopData).length) {
                    this.nReasonActiveIndex = this.dictReqReason.findIndex((item) => {
                        return item.code === this.form.reasonCode;
                    });
                    let obj = this.dictReqReason.find((item) => {
                        return item.code === this.form.reasonCode;
                    })
                    this.form.reason = obj.name;
                }
            }).catch((err) => {

            })
        },
        onFailed() { },
        nReasonConfirm(values) {
            this.form.reason = values.name;
            this.form.reasonCode = values.code;
            this.nReasonShowPicker = false;
        },
        nRangeConfirm(values) {
            this.form.demand = values.name;
            this.form.demandCode = values.code;
            this.nRangeShowPicker = false;
        },
        sHopeCartyConfirm(values) {    // 期望车型
            this.form.hopeBrandName = values.name;
            this.form.hopeBrand = values.code;
            this.sHopeCartyPicker = false;
        },
        onSubmit(values) {
            activitiAssigneeListByType({ type: '用车审批' }).then(({ data }) => {
                if (!data.procDefId) {
                    this.vehicleInfoAdd();
                } else if (data.procDefId) {
                    this.form.procDefId = data.procDefId;
                    if (data.assignee) {
                        this.form.assignee = data.assignee;
                        this.vehicleInfoAdd();
                    } else {
                        this.assigneeList = this.getTreeData(data.assigneeList);
                        this.assigneeShow = true;
                    }
                }
            })
        },
        getTreeData(data){
            let treeList = []
            treeList.push({text:'',children:[]})
            data.forEach((item)=>{
                treeList[0].children.push({
                    text: item.name,
                    id: item.code
                })
            })
            return treeList
        },
        handleTreeSelect(){
            if(this.activeIds.length){
                this.assigneeShow = false;
                this.form.candidateUser = this.activeIds;
                this.vehicleInfoAdd();
            }else{
                this.$notify({
                    type: 'warning',
                    message: '请选择审批人!',
                });
            }
        },
        //递归去除空children
        getAssigneeData(data) {
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
        onChange({ value, selectedOptions, tabIndex }) {

        },
        //全部选项选择完毕后
        onFinish({ value, selectedOptions, tabIndex }) {
            let obj = selectedOptions[selectedOptions.length - 1];
            console.log(obj)
            if (obj.type === "5") {
                this.assigneeShow = false;
                this.form.assign = obj.code;
                this.vehicleInfoAdd();
            } else {
                this.$notify({
                    type: 'warning',
                    message: '请选择审批人!',
                });
            }
        },
        //提交数据
        vehicleInfoAdd() {
            let toast = this.$toast.loading({
                duration: 0,
                message: "提交中..",
                forbidClick: true
            });
            addVehicleRequest(Object.assign({}, this.form)).then(({ data }) => {
                toast.clear();
                this.$store.dispatch('CarApplication/clearOneDataAction');
                this.$router.push({ name: 'SubSuccess', params: { id: data } });
            }).catch((err) => {
                this.$toast.fail("提交失败!");
            })
        },
    },
    created() {
        this.dictGetReqReason();
        this.dictGetReqRange();
        this.dictGetModelType();

        if (!Object.keys(this.CarOneData).length) {
            this.$notify({
                type: 'warning',
                message: '请先填写用车申请基本信息!',
                onClose: () => {
                    this.$router.back();
                }
            });
        }
        this.form.userName = this.userInfo.realName;
        this.form.phone = this.userInfo.phone;

        this.form.fromAddr = this.CarOneHist.sFromAddr + ' ' + this.CarOneHist.sFromAddrDetail;
        this.form.fromAreaId = this.CarOneHist.fromProvinceId + ',' + this.CarOneHist.fromCityId + ',' + this.CarOneHist.fromAreaId;
        this.form.toAddr = this.CarOneHist.sTargetAddr + ' ' + this.CarOneHist.sTargetAddrDetail
        this.form.toAreaIdd = this.CarOneHist.targetProvinceId + ',' + this.CarOneHist.targetCityId + ',' + this.CarOneHist.targetAreaId;
        this.form.usageDate = this.CarOneHist.dDepartureTime;
        this.form.usageTime = this.CarOneHist.dDepartureTimeDetail;


        if (Object.keys(this.CarCopData).length) {
            this.form.reasonCode = this.CarCopData.reasonCode;
            this.form.demandCode = this.CarCopData.demandCode;
            this.form.timeLength = this.CarCopData.timeLength;
            this.form.longDistanceTag = this.CarCopData.longDistanceTag + "";
            this.form.userName = this.CarCopData.userName;
            this.form.phone = this.CarCopData.phone;
            this.form.hopeBrand = this.CarCopData.hopeBrand;
            this.form.usagePersons = this.CarCopData.usagePersons;
            this.form.remark = this.CarCopData.remark;
        }
    }
}
</script>
<style>
.popup-title{
    padding: .2rem 0 .1rem 0.2rem;
    height: .42rem;
}
.van-sidebar{
    width: 0;
}
.van-tree-select__nav{
    flex: 0;
}
.van-tree-select__content{
    height: calc(300px - 1rem) !important;
}
.van-button-sure{
    width: 5.2rem;
    height: 1rem;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4f99ff;
    color: #fff;
}
</style>