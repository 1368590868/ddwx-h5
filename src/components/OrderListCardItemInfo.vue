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
      <div class="info-label">
        <span>分派车辆：</span>
        <span
          class="infor-overflow"
          v-if="childItem.reqAssignments && childItem.reqAssignments.length === 1"
        >
          {{childItem.reqAssignments[0]['carBrand'] || ''}}
          {{childItem.reqAssignments[0]['carNumber'] || ''}}
        </span>
        <span
          class="infor-overflow"
          v-else-if="childItem.reqAssignments && childItem.reqAssignments.length >= 1"
        >
          {{childItem.reqAssignments[0]['carBrand'] || ''}}
          {{`${childItem.reqAssignments[0]['carNumber']} 等${childItem.reqAssignments.length}辆` || ''}}
        </span>
        <span
          class="-overflow"
          v-else
        >
          暂未分配
        </span>
      </div>
      <li class="info-label" v-if="childItem.reqAssignments && childItem.reqAssignments.length === 1"><span>分派司机：</span><span>{{childItem.reqAssignments[0]['driver'] || ''}}</span></li>
      <li class="info-label" v-else-if="childItem.reqAssignments && childItem.reqAssignments.length > 1"><span>分派司机：</span><span>{{`${childItem.reqAssignments[0]['driver']} 等${childItem.reqAssignments.length}位` || ''}}</span></li>
      <li class="info-label" v-else><span>分派司机：</span><span>暂未分配</span></li>
      <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'OrderListCardItemInfo',
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
