<template>
  <div class="not-class">
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
        @click="viewDetail(item)"
      >
        <h5>{{ item.creaetDate | timeAgo('{y}年{m}月{d}日') }}</h5>
        <div class="item-content">
          <div class="item-left">
            <div class="suggestion-info item-info">
              <div>反馈类别:&nbsp;{{ suggestionTypeFormatObj[item.suggestion] }}</div>
              <div class="content">
                {{ item.suggestionContext }}
              </div>
            </div>
            <div class="replay-info item-info">
              <div>反馈回复:</div>
              <div class="content">{{ item.replyContext }}</div>
            </div>
          </div>
          <div class="item-right">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div
        class="add-btn"
        @click="$router.push({path: 'createSuggestion'})"
      ></div>
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
        pageNum: 0
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
      let pageNum = this.pageQuery.pageNum;
      this.loading = true;
      this.pageQuery.pageNum = pageNum + 1;
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
    viewDetail(item) {
      this.$router.push({
        path: 'suggestionDetail',
        query: {
          ...item
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
.container {
  background-color: #eee;
}
.list-item {
  & > h5 {
    padding: 5px 10px;
    font-size: 12px;
    font-weight: normal;
    color: #ccc;
    background-color: #eee;
  }
  .item-content {
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: #fff;
  }
  .item-left {
    // background-color: purple;
    width: 95%;
  }
  .item-right {
    width: 30px;
    // background-color: skyblue;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .item-info {
    // display: flex;
    width: 100%;
    // background-color: pink;
    margin-bottom: 5px;
    & > div:nth-of-type(1) {
      // width: 20%;
      // margin-right: 5px;
      // background-color: red;
      padding-left: 15px;
      margin: 5px 0;
    }
    & > div:nth-of-type(2) {
      // width: 75%;
      // background-color: blue;
      // overflow: hidden;
      padding-left: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>