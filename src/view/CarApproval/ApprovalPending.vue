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
        title="待审批"
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
            finished-text="没有更多了..."
            @load="orderRequestList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in approvalOrderList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <ul
                v-for="(childItem, index) in item"
                :class="['list-ul', childItem.longDistanceTag == 1 ? 'longway':''] "
                :key="childItem.reqNo + index"
                @click="goOrderDetailClick(childItem.nAutoId)"
              >
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
                    {{childItem.fromAddr.split('/')[2].split(' ')[1]}}
                    &nbsp;到&nbsp;
                    {{childItem.toAddr.split('/')[2].split(' ')[1]}}
                  </span>
                </li>
                <li class="info-label">
                  <span>分派车辆：</span>
                  <span class="infor-overflow">
                    <!-- {{childItem.brand || '空的'}} -->
                    {{childItem.carNumber}}
                  </span>
                </li>
                <li class="info-label"><span>分派司机：</span><span>{{childItem.driver}}</span></li>
                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
              </ul>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab
        title="已审批"
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
            finished-text="没有更多了..."
            @load="orderHistoryOrderList"
          >
            <div
              class="list-container"
              v-for="(item, usageDate) in approvedOrderList"
              :key="usageDate"
            >
              <div class="log-title">{{usageDate}}</div>
              <ul
                v-for="(childItem, index) in item"
                :class="['list-ul', childItem.longDistanceTag == 1 ? 'longway':''] "
                :key="childItem.reqNo + index"
                @click="goOrderDetailClick(childItem.nAutoId)"
              >
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
                    {{childItem.fromAddr.split('/')[2].split(' ')[1]}}
                    &nbsp;到&nbsp;
                    {{childItem.toAddr.split('/')[2].split(' ')[1]}}
                  </span>
                </li>
                <li class="info-label">
                  <span>分派车辆：</span>
                  <span class="infor-overflow">
                    <!-- {{childItem.brand || '空的'}} -->
                    {{childItem.carNumber}}
                  </span>
                </li>
                <li class="info-label"><span>分派司机：</span><span>{{childItem.driver}}</span></li>
                <li class="info-label"><span>订 单 号 ：</span><span>{{childItem.reqNo}}</span></li>
              </ul>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { approvalOrderList } from '@/api/order'
import getDict from "@/view/mixins/getDict"
import { mapGetters } from 'vuex'
export default {
  mixins: [getDict],
  computed: mapGetters('CarApplication', ['isFefresh']),
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
    if (to.name === 'Approvaldetails') {   // 去往详情页
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

      approvalOrderList: {},
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
      approvedOrderList: {},
      historyQuery: {
        pageSize: 10,
        pageNum: 0,
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
    orderOnRefresh() {
      this.requestFinished = false;
      this.requestQuery.pageNum = 0;
      this.requestLoading = true;
      this.orderRequestList();
    },
    historyOnRefresh() {
      this.historyFinished = false;
      this.historyQuery.pageNum = 0;
      this.historyLoading = true;
      this.orderHistoryOrderList();
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
    orderRequestList() {    // 用车审批待审批列表
      let pageNum = this.requestQuery.pageNum;
      this.requestLoading = true;
      this.requestQuery.pageNum = pageNum + 1;
      const params = {
        ...this.requestQuery,
        // 待审审核的状态
        status: '1',
      }
      approvalOrderList(params).then(({ data }) => {
        if (this.requestRefresh && this.requestQuery.pageNum === 1) {
          this.approvalOrderList = {};
        }
        this.requestRefresh = false;
        if (data?.list?.length === 0) {
          this.requestFinished = true;
          return;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.approvalOrderList = this.computedGroupDate(list, 'approvalOrderList')
        this.requestLoading = false;
      }).catch((e) => {
        console.error(e);
        alert("错误");
      });
    },
    orderHistoryOrderList() {  // 用车审批已审批列表
      let pageNum = this.historyQuery.pageNum;
      this.historyLoading = true;
      this.historyQuery.pageNum = pageNum + 1;
      const params = {
        ...this.historyQuery,
        // 已审核的固定参数
        reviewCompleted: '1',
      }
      approvalOrderList(params).then(({ data }) => {
        if (this.historyRefresh && this.historyQuery.pageNum === 1) {
          this.approvedOrderList = {};
        }
        this.historyRefresh = false;
        if (data?.list?.length.length === 0) {
          this.historyFinished = true;
        }
        let list = data?.list || [];
        list = this.dealArrToObject(list, 'usageDate') || [];
        this.approvedOrderList = this.computedGroupDate(list, 'approvedOrderList')
        this.historyLoading = false;
      }).catch(() => {
        alert("错误");
      });
    },
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
    goOrderDetailClick(id) {
      this.$router.push({
        name: 'Approvaldetails',
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
    await this.handleSystemCardDict(this.dictIds);
  },
}
</script>