<template>
  <div
    class="not-class"
    ref="notClass"
  >
    <van-tabs
      type="card"
      :sticky="true"
      v-model="activeIndex"
      :animated="true"
      offset-top="0px"
    >
      <van-tab
        title="未完成"
        :name="0"
      >
        <van-pull-refresh
          v-model="requestRefresh"
          @refresh="orderOnRefresh"
          animation-duration="500"
          success-text="刷新成功"
        >
          <van-list
            v-model="requestLoading"
            offset="30"
            :finished="requestFinished"
            :immediate-check="true"
            finished-text="没有更多了..."
            @load="getOrderList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in requestList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <div
                :key="childItem.reqNo + index"
                v-for="(childItem, index) in item"
                @click="goOrderDetailClick(childItem.id)"
              >
                <OrderListCardItem
                  :child-item="childItem"
                  :dict-data="dictData"
                />
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab
        title="历史订单"
        :name="1"
      >
        <van-pull-refresh
          v-model="historyRefresh"
          @refresh="historyOnRefresh"
          animation-duration="500"
          success-text="刷新成功"
        >
          <van-list
            v-model="historyLoading"
            offset="30"
            :finished="historyFinished"
            :immediate-check="true"
            finished-text="没有更多了..."
            @load="getOrderHistoryOrderList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in historyList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <div
                :key="childItem.reqNo + index"
                v-for="(childItem, index) in item"
                @click="goOrderDetailClick(childItem.id)"
              >
                <OrderListCardItem
                  :child-item="childItem"
                  :dict-data="dictData"
                />
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <div
      class="add-btn"
      @click="goStartApplyClick"
    ></div>
  </div>
</template>
<script>
import { orderRequestList } from '@/api/order'
import getDict from "@/view/mixins/getDict"
import { mapGetters } from 'vuex'
export default {
  name: 'OutstandOrder',
  mixins: [getDict],
  computed: mapGetters('CarApplication', ['isFefresh']),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let timer = setTimeout(() => {
        vm.$refs.notClass.scrollTop = to.meta.scrollTop;
        clearTimeout(timer);
      }, 0);
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'OrderDetail') {   // 去往详情页
      let notClass = this.$refs.notClass;
      let top = notClass.scrollTop;
      from.meta.scrollTop = top;
    }
    next();
  },
  data() {
    return {
      activeIndex: 0,

      requestRefresh: false,
      requestLoading: false,
      requestFinished: false,

      requestList: {},
      requestKeys: 0,
      requestQuery: {
        pageSize: 10,
        pageNum: 0,
        orderByColumn: 'usageDate',
        isAsc: 'asc'
      },

      historyRefresh: false,
      historyLoading: false,
      historyFinished: false,
      historyList: {},
      historyQuery: {
        pageSize: 10,
        pageNum: 0,
        orderByColumn: 'usageDate',
        isAsc: 'asc'
      },

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
    }
  },
  methods: {
    orderOnRefresh() {
      this.requestFinished = false;
      this.requestQuery.pageNum = 0;
      this.requestLoading = true;
      this.getOrderList();
    },
    historyOnRefresh() {
      this.historyFinished = false;
      this.historyQuery.pageNum = 0;
      this.historyLoading = true;
      this.getOrderHistoryOrderList();
    },
    dealArrToObject(arr = [], key = '') {
      //   return Object.fromEntries(arr.map((item) => [item[key], [item]]));
      return arr.map((item) => [item[key], [item]]);
    },
    // 用车申请列表 1为历史订单，2为未完成订单
    getOrderList() {
      let pageNum = this.requestQuery.pageNum;
      this.requestLoading = true;
      this.requestQuery.pageNum = pageNum + 1;
      const params = {
        ...this.requestQuery,
        // 1为历史订单，2为未完成订单
        isFinsh: '2',
      }
      orderRequestList(params).then(({ data }) => {
        if (this.requestRefresh && this.requestQuery.pageNum === 1) {
          this.requestList = {};
        }
        this.requestRefresh = false;
        if (data?.list?.length === 0) {
          this.requestFinished = true;
          return;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.requestList = this.computedGroupDate(list, 'requestList')
      }).catch((error) => {
        console.log('getOrderList', error)
      }).finally(() => {
        this.requestLoading = false;
      });
    },
    // 处理返回的数据 将相同日期的数据合并    
    computedGroupDate(data, dataKey) {
      let list = this[dataKey];
      for (let item of data) {
        if (Object.keys(list).includes(item[0])) {
          list[item[0]] = list[item[0]].concat(item[1]);
        } else {
          list[item[0]] = item[1];
        }
      }
      return list;
    },
    getOrderHistoryOrderList() {  // 用车申请历史订单列表
      let pageNum = this.historyQuery.pageNum;
      this.historyLoading = true;
      this.historyQuery.pageNum = pageNum + 1;
      const params = {
        ...this.requestQuery,
        // 1为历史订单，2为未完成订单
        isFinsh: '1',
      }
      this.historyFinished = false;
      orderRequestList(params).then(({ data }) => {
        if (this.historyRefresh && this.historyQuery.pageNum === 1) {
          this.historyList = {};
        }
        this.historyRefresh = false;
        if (data?.list?.length === 0) {
          this.historyFinished = true;
          return;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.historyList = this.computedGroupDate(list, 'historyList')
      }).catch(() => {
        alert('err')
      }).finally(() => {
        this.historyLoading = false;
      });
    },
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = Object.fromEntries(res.map(item => [item.code, item.name]))
      }
    },
    goStartApplyClick() {
      this.$router.push({
        name: 'StartApplying',
        params: { id: '0' }
      });
    },
    goOrderDetailClick(id) {
      this.$router.push({
        name: 'OrderDetail',
        params: { id }
      });
    },
  },
  activated() {
    if (this.isFefresh) {
      if (this.activeIndex) {
        this.historyRefresh = true;
        this.historyOnRefresh();
      } else {
        this.requestRefresh = true;
        this.orderOnRefresh();
      }

      let timer = setTimeout(() => {
        this.$refs.notClass.scrollTop = 0;
        clearTimeout(timer);
      }, 0);
      this.$store.dispatch('CarApplication/triggerFefresh', false);
    }
  },
  async created() {
    this.$store.commit('removeThisPage', 'StartApplying')
    await this.handleSystemCardDict(this.dictIds);
  }
}
</script>