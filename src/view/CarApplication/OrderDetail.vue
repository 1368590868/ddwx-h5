<template>
  <div class="apply-container container">
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
        v-if="orderDetail.stateCode == 'b'"
      >
        <div class="reject-title">驳回原因：</div>
        <van-notice-bar
          :scrollable="orderDetail.sRefuseReason.length>20"
          color="#2e2e2e"
          background="#fef9e9"
        >{{orderDetail.sRefuseReason || '未填写明确申请原因'}}</van-notice-bar>
      </div>
      <div
        class="reject-box"
        v-if="orderDetail.stateCode == '9'"
      >
        <div class="reject-title">取消原因：</div>
        <van-notice-bar
          :scrollable="orderDetail.sCancelReason.length>20"
          color="#2e2e2e"
          background="#f2f7fc"
        >{{orderDetail.sCancelReason || '未填写明确取消原因'}}</van-notice-bar>
      </div>
      <div
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
          <span>电话：</span><span>{{orderDetail.phone}}</span>
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
        <template v-if="orderDetail.cartype!= ''">
          <li class="info-label"><span>实际车型：</span><span
              :class="orderDetail.cartype === orderDetail.hopeCarType?'':'warnning'"
            >{{orderDetail.cartype}}</span></li>
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
          <li class="info-label"><span>行程描述：</span><span
              class="info-address">{{orderDetail.itineraryDescription || '行程描述'}}</span></li>
        </ul>

      </template>
      <div class="operlog-box">
        <div class="log-title">审批日志</div>
        <ul class="log-container">
          <li
            class="log-li"
            v-for="(logItem, logIndex) in apprlogList"
            :key="logIndex"
          >
            <span class="log-time">{{logItem.recordDate | timeAgo('{m}/{d} {h}:{i}')}}</span>
            <em class="log-cirle"></em>
            <span class="log-name">{{logItem.userName}}</span>
            <span class="log-status">{{logItem.recordStep}}</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 0：待审批。1：审批中。2：已审批。3：已派车。4：已领单即已确认。5：已出车。6：待评价即已还车。7：办结。
             8：取消中。9：已取消、a：已封存b审批未通过、c：司机拒单, 增加了、b：审批未通过和c司机拒单状态。增加：d已确认 -->
    <div
      class="button-box"
      v-if="orderDetail.stateCode <= 3"
    >
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
      v-else-if="orderDetail.stateCode == 7"
    >
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>

    </div>
    <div
      class="button-box"
      v-else-if="orderDetail.stateCode == 6"
    >
      <van-button
        block
        type="default"
        @click="CopyOrderChange"
      >复制订单</van-button>
      <van-button
        block
        type="info"
        @click="orderConfirmUserCar"
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
          v-model="cancelReason"
          :rules="[{required: true}]"
          name="cancelReason"
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
import { orderRequestList, orderApprovalLog, orderCancelOrder, orderConfirmUserCar } from '@/api/order'
import getDict from "@/view/mixins/getDict"
import { carPic } from '@/api/dispatch';
import { mapGetters } from 'vuex'
import platform from '@/view/mixins/platform'
export default {
  mixins: [platform, getDict],
  computed: mapGetters(['userInfo']),
  data() {
    return {
      carPic,
      transferCar: false,
      isCancelVis: false, //  是否取消订单弹窗
      cancelReason: '',   // 取消原因
      orderDetail: {},
      apprlogList: [],
      // 字典编号
      dictIds: {
        // 订单状态
        statusDict: '1522830760585670657',
        // 期望车型I
        hopeBrandDict: '1018'
      },
      dictData: {
        statusDict: '',
        hopeBrandDict: '',
      },
    };
  },
  methods: {
    orderConfirmUserCar() {
      let autoId = this.$route.params.autoId;
      this.dialogConfirm({ message: '是否要确认用车?' }, (action, doneCallback) => {
        if (action === 'confirm') {
          orderConfirmUserCar({ autoId }).then(({ data }) => {
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
    getOrderDetail() {
      let id = this.$route.params.id;
      orderRequestList({ id }).then(({ data: { list = [] } }) => {
        this.orderDetail = (list[0] ?? {}) || {};
      }).catch(() => {
        alert("获取详情失败!");
      });
    },
    orderApprovalLog() {
      let autoId = this.$route.params.autoId;
      orderApprovalLog({ autoId }).then(({ data }) => {
        this.apprlogList = data;
      }).catch(() => {
        alert("获取日志失败!");
      });
    },
    orderCancelOrder(done) {
      let autoId = this.$route.params.autoId;
      let cancelReason = this.cancelReason;
      orderCancelOrder({ autoId, cancelReason }).then((data) => {
        this.$notify({
          type: 'success',
          message: '取消成功!'
        });
        this.isCancelVis = "";
        this.getOrderDetail();
        this.orderApprovalLog();
        done();
      }).catch(() => {
        done(false);
      });
    },
    CancelOrderChange(action, done) {
      if (action === 'confirm') {
        this.$refs.isCanceForm.validate(['cancelReason']).then((opt) => {
          this.orderCancelOrder(done);
        }).catch((err) => {   // 校验未通过
          done(false);
        });
      } else {
        done();
      }
    },
    CopyOrderChange() {
      let autoId = this.$route.params.autoId;
      this.$router.push({
        name: 'StartApplying',
        params: { autoId }
      });
    }
  },
  async created() {
    this.getOrderDetail();
    await this.handleSystemCardDict(this.dictIds);
    // this.orderApprovalLog();
  }
}
</script>
<style scoped lang="less">
.warnning {
  color: #e6a23c !important;
}
</style>