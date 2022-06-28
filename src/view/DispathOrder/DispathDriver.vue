<template>
  <div class="ChoiceDriver">
    <!-- <van-nav-bar title="请选择车辆" left-arrow @click-left="$router.back()" /> -->
    <div class="log-title">分派司机</div>
    <div
      class="overflow-auto"
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
          @load="getAvailableDriver"
        >
          <van-radio-group v-model="radio">
            <div
              class="van-radio-groups"
              v-for="(item, index) in driverData"
              :key="item.driverCode + index + ''"
              @click="radioClick(item)"
            >
              <van-radio :name="item.driverCode">
              </van-radio>
              <p class="pImg-lefts">
                <span>{{item.driver}}</span>
                <span>电话：{{item.phone}}</span>
              </p>
              <!-- <p class="pImg-rights">
                                
                            </p> -->
            </div>
          </van-radio-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="button-box">
      <van-button
        block
        type="default"
        @click="returnChoiceVehicie"
        v-if="typeDriver != 'Driver'"
      >车辆选择</van-button>
      <van-button
        block
        type="default"
        @click="returnChoiceVehicie"
        v-if="typeDriver === 'Driver'"
      >上一步</van-button>
      <van-button
        block
        type="info"
        @click="determine"
      >确定司机</van-button>
    </div>
  </div>
</template>
<script>
import { getDispatchAvailableDriver } from '@/api/dispatch'
import { mapGetters } from 'vuex'
export default {
  beforeRouteEnter(to, from, next) {
    if (from.name === 'SubSuccess') {
      to.meta.keepAlive = false;
    } else {
      to.meta.keepAlive = true;
    }
    next((vm) => {
      let timer = setTimeout(() => {
        vm.$refs.notClass.scrollTop = to.meta.scrollTop;
        clearTimeout(timer);
      }, 0);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'details') {   // 去往详情页
      let notClass = this.$refs.notClass;
      let top = notClass.scrollTop;
      from.meta.scrollTop = top;
    }
    next();
  },
  data() {
    return {
      requestLoading: false,
      requestFinished: false,
      requestRefreshLoading: false,
      radio: '',
      radioData: {},
      driverData: [],
      typeDriver: ''
    }
  },
  computed: {
    ...mapGetters(['DispathOrder', 'reqAssignments']),
  },
  watch: {
  },
  methods: {
    requestRefresh() { //清空
      this.requestRefreshLoading = true;
      this.requestFinished = false;
      this.requestLoading = true;
      this.getAvailableDriver(); //重新加载
    },
    radioClick(val) {
      this.radioData = val;
      this.radio = val.driverCode;
    },
    getAvailableDriver() {
      const { unitCode, usageDate, } = this.$route.query || {};
      const params = {
        classDateEnd: usageDate,
        classDateStart: usageDate,
        classId: 'none',
        flag: 0,
        unitCode,
      }
      getDispatchAvailableDriver(Object.assign({}, this.requestQuery, params)).then(({ data }) => {
        this.requestRefreshLoading = false;
        this.requestFinished = true;
        this.requestLoading = false;
        this.driverData = data || [];
      }).catch(() => {
        console.log('err')
      });
    },
    returnChoiceVehicie() {
      this.$router.go(-1);
    },
    async determine() {

      let radio = this.radio;
      if (!radio) {
        this.$toast("请选择司机！");
        return false;
      }
      //   await this.$store.dispatch("DispathOrder/setChoiceDriver", Object.assign({}, this.radioData));
      const { reqAssignmentsIndex } = this.$route.query;
      this.$store.dispatch('DispathOrder/setCarAndDriverData', { ...this.radioData, reqAssignmentsIndex, setDataType: 'driverInfo' })
      console.log('this.$store.getters', this.$store.getters);
      const type = this.$route.params.type;
      // const id = this.$route.params.id;
      // if (type == '1') {  // type ==1  是从详情过来的正常派单
      //   type = 2;
      // }
      if (type == 0) {
        // type = 0 新建调度单  人工派车
        this.$router.push({
          name: 'CreateOder',
          params: { ...this.$route.params },
          query: this.$route.query,
        });
        return
      }
      if (type == 2) {
        // type = 2 复制调度单  人工派车
        this.$router.push({
          name: 'CopyOder',
          params: { ...this.$route.params },
          query: this.$route.query,
        });
        return
      }
      if (type == 3) {
        // type = 2 复制调度单  人工派车
        this.$router.push({
          name: 'ReassignmentOrder',
          params: { ...this.$route.params },
          query: this.$route.query,
        });
        return
      }
      if (type == 5) {
        // type = 5 派单
        this.$router.push({
          name: 'ConfirmDistribute',
          params: { ...this.$route.params },
          query: this.$route.query,
        });
        return
      }
      this.$router.push({
        name: 'DispatchDetails',
        params: { ...this.$route.params },
        query: this.$route.query,
      });
    }
  },
  created() {
    let typeDriver = this.$route.params.typeDriver;
    this.typeDriver = typeDriver
    // this.getAvailableDriver();
  },
  mounted() {
  }
}
</script>
<style scoped lang="less">
.ChoiceDriver {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
  overflow: hidden;
  .overflow-auto {
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
    .pImg-lefts {
      width: 90%;
      float: left;
      margin-left: 10px;
      span {
        float: left;
        display: inline-block;
        margin-right: 15px;
        line-height: 64px;
        font-size: 14px;
        color: #2e2e2e;
      }
    }
    .pImg-rights {
      width: 55%;
      float: right;
      margin-right: 10px;
      span {
        float: right;
        line-height: 64px;
        font-size: 14px;
        color: #2e2e2e;
      }
    }
  }
}
</style>