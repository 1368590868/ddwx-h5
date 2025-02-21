<template>
    <div class="container">
        <div class="address-container">
            <ul>
                <li>
                    <i></i>
                    <span>出发地：</span>
                    <span>{{form.fromAddr}}</span>
                </li>
                <li>
                    <i></i>
                    <span>目的地：</span>
                    <span>{{form.toAddr}}</span>
                </li>
                <li>
                    <i></i>
                    <span>时{{'\u3000'}}间：</span>
                    <span>{{ form.usageDate }}&nbsp;{{ form.usageTime }}</span>
                </li>
            </ul>
        </div>
        <div class="user-container box-container">
            <span>乘车人</span>
            <div class="user-item-container">
                <ul>
                    <li v-for="(item,index) in defaultUser" :key="index">
                         {{item.realName}}
                         <i class="default-icon-i" @click="handleTagClose(index)"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="detail-container">
            <ul>
                <li>
                    <van-field v-model="form.unitName" 
                        name="unit" 
                        readonly 
                        right-icon="arrow-down"
                        clickable 
                        label="用车单位：" 
                        placeholder="点击选择用车单位"
                        @click="showUnitPicker = true"/>
                    <van-popup v-model="showUnitPicker" position="bottom">
                        <van-picker 
                            show-toolbar 
                            value-key="unitName" 
                            :default-index="unitActiveIndex"
                            :columns="dictUnitData" 
                            @confirm="unitConfirm" 
                            @cancel="showUnitPicker = false" />
                    </van-popup>
                </li>
                <li>
                    <van-field v-model="form.deptName" 
                        name="dept" 
                        readonly 
                        right-icon="arrow-down"
                        clickable 
                        label="用车部门" 
                        placeholder="点击选择用车部门"
                        @click="showDeptPicker = true"/>
                    <van-popup v-model="showDeptPicker" position="bottom">
                        <van-cascader
                            v-if="showDeptPicker"
                            v-model="cascaderValue"
                            title="请选择用车部门"
                            :field-names="fieldNames"
                            :options="dictDeptData"
                            @close="showDeptPicker = false"
                            @change="onDeptChange"/>
                        <van-button class="select-dept-button" 
                            type="info" 
                            size="small" 
                            v-show="showDeptPicker" 
                            @click="handleSelectDept">确定
                        </van-button>
                    </van-popup>
                </li>
                <li>
                    <van-field v-model="form.reason" 
                        name="reason" 
                        readonly 
                        right-icon="arrow-down"
                        clickable 
                        label="用车事由：" 
                        placeholder="点击选择用车事由"
                        @click="nReasonShowPicker = true"/>
                    <van-popup v-model="nReasonShowPicker" position="bottom">
                        <van-picker 
                            show-toolbar 
                            value-key="name" 
                            :default-index="nReasonActiveIndex"
                            :columns="dictReqReason" 
                            @confirm="nReasonConfirm" 
                            @cancel="nReasonShowPicker = false" />
                    </van-popup>
                </li>
                <li>
                    <van-field v-model="form.demand" 
                        name="demand" 
                        readonly 
                        right-icon="arrow-down"
                        clickable 
                        label="用车需求：" 
                        placeholder="点击选择用车需求"
                        @click="nRangeShowPicker = true" />
                    <van-popup v-model="nRangeShowPicker" position="bottom">
                        <van-picker 
                            show-toolbar 
                            value-key="name" 
                            :default-index="nRangeActiveIndex" 
                            :columns="dictReqRange"
                            @confirm="nRangeConfirm" 
                            @cancel="nRangeShowPicker = false" />
                    </van-popup>
                </li>
                <li>
                    <van-field v-model="form.timeLength" 
                        name="timeLength" 
                        type="digit" 
                        label="用车时长："
                        placeholder="请输入用车时长">
                        <template #extra>
                            <span>小时</span>
                        </template>
                    </van-field>
                </li>
                <li>
                    <van-field name="longDistanceTag" label="是否长途：">
                        <template #input>
                            <van-radio-group v-model="form.longDistanceTag" direction="horizontal">
                                <van-radio name="1">是
                                    <template #icon="props">
                                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                    </template>
                                </van-radio>
                                <van-radio name="0">否
                                    <template #icon="props">
                                        <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                                    </template>
                                </van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                </li>
                <li>
                    <van-field v-model="form.phone" 
                        name="phone" 
                        type="tel" 
                        label="手机号码："
                        placeholder="请输入手机号码"/>
                </li>
                <li>
                    <van-field v-model="form.hopeBrandName" 
                        name="hopeBrand" 
                        readonly
                        right-icon="arrow-down" 
                        clickable 
                        label="期望车型：" 
                        placeholder="点击选择期望车型"
                        @click="sHopeCartyPicker = true" />
                    <van-popup v-model="sHopeCartyPicker" position="bottom">
                        <van-picker 
                            show-toolbar 
                            value-key="name" 
                            :default-index="sHopeCartyActiveIndex"
                            :columns="dictModelType" 
                            @confirm="sHopeCartyConfirm" 
                            @cancel="sHopeCartyPicker = false" />
                    </van-popup>
                </li>
                <li>
                    <van-field v-model="form.usagePersons" 
                        name="usagePersons" 
                        type="digit" 
                        label="乘坐人数："
                        maxlength="2" 
                        placeholder="请输入乘坐人数">
                        <template #extra>
                            <span>人</span>
                        </template>
                    </van-field>
                </li>
                <li class="li-item-reamark">
                    <van-field v-model="form.remark" 
                        class="form-textarea" 
                        name="remark" 
                        rows="2" 
                        autosize 
                        type="textarea"
                        maxlength="50" 
                        placeholder="请输入备注" 
                        show-word-limit />
                </li>
            </ul>
        </div>
        <div class="default-button-container-two">
            <van-button block type="default" @click="handleAddUser" round icon="/static/add_user.png">添加乘车人</van-button>
            <van-button block type="info" @click="handleConfirmClick" round>选择车辆</van-button>
        </div>
        <!--选择添加乘车人方式-->
        <van-popup v-model="showAddUserPop" round position="bottom">
            <div class="add-user-type-container">
                <van-button block type="info" @click="handleAddUserSelect" round icon="/static/add_user_select.png">内部用户</van-button>
                <van-button block type="default" @click="handleAddUserInput" round icon="/static/add_user_input.png">手动添加</van-button>
            </div>
        </van-popup>
        <!--手动输入乘车人弹框-->
        <van-dialog v-model="showAddUserInput" 
            class="add-user-input-container" 
            title="请输入乘车人姓名:" 
            show-cancel-button 
            confirmButtonColor="#0571ff"
            :before-close="onBeforeClose">
            <van-field label="" v-model="addUserInputText" maxlength="5" placeholder="请输入乘车人姓名"/>
        </van-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAvailableUnit, getDispatchDept } from '@/api/dispatch'
