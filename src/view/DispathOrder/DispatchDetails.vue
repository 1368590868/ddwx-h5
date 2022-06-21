<template>
  <div class="apply-container container">
    <!-- <van-nav-bar title="订单详情" left-arrow @click-left="$router.back()" /> -->
    <AllOrderDetail
      :order-detail="orderDetail"
      :approve-log-list="approveLogList"
      :dict-data="dictData"
      :is-show-operate-car="$route.params.type === 0 || $route.params.type === 2 || $route.params.type === 3"
      @reselect="reselect"
      @deleteCar="deleteCar"
    />
    <!-- <div class="form-button" v-if="userInfo.loginName != orderDetail.sOperator && (orderDetail.state === '已派车' || orderDetail.state === '已领单' || orderDetail.state === '已出车')">
            <van-button block type="default" @click="cancelOrderButton">取消订单</van-button>
        </div>
         -->
    <!-- 新增或者复制订单过来的数据 -->
    <div
      class="button-box"
      v-if="$route.params.type == 0 || $route.params.type == 2"
    >
      <!-- <van-button
        block
        type="default"
        @click="returnDetails"
      >重新选择</van-button> -->
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
    <div
      class="button-box"
      v-if="$route.params.type == 3"
    >
      <van-button
        block
        type="default"
        @click="addCar"
      >添加车辆</van-button>
      <van-button
        block
        type="info"
        @click="dispatchReassignment"
      >确认改派</van-button>
    </div>
    <!-- 调度详情过来的 -->
    <!-- 以前的 0：待审批。1：审批中。2：已审批。3：已派车。4：已领单即已确认。5：已出车。6：待评价即已还车。7：办结。
             8：取消中。9：已取消、a：已封存b审批未通过、c：司机拒单, 增加了、b：审批未通过和c司机拒单状态。增加：d已确认 -->

    <!-- 现在的 "1": "待审核","2": "审核中","3": "已驳回","4": "待派单","5": "已派单","6": "已取消","7": "部分接单",
            "8": "已接单","9": "已出车","10": "已还车","11": "已确认" -->
    <div
      class="button-box"
      v-if="$route.params.type == 1 && orderType == 'dispatch' && (orderDetail.reassignStatus === '否' || [3].includes(orderDetail.status) )"
    >
      <!-- 待派单  非转派/驳回    显示派单、转派、取消 -->
      <div class="button-box-image" v-if="orderDetail.status != 6">
        <van-image
          width="100%"
          height="20px"
          :src="quxiao"
          @click="cancelOrderButton"
        />
        <div class="text">
          取消订单
        </div>
      </div>
      <van-button
        block
        type="info"
        @click="distribute"
      >
        派单
      </van-button>
      <van-button
        block
        type="info"
        @click="reDispatch"
      >
        转派
      </van-button>
    </div>
    <div
      class="button-box"
      v-if="$route.params.type == 1 && orderType == 'dispatch' && orderDetail.reassignStatus === '是'"
    >
      <van-button
        block
        type="info"
        @click="distribute"
        v-if="orderDetail.reassignStr == '0'"
      >
        派单
      </van-button>
      <!-- 
        0 转入
        1 转出
      -->
      <van-button
        block
        type="info"
        v-if="orderDetail.reassignStr == '0'"
        @click="cancelOrRefuseReDispatch"
      >
        转派拒绝
      </van-button>
      <van-button
        block
        type="info"
        v-if="orderDetail.reassignStr == '1'"
        @click="cancelOrRefuseReDispatch"
      >
        转派取消
      </van-button>
      <!-- <van-button
        block
        type="info"
        @click="reject"
        v-if="orderDetail.reassignStr == '0'"
      >
        驳回
      </van-button> -->
    </div>
    <!-- 已派单      显示 改派、复制、取消 ---start--- -->
    <div
      class="button-box"
      v-if="$route.params.type == 1 && orderType == 'dispatched' && orderDetail.reassignStatus === '否' && orderDetail.status != 6"
    >
      <!-- 已派单      显示 改派、复制、取消 -->
      <div class="button-box-image">
        <van-image
          width="100%"
          height="20px"
          :src="quxiao"
          v-show="orderDetail.status != 6"
          @click="cancelOrderButton"
        />
        <div class="text">
          取消订单
        </div>
      </div>
      <div
        class="button-box-image"
        @click="copyOrderChange"
      >
        <van-image
          width="100%"
          height="20px"
          :src="fuzhi"
        />
        <div class="text">
          复制订单
        </div>
      </div>
      <van-button
        block
        type="info"
        @click="reassignmentClick"
      >
        改派
      </van-button>
    </div>
    <div
      class="button-box"
      v-if="$route.params.type == 1 && orderType == 'dispatched' && orderDetail.reassignStatus === '是' && orderDetail.status != 6"
    >
      <div class="button-box-image">
        <van-image
          width="100%"
          height="20px"
          :src="quxiao"
          @click="cancelOrderButton"
        />
        <div class="text">
          取消订单
        </div>
      </div>
      <div
        class="button-box-image"
        @click="copyOrderChange"
      >
        <van-image
          width="100%"
          height="20px"
          :src="fuzhi"
        />
        <div class="text">
          复制订单
        </div>
      </div>
      <van-button
        block
        type="info"
        @click="reassignmentClick"
        v-if="orderDetail.reassignStr == '0'"
      >
        改派
      </van-button>
      <van-button
        block
        type="info"
        v-if="orderDetail.reassignStr == '1'"
        @click="cancelOrRefuseReDispatch"
      >
        转派取消
      </van-button>
      <van-button
        block
        type="info"
        v-if="orderDetail.reassignStr == '0'"
        @click="cancelOrRefuseReDispatch"
      >
        转派拒绝
      </van-button>
    </div>
    <!-- 已派单      显示 改派、复制、取消 ---end--- -->
    <!-- 历史订单  显示复制---start--- -->
    <div
      class="form-button"
      v-if="$route.params.type == 1  && orderType === 'history'"
    >
      <van-button
        block
        type="default"
        @click="copyOrderChange"
      >复制订单</van-button>
    </div>
    <!-- 历史订单  显示复制---end--- -->
    <van-popup
      v-model="showCancel"
      position="bottom"
    >
      <div class="CancelOrder">
        <p>取消原因：</p>
      </div>
      <van-field
        v-model="closeReason"
        rows="2"
        :autosize="{minHeight: 100}"
        type="textarea"
        maxlength="50"
        placeholder="请输入取消原因"
        show-word-limit
        label-width="60px"
      />
      <van-button
        block
        type="info"
        @click="popupCancelOrderBtn"
      >取消订单</van-button>
    </van-popup>
  </div>
