<template>
  <div class="container">
    <AllOrderDetail :order-detail="orderDetail" :approve-log-list="approveLogList" :dict-data="dictData" />
    <!-- TODO button-box的v-if的条件处理 -->

    <div class="button-box" v-if="!orderDetail.endTimeMe">
      <van-button block type="default" @click="approvalOrdeReject">驳回</van-button>
      <van-button block type="info" @click="approvalOrderChange">通过</van-button>
    </div>
    <van-popup v-model="transferCar" position="bottom">
      <van-form class="form-scroll" validate-first @failed="onFailed" @submit="approvalOrdeReject">
        <van-field label="驳回原因：" required class="form-textarea" v-model="formData.comment" name="comment" rows="1"
          autosize type="textarea" maxlength="40" placeholder="请输入驳回原因" :rules="[{ required: true }]" show-word-limit />
        <div class="form-button">
          <van-button block type="info" native-type="submit">确认驳回</van-button>
        </div>
      </van-form>
    </van-popup>
    <!-- 下一级审批人 -->
    <van-popup v-model="assigneeShow" position="bottom">
      <div class="popup-title">
          <span>请选择下一级审批人</span>
          <van-button class="more-button" type="info" size="small" native-type="button" @click="handleMoreClick">更多审核人</van-button>
      </div>
      <van-tree-select :active-id.sync="activeIds" :main-active-index.sync="activeIndex" :items="assigneeList" />
      <van-button class="van-button-sure" @click="handleTreeSelect">确定</van-button>
    </van-popup>
    <!--优先保障-->
    <van-popup v-model="guaranteePicker" position="bottom">
        <van-picker 
            show-toolbar 
            value-key="name" 
            :default-index="guaranteeActiveIndex"
            :columns="dictGuarantee" 
            @confirm="guaranteeConfirm" 
            @cancel="guaranteeCancel" />
    </van-popup>
  </div>
