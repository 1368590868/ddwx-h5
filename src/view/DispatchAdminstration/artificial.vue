<template>
    <div class="apply-container container">
        <van-nav-bar title="人工调配" left-arrow @click-left="$router.back()" />
        <div class="wrapper">
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
                        <span style="letter-spacing: 7.5px;">时间：</span><span>{{CarOneData.dDepartureTime}}</span>
                    </li>
                </ul>
                <div class="form-warpper">
                    <!-- <van-action-sheet v-model="nReasonShowPicker" :actions="dictReqReason" @select="nReasonConfirm"></van-action-sheet> -->
                    <van-field v-model="formData.nReasonName" name="nReasonName" readonly right-icon="arrow-down" clickable label="用车事由：" placeholder="点击选择用车事由" @click="nReasonShowPicker=true" />
                    <van-popup v-model="nReasonShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nReasonActiveIndex" name="nReasonCode" :columns="dictReqReason" @confirm="nReasonConfirm" @cancel="nReasonShowPicker=false" />
                    </van-popup>

                    <van-field v-model="formData.nRangeName" name="nRangeName" readonly right-icon="arrow-down" clickable label="用车需求：" placeholder="点击选择用车事由" @click="nRangeShowPicker=true" />
                    <van-popup v-model="nRangeShowPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="nRangeActiveIndex" :columns="dictReqRange" @confirm="nRangeConfirm" @cancel="nRangeShowPicker=false" />
                    </van-popup>

                    <van-field v-model="formData.nAboutHours" name="nAboutHours" label="用车时长：" type="digit" placeholder="请输入用车时长" :rules="[{ required: true, message: '请输入用车时长' }]" />

                    <van-field name="radio" label="是否长途：">
                        <template #input>
                            <van-radio-group v-model="formData.cLongDistance" direction="horizontal">
                                <van-radio name="Y">是</van-radio>
                                <van-radio name="N">否</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>

                    <van-field v-model="formData.sPassenger" name="sPassenger" label="乘车人：" placeholder="请输入乘车人" :rules="[{ required: true, message: '请输入乘车人' }]" />
                    <van-field v-model="formData.sPhone" name="sPhone" label="联系电话：" placeholder="请输入联系电话" :rules="[{ required: true, message: '请输入联系电话' }]" />

                    <van-field v-model="formData.sHopeCarname" name="sHopeCartype" readonly right-icon="arrow-down" clickable label="期望车型：" placeholder="点击选择期望车型" @click="sHopeCartyPicker=true" />
                    <van-popup v-model="sHopeCartyPicker" position="bottom">
                        <van-picker show-toolbar value-key="label" :default-index="sHopeCartyActiveIndex" :columns="dictModelType" @confirm="sHopeCartyConfirm" @cancel="sHopeCartyPicker=false" />
                    </van-popup>

                    <van-field v-model="formData.nPassenger" name="nPassenger" label="乘坐人数：" placeholder="请输入乘坐人数" :rules="[{ required: true, message: '请输入乘坐人数' }]" />
                    <van-field class="form-textarea" v-model="formData.sRemark" name="sRemark" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入备注" show-word-limit />
                </div>
                <div class="form-button">
                    <van-button block type="info" native-type="submit">提交</van-button>
                </div>
            </van-form>

        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {orderSaveOrderRequest} from '@/api/order'
    export default {
        computed: {
            ...mapGetters(['userInfo']),
            ...mapGetters('CarApplication', ['CarOneData']),
            ...mapGetters('dict', ['dictReqReason', 'dictReqRange', 'dictModelType'])
        },
        data() {
            return {
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
                    cLongDistance: 'N',  // (string, optional): 是否长途 Y是；N否 ,
                    sPassenger: '',     // (string, optional): 乘车人 ,  // 登录
                    sPhone: '',         // (string, optional): 联系电话 ,// 登录
                    nPassenger: '',     // (integer, optional): 乘坐人数 ,
                    
                    sHopeCarname: '轿车',   // no,
                    sHopeCartype: '1',   // (string)          : 期望车型编号 ,
                    nAboutHours: 2,     // (number, optional): 预计时长 ,
                    sRemark: '',        // (string, optional): 备注 ,
                    
                    // sHopeDrever: '',    // (string, optional): 期望司机编号 ,

                    // confirmDate: '',    // (string, optional): 确认时间 ,
                    // confirmPeople: '',  // (string, optional): 回车确认人 ,
                    // dWeek: '',          // (string, optional): 星期 ,
                    // dreverPhone: '',    // (string, optional): 司机电话 ,
                    
                    // nAutoId: '',        // (string, optional): 主键 ,
                    // sArrangedCar: '',   // (string, optional): 车牌号 ,
                    // sArrangedDriver: '',// (string, optional): 司机ID ,
                    
                    // sRefuseReason: '',  // (string, optional): 驳回理由 ,
                    // sReqNo: '',         // (string, optional): 用车单号 ,


                },
            }
        },
        methods: {
            onFailed() {},
            nReasonConfirm(values) {
                this.formData.nReasonCode = values.value;
                this.formData.nReasonName = values.label;
                this.nReasonShowPicker = false;
            },
            nRangeConfirm (values) {
                this.formData.nRangeCode = values.code;
                this.formData.nRangeName = values.label;
                this.nRangeShowPicker = false;
            },
            sHopeCartyConfirm (values) {    // 期望车型
                this.formData.sHopeCartype = values.code;
                this.formData.sHopeCarname = values.label;
                this.sHopeCartyPicker = false;
            },

            onSubmit (values) {
                // let toast = this.$toast.loading({
                //     duration: 0,
                //     message: "提交中..",
                //     forbidClick: true
                // });
                // let CarOneData = this.CarOneData;
                // orderSaveOrderRequest(Object.assign({}, this.CarOneData, this.formData)).then(({data}) => {
                //     toast.clear();
                //     this.$store.dispatch('CarApplication/clearOneDataAction');
                //     this.$router.push({name: 'SubSuccess', params: {autoId: data}});
                // }).catch((err)=>{
                //     this.$toast.fail("提交失败!");
                // });
            }
        },
        created () {
            const userInfo = this.userInfo;
            this.formData.sPassenger = userInfo.loginName;
            this.formData.sPhone = userInfo.phone;

            this.$store.dispatch('dict/dictGetReqRange');
            this.$store.dispatch('dict/dictGetReqReason');
            this.$store.dispatch('dict/dictGetModelType');

            if (!Object.keys(this.CarOneData).length) {
                this.$notify({
                    type: 'warning',
                    message: '请先填写用车申请基本信息!',
                    onClose: ()=> {
                        this.$router.push({name: 'StartApplying',params: { autoId:'0' }});
                    }
                });
            };
        }
    }
</script>