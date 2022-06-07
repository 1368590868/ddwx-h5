<template>
    <div class="apply-container container">
        <!-- <van-nav-bar title="订单详情" left-arrow @click-left="$router.back()" /> -->
        <div class="wrapper">
            <div class="order-top" v-if="$route.params.type == 1">
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
            <!-- v-if="(orderDetail.state === '已派车' && type === '0') || ((type === '4' || type === '5') && orderDetail.driverName) || type === '3'" -->
            <div class="ChoiceVehicie" v-if="orderDetail.stateCode != '2'">
                <ul>
                    <li><img :src="carPic+'?carNumber='+orderDetail.sArrangedCar"></li>
                    <li>
                        <h3>{{orderDetail.sArrangedCar}}</h3>
                        <p>{{orderDetail.brand}}</p>
                        <p>司机：{{orderDetail.driverName || ChoiceDriver.name}}<span @click="teleponeClick(orderDetail.dreverPhone)">{{orderDetail.dreverPhone}}</span></p>
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
                    <span>单位：</span><span>{{orderDetail.unitval}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-department-20"></i>
                    <span>部门：</span><span>{{orderDetail.deptval}}</span>
                </li>
            </ul>
            <ul class="info-text">
                <li class="info-label"><span>用车事由：</span><span>{{orderDetail.nReasonCode | nReasonGo}}</span></li>
                <li class="info-label"><span>用车需求：</span><span>{{orderDetail.nRangeCode  | nRangeGo}}</span></li>
                <li class="info-label"><span>用车时长：</span><span>{{orderDetail.nAboutHours}}</span></li>
                <li class="info-label"><span>是否长途：</span><span>{{orderDetail.cLongDistance | isLong}}</span></li>
                <li class="info-label"><span>期望车型：</span><span>{{orderDetail.sHopeCartype | cartypeGo}}</span></li>
                <template v-if="orderDetail.carModel && orderDetail.carModel != ''">
                    <li class="info-label"><span>实际车型：</span><span :class="orderDetail.carModel == orderDetail.hopeCarType?'':'warnning'">{{orderDetail.carModel}}</span></li>
                </template>
                 <template v-if="orderDetail.cartype && orderDetail.cartype != ''"> 
                    <template v-if="orderDetail.hopeCarType!=''">
                        <li class="info-label"><span>实际车型：</span><span :class="orderDetail.cartype == orderDetail.hopeCarType?'':'warnning'">{{orderDetail.cartype}}</span></li>
                    </template>  
                    <template v-else>
                        <li class="info-label"><span>实际车型：</span><span>{{orderDetail.cartype}}</span></li>
                    </template>              
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
            <div class="operlog-box" v-if="($route.params.type == 1 && (!orderDetail.isDispatchCreate))">
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
        <!-- <div class="form-button" v-if="userInfo.loginName != orderDetail.sOperator && (orderDetail.state === '已派车' || orderDetail.state === '已领单' || orderDetail.state === '已出车')">
            <van-button block type="default" @click="CancelOrderChanges">取消订单</van-button>
        </div>
         -->
        <!-- 新增或者复制订单过来的数据 -->
        <div class="button-box" v-if="$route.params.type == 0 || $route.params.type == 2">
            <van-button block type="default" @click="returnDetails">重新选择</van-button>
            <van-button block type="info" @click="saveOrderDispatch">确认派单</van-button>
        </div>
        <div class="button-box" v-if="$route.params.type == 3">
            <van-button block type="default" @click="returnDetails">重新选择</van-button>
            <van-button block type="info" @click="dispatchReassignment">确认改派</van-button>
        </div>
        <div class="button-box" v-if="orderDetail.stateCode == '2'">
            <div class="button-box-image" v-if="redispatchOrReject.indexOf('CANCEL') != -1">
                <van-image width="100%" height="20px" :src="quxiao" @click="CancelOrderChanges" />
                <div class="text">取消订单</div>
            </div>
            <div class="button-box-image" @click="CopyOrderChange">
                <van-image width="100%" height="20px" :src="fuzhi" />
                <div class="text">复制订单</div>
            </div>
            <van-button block type="info" @click="redispatch" v-if="redispatchOrReject.indexOf('REDISPATCH') != -1">转派</van-button>
            <van-button block type="info" @click="reject" v-if="redispatchOrReject.indexOf('REJECT') != -1">驳回</van-button>
            <van-button block type="info" @click="distribute">派单</van-button>
        </div>
        
        <div class="button-box" v-if="orderDetail.stateCode == '3' || orderDetail.stateCode == '4'">
            <div class="button-box-image" v-if="redispatchOrReject.indexOf('CANCEL') != -1">
                <van-image width="100%" height="20px" :src="quxiao" @click="CancelOrderChanges"/>
                <div class="text">取消订单</div>
            </div>
            <div class="button-box-image" @click="CopyOrderChange">
                <van-image width="100%" height="20px" :src="fuzhi" />
                <div class="text">复制订单</div>
            </div>
            <van-button block type="info" @click="reassignmentClick">改派</van-button>
        </div>
        <div class="button-box" v-if="orderDetail.stateCode == '5'">
            <van-button block type="default" @click="CopyOrderChange">复制订单</van-button>
            <van-button block type="info" @click="CancelOrderChanges" redispatchOrReject.indexOf('CANCEL') != -1>取消订单</van-button>
        </div>
        <div class="button-box" v-if="orderDetail.stateCode == '6'">
            <van-button block type="default" @click="CopyOrderChange">复制订单</van-button>
            <van-button block type="info" @click="orderConfirmUserCar">确认用车</van-button>
        </div>
        <div class="form-button" v-if="orderDetail.stateCode == '7' || orderDetail.stateCode == 'd' || orderDetail.stateCode == '9'">
            <van-button block type="default" @click="CopyOrderChange">复制订单</van-button>
        </div>
<!-- 
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
            
        </template>
        <template v-if="type === '10'">
            <div class="button-box">
                <van-button block type="default" @click="returnDetails">上一步</van-button>
                <van-button block type="info" @click="saveOrderDispatch">确认派单</van-button>
            </div>
        </template> -->
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
import {carPic, saveOrderDispatch, dispatchReassignment,dispatchCheckDriver,dispatchCheckCar,getAvailableButton,redispatch,reject} from '@/api/dispatch';
import fuzhi from '@/assets/icon/fuzhi.svg';
import quxiao from '@/assets/icon/quxiao.svg';
import {mapGetters} from 'vuex'
import platform from '@/view/mixins/platform'
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
            type:'',
            redispatchOrReject:'',

        };
    },
    computed: {
        ...mapGetters('DispathOrder',['ChoiceVehicie', 'ChoiceDriver', 'CarPerfect']),
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
                        this.$store.dispatch('DispathOrder/triggerFefresh', true);
                        this.$router.push({
                            name: 'DispathOrderList',
                        });
                    }).catch(() => {
                        doneCallback();
                    });
                } else {
                    doneCallback();
                };
            });
            
        },

        returnDetails () {
            this.$router.go(-1);
        },
        orderGetOrderDetail() {
            let autoId = this.$route.params.autoId;
            orderGetOrderDetail({autoId}).then(({data}) => { 
                this.orderDetail = data;
                this.orderDetail.unitval = data.companyName
                this.orderDetail.deptval = data.deptName
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
                    this.orderGetOrderDetail();
                    this.orderApprovalLog();
                });
                return false;
            };
            done();
        },
        distribute () { // 保存当前数据
            this.$store.dispatch('DispathOrder/setPerfectAction', this.orderDetail).then(() => {
                let autoId = this.$route.params.autoId;
                this.$router.push({
                    name: 'DispathVehicle',
                    params: {type: 1, autoId}
                });
            }); 
        },
        reassignmentClick () {
            this.$store.dispatch('DispathOrder/setPerfectAction', this.orderDetail).then(() => {
                let autoId = this.$route.params.autoId;
                this.$router.push({ // 改派为3
                    name: 'DispathVehicle',
                    params: {type: 3, autoId}
                });
            });

        },
        dispatchReassignment () {   // 已审批 派单
            let toast = this.$toast.loading({
                duration: 0,
                message: "派单中..",
                forbidClick: true
            });
            let nAutoId = this.$route.params.autoId;
            dispatchReassignment(Object.assign({nAutoId}, this.orderDetail)).then(({data}) => {
                toast.clear();
                this.$store.dispatch('DispathOrder/clearOneDataAction');
                this.$router.push({name: 'DispathSuccess', params: {autoId: data}});
            }).catch((err)=>{
                this.$toast.fail("派单失败!");
            });
        },

    async saveOrderDispatch () {
            let toast = this.$toast.loading({
                duration: 0,
                message: "提交中..",
                forbidClick: true
            });
            let nAutoId = this.$route.params.autoId != 0 ? this.$route.params.autoId: "";
            let driverUnitCode = this.orderDetail.driverUnitCode
            let driver = this.orderDetail.driver
            let startTime = this.orderDetail.dDepartureTime 
            let aboutHours = this.orderDetail.nAboutHours
            let carNumber = this.orderDetail.sArrangedCar
            let autoId = '';
           if(this.$route.params.autoId && this.$route.params.autoId.length>2){
               autoId = this.$route.params.autoId
           }
            // let checkDriver = await this.dispatchCheckDriver({autoId,driverUnitCode,driver,startTime,aboutHours})
            let checkCarResult = await this.dispatchCheckCar({autoId,carNumber,startTime,aboutHours,driverUnitCode,driver})
    
            if(checkCarResult!=""){
                toast.clear();
                this.$dialog.confirm({message:checkCarResult}).then(()=>{
                  saveOrderDispatch(Object.assign({nAutoId}, this.orderDetail)).then(({data}) => {
                    toast.clear();
                    this.$store.dispatch('DispathOrder/clearOneDataAction');
                    this.$router.push({name: 'DispathSuccess', params: {autoId: data}});
                  }).catch((err)=>{
                    this.$toast.fail("派单失败!");
                  });
               }).catch(()=>{
                   return false;
               })
            }else{
                saveOrderDispatch(Object.assign({nAutoId}, this.orderDetail)).then(({data}) => {
                    toast.clear();
                    this.$store.dispatch('DispathOrder/clearOneDataAction');
                    this.$router.push({name: 'DispathSuccess', params: {autoId: data}});
                }).catch((err)=>{
                    this.$toast.fail("派单失败!");
                });
            }
        },
        dispatchCheckDriver(params){
            return new Promise((resolve,reject)=>{                
                dispatchCheckDriver(params).then(({data})=>{
                    resolve(data)
                })
            })
        },
        dispatchCheckCar(params){            
            return new Promise((resolve,reject)=>{
                dispatchCheckCar(params).then(({data})=>{
                    resolve(data)
                })
            })
        },
        CopyOrderChange () {
            let autoId = this.$route.params.autoId;
            this.$router.push({
                name: 'DispathApply',
                params: {autoId}
            });
        },
        computedDetailData (detailData) {
            let userInfo = this.userInfo;
            this.orderDetail.sFromAddr = detailData.sFromAddr;  //  (string, optional): 出发地 ,
            this.orderDetail.sTargetAddr = detailData.sTargetAddr; //  (string, optional): 目的地
            this.orderDetail.dDepartureTime = detailData.dDepartureTime; //  (string, optional): 出发时刻 ,

            this.orderDetail.sPassenger = detailData.sPassenger; // (string, optional): 乘车人 ,
            this.orderDetail.sPhone = detailData.sPhone;    //  (string, optional): 联系电话 ,
       
            // this.orderDetail.companyName = userInfo.companyName;
            
            this.orderDetail.deptName = userInfo.officeName;    // 
       
            this.orderDetail.nReasonCode = detailData.nReasonCode;  //  (number, optional): 用车事由编号 ,
            this.orderDetail.nRangeCode = detailData.nRangeCode; // (number, optional): 用车需求编号 ,
            this.orderDetail.sHopeCartype = detailData.sHopeCartype;   //  (string): 期望车型编号 ,
            this.orderDetail.carModel = detailData.carModel;
            this.orderDetail.cLongDistance = this.$options.filters.longIs(detailData.cLongDistance); // (string, optional): 是否长途 Y是；N否 ,
            this.orderDetail.nPassenger = detailData.nPassenger;    // (integer, optional): 乘坐人数 ,
            this.orderDetail.nAboutHours = detailData.nAboutHours;  // (number, optional): 预计时长 ,
            this.orderDetail.sRemark = detailData.sRemark;  //  (string, optional): 备注 ,

            this.orderDetail.confirmDate = '';  //  (string, optional): 确认时间 ,
            this.orderDetail.confirmPeople = '';    //  (string, optional): 回车确认人 ,
            this.orderDetail.dWeek = '';    //  (string, optional): 星期 ,

            this.orderDetail.dreverPhone = detailData.phone;    // dreverPhone (string, optional): 司机电话 ,
            this.orderDetail.sArrangedDriver = detailData.id;   // sArrangedDriver (string, optional): 司机ID ,
            this.orderDetail.sHopeDrever = '';      // sHopeDrever (string, optional): 期望司机编号 ,
            this.orderDetail.sArrangedCar = detailData.carNumber;   //  (string, optional): 车牌号 ,
            this.orderDetail.sOperator = '';    //  (string, optional): 申请人ID ,
            
            this.orderDetail.brand = detailData.carType;        // 人工添加
            this.orderDetail.hopeCarType = detailData.hopeCarType;
            this.orderDetail.unitval = detailData.unitval
            this.orderDetail.deptval = detailData.deptval
            this.orderDetail.driverUnitCode = detailData.unitCode;//司机单位编号
            this.orderDetail.driver = detailData.id;//司机编号
            this.orderDetail.sUnitCode = detailData.reqUnitCode;//用车单位编号
            this.orderDetail.sDeptCode = detailData.sDeptCode;//用车部门编号
            this.orderDetail.sDriverUnitCode = detailData.unitCode?detailData.unitCode:sUnitCode;//司机单位编号（验证车接口用）
                // nAutoId (string, optional): 主键 ,
                // nInitMiles (number, optional): 出库公里数(用于填写行车记录默认出车里程) ,
                // sCancelReason (string, optional): 取消原因 ,
                // sRefuseReason (string, optional): 驳回理由 ,
                // sReqNo (string, optional): 用车单号 ,
        },
        getAvailableButton(){
            let autoId = ''
            if(this.$route.params.autoId!=0){
                autoId = this.$route.params.autoId?this.$route.params.autoId:''
            }
            // let autoId = this.$route.params.autoId;
            getAvailableButton({autoId}).then(({data})=>{
                this.redispatchOrReject = data
            })
        },
        redispatch(){
            let autoId = this.$route.params.autoId;
            redispatch({autoId}).then(({data})=>{
                this.$toast.success("转派成功！")
                // this.$router.push({path:'/DispathOrder'});
                this.$router.push({path:'/DispathOrder', query: {refresh: true}});
            })
        },
        reject(){
            let autoId = this.$route.params.autoId;
            reject({autoId}).then(({data})=>{
                this.$toast.success("驳回成功！")
                this.$router.push({path:'/DispathOrder', query: {refresh: true}});
            })
        }
    },
    created () {
        let type = this.$route.params.type * 1;
        this.getAvailableButton()
        if (type === 0 || type === 2 || type === 3) {   // 正常人工指派
            this.computedDetailData(Object.assign({}, this.CarPerfect, this.ChoiceVehicie, this.ChoiceDriver));
            
        } else if (type === 1) {    // 展示详情页面
            this.orderGetOrderDetail();
            this.orderApprovalLog();
        };
    }
}
</script>
<style scoped lang="less">
    .warnning{
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