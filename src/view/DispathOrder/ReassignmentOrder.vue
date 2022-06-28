<template>
  <div class="apply-container container">
    <!-- 确认改派 -->
    <AllOrderDetail
      :order-detail="orderDetail"
      :approve-log-list="approveLogList"
      :dict-data="dictData"
      :is-show-operate-car="true"
      @reselect="reselect"
      @deleteCar="deleteCar"
    />
    <div class="button-box">
      <van-button
        block
        type="default"
        @click="addCar"
      >添加车辆</van-button>
      <van-button
        block
        type="info"
        @click="dispatchReassignment"
      >确认</van-button>
    </div>
  </div>
</template>
<script>
import {
  gcywVehicleRequestDispatchList,
} from '@/api/order';
import {
  carPic,
  reassignment,
} from '@/api/dispatch';
import { mapGetters } from 'vuex'
import platform from '@/view/mixins/platform'
import getDict from "@/view/mixins/getDict"
export default {
  name: 'ReassignmentOrder',
  mixins: [platform, getDict],
  data() {
    return {
      carPic,
      orderDetail: {},
      approveLogList: [],
      type: '',
      // 字典编号
      dictIds: {
        // 订单状态
        statusDict: '1522830760585670657',
        // 期望车型I
        hopeBrandDict: '101801'
      },
      dictData: {
        statusDict: '',
        hopeBrandDict: '',
      },
      // 订单类型，订单来源
      orderType: '',
      oldReqAssignments: [],
    };
  },
  computed: {
    ...mapGetters('DispathOrder', ['ChoiceVehicie', 'ChoiceDriver', 'CarPerfect']),
    ...mapGetters(['userInfo', 'reqAssignments']),
  },
  methods: {
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = Object.fromEntries(res.map(item => [item.code, item.name]))
      }
    },
    // 获取订单详情
    async getOrderDetail() {
      let id = this.$route.params.id;
      gcywVehicleRequestDispatchList({ id }).then(({ data: { list = [] } }) => {
        const orderDetail = (list[0] ?? {}) || {};
        this.oldReqAssignments = [...orderDetail.reqAssignments]
        this.orderDetail = this.dealReqAssignments(orderDetail) || {};
      });
    },
    // 添加车辆按钮
    addCar() {
      const { unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      const { id, type } = this.$route.params
      const reqAssignmentsIndex = this.reqAssignments.length;
      this.$router.push({
        name: 'DispatchVehicle',
        params: { id, type },
        query: {
          reqAssignmentsIndex,
          id,
          unitCode,
          deptId,
          reassignUnitCode,
          usageDate,
        }
      });
    },
    // 改派
    async dispatchReassignment() {   // 已审批 派单
      let toast = this.$toast.loading({
        duration: 0,
        message: "派单中..",
        forbidClick: true
      });
      const params = {
        status: this.orderDetail.status,
        fromAddr: this.orderDetail.fromAddr,
        toAddr: this.orderDetail.toAddr,
        id: this.orderDetail.id,
        phone: this.orderDetail.phone,
        createType: this.orderDetail.createType,
        usageDate: this.orderDetail.usageDate,
        usageTime: this.orderDetail.usageTime,
        handleUserId: this.orderDetail.handleUserId,
        handleUserName: this.orderDetail.handleUserName,
        handleUnit: this.orderDetail.handleUnit,
        handleUnitCode: this.orderDetail.handleUnitCode,
        reqAssignments: [],
      };
      let reqAssignments = []
      if (this.oldReqAssignments.length) {
        reqAssignments = this.oldReqAssignments.map(item => {
          return {
            beginMiles: item.beginMiles || '',
            carNumber: item.carNumber || '',
            driver: item.driver || '',
            driverId: item.driverId || '',
            driverPhone: item.driverPhone || '',
            id: item.id || '',
            vinNumber: item.vinNumber || '',
            restatus:  1,
          }
        })
      }
      params.reqAssignments = this.orderDetail.reqAssignments.map(req => {
        return {
          id: req.id,
          restatus: req.restatus,
          driver: req.driver,
          driverId: req.driverCode,
          driverPhone: req.phone,
          beginMiles: req.startMiles,
          carNumber: req.carNumber,
          vinNumber: req.vinNumber,
        }
      });
      params.reqAssignments = [
        ...params.reqAssignments,
        ...reqAssignments
      ]
      try {
        const res = await reassignment(params)
        if (res?.code === 0) {
          this.$store.dispatch('DispathOrder/removeReqAssignments').then(() => {
            this.$router.push({ name: 'DispathSuccess', params: { id: this.orderDetail.id } });
          })
        } else {
          this.$toast.fail(res?.message || "派单失败!，请重试");
        }
      } catch (error) {
        this.$toast.fail("派单失败!，请重试");
      } finally {
        toast.clear();
      }
    },
    // 处理选中的数据与详情结合起来 
    dealReqAssignments(detail) {
      const reqAssignments = this.reqAssignments.map(item => {
        return {
          ...item.driverInfo,
          ...item.carInfo,
        }
      })
      detail['reqAssignments'] = reqAssignments;
      return detail;
    },
    // 重新选择
    reselect(index) {
      this.$emit('reselect', index);
      const { id, unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      this.$router.push({
        name: 'DispatchVehicle',
        params: { type: '0', id, },
        query: {
          reqAssignmentsIndex: index,
          id,
          unitCode,
          deptId,
          reassignUnitCode,
          usageDate,
        }
      });
    },
    // 删除车辆
    deleteCar(index) {
      this.$store.dispatch('DispathOrder/deleteReqAssignmentsItem', index).then(() => {
        this.orderDetail = this.dealReqAssignments(this.orderDetail) || {};
      })
    },
  },
  async created() {
    // const { type, id } = this.$route.params;
    this.orderType = this.$route.query.orderType;
    this.handleSystemCardDict(this.dictIds);
    this.getOrderDetail()
  },
}
</script>
<style scoped lang="less">
.warnning {
  color: #e6a23c !important;
}
.ChoiceVehicie {
  width: 100%;
  height: 98px;
  ul {
    width: 100%;
    height: 98px;
    border-bottom: 1px solid #f0f0f0;
    li {
      float: left;
      margin-left: 14px;
      img {
        width: 98px;
        height: 98px;
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
}
.CancelOrder {
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
  .button-box-image {
    width: 25%;
    border-right: 1px solid #ccc;
    .text {
      text-align: center;
      font-size: 12px;
      color: #2e2e2e;
    }
  }
  .button-box-image:nth-child(2) {
    border-right: 0px;
  }
}
</style>