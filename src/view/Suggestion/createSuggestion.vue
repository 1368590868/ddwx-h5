<template>
  <div class="apply-container container">
    <van-form
      class="form-scroll"
      validate-first
      @failed="onFailed"
      @submit="onSubmit"
    >
      <div class="form-warpper">
        <div class="form-block">
          <div class="log-title">(必选)请输入您想反馈的问题点</div>
          <van-field name="radio">
            <template #input>
              <van-radio-group v-model="formData.suggestion">
                <van-radio
                  :key="item.code"
                  :name="item.code"
                  v-for="item in suggestionList"
                >
                  {{item.name}}
                </van-radio>
              </van-radio-group>
            </template>
          </van-field>

        </div>
        <div class="form-block">
          <div class="log-title">请补充详细问题跟意见</div>
          <van-field
            v-model="formData.suggestionContext"
            type="textarea"
            rows="5"
            placeholder="请输入详细问题跟意见"
            maxlength="240"
            show-word-limit
          >
          </van-field>
        </div>
      </div>
      <div class="form-button">
        <van-button
          block
          type="info"
          native-type="submit"
        >提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { addSuggestion } from '@/api/suggestion'
import getDict from "@/view/mixins/getDict"

export default {
  mixins: [getDict],
  data() {
    return {
      formData: {
        // 意见分类编码
        suggestion: '1002201',
        suggestionContext: '',
        // 操作端  
        operatorType: '101302'
      },
      suggestionList: [],
    }
  },
  methods: {
    onFailed() {

    },
    async onSubmit() {
      try {
        const res = await addSuggestion(this.formData);
        if (res.code != 0) {
          this.$toast.fail("提交失败！");
        } else {
          this.$toast.success("提交成功！")
          this.$router.push({
            path: 'index',
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取字典
    async getOperateDict(parentId = '') {
      // 获取意见分类
      this.suggestionList = (await this.getCommonDictList(parentId) ?? []) || [];
    },
    // 获取字典
  },
  created() {
    this.getOperateDict('10022')
  }
}
</script>
<style lang="less" scoped>
.van-radio-group {
  background: #fff;
  padding: 10px 0px;
}
.van-radio {
  padding: 10px;
}
</style>