import { getListByParentId } from '@/api/dict'
import eventBus from '@/utils/eventBus.js'
import keepPages from '@/view/mixins/keepPages'

export default {
    name: 'DispathPerfect',
    mixins: [keepPages],

    computed: {
        ...mapGetters(['userInfo']),
        ...mapGetters('DispathOrder', ['CarOneData', 'CarCopData', 'CarOneHist'])
    },
    data() {
        return {
            pattern: /^1[3456789]\d{9}$/,

            dictReqReason: [],   //用车事由
            dictReqRange: [],   //用车需求
            dictModelType: [],   //期望车型
            dictUnitData: [],    //用车单位
            dictDeptData: [],     //用车部门

            nReasonShowPicker: false,   // 用车事由弹窗
            nRangeShowPicker: false,    // 用车需求弹窗
            sHopeCartyPicker: false,    // 期望车型弹窗
            showUnitPicker: false,      //用车单位弹窗
            showDeptPicker: false,      //用车部门弹窗

            nReasonActiveIndex: 0,      // 用车事由默认
            nRangeActiveIndex: 1,       // 用车需求默认
            sHopeCartyActiveIndex: 0,   // 期望车型默认
            unitActiveIndex: 0,      // 用车单位默认
            deptActiveIndex: 0,       // 用车部门默认

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
                userId:'',
                phone: "",      //手机号码
                hopeBrand: "",     //期望车型
                hopeBrandName: "",
                usagePersons: "",  //乘坐人数
                remark: "",  //备注
                source: "2",      //来源 1PC 2APP
                guarantee:'0',   //优先保障
                unitName:'',  //用车单位
                unitCode:'',
                deptName:'',  //用车部门
                deptId:'',
            },
            fieldNames: {
                text: 'deptName',
                value: 'id',
                children: 'children',
            },
            //添加乘车人弹框
            showAddUserPop:false,
            //手动输入乘车人弹框
            showAddUserInput:false,
            //手动输入乘车人内容
            addUserInputText:'',
            //乘车人数据
            defaultUser:[],
            //用车部门选值
            cascaderValue:'',
            deptSelectedOptions:[],

            activeIcon: '/static/radio_checked.png',
            inactiveIcon: '/static/radio_default.png',
        }
    },
    
    async created() {
        if (!Object.keys(this.CarOneData).length) {
            this.$notify({
                type: 'warning',
                message: '请先填写用车申请基本信息!',
                onClose: () => {
                    this.$router.back();
                }
            });
        }
        this.form.phone = this.userInfo.phone;
        this.form.unitName = this.userInfo.unitName;
        this.form.unitCode = this.userInfo.unitCode;
        this.form.deptName = this.userInfo.deptName;
        this.form.deptId = this.userInfo.deptId;
        this.cascaderValue = this.form.deptId;  
        this.initDefaultUser();

        this.form.fromAddr = this.CarOneHist.sFromAddr + ' ' + this.CarOneHist.sFromAddrDetail;
        this.form.fromAreaId = this.CarOneHist.fromProvinceId + ',' + this.CarOneHist.fromCityId + ',' + this.CarOneHist.fromAreaId;
        this.form.toAddr = this.CarOneHist.sTargetAddr + ' ' + this.CarOneHist.sTargetAddrDetail
        this.form.toAreaIdd = this.CarOneHist.targetProvinceId + ',' + this.CarOneHist.targetCityId + ',' + this.CarOneHist.targetAreaId;
        this.form.usageDate = this.CarOneHist.usageDate;
        this.form.usageTime = this.CarOneHist.usageTime;

        if (Object.keys(this.CarCopData).length) {
            this.form.reasonCode = this.CarCopData.reasonCode;
            this.form.demandCode = this.CarCopData.demandCode;
            this.form.timeLength = this.CarCopData.timeLength;
            this.form.longDistanceTag = this.CarCopData.longDistanceTag + "";
            this.form.userName = this.CarCopData.userName;
            this.form.phone = this.CarCopData.phone;
            this.form.hopeBrand = this.CarCopData.hopeBrand;
            this.form.remark = this.CarCopData.remark;
            this.form.guarantee = this.CarCopData.guarantee;
            this.form.unitCode = this.CarCopData.unitCode;
            this.form.deptId = this.CarCopData.deptId;
            this.cascaderValue = this.form.deptId;  
        }
        this.dictGetReqReason();
        this.dictGetReqRange();
        this.dictGetModelType();
        this.dictUnitOptions();
        this.dictDeptOptions();

        //选择乘车人回调
        eventBus.$off('addUserConfirm');
        eventBus.$on('addUserConfirm',function(item){
            this.addUserConfirm(item)
        }.bind(this));
    },
    activated() {
        console.log('activated')
    },
    methods: {
        //初始化乘车人
        initDefaultUser(){
            let obj = {
                id:this.userInfo.id,
                realName:this.userInfo.realName,
                deptId:this.userInfo.deptId,
                navMenuId:this.userInfo.deptId,
            }
            this.defaultUser.push(obj)
            this.form.usagePersons = this.defaultUser.length;
        },
        //获取用车单位
        dictUnitOptions() {
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            getAvailableUnit().then(({ data }) => {
                this.dictUnitData = data;

                if (Object.keys(this.CarCopData).length) {
                    this.unitActiveIndex = this.dictUnitData.findIndex((item) => {
                        return item.unitCode === this.form.unitCode;
                    });
                    let obj = this.dictUnitData.find((item) => {
                        return item.unitCode === this.form.unitCode;
                    });
                    this.form.unitName = obj.unitName;
                }else{
                    this.unitActiveIndex = this.dictUnitData.findIndex((item) => {
                        return item.unitCode === this.form.unitCode;
                    });
                }
            }).catch((err) => {
              
            }).finally(() => {
                toast.clear();
            })
        },
        //获取用车部门
        dictDeptOptions(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                unitCode:this.form.unitCode,
            }
            getDispatchDept(params).then(({ data }) => {
                this.dictDeptData = this.dealTreeListEmptyChildren(data);
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
        },
        // 去除空数组
        dealTreeListEmptyChildren(arr = []) {
            arr.forEach(item => {
                if (!item?.children?.length) {
                    delete item.children;
                } else {
                    this.dealTreeListEmptyChildren(item.children)
                }
            });
            return arr;
        },
        //获取车型字典
        dictGetModelType() {
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            getListByParentId("101801").then(({ data }) => {
                this.dictModelType = data;
              
                if (Object.keys(this.CarCopData).length) {
                    this.sHopeCartyActiveIndex = this.dictModelType.findIndex((item) => {
                        return item.code === this.form.hopeBrand;
                    });
                    let obj = this.dictModelType.find((item) => {
                        return item.code === this.form.hopeBrand;
                    });
                    this.form.hopeBrandName = obj.name;
                }else{
                    this.form.hopeBrandName = data[this.sHopeCartyActiveIndex].name;
                    this.form.hopeBrand = data[this.sHopeCartyActiveIndex].code;
                }
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
        },
        //获取用车需求字典
        dictGetReqRange() {
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            getListByParentId("10018").then(({ data }) => {
                this.dictReqRange = data;
              
                if (Object.keys(this.CarCopData).length) {
                    this.nRangeActiveIndex = this.dictReqRange.findIndex((item) => {
                        return item.code === this.form.demandCode;
                    });
                    let obj = this.dictReqRange.find((item) => {
                        return item.code === this.form.demandCode;
                    })
                    this.form.demand = obj.name;
                }else{
                    this.form.demand = data[this.nRangeActiveIndex].name;
                    this.form.demandCode = data[this.nRangeActiveIndex].code;
                }
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //获取用车事由字典
        dictGetReqReason() {
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            getListByParentId("1016").then(({ data }) => {
                this.dictReqReason = data;

                if (Object.keys(this.CarCopData).length) {
                    this.nReasonActiveIndex = this.dictReqReason.findIndex((item) => {
                        return item.code === this.form.reasonCode;
                    });
                    let obj = this.dictReqReason.find((item) => {
                        return item.code === this.form.reasonCode;
                    })
                    this.form.reason = obj.name;
                }else{
                    this.form.reason = data[this.nReasonActiveIndex].name;
                    this.form.reasonCode = data[this.nReasonActiveIndex].code;
                }
            }).catch((err) => {
                toast.clear();
            })
        },
        //用车单位确定
        unitConfirm(value){
            this.form.unitName = value.unitName;
            this.form.unitCode = value.unitCode;
            this.form.deptId = "";
            this.form.deptName = "";
            this.cascaderValue = "";
            this.showUnitPicker = false
            this.dictDeptOptions()
        },
        //用车部门变化
        onDeptChange({ value, selectedOptions, tabIndex }){
            this.deptSelectedOptions = selectedOptions;
        },
        //用车部门确定
        handleSelectDept(){
            if(this.deptSelectedOptions.length===0){
                return;
            }
            if(!this.deptSelectedOptions[this.deptSelectedOptions.length-1].children){
                this.form.deptId = this.cascaderValue;
                this.form.deptName = this.deptSelectedOptions.map((option) => option.deptName).join('/');
                this.showDeptPicker = false;
            }
        },
        //用车事由确定
        nReasonConfirm(values) {
            this.form.reason = values.name;
            this.form.reasonCode = values.code;
            this.nReasonShowPicker = false;
        },
        //用车需求确定
        nRangeConfirm(values) {
            this.form.demand = values.name;
            this.form.demandCode = values.code;
            this.nRangeShowPicker = false;
        },
        // 期望车型确定
        sHopeCartyConfirm(values) {   
            this.form.hopeBrandName = values.name;
            this.form.hopeBrand = values.code;
            this.sHopeCartyPicker = false;
        },
        //添加乘车人
        handleAddUser(){
            this.showAddUserPop = true;
        },
        //内部用户
        handleAddUserSelect(){
            this.$router.push({
                name: 'DispathAddUserList',
                params: {
                    checkedUser:JSON.stringify(this.defaultUser),
                },
            })
        },
        //手动添加
        handleAddUserInput(){
            this.addUserInputText = '';
            this.showAddUserInput = true;
        },
        //手动添加关闭前回调
        onBeforeClose(action, done){
            if (action === "confirm") {
                if(!this.addUserInputText){
                    this.$notify({
                        type: 'warning',
                        message: '请填写乘车人姓名!',
                    });
                    return done(false);
                }else {
                    if(this.defaultUser.length === 30){
                        this.$notify({
                            type: 'warning',
                            message: '最多只能选择30名乘车人，请重新选择!',
                        });
                    }else{
                        let obj = {
                            id:'',
                            deptId:'',
                            realName:this.addUserInputText,
                        }
                        this.defaultUser.push(obj)
                        this.form.usagePersons = this.defaultUser.length;
                    }
                }
            }   
            this.showAddUserPop = false;
            done(true)
        },
        //内部用户选择回调
        addUserConfirm(checkedUser){
            this.defaultUser = checkedUser;
            this.form.usagePersons = this.defaultUser.length;

            this.$nextTick(() => {
                this.showAddUserPop = false;
            })
        },
        //删除乘车人回调
        handleTagClose(index){
            this.defaultUser.splice(index, 1);
            this.form.usagePersons = this.defaultUser.length;
        },
        //提交
        handleConfirmClick(){
            if(!this.form.unitName){
                this.$notify({
                    type: 'warning',
                    message: '请选择用车单位!',
                });
                return
            }
            if(!this.form.deptName){
                this.$notify({
                    type: 'warning',
                    message: '请选择用车部门!',
                });
                return
            }
            if(!this.form.reasonCode){
                this.$notify({
                    type: 'warning',
                    message: '请选择用车事由!',
                });
                return
            }
            if(!this.form.demandCode){
                this.$notify({
                    type: 'warning',
                    message: '请选择用车需求!',
                });
                return
            }
            if(!this.form.timeLength || this.form.timeLength === '0'){
                this.$notify({
                    type: 'warning',
                    message: '请填写用车时长!',
                });
                return
            }
            if(!this.form.longDistanceTag){
                this.$notify({
                    type: 'warning',
                    message: '请选择是否长途!',
                });
                return
            }
            if(this.defaultUser.length === 0){
                this.$notify({
                    type: 'warning',
                    message: '请选择乘车人!',
                });
                return
            }else {
                let tempUserName = '';
                let tempUserId = '';

                this.defaultUser.forEach((item,index) => {
                    if(index === this.defaultUser.length-1){
                        tempUserName = tempUserName + item.realName;
                        tempUserId = tempUserId + item.id;
                    }else{
                        tempUserName = tempUserName + item.realName + ',';
                        tempUserId = tempUserId + item.id + ',';
                    }
                })
                this.form.userName = tempUserName;
                this.form.userId = tempUserId;
            }
            if(!this.form.phone){
                this.$notify({
                    type: 'warning',
                    message: '请填写手机号码!',
                });
                return
            }
            if(!this.pattern.test(this.form.phone)){
                this.$notify({
                    type: 'warning',
                    message: '手机号码格式有误,请输入正确的手机号码!',
                });
                return
            }
            if(!this.form.hopeBrand){
                this.$notify({
                    type: 'warning',
                    message: '请选择期望车型!',
                });
                return
            }
            if(!this.form.usagePersons){
                this.$notify({
                    type: 'warning',
                    message: '请填写乘坐人数!',
                });
                return
            }
            this.checkRouter();
        },
        //跳转路由
        checkRouter(){
            const setPerfectActionData = {
                ...this.form,
                ...this.CarOneData
            }
            console.log(setPerfectActionData)
            const fromAreaIdArr = setPerfectActionData?.fromAreaId?.split(',') || [];
            const cityId = fromAreaIdArr[1] || '';
            this.$store.dispatch('DispathOrder/setPerfectAction', setPerfectActionData).then(() => {
                const {
                unitCode,
                deptId,
                // reassignUnitCode,
                usageDate,
                } = this.form;
                let type = this.$route.params.type;
                const routeParams = this.$route.params || {};
                if (type == 2) {
                    this.$router.push({
                        name: 'DispatchVehicle',
                        params: routeParams,
                        query: {
                            ...this.$route.query,
                            reqAssignmentsIndex: 0,
                        }
                    })
                    return
                }
                this.$router.push({
                    name: 'DispatchVehicle',
                    params: routeParams,
                    query: {
                        reqAssignmentsIndex: 0,
                        unitCode,
                        deptId,
                        reassignUnitCode: '',
                        usageDate,
                        assignUnitCode: unitCode,
                        cityId,
                    },
                })
            });
        },
    },
}
</script>
<style lang="less" scoped>
.container {
    background: #f2f4f8;
    box-sizing: border-box;
    padding-top: 10px;
    overflow-y: auto;
    position: relative;

    .address-container {
        background: #ffffff;
        border-radius: 7px;
        margin: 0px 8px 10px 8px;
        box-sizing: border-box;
        padding: 20px 10px 4px 10px;
        position: relative;

        ul {
            display: flex;
            flex-direction: column;
            height: 100%;

            li {
                flex: 1;
                display: flex;
                color: #272b31;
                font-size: 14px;
                position: relative;
                margin-bottom: 16px;
                line-height: 22px;

                i {
                    margin-top: 1px;
                    width: 20px;
                    height: 20px;
                    background-size: cover;
                    background-position: center;
                    margin-right: 5px;
                }
                & span:nth-child(3){
                    width: calc(100% - 85px);
                }
            }
            & li:nth-child(1) i {
                background-image:url(/static/icon_loaction_from.png);
            }
            & li:nth-child(2) i {
                background-image:url(/static/icon_location_to.png);
            }
            & li:nth-child(3) i {
                background-image:url(/static/start_time.png);
            }
        }
    }
    .user-container {
        color: #272b31;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        
        span {
            margin-bottom: 10px;
        }
        .user-item-container {
            display: flex;
            justify-content: space-between;


            li {
                display: inline-block;
                width: 100px;
                height: 26px;
                box-sizing: border-box;
                background: #f6f6f6;
                border-radius: 50px;
                line-height: 26px;
                padding-left: 10px;
                padding-right: 20px;
                position: relative;
                margin-right: 8px;
                margin-bottom: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                span {
                    font-size: 13px;
                    color: #272b31;
                 
                }
                i {
                    background-image:url(/static/add_user_delete.png);
                    position: absolute;
                    right: 10px;
                    top: 5px;
                }
            }
        }
    }
    .detail-container {
        background: #ffffff;
        border-radius: 7px;
        margin: 0px 8px 64px 8px;
        box-sizing: border-box;
        padding: 6px 10px 32px 10px;
        position: relative;

        ul {
            display: flex;
            flex-direction: column;
            height: 100%;

            li {
                color: #272b31;
                font-size: 14px;

                .van-cell {
                    height: 41px;
                    border-bottom: 1px solid #f0f0f0;
                    padding-left: 10px;
                    padding-right: 10px;
                }
                .img-icon {
                    width: 18px;
                    height: 18px;
                }
            }
            .li-item-reamark {
                margin-top: 20px;

                .van-cell {
                    height: 100px;
                    padding-left: 10px;
                    padding-right: 10px;
                    border-bottom: none
                }
            }
        }
        .select-dept-button {
            width: 100px;
            position: absolute;
            border-radius: 25px;
            right: 10px;
            bottom: 10px;
        }
    }
    .add-user-type-container {
        width: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        padding: 38px;
        box-sizing: border-box;

        .van-button--info {
            background-color: #0571FF;
            border-color: #0571FF;
        }
        .van-button {
            width: 100%;
            height: 44px;
        }
        & .van-button:nth-child(1){
            margin-bottom: 10px;
        }
        .van-icon__image {
            width: 24px;
            height: 24px;
        }
    }
    .add-user-input-container {

        ::v-deep .van-dialog__header {
            text-align: left;
            padding-left: 25px;
        }
        .van-cell {
            margin-top: 20px;
            margin-bottom: 30px;
        }
        ::v-deep .van-field__body {
            border-bottom: 1px solid #434951;
        }
    }
}
</style>