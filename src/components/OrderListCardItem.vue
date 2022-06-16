<template>
  <div class="order-list-card-item">
    <ul :class="['list-ul', childItem.longDistanceTag == 1 ? 'longway':''] ">
      <li class="list-li">
        <div class="li-address"><b class="b1">
            {{childItem.fromAddr.split('/')[2].split(' ')[0]}}
          </b>
          <b class="b2">
            {{childItem.toAddr.split('/')[2].split(' ')[0]}}
          </b>
        </div>
        <div class="li-timestu">
          <time>{{childItem.usageTime}}</time>
          <span>出发</span>
          <b class="b-status">
            {{dictData.statusDict[childItem.status]}}
          </b>
        </div>
      </li>
      <li class="info-label"><span>详细地址：</span>
        <span>
          {{childItem.fromAddr.split('/')[2].split(' ')[1] | splitLongString}}
          &nbsp;到&nbsp;
          {{childItem.toAddr.split('/')[2].split(' ')[1] | splitLongString}}
        </span>
      </li>
      <li class="info-label">
        <span>分派车辆：</span>
        <span class="infor-overflow">
          {{childItem.carBrand}}
          {{childItem.carNumber}}
        </span>
      </li>
      <li class="info-label"><span>分派司机：</span><span>{{childItem.driver}}</span></li>
      <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'OrderListCardItem',
  components: {

  },
  filters: {
    splitLongString(str = '') {
      if (str?.length >= 8) {
        return str.substr(0, 7) + '...'
      }
      return str
    }
  },
  props: {
    childItem: {
      type: Object,
      default() {
        return {}
      },
    },
    dictData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  mounted() {
    console.log('orderListData', this.orderListData);
  },
  methods: {
    clickItem(id, orderType) {
      this.$emit('clickItem', id, orderType)
    }
  },
};
</script>

<style scoped lang="less">
.order-list-card-item {
  width: 100%;
}
.info-label {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