</template>
<script>
import {
  agreeApprovalOrder,
  rejectApprovalOrder,
  activityAssigneeList,
  approvalOrderList,
  orderApprovalLog,
  vehicleInfoGetVehicleFile,
} from '@/api/order'
import getDict from "@/view/mixins/getDict"
import { mapGetters } from 'vuex'
export default {
  mixins: [getDict],
  computed: {
      ...mapGetters(['userInfo']),
  },
  data() {
    return {
      transferCar: false,
      formData: {
        comment: '',
        status: 1
      },
      // 下一级审批人的id
      assignee: '',
      assigneeShow: false,
      // 自定义选择
      fieldNames: {
        text: 'name',
        value: 'code',
        children: 'children',
      },
      // 下级审批人原始数据
      originAssigneeList: [],
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
        hopeBrandDict: '101801',
         //优先保障
        guaranteeDict:'1679651627836055552',
      },
      dictData: {
        statusDict: '',
        hopeBrandDict: '',
        guaranteeDict:'',
      },
      cascaderValue: '',
      activeIds: [],
      activeIndex: 0,
      //优先保障弹框
      guaranteePicker:false,
      //优先保障默认位置
      guaranteeActiveIndex:0,
      //优先保障数据
      dictGuarantee: [],  
      //当前审核按钮
      currentExamine:null,
    };
  },
  methods: {
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = Object.fromEntries(res.map(item => [item.code, item.name]))
        if(item === 'guaranteeDict'){
          this.dictGuarantee = res;
          this.guaranteeActiveIndex = this.dictGuarantee.findIndex((item) => {
              return item.code === this.orderDetail.guarantee;
          });
        }
      }
    },
    // 获取订单详情
    getOrderDetail() {
      let id = this.$route.params.id;
      let detailId = this.$route.params.detailId;
      console.log("🚀 ~ file: ApprovalDetail.vue ~ line 105 ~ getOrderDetail ~ id", id)
      approvalOrderList({ id, detailId }).then(({ data: { list = [] } }) => {
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
    approvalOrdeReject(){
      this.currentExamine = 1;
   
      this.$dialog.confirm({
        title: '提示',
        message: '是否修改优先保障类型?',
        confirmButtonText:'是',
        cancelButtonText:'否'
      }).then(() => {
        this.guaranteePicker = true;
      }).catch((err) => {
        this.requestApprovalOrdeReject();
      })
    },
    // 驳回请求
    requestApprovalOrdeReject() {
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
        guarantee:this.orderDetail.guarantee,
      }
      rejectApprovalOrder(param).then(({ data }) => {
        toast.clear();
        this.$router.push({
          name: 'approvalSuccess',
          params: { id: this.$route.params.id }
        });
      }).catch((err) => {
        this.$toast.fail("驳回失败!");
      });
    },
    // 开始
    // 通过按钮
    approvalOrderChange() {
      this.currentExamine = 0;
      this.$dialog.confirm({
        title: '提示',
        message: '是否修改优先保障类型?',
        confirmButtonText:'是',
        cancelButtonText:'否'
      }).then(() => {
        this.guaranteePicker = true;
      }).catch((err) => {
        this.requestApprovalOrderChange();
      })
    },
    async requestApprovalOrderChange(){
      const res = await activityAssigneeList({
        businessId: this.$route.params.id || this.orderDetail.id,
        procDefId: '',
        procInstId: this.orderDetail.procInstId,
        actId: this.orderDetail.actId,
      })
      if (res.code === 0) {
        if (res?.data?.assignee) {
          // 如果直接返回了审批人信息 则直接通过
          const param = {
            assignee: res.data.assignee,
            businessId: this.$route.params.id || this.orderDetail.id,
            procInstId: this.orderDetail.procInstId || '',
            comment: '同意',
            taskId: this.orderDetail.taskId || '',
            guarantee:this.orderDetail.guarantee,
          }
          this.$dialog.confirm({
            title: '提示',
            message: '是否要审批通过?',
          }).then(() => {
            this.approvalOrderApi(param)
          }).catch(() => {
            // on cancel
          });
          return;
        }
        // 如果有审批人列表存在, 则直接展示审批人列表供其选择 选择值后在调用 审批通过接口
        if (res?.data?.assigneeList?.length > 0) {
          const data = res.data || [];
          this.originAssigneeList = this.getTreeData(data.assigneeList);
          //隐藏数据
          let tempAssigneeList = data.assigneeList.filter((item) => {
              return item.hide === '0';
          })
          this.assigneeList = this.getTreeData(tempAssigneeList);
          this.assigneeShow = true;
          return
        }
        // 如果两者都没有 则是最后一级，直接通过
        this.$dialog.confirm({
          title: '提示',
          message: '是否要审批通过?',
        }).then(() => {
          const param = {
            assignee: '',
            businessId: this.$route.params.id || this.orderDetail.id,
            procInstId: this.orderDetail.procInstId || '',
            comment: '同意',
            taskId: this.orderDetail.taskId || '',
            guarantee:this.orderDetail.guarantee,
          }
          this.approvalOrderApi(param)
        }).catch(() => {
          // on cancel
        });
      }
    },
    //优先保障选择确定
    guaranteeConfirm(values){
      this.orderDetail.guarantee = values.code;
      this.guaranteePicker = false;

      if(this.currentExamine = 0){
        this.requestApprovalOrdeReject();
      }else{
        this.requestApprovalOrderChange();
      }
    },
    //优先保障选择取消
    guaranteeCancel(){
      this.guaranteePicker = false;

      if(this.currentExamine = 0){
        this.requestApprovalOrdeReject();
      }else{
        this.requestApprovalOrderChange();
      }
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
    //整理tree data
    getTreeData(data) {
      let treeList = []
      treeList.push({ text: '', children: [] })
      data.forEach((item) => {
        treeList[0].children.push({
          text: item.name,
          id: item.code
        })
      })
      return treeList
    },
    // 确定通过按钮
    async approvalOrder(action, done) {
      const id = this.$route.params.id;
      if (action === 'confirm') {
        let param = {
          assignee: this.cascaderValue,
          businessId: id || this.orderDetail.id,
          candidateUser: this.activeIds,
          procInstId: this.orderDetail.procInstId,
          comment: '同意',
          taskId: this.orderDetail.taskId,
        }
        this.approvalOrderApi(param);
        done();
        return false;
      }
      done();
    },
    // 审批通过请求
    async approvalOrderApi(param) {
      // eslint-disable-next-line no-unused-vars
      agreeApprovalOrder(param).then((_data) => {
        const id = this.$route.params.id;
        this.$router.push({ name: 'approvalSuccess', params: { id } });
        // this.$notify({
        //     type: 'success',
        //     message: '成功!'
        // });
      })
    },
    // 全部选项选择完毕后，会触发 finish 事件 选择完人员之后
    // onFinish({ selectedOptions }) {
    //   this.assigneeShow = false;
    //   this.$dialog.confirm({
    //     title: '提示',
    //     message: '是否要审批通过?',
    //     beforeClose: this.approvalOrder
    //   });
    //   this.assignee = selectedOptions.map((option) => option.name).join('/');
    // },
    //点击更多审核人回调
    handleMoreClick(){
      this.assigneeList = this.originAssigneeList;
    },
    handleTreeSelect() {
      this.assigneeShow = false;
      this.$dialog.confirm({
        title: '提示',
        message: '是否要审批通过?',
        beforeClose: this.approvalOrder
      });
      let activeName = []
      if (this.activeIds.length) {
        this.activeIds.forEach(idItem => {
          this.assigneeList[0].children.forEach(listItem => {
            if(listItem.id == idItem){
              activeName.push(listItem.text)
            }
          })
        })
      }
      this.assignee = activeName.map((option) => option).join('/');
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

.popup-title{
    padding: 5px 10px;
    line-height: 30px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 5px;
}
.van-sidebar{
    width: 0;
}
.van-tree-select__nav{
    flex: 0;
}
.van-tree-select__content{
    height: calc(300px - 1rem) !important;
}

.van-button-sure {
  width: 5.2rem;
  height: 1rem;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4f99ff;
  color: #fff;
}
.more-button {
    float: right;
}
</style>