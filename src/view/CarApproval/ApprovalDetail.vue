<template>
  <div class="apply-container container">
    <AllOrderDetail
      :order-detail="orderDetail"
      :approve-log-list="approveLogList"
      :dict-data="dictData"
    />
    <!-- TODO button-box的v-if的条件处理 -->

    <div
      class="button-box"
      v-if="orderDetail.isApproval == '1'"
    >
      <van-button
        block
        type="default"
        @click="transferCar=true"
      >驳回</van-button>
      <van-button
        block
        type="info"
        @click="approvalOrderChange"
      >通过</van-button>
    </div>
    <van-popup
      v-model="transferCar"
      position="bottom"
    >
      <van-form
        class="form-scroll"
        validate-first
        @failed="onFailed"
        @submit="approvalOrdeReject"
      >
        <van-field
          label="驳回原因："
          required
          class="form-textarea"
          v-model="formData.comment"
          name="comment"
          rows="1"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入驳回原因"
          :rules="[{ required: true}]"
          show-word-limit
        />
        <div class="form-button">
          <van-button
            block
            type="info"
            native-type="submit"
          >确认驳回</van-button>
        </div>
      </van-form>
    </van-popup>
    <!-- 下一级审批人 -->
    <van-popup
      v-model="selectAssigneeShow"
      position="bottom"
    >
      <van-field
        v-model="assignee"
        required
        is-link
        readonly
        label="下一级审批人"
        placeholder="请选择下一级审批人"
        @click="assigneeShow = true"
      />
      <!-- <div class="form-button">
        <van-button
          block
          type="info"
          native-type="button"
        >确认</van-button>
      </div> -->
    </van-popup>
    <van-popup
      v-model="assigneeShow"
      round
      position="bottom"
    >
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :field-names="fieldNames"
        :options="assigneeList"
        @close="assigneeShow = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
import {
  agreeApprovalOrder,
  rejectApprovalOrder,
  activityAssigneeList,
  orderRequestList,
  orderApprovalLog,
  vehicleInfoGetVehicleFile,
} from '@/api/order'
import getDict from "@/view/mixins/getDict"
export default {
  mixins: [getDict],
  data() {
    return {
      transferCar: false,
      formData: {
        comment: '',
        status: 1
      },
      // 下一级审批人的id
      assignee: '',
      // 审批人级联选择器是否展示
      selectAssigneeShow: false,
      assigneeShow: false,
      // 自定义选择
      fieldNames: {
        text: 'name',
        value: 'code',
        children: 'children',
      },
      // 审批人列表信息
      assigneeListInfo: {},
      // 下级审批人的列表
      assigneeList: [],
      // 订单详情
      orderDetail: {},
      approveLogList: [],
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
      cascaderValue: '',
    };
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
    getOrderDetail() {
      let id = this.$route.params.id;
      console.log("🚀 ~ file: ApprovalDetail.vue ~ line 105 ~ getOrderDetail ~ id", id)
      orderRequestList({ id }).then(({ data: { list = [] } }) => {
        const orderDetail = (list[0] ?? {}) || {};
        if (orderDetail.reqAssignments?.length > 0) {
          orderDetail.reqAssignments.forEach(async (item) => {
            item['carImage'] = await this.getCarImage(item.vinNumber)
          })
        }
        this.orderDetail = orderDetail;

      }).catch(() => {
        alert("获取详情失败!");
      });
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
    onFailed() { },
    // 驳回请求
    approvalOrdeReject() {
      // this.$router.push({ name: 'reject', params: { id: id } });
      let toast = this.$toast.loading({
        duration: 0,
        message: "正在驳回..",
        forbidClick: true
      });
      let param = {
        ...this.formData,
        businessId: this.$route.params.id || this.orderDetail.id,
        procInstId: this.orderDetail.procInstId,
        taskId: this.orderDetail.taskId,
      }
      rejectApprovalOrder(param).then(({ data }) => {
        toast.clear();
        this.$router.push({
          name: 'approvalSuccess',
          params: { id: id }
        });
      }).catch((err) => {
        this.$toast.fail("驳回失败!");
      });
    },
    // 通过按钮
    async approvalOrderChange() {
      this.selectAssigneeShow = true;
      const res = await activityAssigneeList({
        businessId: this.$route.params.id || this.orderDetail.id,
        procInstId: this.orderDetail.procInstId,
        actId: this.orderDetail.actId,
      })
      console.log('activityAssigneeList', res);
      if (res.code === 0 || 1 > 0) {
        const data = res.data || [];
        this.assigneeListInfo = data;
        this.assigneeList = this.dealTreeListEmptyChildren(data?.assigneeList) || [];
      }

      // TODO 删除下面多余的
      // this.assigneeList = this.dealTreeListEmptyChildren([
      //   {
      //     "id": null,
      //     "code": "11",
      //     "name": "测试单位1",
      //     "type": "1",
      //     "children": [
      //       {
      //         "id": null,
      //         "code": "1535099123127439360",
      //         "name": "经管事业群",
      //         "type": "2",
      //         "children": [
      //           {
      //             "id": null,
      //             "code": "1535101376877973504",
      //             "name": "经管主任",
      //             "type": "5",
      //             "children": [],
      //             "userList": null
      //           }
      //         ],
      //         "userList": null
      //       }
      //     ],
      //     "userList": null
      //   }
      // ]);
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
    // 确定通过
    async approvalOrder(action, done) {
      const id = this.$route.params.id;
      if (action === 'confirm') {
        let param = {
          assignee: this.cascaderValue,
          businessId: id || this.orderDetail.id,
          procInstId: this.orderDetail.procInstId,
          comment: '',
          taskId: this.orderDetail.taskId,
        }
        // eslint-disable-next-line no-unused-vars
        agreeApprovalOrder(param).then((_data) => {
          this.$router.push({ name: 'approvalSuccess', params: { id } });
          // this.$notify({
          //     type: 'success',
          //     message: '成功!'
          // });
          done();
        }).catch(() => {
          done(false);
        });
        return false;
      }
      done();
    },
    // 全部选项选择完毕后，会触发 finish 事件 选择完人员之后
    onFinish({ selectedOptions }) {
      this.assigneeShow = false;
      this.$dialog.confirm({
        title: '提示',
        message: '是否要审批通过?',
        beforeClose: this.approvalOrder
      });
      this.assignee = selectedOptions.map((option) => option.name).join('/');
    },
  },
  created() {
    this.handleSystemCardDict(this.dictIds);
    this.getOrderDetail();
    this.orderApprovalLog();
  }
}
</script>
<style scoped lang="less">
.warnning {
  color: #e6a23c !important;
}
</style>