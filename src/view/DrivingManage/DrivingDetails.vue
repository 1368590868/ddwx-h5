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
            <div class="ChoiceVehicie">
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
                    <span>电话：</span><span><a style="color: ;" :href="'tel:'+orderDetail.sPhone"></a>{{orderDetail.sPhone}}</span>
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
                <li class="info-label"><span>用车时长：</span><span>{{orderDetail.nAboutHours}}小时</span></li>
                <li class="info-label"><span>是否长途：</span><span>{{orderDetail.cLongDistance}}</span></li>
                <li class="info-label"><span>期望车型：</span><span>{{orderDetail.hopeCarType}}</span></li>
                <template v-if="orderDetail.cartype!= ''">
                    <li class="info-label"><span>实际车型：</span><span :class="orderDetail.cartype === orderDetail.hopeCarType?'':'warnning'">{{orderDetail.cartype}}</span></li>
                </template>
                <li class="info-label"><span>乘车人数：</span><span>{{orderDetail.nPassenger}}人</span></li>
                <li class="info-label"><span>备注：</span><span class="info-address">{{orderDetail.sRemark || '暂无备注'}}</span></li>
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
        <div class="form-button" v-if="orderDetail.stateCode == 3">
            <van-button block type="info" @click="drivingCconfirmReceipt">确认接单</van-button>
        </div>
        <div class="form-button" v-else-if="orderDetail.stateCode == 4">
            <van-button block type="info" @click="drivingConfirmDriving">确认出车</van-button>
        </div>
        <div class="button-box" v-else-if="orderDetail.stateCode == 5">
            <van-button block type="default" @click="drivingPickupReminder">接车提醒</van-button>
            <van-button block type="info"  @click="transferCar=true">确认还车</van-button>
        </div>
        
        <van-popup v-model="transferCar" position="bottom">    
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="drivingreturnCar">
                <van-field type="digit" required label="出车里程：" center v-model="drivingData.nStartMiles" placeholder="请输入当前出车里程数" :rules="[{ required: true }, {validator: asyncValidate, message: '还车里程必须大于出车里程!'}]" name="nStartMiles">
                    <template #extra><span>千米</span></template>
                </van-field>
                <van-field type="digit" required label="还车里程：" center v-model="drivingData.nEndMiles" placeholder="请输入当前表显里程数" :rules="[{ required: true }, {validator: asyncValidate, message: '还车里程必须大于出车里程!'}]" name="nEndMiles">
                    <template #extra><span>千米</span></template>
                </van-field>

                <van-field type="digit" required label="等待时长：" center v-model="drivingData.nWaitingTime" placeholder="请输入当前等待时长数" :rules="[{ required: true}]" name="nWaitingTime">
                    <template #extra><span>小时</span></template>
                </van-field>
                <van-field label="行程描述：" class="form-textarea" v-model="drivingData.sItinerayDescription" name="sItinerayDescription" rows="1" autosize type="textarea" maxlength="50" placeholder="请输入行程描述" show-word-limit />
                <div class="form-button">
                    <van-button block type="info" native-type="submit">确认还车</van-button>
                </div>
            </van-form>
        </van-popup>

     
    </div>
