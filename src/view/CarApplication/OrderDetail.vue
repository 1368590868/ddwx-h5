<template>
  <div class="container">
    <div class="wrapper">
      <div class="order-top">
        <span>订单号：{{orderDetail.reqNo}}</span>
        <van-tag
          size="large"
          round
          type="primary"
          :color="orderDetail.status | colors"
        >{{dictData.statusDict[orderDetail.status]}}</van-tag>
      </div>
      <div
        class="reject-box"
        v-if="orderDetail.status == 3"
      >
        <div class="reject-title">驳回原因：</div>
        <van-notice-bar
          :scrollable="orderDetail.auditDesc && orderDetail.auditDesc.length > 20"
          color="#2e2e2e"
          background="#fef9e9"
        >{{orderDetail.auditDesc || '未填写明确申请原因'}}</van-notice-bar>
      </div>
      <div
        class="reject-box"
        v-if="orderDetail.status == 6"
      >
        <div class="reject-title">取消原因：</div>
        <van-notice-bar
          :scrollable="orderDetail.closeReason && orderDetail.closeReason.length>20"
          color="#2e2e2e"
          background="#f2f7fc"
        >{{orderDetail.closeReason || '未填写明确取消原因'}}</van-notice-bar>
      </div>
      <!-- 以前的 0：待审批。1：审批中。2：已审批。3：已派车。4：已领单即已确认。5：已出车。6：待评价即已还车。7：办结。
             8：取消中。9：已取消、a：已封存b审批未通过、c：司机拒单, 增加了、b：审批未通过和c司机拒单状态。增加：d已确认 -->

      <!-- 现在的 "1": "待审核","2": "审核中","3": "已驳回","4": "待派单","5": "已派单","6": "已取消","7": "部分接单",
            "8": "已接单","9": "已出车","10": "已还车","11": "已确认" -->
      <!-- <div
        class="ChoiceVehicie"
        v-if="(orderDetail.stateCode>=3 && orderDetail.driverName !='') || (orderDetail.stateCode == 'd')"
      >
        <ul>
          <li><img :src="carPic+'?carModel='+orderDetail.brand+' '+orderDetail.cartype"></li>
          <li>
            <h3>{{orderDetail.sArrangedCar}}</h3>
            <p>{{orderDetail.brand}}</p>
            <p>司机：{{orderDetail.driverName}}<span
                @click="teleponeClick(orderDetail.dreverPhone)">{{orderDetail.dreverPhone}}</span></p>
          </li>
        </ul>
      </div> -->
      <div v-if="orderDetail.reqAssignments && orderDetail.reqAssignments.length > 0">
        <div
          class="ChoiceVehicie"
          v-for="(car, index) in orderDetail.reqAssignments"
          :key="car.carNumber + index"
        >
          <ul>
            <li><img :src="checkCarImagePath(car.carBrand, car.carSeries)" @click="handleImageClick(car)"></li>
            <li>
              <h3 class="link_h3" v-if="orderDetail.status===10 || orderDetail.status===11" @click="handleRouteClick(car)">{{car.carNumber}}</h3>
              <h3 v-else>{{car.carNumber}}</h3>
              <p>{{car.carBrand}} {{car.carSeries}}</p>
              <p>司机：{{car.driver.substr(0,1)}}师傅<span style="color:blue;" @click="teleponeClick(car.driverPhone)">{{car.driverPhone}}</span></p>
            </li>
          </ul>
        </div>
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
          <span>时间：</span><span>{{orderDetail.usageDate + `&nbsp;` + orderDetail.usageTime}}</span>
        </li>
      </ul>
      <ul class="info-box">
        <li class="info-label">
          <i class="font_family icon-icon-mine-24"></i>
          <span>申请人：</span><span>{{orderDetail.handleUserName}}</span>
        </li>
        <li class="info-label">
          <i class="font_family icon-icon-mine-24"></i>
          <span>乘车人：</span><span class="info-address">{{orderDetail.userName}}</span>
        </li>
        <li class="info-label">
          <i class="icon font_family icon-icon-contacts-20"></i>
          <span>电话：</span><span style="color:blue;" @click="teleponeClick(orderDetail.phone)">{{orderDetail.phone}}</span>
          
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
        <li class="info-label"><span>经办人：</span><span>{{orderDetail.handledUserManual}}</span></li>
        <li class="info-label"><span>经办人电话：</span><span>{{orderDetail.handledPhoneManual}}</span></li>
        <li class="info-label"><span>优先保障：</span><span :class="[dictData.guaranteeDict[orderDetail.guarantee] === '否'?'':'hight-red']">
          {{dictData.guaranteeDict[orderDetail.guarantee]}}</span></li>
        <li class="info-label"><span>用车事由：</span><span>{{orderDetail.reason}}</span></li>
        <li class="info-label"><span>用车需求：</span><span>{{orderDetail.demand}}</span></li>
        <li class="info-label"><span>用车时长：</span><span>{{orderDetail.timeLength}}小时</span></li>
        <li class="info-label"><span>是否长途：</span><span>{{orderDetail.longDistanceTag == '1' ? '是' : '否'}}</span></li>
        <li class="info-label"><span>期望车型：</span><span>{{dictData.hopeBrandDict[orderDetail.hopeBrand] }}</span></li>
        <!-- <template v-if="orderDetail.carType2!= ''">
          <li class="info-label"><span>实际车型：</span><span
              :class="orderDetail.carType2 === orderDetail.carType2 ? '':'warnning'"
            >{{orderDetail.carType2}}</span></li>
        </template> -->

        <li class="info-label"><span>乘车人数：</span><span>{{orderDetail.usagePersons}}人</span></li>
        <li class="info-label"><span>备注：</span><span class="info-address">{{orderDetail.remark || '暂无备注'}}</span></li>
      </ul>
      <!-- <template v-if="orderDetail.stateCode == 'd' || orderDetail.stateCode == 6 || orderDetail.stateCode == 7 ">
        <div class="log-title">行车信息</div>
        <ul class="info-text">
          <li class="info-label"><span>出车里程：</span><span>{{orderDetail.startMiles || 0}} 千米</span></li>
          <li class="info-label"><span>还车里程：</span><span>{{orderDetail.endMiles || 0}} 千米</span></li>
          <li class="info-label"><span>等待时长：</span><span>{{orderDetail.waitTime || 0}} 小时</span></li>
          <li class="info-label"><span>行程描述：</span><span
              class="info-address">{{orderDetail.itineraryDescription || '行程描述'}}</span></li>
        </ul>

      </template> -->
      <div class="operlog-box">
        <div class="log-title">审批日志</div>
        <ul class="log-container">
          <li
            class="log-li"
            v-for="logItem in approveLogList"
            :key="logItem.id"
          >
            <span class="log-time">{{logItem.createTime | timeAgo('{m}/{d} {h}:{i}')}}</span>
            <em class="log-cirle"></em>
            <span class="log-name">{{logItem.operator}}</span>
            <span class="log-status">{{logItem.sdesc}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 以前的 0：待审批。1：审批中。2：已审批。3：已派车。4：已领单即已确认。5：已出车。6：待评价即已还车。7：办结。
             8：取消中。9：已取消、a：已封存b审批未通过、c：司机拒单, 增加了、b：审批未通过和c司机拒单状态。增加：d已确认 -->

    <!-- 现在的 "1": "待审核","2": "审核中","3": "已驳回","4": "待派单","5": "已派单","6": "已取消","7": "部分接单",
            "8": "已接单","9": "已出车","10": "已还车","11": "已确认" -->
    <div
      class="button-box"
      v-if="[1,2,4].includes(orderDetail.status)"
    >
      <!-- 不需要用车时，在调度没有派车之前用车人可以取消用车单。 -->
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>
      <van-button
        block
        type="info"
        @click="isCancelVis=true"
      >取消订单</van-button>
    </div>
    <div
      class="form-button"
      v-else-if="orderDetail.status == 11"
    >
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>

    </div>
    <div
      class="button-box"
      v-else-if="orderDetail.status == 10"
    >
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>
      <van-button
        block
        type="info"
        @click="confirmUserCar"
      >确认用车</van-button>
    </div>
    <div
      class="form-button"
      v-else
    >
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>
    </div>
    <van-dialog
      title="是否取消订单"
      v-model="isCancelVis"
      show-cancel-button
      :beforeClose="CancelOrderChange"
    >
      <van-form ref="isCanceForm">
        <van-field
          class="form-textarea"
          v-model="closeReason"
          :rules="[{required: true}]"
          name="closeReason"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入取消原因"
          show-word-limit
        />
      </van-form>
    </van-dialog>

  </div>
</template>
<script>
import {
  orderRequestList,
  orderApprovalLog,
  orderCancelOrder,
  orderConfirmUserCar,
  vehicleInfoGetVehicleFile,
} from '@/api/order'
import getDict from "@/view/mixins/getDict"
import { carPic } from '@/api/dispatch';
import { mapGetters } from 'vuex'
import platform from '@/view/mixins/platform'
import checkCarImagePath from '@/utils/carPath'
import teleponeClick from '@/view/mixins/platform'

export default {
  mixins: [platform, getDict],
  computed: mapGetters(['userInfo']),
  data() {
    return {
      carPic,
      transferCar: false,
      isCancelVis: false, //  是否取消订单弹窗
      closeReason: '',   // 取消原因
      orderDetail: {},
      approveLogList: [],
      // 字典编号
      dictIds: {
        // 订单状态
        statusDict: '1522830760585670657',
        // 期望车型I
        hopeBrandDict: '101801',
        //优先保障
        guaranteeDict:'1679651627836055552',
      },
      dictData: {
        statusDict: '',
        hopeBrandDict: '',
        guaranteeDict:'',
      },
      checkCarImagePath,
    };
  },
  methods: {
    // 确认用车
    confirmUserCar() {
      let id = this.$route.params.id;
      this.dialogConfirm({ message: '是否要确认用车?' }, (action, doneCallback) => {
        if (action === 'confirm') {
          orderConfirmUserCar([{ id }]).then(({ data }) => {
            console.log("🚀 ~ file: OrderDetail.vue ~ line 308 ~ orderRequestList ~ orderDetail", data)
            this.$notify({
              type: 'success',
              message: '确认用车成功!'
            });
            // this.getOrderDetail();
            // this.orderApprovalLog();
            doneCallback();
            this.$store.dispatch('CarApplication/triggerFefresh', true);
            this.$router.push({
              name: 'OutstandOrder',
            })
          }).catch(() => {
            doneCallback();
          });
        } else {
          doneCallback();
        }
      });

    },
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = Object.fromEntries(res.map(item => [item.code, item.name]))
      }
    },
    // 获取订单详情
    async getOrderDetail() {
      const toast = this.$toast.loading({
        duration: 0,
        message: "加载中..",
        forbidClick: true
      });
      try {
        let id = this.$route.params.id;
        const { data: { list = [] } } = await orderRequestList({ id })
        const orderDetail = (list[0] ?? {}) || {};
        if (orderDetail.reqAssignments?.length > 0) {
          orderDetail.reqAssignments.forEach(async (item) => {
            item['carImage'] = await this.getCarImage(item.vinNumber)
          })
        }
        this.orderDetail = orderDetail;
      } catch (error) {

        alert("获取详情失败!");
      } finally {
        toast.clear()
      }
    },
    // 根据车架号获取图片
    async getCarImage(vinNumber = '') {
      let imgUrl = '';
      try {
        const { data: [img1 = ''] } = await vehicleInfoGetVehicleFile({ vinNumber });
        img1 ? imgUrl = process.env.VUE_APP_BASE_API + process.env.VUE_APP_AUTH_SERVER + "/minio/getPic?fileName=" + img1 : imgUrl
        return imgUrl
      } catch (error) {
        alert("获取车辆图片失败!");
      }
    },
    // 获取车辆审批日志
    orderApprovalLog() {
      let reqId = this.$route.params.id;
      orderApprovalLog({ reqId }).then(({ data }) => {
        this.approveLogList = data;
      }).catch(() => {
        alert("获取日志失败!");
      });
    },
    // 取消订单请求
    cancelOrder(done) {
      let id = this.$route.params.id;
      let closeReason = this.closeReason;
      const params = {
        id,
        closeReason,
      }
      orderCancelOrder([params]).then((data) => {
        if (data?.code === 0) {
          this.$notify({
            type: 'success',
            message: '取消成功!'
          });
          this.isCancelVis = "";
          this.getOrderDetail();
          this.orderApprovalLog();
        } else {
          this.$notify({
            type: 'warning',
            message: (data?.message ?? '取消失败，请重试!') || '取消失败，请重试!',
          });
        }
        done();
      }).catch(() => {
        done(false);
      });
    },
    // 点击弹出层的确定按钮 
    CancelOrderChange(action, done) {
      if (action === 'confirm') {
        this.$refs.isCanceForm.validate(['closeReason']).then((opt) => {
          this.cancelOrder(done);
        }).catch((err) => {   // 校验未通过
          done(false);
        });
      } else {
        done();
      }
    },
    // 复制按钮
    CopyOrderChange() {
      let id = this.$route.params.id;
      this.$router.push({
        name: 'StartApplying',
        params: { id: id }
      });
    },
    //跳转车辆3d显示页面
    handleImageClick(car){
      this.$router.push({
        name: 'Car3d',
        params:{
            carSeries:car.carSeries,
            carBrand:car.carBrand
          }
      })
    },
    //跳转行车轨迹界面
    handleRouteClick(car){
      this.$router.push({
        name: 'ArcgisMap',
        params:{
            carInfo:car,
        }
      })
    }
  },
  created() {
    this.$store.commit('removeThisPage', 'StartApplying');
    this.handleSystemCardDict(this.dictIds);
    this.orderApprovalLog();
    this.getOrderDetail();
  }
}
</script>
<style scoped lang="less">
.warnning {
  color: #e6a23c !important;
}
.order-top .van-tag{
    padding-left: 15px;
    padding-right: 15px;
} 
.link_h3 {
    color: #2893ff;
    text-decoration: underline;
}
.hight-red {
    color: red !important;
}
</style>
