<template>
  <div class="ChoiceVehicies">
    <p class="titleVeh">
      <span>车辆:</span>
      <span>{{radioData.carNumber}}</span>
      <span :class="`${isDisableDriving === '不限行' ? '' : 'disabled-driving'}`">
        {{isDisableDriving}}
      </span>
    </p>
    <!-- <p class="titleVeh"><span>分派车辆时注意所在地限行法规</span></p> -->
    <div
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
          <van-radio-group v-model="radio">
            <div
              class="van-radio-groups"
              v-for="(item, index) in carData"
              :key="index"
              @click="radioClick(item, index)"
            >
              <div>
                <van-radio :name="item.carNumber">
                </van-radio>
                <p class="pImg-left">
                  <img
                    :src="checkCarImagePath(item.carBrand, item.carSeries)"
                    alt=""
                  >
                  <span>{{item.carNumber}}</span>
                  <span>{{item.carBrand}} {{item.carSeries}}</span>
                  <!-- <span class="sright">{{item.carModel}}</span> -->
                </p>
              </div>
            </div>
          </van-radio-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <div>

    </div>
    <div class="button-box">
      <!-- <van-button block type="default" @click="returnDetails" v-if="typeVehicie != 'Vehicie'">返回详情</van-button> -->
      <van-button
        block
        type="default"
        @click="returnDetails"
      >上一步</van-button>
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
import { vehicleInfoGetAvailableCar, carPic } from '@/api/dispatch'
import { carIsDriving } from '@/api/driving'
import { mapGetters } from 'vuex'
import checkCarImagePath from '@/utils/carPath'
export default {
  name: 'DispatchVehicle',
  computed: {
    ...mapGetters(['DispathOrder']),
    ...mapGetters(['reqAssignments']),
  },

  filters: {
  },
  watch: {
  },
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
    if (to.name === 'DispathDriver') {
      let notClass = this.$refs.notClass;
      let top = notClass.scrollTop;
      from.meta.scrollTop = top;
    }
    next();
  },
  data() {
    return {
      carPic,
      requestLoading: false,
      requestFinished: false,
      requestRefreshLoading: false,
      radio: '',
      radioData: {},
      carData: [],
      requestQuery: {
        pageSize: 10,
        pageNum: 0
      },
      isDisableDriving: '',
      typeVehicie: '',
      type: '',
      checkCarImagePath,
      status:'',
    }
  },
  methods: {
    requestRefresh() {
      //清空
      this.requestRefreshLoading = true;
      this.requestFinished = false;
      this.requestLoading = true;
      this.requestQuery.pageNum = 0;
      //重新加载
      this.getAvailableCar();
    },
    radioClick(val, index) {
      this.radioData = val;
      this.radio = val.carNumber;
      this.viewCarIsDriving(val.carNumber, index)
    },
    getAvailableCar() {
      this.requestLoading = true;
      const { unitCode, deptId, reassignUnitCode, } = this.$route.query || {};

      let params = {
        unitCode,
        deptId,
        tunUnitCode: reassignUnitCode || '',
      }
      vehicleInfoGetAvailableCar(params, reassignUnitCode).then(({ data = [] }) => {
        this.requestRefreshLoading = false;
        this.requestFinished = true;
        this.requestLoading = false;
        this.carData = data || [];
      }).catch(() => {
        console.log('err')
      });
    },
    returnDetails() {
      this.$router.go(-1);
    },
    determine() {
      let radio = this.radio;
      if (!radio) {
        this.$toast("请选择车型！");
        return false;
      }
      if(this.status !== 'reset'){
        let obj = this.reqAssignments.some((item) => {
          return item.carInfo.carNumber===radio;
        })
        if(!!obj){
          this.$toast("该车辆已经选择过，无法重复选择!");
          return false;
        }
      }
      
      // return
      // const id = this.$route.params.id;
      // const type = this.$route.params.type;
      const {
        reqAssignmentsIndex,
        // usageDate,
        // unitCode,
      } = this.$route.query;
      // this.$store.dispatch("DispathOrder/setChoiceVehicie", this.radioData);
      this.$store.dispatch('DispathOrder/setCarAndDriverData', { ...this.radioData, reqAssignmentsIndex, setDataType: 'carInfo' })
      this.$router.push({
        name: 'DispathDriver',
        params:this.$route.params,
        query: Object.assign(this.$route.query, {vinNumber:this.radioData.vinNumber},{reqAssignmentsIndex:reqAssignmentsIndex})
      });
      // let typeDriver = '0';
      // if(this.typeVehicie === 'Vehicie'){
      //     typeDriver = 'Driver';
      // }else if(this.typeVehicie === 'addVehicie') {
      //     typeDriver = 'addDriver'; //新增
      // }else{
      //     typeDriver = '0';
      // }
      // this.$router.push({
      //     name: 'ChoiceDriver',
      //     params: {typeDriver: typeDriver}
      // });
    },

    // 查询车辆限行
    viewCarIsDriving(carNumber, _index) {
      const { usageDate, cityId } = this.$route.query || {};
      let obj = {
        carNumber: carNumber,
        date: usageDate,
        cityId,
      }
      carIsDriving(obj).then(({ message }) => {
        if (!message) {
          this.isDisableDriving = ''
        }
        if (message !== '操作成功') {
          this.isDisableDriving = `${message}限行`
        } else {
          this.isDisableDriving = '不限行'
        }
      })
    },
  },
  created() {
    let typeVehicie = this.$route.params.typeVehicie;
    this.typeVehicie = typeVehicie
    let type = this.$route.params.type
    this.type = type
     
    this.getAvailableCar();

    const { reqAssignmentsIndex } = this.$route.query || {};
    this.status = this.$route.query.status;


    //  this.$store.dispatch('DispathOrder/setCarAndDriverData', { undefined, reqAssignmentsIndex, setDataType: 'carInfo' })
    //   this.$store.dispatch('DispathOrder/setCarAndDriverData', { undefined, reqAssignmentsIndex, setDataType: 'driverInfo' })

    if( this.status !== 'add' &&  this.status !== 'reset'){
      this.$store.dispatch('DispathOrder/setCarAndDriverData', { undefined, reqAssignmentsIndex, setDataType: 'carInfo' })
    }
  }
}
</script>
<style scoped lang="less">
.ChoiceVehicies {
  width: 100%;
  height: calc(100% - 45px);
  background-color: #fff;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-flex-direction: column;
  overflow: hidden;
  .list_overflow {
    flex: 1;
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
  }
}
// 限行信息系
.disabled-driving {
  color: #e77676;
}
</style>