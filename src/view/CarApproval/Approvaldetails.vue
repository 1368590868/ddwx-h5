<template>
    <div class="apply-container container">
        <div class="wrapper">
            <div class="order-top">
                <span>订单号：{{orderDetail.sReqNo}}</span>
                <van-tag size="large" round type="primary" :color="orderDetail.stateCode | colors">{{orderDetail.state}}</van-tag>
            </div>
            <div class="reject-box" v-if="orderDetail.stateCode == 'b'">
                <div class="reject-title">驳回原因：</div>
                <van-notice-bar :scrollable="orderDetail.sRefuseReason.length>20" color="#2e2e2e" background="#fef9e9">{{orderDetail.sRefuseReason || '未填写明确申请原因'}}</van-notice-bar>
            </div>
            <div class="reject-box" v-if="orderDetail.stateCode == '9'">
                <div class="reject-title">取消原因：</div>
                <van-notice-bar :scrollable="orderDetail.sCancelReason.length>20" color="#2e2e2e" background="#f2f7fc">{{orderDetail.sCancelReason || '未填写明确取消原因'}}</van-notice-bar>
            </div>
            <div class="ChoiceVehicie" v-if="(orderDetail.stateCode>=3 && orderDetail.driverName !='') || (orderDetail.stateCode == 'd')">
                <ul>
                    <li><img :src="carPic+'?carModel='+orderDetail.brand+' '+orderDetail.cartype"></li>
                    <li>
                        <h3>{{orderDetail.sArrangedCar}}</h3>
                        <p>{{orderDetail.brand}}</p>
                        <p>司机：{{orderDetail.driverName}}<span @click="teleponeClick(orderDetail.dreverPhone)">{{orderDetail.dreverPhone}}</span></p>
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
                <li class="info-label"><span>期望车型：</span><span>{{orderDetail.sHopeCartype | cartypeGo}}</span></li>
                <template v-if="orderDetail.cartype!= ''">
                    <li class="info-label"><span>实际车型：</span><span :class="orderDetail.cartype === orderDetail.hopeCarType?'':'warnning'">{{orderDetail.cartype}}</span></li>
                </template>
                <li class="info-label"><span>乘车人数：</span><span>{{orderDetail.nPassenger}}</span></li>
                <li class="info-label"><span>备注：</span><span class="info-address">{{orderDetail.sRemark}}</span></li>
            </ul>
            <template v-if="orderDetail.stateCode == 'd' || orderDetail.stateCode == 6 || orderDetail.stateCode == 7 ">
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
        
        <div class="button-box" v-if="orderDetail.isApproval == 'Y'">
            <van-button block type="default" @click="transferCar=true">驳回</van-button>
            <van-button block type="info" @click="approvalOrderChange">通过</van-button>
        </div>
        <van-popup v-model="transferCar" position="bottom">  
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="approvalOrdeReject">
                <van-field label="驳回原因：" required class="form-textarea" v-model="formData.rejectReason" name="rejectReason" rows="1" autosize type="textarea" maxlength="50" placeholder="请输入驳回原因" :rules="[{ required: true}]" show-word-limit />
                <div class="form-button">
                    <van-button block type="info" native-type="submit">确认驳回</van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>
<script>
import {orderGetOrderDetail, orderApprovalLog, approvalOrder} from '@/api/order'
import {carPic} from '@/api/dispatch';
import platform from '@/view/mixins/platform'
export default {
    mixins: [platform],
    data (){
        return {
            carPic,
            orderDetail: {},
            apprlogList: [],
            transferCar:false,
            formData:{
                rejectReason:'',
                status:1
            }
        };
    },
    methods: {
        orderGetOrderDetail() {
            let autoId = this.$route.params.autoId;
            orderGetOrderDetail({autoId}).then(({data}) => {
                this.orderDetail = data;
            });
        },
        orderApprovalLog () {
            let autoId = this.$route.params.autoId;
            orderApprovalLog({autoId}).then(({data}) => {
                this.apprlogList = data;
            });
        },
        onFailed (){},
        approvalOrdeReject(){
            let autoId = this.$route.params.autoId;
            this.$router.push({name: 'reject', params: {autoId: autoId}});
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在驳回..",
                forbidClick: true
            });
            let param = Object.assign({},{autoId:autoId},this.formData)
            approvalOrder(param).then(({data}) => {
                toast.clear();
                this.$router.push({
                    name: 'approvalSuccess',
                    params: {autoId: autoId}
                });
            }).catch((err)=>{
                this.$toast.fail("驳回失败!");
            });
        },
        approvalOrderChange () {
            this.$dialog.confirm({
                title: '提示',
                message: '是否要审批通过?',
                beforeClose: this.approvalOrder
            });
        },
        approvalOrder(action, done) {
            let autoId = this.$route.params.autoId;
            if (action === 'confirm') {
                approvalOrder({autoId:autoId,status:0}).then((data) => {
                    this.$router.push({name: 'approvalSuccess', params: {autoId: autoId}});
                    // this.$notify({
                    //     type: 'success',
                    //     message: '成功!'
                    // });
                    done();
                }).catch(() => { 
                    done(false);
                });
                //return false;
            };
            done();
        }
    },
    created () {
        this.orderGetOrderDetail();
        this.orderApprovalLog();
    }
}
</script>
<style scoped lang="less">
.warnning {
    color:#E6A23C !important
}
</style>