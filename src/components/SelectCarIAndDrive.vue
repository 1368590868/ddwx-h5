<template>
  <div class='Select-carI-and-drive'>
    <div>选择车辆 分派车辆时注意所在地限行法规</div>
    <div class="car-card card">
      <div
        class="car-item info-item"
        v-for="(car, index) in carDataList"
        :key="`${car.carNumber ? car.carNumber + index : index}`"
        :style="`visibility: ${car.carNumber ? '' : 'hidden'}`"
        @click="selectCar(car)"
      >
        <div class="car-number">
          {{ car.carNumber }}
        </div>
        <div class="car-type">
          {{ car.carBrand }} {{ car.carSeries }}
        </div>
      </div>
    </div>
    <div class="drive-card card">
      <div
        class="drive-item info-item"
        v-for="(item, index) in driverDataList"
        :key="`${item.driver ? item.driver + index : index}`"
        :style="`visibility: ${item.driver ? '' : 'hidden'}`"
        @click="selectDriver(item)"
      >
        <div class="drive-name">
          {{item.driver}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectCarIAndDrive',
  components: {

  },
  filters: {

  },
  props: {
    carData: {
      type: Array,
      default() {
        return []
      },
    },
    driverData: {
      type: Array,
      default() {
        return []
      },
    }
  },
  data() {
    return {
      carDataList: [],
      driverDataList: [],
      // 选中的车辆集合
      selectedCar: [],
      // 选中的司机集合
      selectedDriver: [],
    };
  },
  computed: {

  },
  watch: {
    carData: {
      handler(val) {
        this.carDataList = val;
        if (val?.length > 0 && 3 - val.length % 3 > 0) {
          const arr = []
          arr.length = 3 - val.length % 3;
          arr.fill({})
          this.carDataList = [...val, ...arr];
        }
      },
      immediate: true
    },
    driverData: {
      handler(val) {
        this.driverDataList = val;
        console.log('driverDataList', this.length);
        if (val?.length > 0 && 4 - val.length % 4 > 0) {
          const arr = []
          arr.length = 4 - val.length % 4;
          arr.fill({})
          this.driverDataList = [...val, ...arr];
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {

  },
  methods: {
    // 选中车辆
    selectCar(car) {
      // this.selectedCar.push(car)
      this.$emit('selectCar', car)
    },
    // 选中司机
    selectDriver(driver) {
      // this.selectedDriver.push(driver)
      this.$emit('selectDriver', driver)
    },
  },
};
</script>

<style scoped lang="less">
div {
  box-sizing: border-box;
}
.Select-carI-and-drive {
  width: 100%;
  background-color: #fff;
  background-color: pink;
  padding: 10px;
  .card {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .info-item {
      padding: 5px;
      width: 30%;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin: 5px 0;
      display: flex;
      flex-direction: column;
    }
    .car-item {
      background-color: skyblue;
      .car-number {
        display: flex;
        justify-content: center;
      }
      .car-type {
        display: flex;
        justify-content: center;
        font-size: 12px;
      }
    }
    .drive-item {
      background-color: cyan;
      width: 23%;
      .drive-name {
        display: flex;
        justify-content: center;
        font-size: 12px;
      }
    }
  }
}
</style>
