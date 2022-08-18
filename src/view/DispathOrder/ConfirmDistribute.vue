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
      >确认派单</van-button>
    </div>

    <!-- <van-popup
      v-model="assigneeShow"
      position="bottom"
    >
      <van-cascader
        v-model="assignee"
        title="请选择审批人"
        :options="assigneeList"
        :field-names="fieldNames"
        @close="assigneeShow = false"
        @finish="onFinish"
      />
    </van-popup> -->
  </div>
</template>
<script>
import {
  gcywVehicleRequestDispatchList,
  orderApprovalLog,
  activitiAssigneeListByType,
} from '@/api/order';
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
      // 是否显示选择审批人
      assigneeShow: false,
      assignee: '',
      //工作流数据
      assigneeList: [],
      //定义工作流取值字段名称
      fieldNames: {
        text: 'name',
        value: 'code',
        children: 'children',
      },
      type: '',
      // 字典编号
      dictIds: {
        // 订单状态
        statusDict: '1522830760585670657',
        // 期望车型I
        hopeBrandDict: '101801'
      },
      procDefId: '',
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
    // 获取订单详情 
    async getOrderDetail() {
      let id = this.$route.params.id;
      gcywVehicleRequestDispatchList({ id }).then(({ data: { list = [] } }) => {
        let orderDetail = (list[0] ?? {}) || {};
        this.orderDetail = this.dealReqAssignments(orderDetail) || {};
        console.log(this.orderDetail)
      });
    },
    // 获取车辆审批日志
    orderApprovalLog() {
      let reqId = this.$route.params.id;
      orderApprovalLog({ reqId }).then(({ data }) => {
        this.approveLogList = data;
      });
    },
    // 添加车辆按钮
    addCar() {
      // const { unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      const { id, type } = this.$route.params
      const reqAssignmentsIndex = this.reqAssignments.length;
      console.log(reqAssignmentsIndex)
      this.$router.push({
        name: 'DispatchVehicle',
        params: { id, type },
        query: {
          ...this.$route.query,
          reqAssignmentsIndex,
        }
      });
    },
    //全部选项选择完毕后
    // onFinish({ selectedOptions }) {
    //   let obj = selectedOptions[selectedOptions.length - 1];
    //   if (obj.type === "5") {
    //     this.assigneeShow = false;
    //     this.assignee = obj.code;
    //     this.confirmDistribute();
    //   } else {
    //     this.$notify({
    //       type: 'warning',
    //       message: '请选择审批人!',
    //     });
    //   }
    // },
    // 确认派单按钮
    async confirmOrderDispatch() {
      // const { data = {} } = activitiAssigneeListByType({ type: '用车审批' })
      // if (!data.procDefId) {
      //   this.confirmDistribute();
      //   return;
      // }
      // this.procDefId = data.procDefId;
      // if (data?.assignee) {
      //   this.assignee = data.assignee;
      //   this.confirmDistribute();
      //   return
      // }
      // this.assigneeList = this.dealTreeListEmptyChildren(data.assigneeList);
      // this.assigneeShow = true;
      this.confirmDistribute()
    },
    // 派单请求
    async confirmDistribute() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中..",
        forbidClick: true
      });
      let id = this.$route.params.id || this.orderDetail.id
      let params = {
        status: this.orderDetail.status,
        id,
        phone: this.orderDetail.phone,
        createType: this.orderDetail.createType,
        usageDate: this.orderDetail.usageDate,
        usageTime: this.orderDetail.usageTime,
        handleUserId: this.orderDetail.handleUserId,
        handleUserName: this.orderDetail.handleUserName,
        handleUnit: this.orderDetail.handleUnit,
        handleUnitCode: this.orderDetail.handleUnitCode,
        fromAddr: this.orderDetail.fromAddr,
        toAddr: this.orderDetail.toAddr,
        reqAssignments: [],
        procDefId: '',
      };
      params.reqAssignments = this.orderDetail.reqAssignments.map(req => {
        return {
          id: req.id,
          restatus: req.restatus || '',
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
      // const { id, unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      this.$router.push({
        name: 'DispatchVehicle',
        // 正常派单 type: 1
        params: this.$route.params,
        query: {
          ...this.$route.query,
          reqAssignmentsIndex: index,
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
  },
  created() {
    this.orderType = this.$route.query.orderType;
    this.handleSystemCardDict(this.dictIds);
    // 列表进入详情页
    // 展示详情页面
    this.getOrderDetail();
    this.orderApprovalLog();
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