<template>
  <div class='changeOder'>
    <p class="titleVeh">
      <span>请选择转派单位</span>
    </p>
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
          @load="getTurnUnitList"
        >
          <van-radio-group v-model="radio">
            <div
              class="van-radio-groups"
              v-for="item in turnUnitData"
              :key="item.id"
              @click="radioClick(item)"
            >
              <van-radio :name="item.turnUnitCode" />
              <p>
                <span>{{item.turnUnitName}}</span>
              </p>
            </div>
          </van-radio-group>
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="button-box">
      <van-button
        block
        type="default"
        @click="$router.go(-1)"
      >上一步</van-button>
      <van-button
        block
        type="info"
        @click="confirmChange"
      >
        确定转派
      </van-button>
    </div>
  </div>
</template>

<script>
import { getTurnUnit, changeOrder } from '@/api/dispatch'

export default {
  name: 'ChangeOder',
  components: {

  },
  filters: {

  },
  props: {

  },
  data() {
    return {
      requestLoading: false,
      requestFinished: false,
      requestRefreshLoading: false,
      radio: '',
      radioData: {},
      turnUnitData: [],
      type: '',
    };
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.getTurnUnitList()
  },
  mounted() {

  },
  methods: {
    // 刷新
    requestRefresh() {
      //清空
      this.requestRefreshLoading = true;
      this.requestFinished = false;
      this.requestLoading = true;
      //重新加载
      this.getTurnUnitList();
    },
    // 点及单选
    radioClick(val) {
      this.radioData = val;
      this.radio = val.turnUnitCode;
    },
    // 获取转派单位 转单单位
    getTurnUnitList() {
      this.requestLoading = true;
      getTurnUnit().then(({ data = [] }) => {
        this.requestRefreshLoading = false;
        this.requestFinished = true;
        this.requestLoading = false;
        this.turnUnitData = data || [];
      }).catch(() => {
        console.log('err')
      });
    },
    // 确认转单 转派
    async confirmChange() {
      let toast = this.$toast.loading({
        duration: 0,
        message: "提交中..",
        forbidClick: true
      });
      try {
        const radio = this.radio;
        if (!radio) {
          this.$toast("请选择转派单位！");
          return false;
        }
        const {
          id,
          // type,
        } = this.$route.params;
        const params = {
          id,
          reassignUnitCode: radio
        }
        const res = await changeOrder(params);
        if (res?.code === 0) {
          this.$toast.success("转派成功")
          // this.$router.replace({ name: 'DispatchDetails', params: { id, type } });
          this.$store.dispatch('DispathOrder/triggerFefresh', true);
          this.$router.push({
            name: 'DispatchOrderList',
          });
        } else {
          this.$toast.fail(res?.message || "转派失败!，请重试");
        }
      } catch (error) {
        this.$toast.fail("转派失败!，请重试");
      } finally {
        toast.clear();
      }
    }
  },
};
</script>

<style scoped lang="less">
.changeOder {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .list_overflow {
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
    display: flex;
    .van-radio {
      float: left;
      width: 6%;
      margin-left: 0px;
      .van-radio__icon--checked {
        .van-icon {
          width: 16px;
          height: 16px;
        }
      }
    }
    & > p {
      display: flex;
      align-items: center;
    }
  }
}
</style>
