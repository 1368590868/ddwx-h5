<template>
    <div class="apply-container container">
        <div class="wrapper">
            <div class="order-top">
                <span>订单号：{{orderDetail.reqNo}}</span>
                <van-tag size="large" round type="primary" :color="orderDetail.status | colors">{{orderDetail.status | checkStatus()}}</van-tag>
            </div>
            <!-- <div class="reject-box" v-if="orderDetail.stateCode == 'b'">
                <div class="reject-title">驳回原因：</div>
                <van-notice-bar :scrollable="orderDetail.auditDesc?orderDetail.auditDesc.length >20:false" color="#2e2e2e" background="#fef9e9">{{orderDetail.auditDesc || '未填写明确申请原因'}}</van-notice-bar>
            </div> -->
            <!-- <div class="reject-box" v-if="orderDetail.stateCode == '9'"> -->
            <div class="reject-box" v-if="orderDetail.status == '6'">
                <div class="reject-title">取消原因：</div>
                <van-notice-bar :scrollable="orderDetail.closeReason?orderDetail.closeReason.length>20:false" color="#2e2e2e" background="#f2f7fc">{{orderDetail.closeReason || '未填写明确取消原因'}}</van-notice-bar>
            </div>
            <div class="ChoiceVehicie">
                <ul>
                    <li><img :src="imagePath"></li>
                    <li>
                        <h3>{{orderDetail.carNumber}}</h3>
                        <p>{{orderDetail.carBrand}}</p>
                        <p>司机：{{orderDetail.driver}}<span @click="teleponeClick(orderDetail.dreverPhone)">{{orderDetail.driverPhone}}</span></p>
                    </li>
                </ul>
            </div>
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-location-20"></i>
                    <span>出发地：</span><span class="info-address">{{orderDetail.fromAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-destination-20"></i>
                    <span>目的地：</span><span class="info-address">{{orderDetail.toAddr}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-date-20"></i>
                    <span>时间：</span><span>{{orderDetail.usageDate}}&nbsp;{{orderDetail.usageTime}}</span>
                </li>
            </ul>
            <ul class="info-box">
                <li class="info-label">
                    <i class="font_family icon-icon-mine-24"></i>
                    <span>乘车人：</span><span>{{orderDetail.userName}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-contacts-20"></i>
                    <span>电话：</span><span><a style="color: ;" :href="'tel:'+orderDetail.phone"></a>{{orderDetail.phone}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-company-20"></i>
                    <span>单位：</span><span>{{orderDetail.unitName}}</span>
                </li>
                <li class="info-label">
                    <i class="icon font_family icon-icon-department-20"></i>
                    <span>部门：</span><span>{{orderDetail.deptName}}</span>
                </li>
            </ul>
            <ul class="info-text">
                <li class="info-label"><span>用车事由：</span><span>{{orderDetail.reason}}</span></li>
                <li class="info-label"><span>用车需求：</span><span>{{orderDetail.demand}}</span></li>
                <li class="info-label"><span>用车时长：</span><span>{{orderDetail.timeLength}}小时</span></li>
                <li class="info-label"><span>是否长途：</span><span>{{orderDetail.longDistanceTag===1?'是':'否'}}</span></li>
                <li class="info-label"><span>期望车型：</span><span>{{orderDetail.hopeBrand | checkCarType()}}</span></li>
                <!-- <template v-if="orderDetail.cartype!= ''">
                    <li class="info-label"><span>实际车型：</span><span :class="orderDetail.cartype === orderDetail.hopeCarType?'':'warnning'">{{orderDetail.cartype}}</span></li>
                </template> -->
                <li class="info-label"><span>乘车人数：</span><span>{{orderDetail.usagePersons}}人</span></li>
                <li class="info-label"><span>备注：</span><span class="info-address">{{orderDetail.remark || '暂无备注'}}</span></li>
            </ul>
            <!-- <template v-if="orderDetail.stateCode == 'd' || orderDetail.stateCode == 6 || orderDetail.stateCode == 7 "> -->
            <template>
                <div class="log-title">行车信息</div>
                <ul class="info-text">
                    <li class="info-label"><span>出车里程：</span><span>{{orderDetail.beginMiles || 0}} 千米</span></li>
                    <li class="info-label"><span>还车里程：</span><span>{{orderDetail.endMiles || 0}} 千米</span></li>
                    <li class="info-label"><span>等待时长：</span><span>{{orderDetail.waitTimes || 0}} 小时</span></li>
                    <li class="info-label"><span>行程描述：</span><span class="info-address">{{orderDetail.itinerayDescription || '暂无描述'}}</span></li>
                </ul>
            </template>
            <div class="operlog-box">
                <div class="log-title">审批日志</div>
                <ul class="log-container">
                    <li class="log-li" v-for="(logItem, logIndex) in apprlogList" :key="logIndex">
                        <span class="log-time">{{logItem.createTime | timeAgo('{m}/{d} {h}:{i}')}}</span>
                        <em class="log-cirle"></em>
                        <span class="log-name">{{logItem.operator}}</span>
                        <span class="log-status">{{logItem.sdesc}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="form-button" v-if="orderDetail.stateCode == 3"> -->
        <div class="button-box" v-if="orderDetail.status == '1'">
            <van-button block type="default"  @click="drivingRefause">拒绝接单</van-button>
            <van-button block type="info" @click="drivingCconfirmReceipt">确认接单</van-button>
        </div>
        <!-- <div class="form-button" v-else-if="orderDetail.stateCode == 4"> -->
        <div class="form-button" v-else-if="orderDetail.status == '2'">
            <van-button block type="info" @click="dispatchCar=true">确认出车</van-button>
        </div>
        <!-- <div class="button-box" v-else-if="orderDetail.stateCode == 5"> -->
        <div class="button-box" v-else-if="orderDetail.status == '4'">
            <van-button block type="default" @click="drivingPickupReminder">接车提醒</van-button>
            <van-button block type="info"  @click="handleTransferCarClick()">确认还车</van-button>
        </div>

        <van-popup v-model="dispatchCar" position="bottom"  @close="handleDispatchClose()">    
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="drivingConfirmDriving">
                <van-field label="出车里程：" center readonly>
                    <template #input>
                        <span style="color:red;">{{orderDetail.beginMiles || 0}}</span>
                        <span style="margin-left:10px;">千米</span>
                    </template>
                </van-field>
                <van-field label="" center readonly style="padding-left:10px">
                    <template #input>
                        <van-icon name="info-o" class="warnning"/>
                        <p style="margin-left:5px;">出车里程和表显里程不符？<a href="javascript:void(0)" @click="handleCatchClick()" style="color:#1890ff;text-decoration:underline;">异常报告</a></p>
                    </template>
                </van-field>
                <div v-show="isShowCatch">
                    <van-field label="异常原因：" :required="isShowCatch"  class="form-textarea" v-model="dispatchCarData.message" name="message" rows="1" autosize type="textarea" maxlength="200" placeholder="请输入异常原因" show-word-limit :rules="[{ required: isShowCatch}]"/>
                    <van-field :label="'拍照上传\u3000\n表显里程：'"  :required="isShowCatch" :rules="[{ required: false }, {validator: validateImageUrl,message: '请上传表显里程照片!'}]">
                        <template #input>
                            <van-uploader 
                                v-model="dispatchFileList"
                                :after-read="afterReadDispatch"
                                :max-count="1"
                                :before-read="beforeRead"
                                @delete="handleDispatchImageDelete()"
                                capture
                                />
                        </template>
                    </van-field>
                </div>
                <div class="form-button">
                    <van-button block type="info" native-type="submit">确认出车</van-button>
                </div>
            </van-form>
        </van-popup>
        
        <van-popup v-model="transferCar" position="bottom" @close="handleTransferClose()">    
            <van-form class="form-scroll" validate-first @failed="onFailed" @submit="drivingreturnCar">
                <van-field type="digit" required label="出车里程：" center v-model="transferCarData.beginMiles" :disabled="true" :rules="[{ required: true }, {validator: asyncValidate, message: '还车里程必须大于出车里程!'}]" name="beginMiles">
                    <template #extra><span>千米</span></template>
                </van-field>
                <van-field type="digit" required label="还车里程：" center v-model="transferCarData.endMiles" placeholder="请输入当前表显里程数" :rules="[{ required: true }, {validator: asyncValidate, message: '还车里程必须大于出车里程!'}]" name="endMiles">
                    <template #extra><span>千米</span></template>
                </van-field>
                <van-field type="digit" required label="等待时长：" center v-model="transferCarData.waitTimes" placeholder="请输入当前等待时长数" :rules="[{ required: true}]" name="waitTimes">
                    <template #extra><span>小时</span></template>
                </van-field>
                <van-field type="digit" required label="路桥费：" center v-model="transferCarData.etcCost" placeholder="请输入路桥费" :rules="[{ required: true}]" name="etcCost">
                    <template #extra><span>元</span></template>
                </van-field>
                <van-field type="digit" required label="加油费：" center v-model="transferCarData.oilCost" placeholder="请输入加油费" :rules="[{ required: true}]" name="oilCost">
                    <template #extra><span>元</span></template>
                </van-field>
                <van-field type="digit" required label="其他费：" center v-model="transferCarData.otherCost" placeholder="请输入其他费" :rules="[{ required: true}]" name="otherCost">
                    <template #extra><span>元</span></template>
                </van-field>
                <van-field type="digit" required label="停车费：" center v-model="transferCarData.parkCost" placeholder="请输入停车费" :rules="[{ required: true}]" name="parkCost">
                    <template #extra><span>元</span></template>
                </van-field>
                <van-field label="行程描述：" class="form-textarea" v-model="transferCarData.remark" name="remark" rows="1" autosize type="textarea" maxlength="50" placeholder="请输入行程描述" show-word-limit />
                <van-field :label="'还车里程\u3000\n拍照上传：'"  readonly>
                    <template #input>
                        <van-uploader 
                            v-model="transferFileList"
                            :after-read="afterReadTransfer"
                            :max-count="1"
                            :before-read="beforeRead"
                            @delete ="handleTransferImageDelete()"
                            capture
                            />
                    </template>
                </van-field>
                <div class="form-button">
                    <van-button block type="info" native-type="submit">确认还车</van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>
<script>
import {gcywVehicleRequestLogList} from '@/api/order'
import {getListByParentId} from '@/api/dict'
import {drivingDrivingList} from '@/api/driving'
import {gcywVehicleRequesTakeOrder,
        gcywVehicleRequesDriving, 
        gcywVehicleRequesRemind, 
        gcywVehicleRequesReturning,
        checkDriving,
        gcywVehicleRequesCancelOrder,
        minioUpload} from '@/api/driving'
import platform from '@/view/mixins/platform'
import checkCarImagePath from '@/utils/carPath'

let that;
export default {
    mixins: [platform],

    beforeCreate() {
        that = this
    },
    data (){
        return {
            imagePath:"",
            transferCar: false, // 确认还车
            dispatchCar:false,  //确认出车
            orderDetail: {},
            apprlogList: [],
            carTypeOptions:[],

            transferCarData: {
                beginMiles: '0',    //出车里程 ,
                endMiles: '0',      //还车里程 ,
                waitTimes: '0',     //等待时长 ,
                etcCost:"0",        //路桥费
                oilCost:"0",        //加油费
                otherCost:"0",      //其他费
                parkCost:"0",       //停车费
                remark: '',         //行程描述 ,
                imageUrl:'',        //还车里程拍照上传
                images:[]
            },
            dispatchCarData:{
                message:"",         //异常原因
                imageUrl:"",
                images:[]
            },
            isShowCatch:false,
            transferFileList:[],
            dispatchFileList:[]
        };
    },
    methods: {
        asyncValidate () {
            let endMiles = this.transferCarData.endMiles*1;
            let beginMiles = this.transferCarData.beginMiles*1;
            return endMiles > beginMiles;
        },
        validateImageUrl () {
            if(this.isShowCatch){
                 if(this.dispatchCarData.images.length>0){
                    return true;
                }else{
                    return false;
                }
            }
            return true;
        },
        onFailed (){},

        //获取车型字典
        dictGetModelType () {
            getListByParentId("101801").then(({data}) => {
                this.carTypeOptions = data;
            }).catch((err) => {
                
            })
        },
        //获取订单详情
        orderGetOrderDetail() {
            let id = this.$route.params.autoId;
            drivingDrivingList({assignmentId:id}).then(({data}) => {
                this.orderDetail = data.list[0];
                this.imagePath = checkCarImagePath(this.orderDetail.carBrand,this.orderDetail.carSeries);
            }).catch(() => {
                
            });
        },
        //获取日志信息
        orderApprovalLog () {
            let id = this.$route.params.autoId;
            gcywVehicleRequestLogList({reqId:id}).then(({data}) => {
                this.apprlogList = data;
            }).catch(() => {
                
            });;
        },
        //接单
        drivingCconfirmReceipt() { 
            this.dialogConfirm({message: '是否要确认接单?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    gcywVehicleRequesTakeOrder({assignmentId:this.orderDetail.assignmentId}).then((data) => {
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
            }).catch((err) => {
                
            })
        },
        //拒绝
        drivingRefause(){  
            this.dialogConfirm({message: '是否要拒绝接单?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    gcywVehicleRequesCancelOrder({assignmentId:this.orderDetail.assignmentId}).then((data) => {
                        this.$notify({type: 'success',message: '拒绝接单成功!'});
                        this.orderGetOrderDetail();
                        this.orderApprovalLog();
                        doneCallback();
                    }).catch(() => {
                        doneCallback();
                        alert("拒绝接单失败!");
                    });
                } else {
                    doneCallback();
                }
            }).catch((err) => {
                
            })
        },
        //出车
        async drivingConfirmDriving() {  
            let checkResult = await this.checkDriving({vinNumber:this.orderDetail.vinNumber});

            if(checkResult){
                this.dialogConfirm({message: '是否要确认出车?'}, (action, doneCallback) => {
                    if (action === 'confirm') {
                        gcywVehicleRequesDriving(Object.assign({}, this.dispatchCarData,{id:this.orderDetail.assignmentId})).then((data) => {
                            this.$notify({type: 'success', message: '确认出车成功!'});
                            this.orderGetOrderDetail();
                            this.orderApprovalLog();
                            this.dispatchCar = false;
                            doneCallback();
                        }).catch(() => {
                            alert("确认出车失败!");
                            this.dispatchCar = false;
                            doneCallback();
                        });
                    } else {
                        doneCallback();
                    };
                }).catch((err) => {
                    
                })
            }
        },
        //接车提醒
        drivingPickupReminder() {     
            this.dialogConfirm({message: '是否要接车提醒?'}, (action, doneCallback) => {
                if (action === 'confirm') {
                    gcywVehicleRequesRemind({assignmentId:this.orderDetail.assignmentId}).then((data) => {
                        this.$notify({type: 'success',message: '接车提醒成功!'});
                        doneCallback();
                    }).catch(() => {
                        alert("接车提醒失败!");
                        doneCallback();
                    });
                } else {
                    doneCallback();
                };
            }).catch((err) => {
                
            })
        },
        //还车
        drivingreturnCar () {   
            this.$dialog.confirm({
                    message:'还车里程为'+this.transferCarData.endMiles+'，是否正确？',
                    confirmButtonText:'是',
                    cancelButtonText:'否'}).then(()=>{
                let toast = this.$toast.loading({
                    duration: 0,
                    message: "还车中..",
                    forbidClick: true
                });
                gcywVehicleRequesReturning(Object.assign({}, this.transferCarData,{id:this.orderDetail.assignmentId})).then(({data}) => {
                    this.transferCar = false;
                    toast.clear();
                    this.$router.push({
                        name: 'DriSuccess',
                        params: {autoId: this.$route.params.autoId}
                    });
                }).catch((err)=>{
                    this.transferCar = false;
                    this.$toast.fail("提交失败!");
                });
            }).catch(()=>{

            })
        },
        //确认还车点击回调
        handleTransferCarClick(){
            this.transferCar = true;
            if (!!this.orderDetail.beginMiles) {
                this.transferCarData.beginMiles = this.orderDetail.beginMiles;
            }
        },
        //图片上传前
        beforeRead(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isPNG) {
                this.$notify({
                    type: 'warning',
                    message: '上传图片只能是 JPG 或 PNG 格式!',
                });
                return false;
            }
            if (!isLt2M) {
                this.$notify({
                    type: 'warning',
                    message: '上传图片大小不能超过 2MB!',
                });
                return false;
            }
            return true;
        },
         //校验通过图片上传
        afterReadTransfer(file){
            let formData = new FormData();
            formData.append("file", file.file);
            formData.append("type","4");
            
            this.transferFileList[0].status = 'uploading';
            this.transferFileList[0].message = '上传中...';

            minioUpload(formData).then(({data}) => {
                this.$notify({
                    type: 'success',
                    message: "上传图片成功"
                });
                this.transferFileList[0].status = '';
                this.transferFileList[0].message = '';
                this.transferFileList[0].url = data.url;

                this.transferCarData.imageUrl = data.url;
                this.transferCarData.images[0] = data;
            }).catch((err) => {
                this.$notify({
                    type: 'warning',
                    message: "上传图片失败"
                });
            })
        },
        afterReadDispatch(file){
            let formData = new FormData();
            formData.append("file", file.file);
            formData.append("type","3");
            
            this.dispatchFileList[0].status = 'uploading';
            this.dispatchFileList[0].message = '上传中...';

            minioUpload(formData).then(({data}) => {
                this.$notify({
                    type: 'success',
                    message: "上传图片成功"
                });
                this.dispatchFileList[0].status = '';
                this.dispatchFileList[0].message = '';
                this.dispatchFileList[0].url = data.url;

                this.dispatchCarData.imageUrl = data.url;
                this.dispatchCarData.images[0] = data;
            }).catch((err) => {
                this.$notify({
                    type: 'warning',
                    message: "上传图片失败"
                });
            })
        },
        handleTransferImageDelete(){
            this.transferCarData.imageUrl = "";
            this.transferCarData.images.splice(0, 1);
        },
        handleDispatchImageDelete(){
            this.dispatchCarData.imageUrl = "";
            this.dispatchCarData.images.splice(0, 1);
        },
        handleTransferClose(){
            this.transferCarData = this.$options.data.call(this).transferCarData; 
            this.transferFileList = [];
        },
        handleDispatchClose(){
            this.isShowCatch = false;
            this.dispatchCarData = this.$options.data.call(this).dispatchCarData;
            this.dispatchFileList = [];
        },
        //异常报告点击
        handleCatchClick(){
            this.isShowCatch = !this.isShowCatch
        },
       
        checkDriving(params){
          return new Promise((resolve,reject)=>{
            checkDriving(params).then(({data})=>{
                resolve(data)
            })
          })    
        }
    },
    filters:{
        checkStatus(status){
            let msg = "";
            switch (status) {
                case '1':
                    msg= "待接单"
                    break
                case '2':
                    msg="待出车"
                    break
                case '3':
                    msg="拒绝接单"
                    break
                case '4':
                    msg="已出车"
                    break
                case '5':
                    msg="已还车"
                    break
                case '6':
                    msg="转派"
                    break
                case '7':
                    msg="已确认"
                    break
                case '8':
                    msg="拒绝再派单"
                    break
                default:
                    break
            }
            return msg;
        },
        //期望车型
        checkCarType(hopeBrand){
            let obj =  that.carTypeOptions.find((item) => {
                return item.code === hopeBrand;
            })
            return obj ? obj.name:"";
        }
    },
    created () {
        this.orderGetOrderDetail();
        this.dictGetModelType();
        this.orderApprovalLog();
    }
}
</script>
<style scoped lang="less">
.warnning{
    color:#E6A23C !important
}
.log-status{
    font-size: 12px;
}
.van-cell--required::before{
    left:15px;
}
</style>