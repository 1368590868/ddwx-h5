<template>
  <div class="apply-container container">
    <van-form class="form-scroll" validate-first @failed="onFailed" @submit="onSubmit">
        <div class="form-warpper">
            <div class="form-block">
              <div class="log-title">(必选)请输入您想反馈的问题点</div>
                <van-field name="radio">
                  <template #input>
                    <van-radio-group v-model="formData.sSuggestionCode">
                      <van-radio :name="item.value" v-for="item in suggestionList">
                        {{item.label}}
                      </van-radio>
                    </van-radio-group> 
                  </template>
                </van-field>
                  
              </div>    
              <div class="form-block">
                <div class="log-title">请补充详细问题跟意见</div>
                <van-field v-model="formData.sRemark" type="textarea" rows="5" placeholder="请输入详细问题跟意见" maxlength="240" show-word-limit>
                </van-field>
              </div>
        </div> 
        <div class="form-button">
            <van-button block type="info" native-type="submit">提交</van-button>
        </div>     
    </van-form>
  </div>
</template>
<script>
  import {getSuggestion,saveSuggestion} from '@/api/suggestion'
export default{
  data() {
    return {
      formData:{
        sSuggestionCode:'0',
        sRemark:''
      },
      suggestionList:[]
    }
  },
  methods:{
    onFailed(){

    },
    onSubmit(){
      saveSuggestion(this.formData).then((res)=>{     
        if(res.code === 200){
          this.$toast.success("提交成功！")
          this.$router.push({
            path: '/MyManager',
          });
        }else{
          this.$toast.fail("提交失败！")
        }
      })
    },
    getSuggestion(){
      getSuggestion().then(({data})=>{
        this.suggestionList = data || []
      })
    }
  },
  created(){
    this.getSuggestion()
  }
}
</script>
<style lang="less" scoped>
  .van-radio-group{
    background: #fff;
    padding:10px 0px;
  }
  .van-radio{
      padding:10px
    }
</style>