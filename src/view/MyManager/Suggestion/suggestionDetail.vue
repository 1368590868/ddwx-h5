<template>
  <div class="apply-container container">
    <div class="suggestion-detail">
      <div class="suggestion">
        <h3>意见反馈 <span>2022年6月11日 21:30:52</span></h3>
        <div class="title">功能异常</div>
        <div class="content">
          系统太烂，哪儿都不好使！！！
          人工派车功能不好用，反人类设计。
        </div>
      </div>
      <div class="replay">
        <h3>回复<span>2022年6月11日 21:30:52</span></h3>
        <div class="content">
          已收到。正在解决中，预计近期修复上线
        </div>
      </div>
    </div>
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
  },
  created() {
    console.log('route', this.$route);
    this.getOperateDict('10022');
  }
}
</script>
<style lang="less" scoped>
.suggestion-detail {
  padding: 5px;
  h3 {
    color: #1989fa;
    font-size: 20px;
    span {
      color: #272b31;
      font-weight: normal;
      font-size: 14px;
    }
  }
}
.suggestion {
  margin-bottom: 30px;
  .title {
    padding-left: 25px;
    margin: 5px 0;
    font-size: 16px;
  }
}
.replay {
  margin-bottom: 30px;
}
.content {
  padding-left: 25px;
}
</style>