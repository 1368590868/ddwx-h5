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
                    <van-field center required v-model="formData.nReasonName" name="nReasonName" readonly right-icon="arrow-down" clickable label="用车事由：" :rules="[{ required: true }]"  placeholder="点击选择用车事由" @click="nReasonShowPicker=true" />
                    <van-popup v-model="nReasonShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nReasonActiveIndex" name="nReasonCode" :columns="dictReqReason" @confirm="nReasonConfirm" @cancel="nReasonShowPicker=false" />
                    </van-popup>

                    <van-field center required v-model="formData.nRangeName" name="nRangeName" readonly right-icon="arrow-down" clickable label="用车需求：" :rules="[{ required: true }]" placeholder="点击选择用车需求" @click="nRangeShowPicker=true" />
                    <van-popup v-model="nRangeShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nRangeActiveIndex" :columns="dictReqRange" @confirm="nRangeConfirm" @cancel="nRangeShowPicker=false" />
                    </van-popup>

                    <van-field center required v-model="formData.nAboutHours" name="nAboutHours" type="digit" label="用车时长：" placeholder="请输入用车时长" :rules="[{ required: true}]">
                        <template #extra><span>小时</span></template>
                    </van-field>

                    <van-field center required name="radio" label="是否长途：">
                        <template #input>
                            <van-radio-group v-model="formData.cLongDistance" direction="horizontal">
                                <van-radio name="Y">是</van-radio>
                                <van-radio name="N">否</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>

                    <van-field center required v-model="formData.sPassenger" name="sPassenger" label="乘车人：" placeholder="请输入乘车人" :rules="[{ required: true }]" maxlength="20"/>
                    <van-field center required v-model="formData.sPhone" name="sPhone" type="tel" label="联系电话：" placeholder="请输入联系电话" :rules="[{ required: true }, {pattern, message: '联系电话输入错误!'}]" />
                    <van-field center required v-model="formData.sHopeCarname" name="sHopeCartype" readonly right-icon="arrow-down" clickable label="期望车型：" :rules="[{ required: true}]" placeholder="点击选择期望车型" @click="sHopeCartyPicker=true" />
                    <van-popup v-model="sHopeCartyPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="sHopeCartyActiveIndex" :columns="dictModelType" @confirm="sHopeCartyConfirm" @cancel="sHopeCartyPicker=false" />
                    </van-popup>

                    <van-field center required v-model="formData.nPassenger" name="nPassenger"  type="digit" label="乘坐人数：" placeholder="请输入乘坐人数" :rules="[{ required: true}]">
                        <template #extra><span>人</span></template>
                    </van-field>
                    <van-field class="form-textarea" v-model="formData.sRemark" name="sRemark" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入备注" show-word-limit />
                </div>
                <div class="button-box">
                    <van-button block type="default" @click="returnArtificials">上一步</van-button>
                    <van-button block type="info" native-type="submit">选择车辆</van-button>
                </div>
            </van-form>

        <!-- </div> -->
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { orderSaveOrderRequest } from '@/api/order'
    export default {
        computed: {
            ...mapGetters(['userInfo']),
            ...mapGetters('dict', ['dictReqReason', 'dictReqRange', 'dictModelType']),
            ...mapGetters('details', ['Details', 'CarOneData', 'CarCopData'])
        },
        data() {
            return {
                pattern: /^1[3456789]\d{9}$/,

                nReasonShowPicker: false,   // 用车事由弹窗
                nRangeShowPicker: false,    // 用车需求弹窗
                sHopeCartyPicker: false,    // 期望车型弹窗

                nReasonActiveIndex: 0,      // 用车事由默认
                nRangeActiveIndex: 2,       // 用车需求默认
                sHopeCartyActiveIndex: 0,   // 期望车型默认
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
                },
            }
        },
        methods: {
            returnArtificials() {
                this.$router.go(-1);
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
                let sOperator = this.Details.sOperator || '';
                this.$store.dispatch('details/setDetails', Object.assign({ sOperator }, this.CarOneData, this.formData))
                let typeVehicie = 'Vehicie';
                let autoId = this.$route.params.autoId;
                if (autoId != '0') {
                    typeVehicie = 'Vehicie';
                } else {
                    typeVehicie = 'addVehicie';
                }
                this.$router.push({
                    name: 'ChoiceVehicie',
                    params: { typeVehicie: typeVehicie }
                });
            }
        },
        created() {
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
                        this.$router.push({ name: 'StartApplyings', params: { autoId, type: '0' } });
                    }
                });
            }
            let Details = this.Details;
            console.log(Details)
            if (Object.keys(Details).length) { // 如果有此数据。则为选择车辆返回上一步的数据
                this.nReasonActiveIndex = this.$options.filters.nReasonGoIndex(Details.nReasonCode);
                this.nRangeActiveIndex = this.$options.filters.nReasonGoIndex(Details.nRangeCode);
                this.sHopeCartyActiveIndex = this.$options.filters.cartypeGoIndex(Details.sHopeCartype);   // 期望车型默认

                this.formData.nReasonName = Details.reason;    // no
                this.formData.nReasonCode = Details.nReasonCode; // this.$options.filters.nReasonGo() 1,    // (number, optional): 用车事由编号 ,

                this.formData.nRangeName = Details.range;    //  '全程',     
                this.formData.nRangeCode = Details.nRangeCode;     // (number, optional): 用车需求编号 ,

                this.formData.sHopeCarname = Details.hopeCarType;// '轿车',   // no,
                this.formData.sHopeCartype = Details.sHopeCartype; // '1',   // (string)          : 期望车型编号 ,

                this.formData.cLongDistance = this.$options.filters.longIs(Details.cLongDistance);  // (string, optional): 是否长途 Y是；N否 ,
                this.formData.sPassenger = Details.sPassenger;     // (string, optional): 乘车人 ,  // 登录
                this.formData.sPhone = Details.sPhone;         // (string, optional): 联系电话 ,// 登录
                this.formData.nPassenger = Details.nPassenger;     // (integer, optional): 乘坐人数 ,
                this.formData.nAboutHours = Details.nAboutHours; // 2,     // (number, optional): 预计时长 ,
                this.formData.sRemark = Details.sRemark;    // '',        // (string, optional): 备注 ,
                return false;
            }

            let CarCopData = this.CarCopData;
            if (Object.keys(CarCopData).length) {   // 如果有autoId则是再来一单的操作
                this.nReasonActiveIndex = this.$options.filters.nReasonGoIndex(CarCopData.nReasonCode);
                this.nRangeActiveIndex = this.$options.filters.nReasonGoIndex(CarCopData.nRangeCode);
                this.sHopeCartyActiveIndex = this.$options.filters.cartypeGoIndex(CarCopData.sHopeCartype);   // 期望车型默认

                this.formData.nReasonName = CarCopData.reason;    // no
                this.formData.nReasonCode = CarCopData.nReasonCode; // this.$options.filters.nReasonGo() 1,    // (number, optional): 用车事由编号 ,

                this.formData.nRangeName = CarCopData.range;    //  '全程',     
                this.formData.nRangeCode = CarCopData.nRangeCode;     // (number, optional): 用车需求编号 ,

                this.formData.sHopeCarname = CarCopData.hopeCarType;// '轿车',   // no,
                this.formData.sHopeCartype = CarCopData.sHopeCartype; // '1',   // (string)          : 期望车型编号 ,

                this.formData.cLongDistance = this.$options.filters.longIs(CarCopData.cLongDistance);  // (string, optional): 是否长途 Y是；N否 ,
                this.formData.sPassenger = CarCopData.sPassenger;     // (string, optional): 乘车人 ,  // 登录
                this.formData.sPhone = CarCopData.sPhone;         // (string, optional): 联系电话 ,// 登录
                this.formData.nPassenger = CarCopData.nPassenger;     // (integer, optional): 乘坐人数 ,
                this.formData.nAboutHours = CarCopData.nAboutHours; // 2,     // (number, optional): 预计时长 ,
                this.formData.sRemark = CarCopData.sRemark;    // '',        // (string, optional): 备注 ,
            }
        }
    }
</script>