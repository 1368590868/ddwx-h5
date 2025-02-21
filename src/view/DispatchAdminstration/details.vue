<template>
    <div class="apply-container container">
        <!-- <van-nav-bar title="订单详情" left-arrow @click-left="$router.back()" /> -->
        <div class="wrapper">
            <div class="order-top" v-if="type != '2' && type != '4'">
                <span>订单号：{{orderDetail.sReqNo}}</span>
                <van-tag size="large" round type="primary">{{orderDetail.state}}</van-tag>
            </div>
            <div class="reject-box" v-if="orderDetail.stateCode == 'b'">
                <div class="reject-title">驳回原因：</div>
                <van-notice-bar :scrollable="orderDetail.sRefuseReason.length>20" color="#2e2e2e" background="#fef9e9">{{orderDetail.sRefuseReason || '未填写明确申请原因'}}</van-notice-bar>
            </div>
            <div class="reject-box" v-if="orderDetail.stateCode == '9'">
                <div class="reject-title">取消原因：</div>
                <van-notice-bar :scrollable="orderDetail.sCancelReason.length>20" color="#2e2e2e" background="#f2f7fc">{{orderDetail.sCancelReason || '未填写明确取消原因'}}</van-notice-bar>
            </div>
            <div class="ChoiceVehicie" v-if="type === '1' || type === '2' || type === '10'">
                <ul>
                    <li><img :src="carPic+'?carModel='+ChoiceVehicie.brand+' '+ChoiceVehicie.carType"></li>
                    <li>
                        <h3>{{ChoiceVehicie.carNumber}}</h3>
                        <p>{{ChoiceVehicie.brand}}</p>
                        <p>司机：{{ChoiceDriver.name}}<span style="color:blue;" @click="teleponeClick(ChoiceDriver.phone)">{{ChoiceDriver.driverPhone}}</span></p>
                    </li>
                </ul>
            </div>
            <div class="ChoiceVehicie" v-if="(orderDetail.state === '已派车' && type === '0') || ((type === '4' || type === '5') && orderDetail.driverName) || type === '3'">
                <ul>
                    <li><img :src="carPic+'?carModel='+orderDetail.brand+' '+orderDetail.cartype"></li>
                    <li>
                        <h3>{{orderDetail.sArrangedCar}}</h3>
                        <p>{{orderDetail.brand}}</p>
                        <!-- <p>司机：{{orderDetail.driverName}}<span @click="teleponeClick(orderDetail.dreverPhone)">{{orderDetail.dreverPhone}}</span></p> -->
                        <p>司机：{{orderDetail.driverName}}<span style="color:blue;" @click="teleponeClick(orderDetail.driverPhone)">{{orderDetail.dreverPhone}}</span></p>
                    </li>
                </ul>
            </div>
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-location-20"></i>
                    <span>出发地：</span><span class="info-address">{{orderDetail.sFromAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-destination-20"></i>
                    <span>目的地：</span><span class="info-address">{{orderDetail.sTargetAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-date-20"></i>
                    <span>时间：</span><span>{{orderDetail.dDepartureTime}}</span>
                </li>
            </ul>
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-mine-24"></i>
                    <span>乘车人：</span><span>{{orderDetail.sPassenger}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-contacts-20"></i>
                    <span>电话：</span><span>{{orderDetail.sPhone}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-company-20"></i>
                    <span>单位：</span><span>{{orderDetail.companyName}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-department-20"></i>
                    <span>部门：</span><span>{{orderDetail.deptName}}</span>
                </li>
            </ul>
            <ul class="info-text">
                <li class="info-label"><span>用车事由：</span><span>{{orderDetail.nReasonCode | nReasonGo}}</span></li>
                <li class="info-label"><span>用车需求：</span><span>{{orderDetail.nRangeCode  | nRangeGo}}</span></li>
                <li class="info-label"><span>用车时长：</span><span>{{orderDetail.nAboutHours}}</span></li>
                <li class="info-label"><span>是否长途：</span><span>{{orderDetail.cLongDistance}}</span></li>
                <li class="info-label"><span>期望车型：</span><span>{{orderDetail.hopeCarType}}</span></li>
                <li class="info-label"><span>实际车型：</span><span :class="orderDetail.cartype === orderDetail.hopeCarType?'':'warnning'">{{orderDetail.cartype}}</span></li>
                <li class="info-label"><span>乘车人数：</span><span>{{orderDetail.nPassenger}}</span></li>
                <li class="info-label"><span>备注：</span><span class="info-address">{{orderDetail.sRemark}}</span></li>
            </ul>
            <template v-if="orderDetail.stateCode === 'd' || orderDetail.stateCode === '7'">
                <div class="log-title">行车信息</div>
                <ul class="info-text">
                    <li class="info-label"><span>出车里程：</span><span>{{orderDetail.startMiles || 0}} 千米</span></li>
                    <li class="info-label"><span>还车里程：</span><span>{{orderDetail.endMiles || 0}} 千米</span></li>
                    <li class="info-label"><span>等待时长：</span><span>{{orderDetail.waitTime || 0}} 小时</span></li>
                    <li class="info-label"><span>行程描述：</span><span class="info-address">{{orderDetail.itineraryDescription || '行程描述'}}</span></li>
                </ul>

            </template>
            <div class="operlog-box">
                <div class="log-title">审批日志</div>
                <ul class="log-container">
                    <li class="log-li" v-for="(logItem, logIndex) in apprlogList" :key="logIndex">
                        <span class="log-time">{{logItem.recordDate | timeAgo('{m}/{d} {h}:{i}')}}</span>
                        <em class="log-cirle"></em>
                        <span class="log-name">{{logItem.userName}}</span>
                        <span class="log-status">{{logItem.recordStep}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="form-button" v-if="userInfo.loginName != orderDetail.sOperator && (orderDetail.state === '已派车' || orderDetail.state === '已领单' || orderDetail.state === '已出车')">
            <van-button block type="default" @click="CancelOrderChanges">取消订单</van-button>
        </div>
        <template v-if="userInfo.loginName === orderDetail.sOperator">
            <div class="button-box" v-if="type === '0'">
                <div class="button-box-image">
                    <van-image width="100%" height="20px" :src="quxiao" @click="CancelOrderChanges"/>
                    <div class="text">取消订单</div>
                </div>
                <div class="button-box-image" @click="CopyOrderChange">
                    <van-image width="100%" height="20px" :src="fuzhi" />
                    <div class="text">复制订单</div>
                </div>
                <van-button block type="info" @click="distribute">{{orderDetail.state === '已派车'?'改派':'派单'}}</van-button>
            </div>
            <div class="button-box" v-if="type === '1'">
                <van-button block type="default" @click="returnDetails">重新选择</van-button>
                <van-button block type="info" @click="saveOrderDispatch">确认派单</van-button>
            </div>
            <div class="button-box" v-if="type === '2' || type === '4'">
                <van-button block type="default" @click="returnDetails">上一步</van-button>
                <van-button block type="info" @click="saveOrderDispatch">确认派单</van-button>
            </div>
            <div class="form-button" v-if="type === '5'">
                <van-button block type="default" @click="CopyOrderChange">复制订单</van-button>
            </div>
            <div class="button-box" v-if="type === '6'">
                <van-button block type="default" @click="CopyOrderChange">复制订单</van-button>
                <van-button block type="info" @click="orderConfirmUserCar">确认用车</van-button>
            </div>
        </template>
        <template v-if="type === '10'">
            <div class="button-box">
                <van-button block type="default" @click="returnDetails">上一步</van-button>
                <van-button block type="info" @click="saveOrderDispatch">确认派单</van-button>
            </div>
        </template>
        <van-popup v-model="showCancel" position="bottom">
            <div class="CancelOrder">
                <p>取消原因：</p>
            </div>
            <van-field
                v-model="cancelReason"
                rows="2"
                :autosize="{minHeight: 100}"
                type="textarea"
                maxlength="50"
                placeholder="请输入取消原因"
                show-word-limit
                label-width="60px"
            />
            <van-button block type="info" @click="CancelOrderChange">取消订单</van-button>
        </van-popup>
    </div>
</template>
<script>
import {orderGetOrderDetail, orderApprovalLog, orderCancelOrder, orderConfirmUserCar} from '@/api/order';
import {carPic, saveOrderDispatch, dispatchReassignment} from '@/api/dispatch';
import fuzhi from '@/assets/icon/fuzhi.svg';
import quxiao from '@/assets/icon/quxiao.svg';
import {mapGetters} from 'vuex'
import platform from '@/view/mixins/platform'
import teleponeClick from '@/view/mixins/platform'
export default {
    mixins: [platform],
    data (){
        return {
            carPic,
            quxiao,
            fuzhi,
            orderDetail: {},
            apprlogList: [],
            type: '0',
            showCancel: false,
            cancelReason: '',
        };
    },
    computed: {
        ...mapGetters('details',['autoId', 'ChoiceVehicie', 'ChoiceDriver', 'Details',  'CarOneData', 'CarCopData']),
        ...mapGetters(['userInfo']),
    },
    methods: {
        orderConfirmUserCar (){
            let autoId = this.$route.params.autoId;
            this.dialogConfirm({message: '是否要确认用车?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    orderConfirmUserCar({autoId}).then(({data}) =>{
                        this.$notify({
                            type: 'success',
                            message: '确认用车成功!'
                        });
                        doneCallback();
                        this.$router.push({
                            name: 'order',
                        })
                    }).catch(() => {
                        doneCallback();
                    });
                } else {
                    doneCallback();
                }
            });
            
        },

        returnDetails () {
            this.$router.go(-1);
        },
        orderGetOrderDetail() {
            let autoId = this.$route.params.autoId;
            orderGetOrderDetail({autoId}).then(({data}) => {
                this.orderDetail = data;
                this.$store.dispatch('details/setDetails', data)
            });
        },
        orderApprovalLog () {
            let autoId = this.$route.params.autoId;
            orderApprovalLog({autoId}).then(({data}) => {
                this.apprlogList = data;
            });
        },
        CancelOrderChanges () {
            this.showCancel = true;
        },
        CancelOrderChange () {
            if(this.cancelReason){
                this.$dialog.confirm({
                    title: '提示',
                    message: '是否要取消订单?',
                    beforeClose: this.orderCancelOrder
                });
            }else{
                this.$notify({
                    type: 'warning',
                    message: '请输入取消原因！'
                });
            }
        },
        orderCancelOrder(action, done) {
            let cancelReason = this.cancelReason;
            let autoId = this.$route.params.autoId;
            if (action === 'confirm') {
                orderCancelOrder({autoId,cancelReason}).then((data) => {
                    this.$notify({
                        type: 'success',
                        message: '取消成功!'
                    });
                    done();
                    this.showCancel = false;
                    this.$router.go(-1);
                });
                return false;
            }
            done();
        },
        distribute () {
            this.$router.push({
                name: 'ChoiceVehicie',
                params: {typeVehicie: '0'}
            });
        },
        saveOrderDispatch () {
            let objData = {};
            if(this.type === '2' || this.type === '10'){    // 
                objData = {
                    cLongDistance: this.orderDetail.cLongDistance === '否'? 'N':'Y',
                    confirmDate: '',
                    confirmPeople: '',
                    dDepartureTime: this.orderDetail.dDepartureTime,
                    dWeek: '',
                    dreverPhone: this.ChoiceDriver.phone,
                    nAboutHours: this.orderDetail.nAboutHours,
                    nAutoId: this.orderDetail.nAutoId,
                    nPassenger: this.orderDetail.nPassenger,
                    nRangeCode: this.orderDetail.nRangeCode,
                    nReasonCode: this.orderDetail.nReasonCode,
                    sArrangedCar: this.ChoiceVehicie.carNumber,
                    sArrangedDriver: this.ChoiceDriver.id,
                    sFromAddr: this.orderDetail.sFromAddr,
                    sHopeCartype: this.orderDetail.sHopeCartype,
                    sHopeDrever: '',
                    sPassenger: this.orderDetail.sPassenger,
                    sPhone: this.orderDetail.sPhone,
                    sRefuseReason: '',
                    sRemark: this.orderDetail.sRemark,
                    sReqNo: this.orderDetail.sReqNo,
                    sTargetAddr: this.orderDetail.sTargetAddr

                }
            }else if(this.type === '4'){
                objData = {
                    cLongDistance: this.orderDetail.cLongDistance === '否'? 'N':'Y',
                    confirmDate: '',
                    confirmPeople: '',
                    dDepartureTime: this.orderDetail.dDepartureTime,
                    dWeek: '',
                    dreverPhone: this.orderDetail.dreverPhone,
                    nAboutHours: this.orderDetail.nAboutHours,
                    nPassenger: this.orderDetail.nPassenger,
                    nRangeCode: this.orderDetail.nRangeCode,
                    nReasonCode: this.orderDetail.nReasonCode,
                    sArrangedCar: this.orderDetail.sArrangedCar,
                    sArrangedDriver: this.orderDetail.sArrangedDriver,
                    sFromAddr: this.orderDetail.sFromAddr,
                    sHopeCartype: this.orderDetail.sHopeCartype,
                    sHopeDrever: '',
                    sPassenger: this.orderDetail.sPassenger,
                    sPhone: this.orderDetail.sPhone,
                    sRefuseReason: '',
                    sRemark: this.orderDetail.sRemark,
                    sTargetAddr: this.orderDetail.sTargetAddr
                }
            }else{
                
                objData = {
                    // dreverPhone: this.ChoiceDriver.phone,
                    // sArrangedCar: this.ChoiceVehicie.carNumber,
                    // sArrangedDriver: this.ChoiceDriver.id,
                    // nAutoId: this.orderDetail.nAutoId,
                    cLongDistance: this.orderDetail.cLongDistance === '否'? 'N':'Y',
                    confirmDate: '',
                    confirmPeople: '',
                    dDepartureTime: this.orderDetail.dDepartureTime,
                    dWeek: '',
                    dreverPhone: this.ChoiceDriver.phone,
                    nAboutHours: this.orderDetail.nAboutHours,
                    nAutoId: this.orderDetail.nAutoId,
                    nPassenger: this.orderDetail.nPassenger,
                    nRangeCode: this.orderDetail.nRangeCode,
                    nReasonCode: this.orderDetail.nReasonCode,
                    sArrangedCar: this.ChoiceVehicie.carNumber,
                    sArrangedDriver: this.ChoiceDriver.id,
                    sFromAddr: this.orderDetail.sFromAddr,
                    sHopeCartype: this.orderDetail.sHopeCartype,
                    sHopeDrever: '',
                    sPassenger: this.orderDetail.sPassenger,
                    sPhone: this.orderDetail.sPhone,
                    sRefuseReason: '',
                    sRemark: this.orderDetail.sRemark,
                    sReqNo: this.orderDetail.sReqNo,
                    sTargetAddr: this.orderDetail.sTargetAddr
                }
            }
            let toast = this.$toast.loading({
                duration: 0,
                message: "提交中..",
                forbidClick: true
            });
            let CarOneData = this.CarOneData;
            if (this.orderDetail.state === '已派车'){ // '改派'
                dispatchReassignment(objData).then(({data}) => {
                    toast.clear();
                    this.$store.dispatch('CarApplication/clearOneDataAction');
                    this.$store.dispatch('details/setAutoId', data)
                    this.$router.push({name: 'subSuccess'});
                }).catch((err)=>{
                    this.$toast.fail("派单失败!");
                });
            } else { // '派单'
                saveOrderDispatch(objData).then(({data}) => {
                    toast.clear();
                    this.$store.dispatch('CarApplication/clearOneDataAction');
                    this.$store.dispatch('details/setAutoId', data)
                    this.$router.push({name: 'subSuccess'});
                }).catch((err)=>{
                    this.$toast.fail("派单失败!");
                });
            }


            
        },
        CopyOrderChange () {
            let autoId = this.$route.params.autoId;
            if(this.orderDetail.state === '已派车' || this.orderDetail.state === '已还车' || this.orderDetail.state === '已确认'){
                this.$router.push({
                    name: 'StartApplyings',
                    params: {autoId,type: '1'}
                });
            }else{
                this.$router.push({
                    name: 'StartApplyings',
                    params: {autoId,type: '0'}
                });
            }
        }
    },
    created () {
        let type = this.$route.params.type;
        this.type = type;
        if(type != '2' && type != '4'){
            this.orderGetOrderDetail();
            this.orderApprovalLog();
        }else if(type === '4'){
            this.orderDetail = this.CarCopData;
        }else{
            this.Details.cLongDistance = this.Details.cLongDistance === 'Y'?'是':'否';
            this.orderDetail = this.Details;
        }
    }
}
</script>
<style scoped lang="less">
    .warnning {
        color:#E6A23C !important
    }
    .ChoiceVehicie{
        width: 100%;
        height: 98px;
        ul{
            width: 100%;
            height: 98px;
            border-bottom: 1px solid #f0f0f0;
            li{
                float: left;
                margin-left: 14px;
                img{
                    width: 98px;
                    height: 98px;
                }
                h3{
                    margin-top: 10px;
                }
                p:nth-child(2){
                    line-height: 30px;
                    font-size: 14px;
                }
                p:nth-child(3){
                    line-height: 30px;
                    font-size: 14px;
                    span{
                        margin-left: 10px;
                        color: #2893ff;
                    }
                }
            }
        }
    }
    .CancelOrder{
        margin-left: 20px;
        line-height: 40px;
    }
    // .order-top {
    //     font-size: 16px;
    //     // height: 44px;
    //     padding: 14px;
    //     border-bottom: 1px solid #f0f0f0;
    //     overflow: hidden;
    //     display: flex;
    //     display: -webkit-flex;
    //     align-items: center;
    //     justify-content: space-between;
    //     -webkit-justify-content: space-between;
       
    //     .van-tag {
    //         height: 22px;
    //         // width: 72px;
    //         padding-left: 20px;
    //         padding-right: 20px;
    //     }
    // }
    // .info-box {
    //     border-bottom: 1px solid #f0f0f0;
    //     padding: 8px 0;
    // }
    // .letter {
    //     letter-spacing: 7.5px;
    // }
    
    // .log-container {

    // }
    // .log-li {
    //     height: 40px;
    //     line-height: 40px;
    //     padding-left: 15px;
    //     display: flex;
    //     display: -webkit-flex;
    //     align-items: center;
    //     overflow: hidden;
    //     font-size: 14px;
    //     .log-time {
    //         color: #a9aaad;
    //         width: 75px;
    //     }
    //     .log-name {
    //         color: #3a8bf4;
    //         margin-right: 10px;
    //     }
    //     .log-cirle {
    //         position: relative;
    //         width:8px;
    //         height:8px;
    //         background-color:#43a1ff;
    //         border:1px solid;
    //         border-color:#aad5ff;
    //         border-radius: 50%;
    //         margin: 0 10px;
            
    //         &::after,&::before {
    //             position: absolute;
    //             box-sizing: border-box;
    //             content: ' ';
    //             pointer-events: none;
    //             width: 1px;
    //             height: 25px;
    //             left: 3.5px;
    //             background: #707070;
    //             opacity: 16%;
    //         }
    //         &::after {
    //             bottom: -25px;
    //         }
    //         &::before {
    //             top: -25px;
    //         }
            
    //     }
    //     &:first-child{
    //         .log-cirle::before {
    //             display: none;
    //         }
    //     }
    //     &:last-child{
    //         .log-cirle::after {
    //             display: none;
    //         }
    //     }
    //     // &:nth-child(odd){
    //     //     .log-cirle::after {
    //     //         bottom: -20.5px;
    //     //     }
    //     // }
    // }
    .button-box {
        margin: 8px;
        display: flex;
        display: -webkit-flex;
        justify-content: space-around;
        .van-button {
            width: 50%;
            border: 0px;
            border-right: 1px solid #ccc;
        }
        .button-box-image{
            width: 25%;
            border-right: 1px solid #ccc;
            .text{
                text-align: center;
                font-size: 12px;
                color: #2e2e2e;
            }
        }
        .button-box-image:nth-child(2){
            border-right: 0px;
        }
    }
</style>