</template>
<script>
import {orderGetOrderDetail, orderApprovalLog, orderCancelOrder} from '@/api/order'
import {drivingCconfirmReceipt, drivingConfirmDriving, drivingPickupReminder, drivingreturnCar,checkDriving} from '@/api/driving'
import {carPic} from '@/api/dispatch';
import platform from '@/view/mixins/platform'
export default {
    mixins: [platform],
    data (){
        return {
            carPic,
            transferCar: false, // 确认还车
            cancelReason: '',   // 取消原因
            orderDetail: {},
            apprlogList: [],

            drivingData: {
                nEndMiles: '',      //  (number, optional): 还车里程 ,
                nStartMiles: '',    // (number, optional): 出车里程 ,
                nWaitingTime: '',   //  (number, optional): 等待时长 ,
                sItinerayDescription: '',   // (string, optional): 行程描述 ,
                nReqfoId: '',       // (string, optional): 申请单主键 ,
                sCarNumber: '',     // (string, optional): 车牌号 ,
                sRider: '',         // (string, optional): 乘车人 ,
                sUserCode: '',       //  (string, optional): 司机编号
                dDepartureDate: '', // (string, optional): 出车时间 ,
                dReturnTime: '',    // (string, optional): 回库时间 ,
            }
        };
    },
    methods: {
        asyncValidate () {
            let nEndMiles = this.drivingData.nEndMiles*1,
                nStartMiles = this.drivingData.nStartMiles*1;
            return nEndMiles > nStartMiles;
        },
        onFailed (){},
        drivingreturnCar () {
          this.$dialog.confirm(
            {message:'还车里程为'+this.drivingData.nEndMiles+'，是否正确？',
            confirmButtonText:'是',
            cancelButtonText:'否'}).then(()=>{
            let toast = this.$toast.loading({
              duration: 0,
              message: "还车中..",
              forbidClick: true
            });
            drivingreturnCar(this.drivingData).then(({data}) => {
                toast.clear();
                this.$router.push({
                    name: 'DriSuccess',
                    params: {autoId: data}
                });
            }).catch((err)=>{
                this.$toast.fail("提交失败!");
            });
          }).catch(()=>{

          })
            
        },
        setDrivingData (orderDetail) {

            this.drivingData.nStartMiles = orderDetail.nInitMiles; // 出车里程 ,
            this.drivingData.nEndMiles = orderDetail.endMiles;      // 还车里程
            this.drivingData.nWaitingTime = orderDetail.waitTime;   // 等待时间
            this.drivingData.sItinerayDescription = (orderDetail.itineraryDescription || orderDetail.sFromAddr +'-'+ orderDetail.sTargetAddr);       // 行程描述
            this.drivingData.nReqfoId = orderDetail.nAutoId;       // (string, optional): 申请单主键 ,
            this.drivingData.sCarNumber = orderDetail.sArrangedCar;     // (string, optional): 车牌号 ,
            this.drivingData.sRider = orderDetail.sPassenger;         // (string, optional): 乘车人 ,
            this.drivingData.sUserCode = orderDetail.sHopeDrever;       //  (string, optional): 司机编号 
        },

        orderGetOrderDetail() {
            let autoId = this.$route.params.autoId;
            orderGetOrderDetail({autoId}).then(({data}) => {
                this.orderDetail = data;
                if (this.orderDetail.stateCode == 5) {  // 确认还车
                    this.setDrivingData(data);
                }
            }).catch(() => {
                alert("获取详情失败!");
            });;
        },
        orderApprovalLog () {
            let autoId = this.$route.params.autoId;
            orderApprovalLog({autoId}).then(({data}) => {
                this.apprlogList = data;
            }).catch(() => {
                alert("获取日志失败!");
            });;
        },
        orderCancelOrder (done) {
            let autoId = this.$route.params.autoId;
            let cancelReason = this.cancelReason;
            orderCancelOrder({autoId, cancelReason}).then((data) => {
                this.$notify({
                    type: 'success',
                    message: '取消成功!'
                });
                this.orderGetOrderDetail();
                this.orderApprovalLog();
                done();
            }).catch(() => {
                alert("取消失败!");
            });
        },
        
        drivingCconfirmReceipt() { // 确认接单
            let autoId = this.$route.params.autoId;
            this.dialogConfirm({message: '是否要确认接单?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    drivingCconfirmReceipt({autoId}).then((data) => {
                        this.$notify({type: 'success',message: '接单成功!'});
                        this.orderGetOrderDetail();
                        this.orderApprovalLog();
                        doneCallback();
                    }).catch(() => {
                        doneCallback();
                        alert("接单失败!");
                    });
                } else {
                    doneCallback();
                }
            });
        },
        async drivingConfirmDriving() {       // 确认出车
            let autoId = this.$route.params.autoId;
            let checkResult = await this.checkDriving({carNumber:this.orderDetail.sArrangedCar})
            if(!checkResult){
                this.$toast.fail("该车辆尚未还车，请先还车后再出车!");
                return false;
            }
            this.dialogConfirm({message: '是否要确认出车?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    drivingConfirmDriving({autoId}).then((data) => {
                        this.$notify({type: 'success', message: '确认出车成功!'});
                        this.orderGetOrderDetail();
                        this.orderApprovalLog();
                        doneCallback();
                    }).catch(() => {
                        alert("确认出车失败!");
                        doneCallback();
                    });
                } else {
                    doneCallback();
                };
            });
        },
        drivingPickupReminder() {       // 接车提醒
            let autoId = this.$route.params.autoId;
            this.dialogConfirm({message: '是否要接车提醒?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    drivingPickupReminder({autoId}).then((data) => {
                        this.$notify({type: 'success',message: '接车提醒成功!'});
                        doneCallback();
                    }).catch(() => {
                        alert("接车提醒失败!");
                        doneCallback();
                    });
                } else {
                    doneCallback();
                };
            });
        },
        checkDriving(params){
          return new Promise((resolve,reject)=>{
            checkDriving(params).then(({data})=>{
                resolve(data)
            })
          })    
        }
    },
    created () {
        this.orderGetOrderDetail();
        this.orderApprovalLog();
    }
}
</script>
<style scoped lang="less">
.warnning{
    color:#E6A23C !important
}
</style>