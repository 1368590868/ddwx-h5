<template>
  <div class="distribute-car">
    <p class="titleVeh"><span>分派车辆时注意所在地限行法规</span></p>
    <div
      class="list_overflow"
      ref="notClass"
    >
      <SelectCarItemCard
        :car-data="carData"
        :driver-data="driverData"
      />
      <!-- <div
      class="list_overflow"
      ref="notClass"
    >
      <van-pull-refresh
        v-model="requestRefreshLoading"
        @refresh="requestRefresh"
        success-text="刷新成功"
      >
        <van-list
          v-model="requestLoading"
          offset="30"
          :finished="requestFinished"
          finished-text="没有更多了..."
          @load="getAvailableCar"
        >
          <div
            class="van-radio-groups"
            v-for="(item, index) in carData"
            :key="index"
            @click="radioClick(item)"
          >
            <p class="pImg-left">
              <img
                :src="item.carImage || defaultCarImage"
                alt=""
              >
              <span>{{item.carNumber}}</span>
              <span>{{item.carBrand}}</span>
              <span class="sright">{{item.carSeries}}</span>
            </p>
          </div>
        </van-list>
      </van-pull-refresh>
     -->
    </div>
    <div class="button-box">
      <van-button
        block
        type="default"
        @click="returnDetails"
      >
        上一步
      </van-button>
      <van-button
        block
        type="info"
        @click="determine"
      >
        确定车辆
      </van-button>
    </div>
  </div>
</template>
<script>
import { orderRequestList } from '@/api/order'
import { vehicleInfoGetAvailableCar, getDispatchAvailableDriver } from '@/api/dispatch'
import defaultCarImage from '@/assets/img/car.jpg'
export default {
  computed: {},
  watch: {
  },
  data() {
    return {
      requestRefreshLoading: false,
      requestLoading: false,
      requestFinished: false,
      orderDetail: {},
      driverData: [],
      carData: [],
      // 默认车图片
      defaultCarImage,
    }
  },
  methods: {
    requestRefresh() {
      //清空
      this.requestRefreshLoading = true;
      this.requestFinished = false;
      this.requestLoading = true;
      //重新加载
      this.getAvailableCar();
    },
    // 获取订单详情
    async getOrderDetail() {
      let id = this.$route.query.id;
      await orderRequestList({ id }).then(({ data: { list = [] } }) => {
        const orderDetail = (list[0] ?? {}) || {};
        this.orderDetail = orderDetail;
      });
    },
    // 上一步按钮
    returnDetails() {
      this.$router.go(-1);
    },
    // 获取可用车辆
    async getAvailableCar() {
      await this.getOrderDetail();
      this.getAvailableDriver();
      this.requestLoading = true;
      const { unitCode, deptId, reassignUnitCode } = this.orderDetail;
      console.log("🚀 ~ file: DistributeCar.vue ~ line 104 ~ getAvailableCar ~ this.orderDetail", this.orderDetail)
      const params = {
        unitCode,
        deptId,
        tunUnitCode: reassignUnitCode || '',
      }
      await vehicleInfoGetAvailableCar(params, reassignUnitCode).then(({ data = [] }) => {
        this.requestRefreshLoading = false;
        this.requestFinished = true;
        this.requestLoading = false;
        this.carData = data || [];
      }).catch(() => {
        console.log('err')
      });
    },
    // 获取可用司机
    async getAvailableDriver() {
      this.requestLoading = true;
      const { usageDate, unitCode } = this.orderDetail;
      const params = {
        classDateEnd: usageDate,
        classDateStart: usageDate,
        classId: 'none',
        flag: 0,
        unitCode,
      }
      await getDispatchAvailableDriver(params).then(({ data = [] }) => {
        this.driverData = data || [];
      }).catch(() => {
        console.log('err')
      });
    },
    determine() {

    },
  },
  created() {
    this.getAvailableCar();
  }
}
</script>
<style scoped lang="less">
.distribute-car {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
  overflow: hidden;
  .list_overflow {
    height: 100%;
    overflow: auto;
  }
  .titleVeh {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #f2f4f8;
    span {
      margin-left: 14px;
      font-size: 13px;
    }
  }
  .van-radio-groups {
    width: 95%;
    height: 68px;
    border-bottom: 1px solid #ccc;
    margin: 0 auto;
    .van-radio {
      float: left;
      width: 6%;
      margin-left: 0px;
      margin-top: 20px;
      .van-radio__icon--checked {
        .van-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
    .pImg-left {
      width: 92%;
      float: left;
      img {
        float: left;
        width: 64px;
        height: 64px;
      }
      span {
        float: left;
        display: inline-block;
        margin-right: 5px;
        line-height: 64px;
        font-size: 14px;
        color: #2e2e2e;
      }
    }
    .pImg-right {
      width: 33%;
      float: right;
      span {
        line-height: 64px;
        font-size: 14px;
        color: #2e2e2e;
        &.sright {
          float: right;
        }
      }
    }
  }
}
</style>