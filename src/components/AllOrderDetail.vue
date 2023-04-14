<template>
  <div class="wrapper">
    <div class="order-top">
      <span>订单号：{{orderDetail.reqNo}}</span>
      <van-tag
        v-if="orderDetail.status"
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
        :scrollable="orderDetail.auditComment && orderDetail.auditComment.length > 20"
        color="#2e2e2e"
        background="#fef9e9"
      >{{orderDetail.auditComment || '未填写明确申请原因'}}</van-notice-bar>
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
        class="carInfo"
        v-for="(car, index) in orderDetail.reqAssignments"
        :key="car.carNumber + index"
      >
        <ul>
          <li><img :src="checkCarImagePath(car.carBrand, car.carSeries)" @click="handleImageClick(car)"></li>
          <li>
            <h3 class="link_h3" v-if="orderDetail.status===10 || orderDetail.status===11" @click="handleRouteClick(car)">{{car.carNumber}}</h3>
            <h3 v-else>{{car.carNumber}}</h3>
            <p>{{car.carBrand}} {{car.carSeries}}</p>
            <p>司机：{{car.driver}}<span style="color:blue;" @click="teleponeClick(car.driverPhone || car.phone)"></span></p>
          </li>
        </ul>
        <div
          class="button-area"
          v-if="isShowOperateCar"
        >
          <van-button
            round
            type="default"
            size="small"
            class="car-item-button"
            @click="reselect(index)"
          >
            重新选择
          </van-button>
          <van-button
            round
            v-show="orderDetail.reqAssignments.length > 1"
            type="danger"
            size="small"
            class="car-item-button"
            @click="deleteCar(index)"
          >
            删除车辆
          </van-button>
        </div>
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
        <span>时间：</span><span>{{orderDetail.usageDate || ''}}&nbsp;{{orderDetail.usageTime || ''}}</span>
      </li>
    </ul>
    <ul class="info-box">
      <li class="info-label">
        <i class="font_family icon-icon-mine-24"></i>
        <span>申请人：</span><span>{{orderDetail.handleUserName}}</span>
      </li>
      <li class="info-label">
        <i class="font_family icon-icon-mine-24"></i>
        <span>乘车人：</span><span>{{orderDetail.userName}}</span>
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
      <li class="info-label"><span>转派信息：</span><span>{{orderDetail.reassignStr | formatReassignStr }}</span></li>
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
    <div
      class="operlog-box"
      v-if="approveLogList.length"
    >
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
import checkCarImagePath from '@/utils/carPath'
import teleponeClick from '@/view/mixins/platform'
import platform from '@/view/mixins/platform'
export default {
  mixins: [platform],
  name: 'AllOrderDetail',
  components: {

  },
  filters: {
    formatReassignStr(reassignStr = '') {
      let str = reassignStr;
      if (reassignStr === 0 || reassignStr === '0') {
        str = '转入'
      }
      if (reassignStr === 1 || reassignStr == '1') {
        str = '转出'
      }
      return str
    }
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
    },
    isShowOperateCar: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      checkCarImagePath,
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
    // 重新选择
    reselect(index) {
      this.$emit('reselect', index)
    },
    // 删除车辆
    deleteCar(index) {
      this.$emit('deleteCar', index)
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
};
</script>

<style scoped lang="less">
.carInfo {
  width: 100%;
  // height: 98px;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  ul {
    width: 100%;
    // height: 98px;
    li {
      float: left;
      margin-left: 14px;
      margin-bottom: 5px;
      img {
        width: 98px;
        height: 93px;
      }
      h3 {
        margin-top: 10px;
      }
      p:nth-child(2) {
        line-height: 30px;
        font-size: 14px;
      }
      p:nth-child(3) {
        line-height: 30px;
        font-size: 14px;
        span {
          margin-left: 10px;
          color: #2893ff;
        }
      }
    }
  }
  .button-area {
    padding: 2px 10px 2px 118px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
}
.order-top .van-tag{
    padding-left: 15px;
    padding-right: 15px;
} 
.link_h3 {
    color: #2893ff;
    text-decoration: underline;
}
</style>
