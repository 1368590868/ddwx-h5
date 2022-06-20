<template>
  <div class='select-car-item-card'>
    <div>选择车辆 分派车辆时注意所在地限行法规</div>
    <div class="car-card card">
      <div
        class="car-item info-item"
        v-for="(car, index) in carDataList"
        :key="`${car.carNumber ? car.carNumber + index : index}`"
        :style="`visibility: ${car.carNumber ? '' : 'hidden'}`"
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
  name: 'SelectCarItemCard',
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
          console.log("🚀 ~ file: SelectCarItemCard.vue ~ line 93 ~ handler ~ this.driverDataList", this.driverDataList.length)
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

  },
};
</script>

<style scoped lang="less">
div {
  box-sizing: border-box;
}
.select-car-item-card {
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
