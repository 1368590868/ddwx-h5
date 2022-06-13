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
              v-for="item in requestList"
              :key="item.id"
            >
              <div class="log-title">
                {{item.createTime | timeAgo('{y}-{m}-{d}')}}
              </div>
              <ul
                :class="['list-ul', item.longDistanceTag == 1 ? 'longway':''] "
                @click="goOrderDetailClick(item.id)"
              >
                <li class="list-li">
                  <div class="li-address">
                    <b class="b1">
                      {{item.fromAddr.split('/')[2].split(' ')[0]}}
                    </b>
                    <b class="b2">
                      {{item.toAddr.split('/')[2].split(' ')[0]}}
                    </b>
                  </div>
                  <div class="li-timestu">
                    <time>{{item.usageTime}}</time>
                    <span>出发</span>
                    <b class="b-status">{{dictData.statusDict[item.status]}}</b>
                  </div>
                </li>
                <li class="info-label">
                  <span>详细地址：</span>
                  <span class="infor-overflow">
                    {{item.fromAddr.split('/')[2].split(' ')[1]}}
                    &nbsp;到&nbsp;
                    {{item.toAddr.split('/')[2].split(' ')[1]}}
                  </span>
                </li>
                <div
                  v-for="(car, index) in item.reqAssignments"
                  :key="car.id"
                >
                  <li class="info-label">
                    <span>
                      分派车辆{{index + 1}}：
                    </span>
                    <span class="infor-overflow">
                      {{car.carNumber}}
                    </span>
                  </li>
                  <li class="info-label">
                    <span>分派司机{{index + 1}}：</span>
                    <span>
                      {{car.driver}}
                    </span>
                  </li>
                </div>
                <li class="info-label">
                  <span>订 单 号 ：</span>
                  <span>
                    {{item.reqNo}}
                  </span>
                </li>
              </ul>
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
              v-for="item in requestList"
              :key="item.id"
            >
              <div class="log-title">
                {{item.createTime | timeAgo('{y}-{m}-{d}')}}
              </div>
              <ul
                :class="['list-ul', item.longDistanceTag == 1 ? 'longway':''] "
                @click="goOrderDetailClick(item.id)"
              >
                <li class="list-li">
                  <div class="li-address">
                    <b class="b1">
                      {{item.fromAddr.split('/')[2].split(' ')[0]}}
                    </b>
                    <b class="b2">
                      {{item.toAddr.split('/')[2].split(' ')[0]}}
                    </b>
                  </div>
                  <div class="li-timestu">
                    <time>{{item.usageTime}}</time>
                    <span>出发</span>
                    <b class="b-status">{{dictData.statusDict[item.status]}}</b>
                  </div>
                </li>
                <li class="info-label">
                  <span>详细地址：</span>
                  <span class="infor-overflow">
                    {{item.fromAddr.split('/')[2].split(' ')[1]}}
                    &nbsp;到&nbsp;
                    {{item.toAddr.split('/')[2].split(' ')[1]}}
                  </span>
                </li>
                <div
                  v-for="(car, index) in item.reqAssignments"
                  :key="car.id"
                >
                  <li class="info-label">
                    <span>
                      分派车辆{{index + 1}}：
                    </span>
                    <span class="infor-overflow">
                      {{car.carNumber}}
                    </span>
                  </li>
                  <li class="info-label">
                    <span>分派司机{{index + 1}}：</span>
                    <span>
                      {{car.driver}}
                    </span>
                  </li>
                </div>
                <li class="info-label">
                  <span>订 单 号 ：</span>
                  <span>
                    {{item.reqNo}}
                  </span>
                </li>
              </ul>
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

      requestList: [],
      requestKeys: 0,
      requestQuery: {
        pageSize: 10,
        pageNum: 0
      },

      historyRefresh: false,
      historyLoading: false,
      historyFinished: false,
      historyList: [],
      historyQuery: {
        pageSize: 10,
        pageNum: 0
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
        this.requestRefresh = false;
        if (data?.list?.length === 0) {
          this.requestFinished = true;
        }
        this.requestList = [...this.requestList, ...data.list];
      }).catch((error) => {
        console.log('getOrderList', error)
      }).finally(() => {
        this.requestLoading = false;
      });
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
        if (data?.list?.length === 0) {
          this.historyFinished = true;
        }
        this.historyList = [...this.historyList, ...data.list];
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
        params: { autoId: '0' }
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
    await this.handleSystemCardDict(this.dictIds);
  }
}
</script>