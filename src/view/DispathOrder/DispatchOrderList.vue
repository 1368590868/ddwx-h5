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
        title="待派单"
        :name="0"
      >
        <van-pull-refresh
          v-model="dispatchRefresh"
          @refresh="dispatchOnRefresh"
          success-text="刷新成功"
        >
          <van-list
            v-model="dispatchLoading"
            offset="30"
            :finished="dispatchFinished"
            finished-text="没有更多了..."
            @load="dispatchDispatchList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in dispatchList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <div
                :key="childItem.reqNo + index"
                v-for="(childItem, index) in item"
                @click="goOrderDetailClick(childItem.id, detailType, 'dispatch')"
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
        title="已派单"
        :name="1"
      >
        <van-pull-refresh
          v-model="dispatchedRefreshLoading"
          @refresh="dispatchedRefresh"
          success-text="刷新成功"
        >
          <van-list
            v-model="dispatchedLoading"
            offset="30"
            :finished="dispatchedFinished"
            finished-text="没有更多了..."
            @load="dispatchDispatchedList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in dispatchedList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <div
                :key="childItem.reqNo + index"
                v-for="(childItem, index) in item"
                @click="goOrderDetailClick(childItem.id, detailType, 'dispatched')"
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
        :name="2"
      >
        <van-pull-refresh
          v-model="historyRefreshLoading"
          @refresh="historyRefresh"
          success-text="刷新成功"
        >
          <van-list
            v-model="historyLoading"
            offset="30"
            :finished="historyFinished"
            finished-text="没有更多了..."
            @load="dispatchHistoryList"
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
                @click="goOrderDetailClick(childItem.id, detailType, 'history')"
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
      @click="goStartDispatch"
    ></div>

  </div>
