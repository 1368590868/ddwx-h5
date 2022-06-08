<template>
  <div class="apply-container container">
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="getSuggestionList"
      offset="30"
      :finished="finished"
      finished-text="没有更多了..."
    >
      <div
        class="list-item"
        v-for="item in list"
        :key="item.id"
        @click="viewDetail(item.id)"
      >
        <div class="item-left">
          <div class="suggestion-info item-info">
            <div>{{ suggestionTypeFormatObj[item.suggestion] }}</div>
            <div class="content">
              {{ item.suggestionContext }}
            </div>
          </div>
          <div class="replay-info item-info">
            <div>反馈回复</div>
            <div class="content">{{ item.replyContext }}</div>
          </div>
        </div>
        <div class="item-right">
          >
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import { getSelfSuggestion } from '@/api/suggestion'
import getDict from "@/view/mixins/getDict"
export default {
  mixins: [getDict],
  filters: {
  },
  data() {
    return {
      pageQuery: {
        pageSize: 10,
        pageIndex: 0
      },
      // 意见分类
      suggestionTypeFormatObj: {},
      list: [],
      error: false,
      loading: false,
      finished: false,
    }
  },
  methods: {
    onFailed() {

    },
    onSubmit() {

    },
    // 获取反馈意见历史
    getSuggestionList() {
      let pageIndex = this.pageQuery.pageIndex;
      this.loading = true;
      this.pageQuery.pageIndex = pageIndex + 1;
      getSelfSuggestion(this.pageQuery).then(({ data }) => {
        this.list = data.list || [];
        // if (data.list.length === 0) {
        this.finished = true;
        // }
        this.loading = false;
      })
    },
    // 获取字典
    async getOperateDict(parentId = '') {
      // 获取意见分类
      const suggestionType = (await this.getCommonDictList(parentId) ?? []) || [];
      this.suggestionTypeFormatObj = Object.fromEntries(suggestionType.map(item => [item.code, item.name]))
      console.log("🚀 ~ file: index.vue ~ line 77 ~ getOperateDict ~ this.suggestionTypeFormatObj", this.suggestionTypeFormatObj)
    },
    viewDetail(id) {
      this.$router.push({
        path: 'suggestionDetail',
        params: {
          id
        }
      });
    }
  },
  created() {
    this.getOperateDict('10022');
  }
}
</script>
<style lang="less" scoped>
.list-item {
  // background-color: #ccc;
  display: flex;
  justify-content: center;
  padding: 10px;
  // background-color: #ccc;
  .item-left {
    // background-color: purple;
    width: 100%;
  }
  .item-right {
    width: 30px;
    // background-color: skyblue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item-info {
    display: flex;
    width: 100%;
    // background-color: pink;
    margin-bottom: 5px;
    & > div:nth-of-type(1) {
      width: 20%;
      margin-right: 10px;
      // background-color: red;
    }
    & > div:nth-of-type(2) {
      width: 75%;
      overflow-x: hidden;
      text-overflow: ellipsis;
      // background-color: blue;
    }
  }
}
</style>