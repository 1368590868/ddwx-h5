<template>
  <div class="not-class">
    <div class="suggestion-detail">
      <div class="suggestion">
        <h3>意见反馈<span>{{ detailInfo.creaetDate | timeAgo('{y}年{m}月{d}日 {h}:{i}:{s}') }}</span></h3>
        <div class="title">{{ suggestionTypeFormatObj[detailInfo.suggestion] }}</div>
        <div class="content">{{ detailInfo.suggestionContext }}</div>
      </div>
      <div class="replay">
        <h3>回 复<span>{{ detailInfo.replyTime | timeAgo('{y}年{m}月{d}日 {h}:{i}:{s}') }}</span><span>{{detailInfo.replyUser}}回复</span></h3>
        <div class="content">
          {{detailInfo.replyContext}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import getDict from "@/view/mixins/getDict"
export default {
  mixins: [getDict],
  filters: {
  },
  data() {
    return {
      // 意见分类
      suggestionTypeFormatObj: {},
      detailInfo: {},
    }
  },
  methods: {
    // 获取字典
    async getOperateDict(parentId = '') {
      // 获取意见分类
      const suggestionType = (await this.getCommonDictList(parentId) ?? []) || [];
      this.suggestionTypeFormatObj = Object.fromEntries(suggestionType.map(item => [item.code, item.name]))
    },
  },
  created() {
    this.detailInfo = this.$route.query;
    this.getOperateDict('10022');
  }
}
</script>
<style lang="less" scoped>
.container {
  background-color: #eee;
}
.suggestion-detail {
  h3 {
    color: #1989fa;
    font-weight: normal;
    font-size: 18px;
    span {
      padding-left: 10px;
      color: #272b31;
      font-weight: normal;
      font-size: 14px;
    }
  }
  .content {
    line-height: 25px;
    padding: 10px 25px;
  }
}
.suggestion {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 30px;
  .title {
    padding-left: 25px;
    margin: 5px 0;
    font-size: 16px;
  }
}
.replay {
  padding: 15px;
  background-color: #fff;
  margin-bottom: 30px;
  .content {
    background-color: #fff;
    color: #bbb;
  }
}
</style>