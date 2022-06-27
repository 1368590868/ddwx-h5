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
        @click="confirmOrderDispatch"
      >确认</van-button>
    </div>
  </div>
</template>
<script>
import {
  carPic,
  dispatchOrder,
} from '@/api/dispatch';
import { mapGetters } from 'vuex'
import platform from '@/view/mixins/platform'
import getDict from "@/view/mixins/getDict"
export default {
  name: 'ConfirmDistribute',
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
    // 确认创建人工派单按钮
    async confirmOrderDispatch() {
      this.confirmDistribute();
    },
    // 创建人工派单请求
    async confirmDistribute() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中..",
        forbidClick: true
      });
      let params = {
        ...this.orderDetail,
        id: '',
      };
      params.reqAssignments = this.orderDetail.reqAssignments.map(req => {
        return {
          id: req.id,
          status: req.status,
          driver: req.driver,
          driverId: req.driverCode,
          driverPhone: req.phone,
          beginMiles: req.startMiles,
          carNumber: req.carNumber,
          vinNumber: req.vinNumber,
        }
      })
      try {
        const res = await dispatchOrder(params)
        if (res?.code === 0) {
          await this.$store.dispatch('DispathOrder/removeReqAssignments');
          await this.$store.dispatch('DispathOrder/triggerFefresh', true);
          this.$router.push({
            name: 'DispatchOrderList',
          });
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
    // 去除空数组
    dealTreeListEmptyChildren(arr = []) {
      arr.forEach(item => {
        if (!item?.children?.length) {
          delete item.children;
        } else {
          this.dealTreeListEmptyChildren(item.children)
        }
      });
      return arr;
    },
    computedDetailData(detailData) {
      const {
        createType = "1",
        demandName: demand = "",
        demandCode,
        deptId,
        deptName,
        fromAddr,
        fromAreaId,
        hopeBrand,
        longDistanceTag,
        phone,
        reasonName: reason,
        reasonCode = "1",
        remark,
        reqAssignments = [],
        source = '1',
        timeLength,
        toAddr,
        toAreaIdd,
        unitCode,
        unitName,
        usageDate,
        usagePersons,
        usageTime,
        userName,
      } = detailData
      this.orderDetail = {
        createType,
        demand,
        demandCode,
        deptId,
        deptName,
        fromAddr,
        fromAreaId,
        hopeBrand,
        longDistanceTag,
        phone,
        reason,
        reasonCode,
        remark,
        reqAssignments,
        source,
        timeLength,
        toAddr,
        toAreaIdd,
        unitCode,
        unitName,
        usageDate,
        usagePersons,
        usageTime,
        userName,
      }
    },
  },
  async created() {
    // const { type, id } = this.$route.params;
    this.orderType = this.$route.query.orderType;
    this.handleSystemCardDict(this.dictIds);
    const orderDetail = {
      ...this.CarPerfect,
      // ...this.ChoiceVehicie,
      ...this.ChoiceDriver,
    }
    this.orderDetail = this.dealReqAssignments(orderDetail);
    this.computedDetailData(orderDetail);
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