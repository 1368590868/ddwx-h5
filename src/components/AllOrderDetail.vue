<template>
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

          <li><img :src="car.carImage || defaultCarImage"></li>
          <li>
            <h3>{{car.carNumber}}</h3>
            <p>{{car.carBrand}}</p>
            <p>司机：{{car.driver}}<span><a :href="`tel:${car.driverPhone}`">{{car.driverPhone}}</a></span></p>
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
        <span>乘车人：</span><span>{{orderDetail.userName}}</span>
      </li>
      <li class="info-label">
        <i class="icon font_family icon-icon-contacts-20"></i>
        <span>电话：</span><span><a :href="`tel:${orderDetail.phone}`">{{orderDetail.phone}}</a></span>
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
</template>

<script>
import defaultCarImage from '@/assets/img/car.jpg'
export default {
  name: 'AllOrderDetail',
  components: {

  },
  filters: {

  },
  props: {
    orderDetail: {
      type: Object,
      default() {
        return {}
      },
    },
    approveLogList: {
      type: Array,
      default() {
        return []
      },
    },
    dictData: {
      type: Object,
      default() {
        return {}
      },
    }
  },
  data() {
    return {
      // 默认车图片
      defaultCarImage,
    };
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style scoped lang="scss">
</style>