</template>
<script>
import { gcywVehicleRequestDispatchList } from '@/api/order'
import getDict from "@/view/mixins/getDict"
// import keepPages from '@/view/mixins/keepPages'
import { mapGetters } from 'vuex'
export default {
  name: 'DispatchOrderList',
  mixins: [
    getDict,
    // keepPages,
  ],
  computed: mapGetters('DispathOrder', ['isFefresh']),
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
    if (to.name === 'DispatchDetails') {   // 去往详情页
      let notClass = this.$refs.notClass;
      let top = notClass.scrollTop;
      from.meta.scrollTop = top;
    }
    next();
  },
  data() {
    return {
      activeIndex: 0,
      dispatchLoading: false,
      dispatchFinished: false,
      dispatchRefresh: false,
      dispatchList: {},
      dispatchQuery: {
        pageSize: 10,
        pageNum: 0,
        status: 4,
      },

      dispatchedLoading: false,
      dispatchedFinished: false,
      dispatchedRefreshLoading: false,
      dispatchedList: {},
      dispatchedQuery: {
        pageSize: 10,
        pageNum: 0,
        dispatchedStatus: 1,
      },

      historyLoading: false,
      historyFinished: false,
      historyRefreshLoading: false,
      historyList: {},
      historyQuery: {
        pageSize: 10,
        pageNum: 0,
        status: 11,
      },
      detailType: 1,

      // 按照出发日期升序
      commonQuery: {
        orderByColumn: 'usageDate',
        isAsc: 'asc'
      },
      dictIds: {
        // 订单状态
        statusDict: '1522830760585670657',
      },
      dictData: {
        statusDict: '',
      },
    }

  },
  methods: {
    dispatchOnRefresh() {
      //清空
      this.dispatchFinished = false;
      this.dispatchQuery.pageNum = 0;
      //重新加载
      this.dispatchRefresh = true;
      this.dispatchDispatchList();
    },
    historyRefresh() {
      //清空
      this.historyFinished = false;
      this.historyQuery.pageNum = 0;
      //重新加载
      this.historyRefreshLoading = true;
      this.dispatchHistoryList();
    },
    dispatchedRefresh() {
      //清空
      this.dispatchedFinished = false;
      this.dispatchedQuery.pageNum = 0;
      //重新加载
      this.dispatchedRefreshLoading = true;
      this.dispatchDispatchedList();
    },
    // 
    dealArrToObject(arr = [], key = '') {
      //   return Object.fromEntries(arr.map((item) => [item[key], [item]]));
      return arr.map((item) => [item[key], [item]]);
    },
    // 获取当前页面的通用字典下拉数据
    async handleSystemCardDict(dict = {}) {
      for (const item in dict) {
        const res = await this.getCommonDictList(dict[item]) || [];
        this.dictData[item] = Object.fromEntries(res.map(item => [item.code, item.name]))
      }
    },
    dispatchDispatchList() {    // 待派单
      let pageNum = this.dispatchQuery.pageNum;
      this.dispatchLoading = true;
      this.dispatchQuery.pageNum = pageNum + 1;
      const params = {
        ...this.dispatchQuery,
        // ...this.commonQuery
      }
      gcywVehicleRequestDispatchList(params).then(({ data }) => {
        if (this.dispatchRefresh && this.dispatchQuery.pageNum === 1) {
          this.dispatchList = {};
        }
        this.dispatchRefresh = false;
        if (data?.list?.length === 0) {
          this.dispatchFinished = true;
          return;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.dispatchList = this.computedGroupDate(list, 'dispatchList')
      }).catch((e) => {
        console.error(e);

        this.dispatchFinished = true;
        alert("错误");
      }).finally(() => {
        this.dispatchLoading = false;
      });
    },
    dispatchDispatchedList() {  // 已派单
      let pageNum = this.dispatchedQuery.pageNum;
      this.dispatchedLoading = true;
      this.dispatchedQuery.pageNum = pageNum + 1;
      const params = {
        ...this.dispatchedQuery,
        // ...this.commonQuery
      }
      gcywVehicleRequestDispatchList(params).then(({ data }) => {
        if (this.dispatchedRefreshLoading && this.dispatchedQuery.pageNum === 1) {
          this.dispatchedList = {};
        }
        this.dispatchedRefreshLoading = false;
        if (data?.list?.length === 0) {
          this.dispatchedFinished = true;
          return;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.dispatchedList = this.computedGroupDate(list, 'dispatchedList')
      }).catch((e) => {
        this.dispatchedFinished = true;
        console.error(e);
        alert("错误");
      }).finally(() => {
        this.dispatchedLoading = false;
      });
    },

    dispatchHistoryList() {  // 历史订单
      let pageNum = this.historyQuery.pageNum;
      this.historyLoading = true;
      this.historyQuery.pageNum = pageNum + 1;

      const params = {
        ...this.historyQuery,
        // ...this.commonQuery
      }
      gcywVehicleRequestDispatchList(params).then(({ data }) => {
        if (this.historyRefreshLoading && this.historyQuery.pageNum === 1) {
          this.historyList = {};
        }
        this.historyRefreshLoading = false;
        if (data?.list?.length === 0) {
          this.historyFinished = true;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.historyList = this.computedGroupDate(list, 'historyList')
      }).catch((e) => {
        this.historyFinished = true;
        console.error(e);
        alert("错误");
      }).finally(() => {
        this.historyLoading = false;
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
    goStartDispatch() {
      this.$router.push({
        name: 'DispathApply',
        params: { id: '0', type: '0' }
      });
    },
    goOrderDetailClick(id, type, orderType) {
      this.$router.push({
        name: 'DispatchDetails',
        params: { id, type },
        query: { orderType }
      });
    }
  },
  activated() {
    if (this.$route.query.refresh) {
      this.dispatchOnRefresh();
    }
    if (this.isFefresh) {
      if (this.activeIndex === 0) {
        this.dispatchOnRefresh();
      } else if (this.activeIndex === 1) {
        this.dispatchedRefresh();
      } else if (this.activeIndex === 2) {
        this.historyRefresh();
      }

      let timer = setTimeout(() => {
        this.$refs.notClass.scrollTop = 0;
        clearTimeout(timer);
      }, 0);
      this.$store.dispatch('DispathOrder/triggerFefresh', false);
    }
  },
  async created() {
    // this.$store.commit('removeThisPage', 'DispatchOrderList')
    await this.handleSystemCardDict(this.dictIds);
  },
}
</script>