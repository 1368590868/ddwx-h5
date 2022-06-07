<template>
    <div class="apply-container container">
        <!-- <div class="wrapper"> -->
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
                <ul class="info-box">
                    <li class="info-label">
                        <i class="font_family icon-icon-location-20"></i>
                        <span>出发地：</span><span class="info-address">{{CarOneData.sFromAddr}}</span>
                    </li>
                    <li class="info-label">
                        <i class="icon font_family icon-icon-destination-20"></i>
                        <span>目的地：</span><span class="info-address">{{CarOneData.sTargetAddr}}</span>
                    </li>
                    <li class="info-label">
                        <i class="icon font_family icon-icon-date-20"></i>
                        <span>时间：<i></i></span><span>{{CarOneData.dDepartureTime}}</span>
                    </li>
                </ul>
                <div class="form-warpper">
                    <van-field required label="用车单位" v-model="formData.unitval" readonly clickable name="unit-picker" right-icon="arrow" :rules="[{ required: true }]" placeholder="点击选择单位" @click="showUnitPicker=true"></van-field>
                    <van-field required label="用车部门" v-model="formData.deptval" readonly clickable name="dept-picker" right-icon="arrow" :rules="[{ required: true }]" placeholder="点击选择部门" @click="showDeptPicker=true"></van-field>
                    <van-field label="用车事由：" required center v-model="formData.nReasonName" name="nReasonName" readonly right-icon="arrow-down" clickable :rules="[{ required: true }]"  placeholder="点击选择用车事由" @click="nReasonShowPicker=true" />
                    <van-popup v-model="nReasonShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nReasonActiveIndex" name="nReasonCode" :columns="dictReqReason" @confirm="nReasonConfirm" @cancel="nReasonShowPicker=false" />
                    </van-popup>

                    <van-field label="用车需求：" required center v-model="formData.nRangeName" name="nRangeName" readonly right-icon="arrow-down" clickable :rules="[{ required: true }]" placeholder="点击选择用车需求" @click="nRangeShowPicker=true" />
                    <van-popup v-model="nRangeShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nRangeActiveIndex" :columns="dictReqRange" @confirm="nRangeConfirm" @cancel="nRangeShowPicker=false" />
                    </van-popup>

                    <van-field label="用车时长：" required  center v-model="formData.nAboutHours" name="nAboutHours" type="digit" placeholder="请输入用车时长" :rules="[{ required: true}]">
                        <template #extra><span>小时</span></template>
                    </van-field>

                    <van-field label="是否长途：" required center name="radio" >
                        <template #input>
                            <van-radio-group v-model="formData.cLongDistance" direction="horizontal">
                                <van-radio name="Y">是</van-radio>
                                <van-radio name="N">否</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>

                    <van-field label="乘车人：" required center v-model="formData.sPassenger" name="sPassenger"  placeholder="请输入乘车人" :rules="[{ required: true }]" />
                    <van-field label="联系电话：" required center v-model="formData.sPhone" name="sPhone" type="tel"  placeholder="请输入联系电话" :rules="[{ required: true }, {pattern, message: '联系电话输入错误!'}]" />
                    <van-field label="期望车型：" required center v-model="formData.sHopeCarname" name="sHopeCartype" readonly right-icon="arrow-down" clickable  :rules="[{ required: true}]" placeholder="点击选择期望车型" @click="sHopeCartyPicker=true" />
                    <van-popup v-model="sHopeCartyPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="sHopeCartyActiveIndex" :columns="dictModelType" @confirm="sHopeCartyConfirm" @cancel="sHopeCartyPicker=false" />
                    </van-popup>

                    <van-field label="乘坐人数：" required center v-model="formData.nPassenger" name="nPassenger"  type="digit" placeholder="请输入乘坐人数" :rules="[{ required: true}]">
                        <template #extra><span>人</span></template>
                    </van-field>
                    <van-field class="form-textarea" v-model="formData.sRemark" name="sRemark" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入备注" show-word-limit />
                </div>
                <div class="button-box">
                    <van-button block type="default" @click="returnArtificials">上一步</van-button>
                    <van-button block type="info" native-type="submit">选择车辆</van-button>
                </div>
            </van-form>
        <van-popup v-model="showUnitPicker" position="bottom">
            <van-picker show-toolbar :columns="unitdata" @cancel="showUnitPicker=false" value-key="name" @confirm="onUnitConfirm">
            </van-picker>
        </van-popup>
        <van-popup v-model="showDeptPicker" position="bottom">
            <van-picker show-toolbar :columns="deptdata" @cancel="showDeptPicker=false" value-key="name" @confirm="onDeptConfirm">
            </van-picker>
        </van-popup>
        <!-- </div> -->
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { orderSaveOrderRequest,getAvailableUnit,getDeptByUnit} from '@/api/order'
    export default {
        computed: {
            ...mapGetters(['userInfo']),
            ...mapGetters('dict', ['dictReqReason', 'dictReqRange', 'dictModelType']),
            ...mapGetters('DispathOrder', ['CarOneData', 'CarCopData', 'CarPerfect'])
            // CarOneData 开始页面的数据，CarCopData: 复制订单时开始页面的详情数据
        },
        data() {
            return {
                pattern: /^1[34578]\d{9}$/,

                nReasonShowPicker: false,   // 用车事由弹窗
                nRangeShowPicker: false,    // 用车需求弹窗
                sHopeCartyPicker: false,    // 期望车型弹窗

                nReasonActiveIndex: 0,      // 用车事由默认
                nRangeActiveIndex: 2,       // 用车需求默认
                sHopeCartyActiveIndex: 0,   // 期望车型默认
                unitdata:[],//用车单位
                deptdata:[],//用车部门
                formData: {
                    nReasonName: '会议',    // no
                    nReasonCode: 1,    // (number, optional): 用车事由编号 ,  
                    nRangeName: '全程',     // no
                    nRangeCode: 3,     // (number, optional): 用车需求编号 ,
                    sHopeCarname: '轿车',   // no,
                    sHopeCartype: '1',   // (string)          : 期望车型编号 ,
                    cLongDistance: 'N',  // (string, optional): 是否长途 Y是；N否 ,
                    sPassenger: '',     // (string, optional): 乘车人 ,  // 登录
                    sPhone: '',         // (string, optional): 联系电话 ,// 登录
                    nPassenger: 1,     // (integer, optional): 乘坐人数 ,
                    nAboutHours: 2,     // (number, optional): 预计时长 ,
                    sRemark: '',        // (string, optional): 备注 ,
                    unitval:'',
                    deptval:'',
                    reqUnitCode:'',
                    sDeptCode:''
                },
                showUnitPicker:false,
                showDeptPicker:false,
            }
        },
        methods: {
            returnArtificials() {   // 返回上一步
                let autoId = this.$route.params.autoId;
                this.$router.push({
                    name: 'DispathApply',
                    params: {autoId}
                });
            },
            onFailed() { },
            nReasonConfirm(values) {
                this.formData.nReasonCode = values.value;
                this.formData.nReasonName = values.label;
                this.nReasonShowPicker = false;
            },
            nRangeConfirm(values) {
                this.formData.nRangeCode = values.code;
                this.formData.nRangeName = values.label;
                this.nRangeShowPicker = false;
            },
            sHopeCartyConfirm(values) {    // 期望车型
                this.formData.sHopeCartype = values.code;
                this.formData.sHopeCarname = values.label;
                this.sHopeCartyPicker = false;
            },

            onSubmit(values) {
                //                                                                      开始选择数据       当前页面数据
                this.$store.dispatch('DispathOrder/setPerfectAction', Object.assign({},  this.formData, this.CarOneData)).then(() => {
                    let autoId = this.$route.params.autoId;
                    let type = autoId == '0' ? 0 : 2;   // 2为复制订单
                    this.$router.push({
                        name: 'DispathVehicle',
                        params: {type, autoId: 0}
                    })
                });
            },

            computedFormData (formData) {
                this.nReasonActiveIndex = this.$options.filters.nReasonGoIndex(formData.nReasonCode);
                this.nRangeActiveIndex = this.$options.filters.nReasonGoIndex(formData.nRangeCode);
                this.sHopeCartyActiveIndex = this.$options.filters.cartypeGoIndex(formData.sHopeCartype);   // 期望车型默认

                this.formData.nReasonName = formData.reason;    // no
                this.formData.nReasonCode = formData.nReasonCode; // this.$options.filters.nReasonGo() 1,    // (number, optional): 用车事由编号 ,
                this.formData.unitval = formData.companyName
                this.formData.deptval = formData.deptName
                this.formData.reqUnitCode = formData.sUnitCode
                this.formData.nRangeName = formData.range;    //  '全程',     
                this.formData.nRangeCode = formData.nRangeCode;     // (number, optional): 用车需求编号 ,

                this.formData.sHopeCarname = formData.hopeCarType;// '轿车',   // no,
                this.formData.sHopeCartype = formData.sHopeCartype; // '1',   // (string)          : 期望车型编号 ,

                this.formData.cLongDistance = this.$options.filters.longIs(formData.cLongDistance);  // (string, optional): 是否长途 Y是；N否 ,
                this.formData.sPassenger = formData.sPassenger;     // (string, optional): 乘车人 ,  // 登录
                this.formData.sPhone = formData.sPhone;         // (string, optional): 联系电话 ,// 登录
                this.formData.nPassenger = formData.nPassenger;     // (integer, optional): 乘坐人数 ,
                this.formData.nAboutHours = formData.nAboutHours; // 2,     // (number, optional): 预计时长 ,
                this.formData.sRemark = formData.sRemark;    // '',        // (string, optional): 备注 ,
            },
        getAvailableUnit(){
          getAvailableUnit().then(({data})=>{
            this.unitdata = data
          })
        },
        
        getDeptByUnit(params){
          getDeptByUnit(params).then(({data})=>{
              this.deptdata = data;
          })
        },
        onUnitConfirm(value){
          this.formData.unitval = value.name
          this.formData.reqUnitCode = value.id
          this.getDeptByUnit({reqUnitCode:value.id})
          this.formData.deptval = ""
          this.showUnitPicker = false
        },
        onDeptConfirm(value){
          this.formData.deptval = value.name
          this.formData.sDeptCode = value.id
          this.showDeptPicker = false
        },

        },
               
        created() {
            this.getAvailableUnit();
            const userInfo = this.userInfo;
            this.formData.sPassenger = userInfo.name;
            this.formData.sPhone = userInfo.phone;

            this.$store.dispatch('dict/dictGetReqRange');
            this.$store.dispatch('dict/dictGetReqReason');
            this.$store.dispatch('dict/dictGetModelType');
            
            let autoId = this.$route.params.autoId;
            if (!Object.keys(this.CarOneData).length) {
                this.$notify({
                    type: 'warning',
                    message: '请先填写用车申请基本信息!',
                    onClose: () => {
                        this.$router.push({ name: 'DispathApply', params: { autoId} });
                    }
                });
            };

            let CarPerfect = this.CarPerfect;
            if (Object.keys(CarPerfect).length) {   // 上一步回退之后的选择数据
                this.formData = CarPerfect;
                this.getDeptByUnit({reqUnitCode:this.formData.reqUnitCode})
                return false;
            }

            let CarCopData = this.CarCopData;
            if (Object.keys(CarCopData).length) {   // 如果CarCopData有数据则是再来一单的操作
                this.computedFormData(CarCopData);
                this.getDeptByUnit({reqUnitCode:CarCopData.sUnitCode})
            }
        }
    }
</script>