</template>
<script>
import {
  orderRequestList,
  orderApprovalLog,
  orderCancelOrder,
} from '@/api/order';
import {
  carPic,
  dispatchOrder,
  reassignment,
  getAvailableButton,
  reject,
  updateChangeOrder,
} from '@/api/dispatch';
import fuzhi from '@/assets/icon/fuzhi.svg';
import quxiao from '@/assets/icon/quxiao.svg';
import { mapGetters } from 'vuex'
import platform from '@/view/mixins/platform'
import getDict from "@/view/mixins/getDict"
export default {
  name: 'DispatchDetails',
  mixins: [platform, getDict],
  data() {
    return {
      carPic,
      quxiao,
      fuzhi,
      orderDetail: {},
      approveLogList: [],
      showCancel: false,
      closeReason: '',
      type: '',
      redispatchOrReject: '',
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
    // 获取订单详情
    async getOrderDetail() {
      let id = this.$route.params.id;
      orderRequestList({ id }).then(({ data: { list = [] } }) => {
        // this.orderDetail = data;
        // this.orderDetail.unitval = data.companyName
        // this.orderDetail.deptval = data.deptName
        let orderDetail = (list[0] ?? {}) || {};
        
        let type = this.$route.params.type;
        if (type == 0 || type == 2 || type == 3) {
          this.orderDetail = this.dealReqAssignments(orderDetail) || {};
        } else {
          this.orderDetail = orderDetail;
        }
      });
    },
    // 获取车辆审批日志
    orderApprovalLog() {
      let reqId = this.$route.params.id;
      orderApprovalLog({ reqId }).then(({ data }) => {
        this.approveLogList = data;
      });
    },
    returnDetails() {
      this.$router.go(-1);
    },
    addCar() {
      const { id, unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      const reqAssignmentsIndex = this.reqAssignments.length;
      this.$router.push({
        name: 'DispatchVehicle',
        params: { type: 1, id, },
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
    // 点击取消订单按钮
    cancelOrderButton() {
      this.showCancel = true;
    },
    popupCancelOrderBtn() {
      if (this.closeReason) {
        this.$dialog.confirm({
          title: '提示',
          message: '是否要取消订单?',
          beforeClose: this.orderCancelOrder
        });
      } else {
        this.$notify({
          type: 'warning',
          message: '请输入取消原因！'
        });
      }
    },
    // 二次弹出框确认 关闭之前
    orderCancelOrder(action, done) {
      if (action === 'confirm') {
        this.cancelOrder(done)
        return false;
      }
      done();
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
          this.showCancel = false;
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
    // 派单
    distribute() { // 保存当前数据
      const { id, unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      this.$router.push({
        name: 'DispatchVehicle',
        params: { type: 1, id, },
        query: {
          reqAssignmentsIndex: 0,
          id,
          unitCode,
          deptId,
          reassignUnitCode,
          usageDate,
        }
      });
      this.$store.dispatch('DispathOrder/removeReqAssignments')
    },
    // 改派
    reassignmentClick() {
      const { id, unitCode, deptId, reassignUnitCode, usageDate, } = this.orderDetail;
      this.$router.push({ // 改派为3
        name: 'DispatchVehicle',
        params: { type: 3, id },
        query: {
          reqAssignmentsIndex: 0,
          id,
          unitCode,
          deptId,
          reassignUnitCode,
          usageDate,
        }
      });
    },
    async dispatchReassignment() {   // 已审批 派单
      let toast = this.$toast.loading({
        duration: 0,
        message: "派单中..",
        forbidClick: true
      });
      const params = {
        status: this.orderDetail.status,
        id: this.orderDetail.id,
        phone: this.orderDetail.phone,
        createType: this.orderDetail.createType,
        usageDate: this.orderDetail.usageDate,
        usageTime: this.orderDetail.usageTime,
        handleUserId: this.orderDetail.handleUserId,
        handleUserName: this.orderDetail.handleUserName,
        handleUnit: this.orderDetail.handleUnit,
        handleUnitCode: this.orderDetail.handleUnitCode,
        reqAssignments: []
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
      });

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
    // 派单
    async confirmOrderDispatch() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中..",
        forbidClick: true
      });
      const params = {
        status: this.orderDetail.status,
        id: this.orderDetail.id,
        phone: this.orderDetail.phone,
        createType: this.orderDetail.createType,
        usageDate: this.orderDetail.usageDate,
        usageTime: this.orderDetail.usageTime,
        handleUserId: this.orderDetail.handleUserId,
        handleUserName: this.orderDetail.handleUserName,
        handleUnit: this.orderDetail.handleUnit,
        handleUnitCode: this.orderDetail.handleUnitCode,
        reqAssignments: []
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
        console.log("🚀 ~ file: DispatchDetails.vue ~ line 480 ~ confirmOrderDispatch ~ res", res);
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
    copyOrderChange() {
      let id = this.$route.params.id;
      this.$router.push({
        name: 'DispathApply',
        params: { id }
      });
    },
    computedDetailData(detailData) {
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
      this.orderDetail.sDriverUnitCode = detailData.unitCode ? detailData.unitCode : sUnitCode;//司机单位编号（验证车接口用）
      // nid (string, optional): 主键 ,
      // nInitMiles (number, optional): 出库公里数(用于填写行车记录默认出车里程) ,
      // sCancelReason (string, optional): 取消原因 ,
      // sRefuseReason (string, optional): 驳回理由 ,
      // sReqNo (string, optional): 用车单号 ,
    },
    getAvailableButton() {
      let id = ''
      if (this.$route.params.id != 0) {
        id = this.$route.params.id ? this.$route.params.id : ''
      }
      // let id = this.$route.params.id;
      getAvailableButton({ id }).then(({ data }) => {
        this.redispatchOrReject = data
      })
    },
    // 转派转单 按钮 前往转单 选择单位的页面
    reDispatch() {
      let id = this.$route.params.id;
      this.$router.push({
        name: 'ChangeOder',
        params: {
          type: '1',
          id,
        }
      })
    },
    reject() {
      let id = this.$route.params.id;
      reject({ id }).then(({ data }) => {
        this.$toast.success("驳回成功！")
        this.$router.push({ path: '/DispathOrder', query: { refresh: true } });
      })
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
        params: { type: 1, id, },
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
      console.log('index', index);
      this.$store.dispatch('DispathOrder/deleteReqAssignmentsItem', index).then(() => {
        this.orderDetail = this.dealReqAssignments(this.orderDetail) || {};
      })
    },
    // 转派取消 或者 转派拒绝
    async cancelOrRefuseReDispatch() {
      console.log('cancelOrRefuseReDispatch');
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中..",
        forbidClick: true
      });
      try {
        const {
          id,
          // type,
        } = this.$route.params;
        const params = [
          {
            id,
          }
        ]
        const res = await updateChangeOrder(params);
        if (res?.code === 0) {
          this.$toast.success("操作成功")
          this.$store.dispatch('DispathOrder/triggerFefresh', true).then(() => {
            this.$router.push({
              name: 'DispatchOrderList',
            });
          })
        } else {
          this.$toast.fail(res?.message || "操作失败!，请重试");
        }
      } catch (error) {
        this.$toast.fail("操作失败!，请重试");
      } finally {
        toast.clear();
      }
    },
  },
  async created() {
    // let type = this.$route.params.type;
    this.orderType = this.$route.query.orderType;
    // this.getAvailableButton()
    this.handleSystemCardDict(this.dictIds);

    // 展示详情页面
    await this.getOrderDetail();
    this.orderApprovalLog();
    // if (type == 0 || type == 2 || type == 3) {   // 正常人工指派
    //   // this.computedDetailData(Object.assign({}, this.CarPerfect, this.ChoiceVehicie, this.ChoiceDriver));
    // } else if (type == 1) {
    //   // 列表进入详情页
    //   // this.getOrderDetail();
    //   // this.orderApprovalLog();
    // }
  }
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