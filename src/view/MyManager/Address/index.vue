<template lang="">
    <div>
        <!--出发地-->
        <div class="title-address">
            <div>
                <van-icon name="location-o" class="icon-address"/><span>出发地</span>
            </div>
            <van-icon name="plus"  class="icon-address"/>
        </div>
        <van-list
            v-model="loading"
            :finished="finished"
            @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list> 
        <!--目的地-->
        <div class="title-address">
            <div>
                <van-icon name="location-o" class="icon-address"/><span>目的地</span>
            </div>
            <van-icon name="plus"  class="icon-address"/>
        </div> 
        
    </div>
</template>
<script>
export default {
    name:"Address",

    data () {
        return {
            list: [],
            loading: false,
            finished: false,
        }
    },
    methods:{
        onLoad() {
            // 异步更新数据
            // setTimeout 仅做示例，真实场景中一般为 ajax 请求
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1);
                }

                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 10) {
                    this.finished = true;
                }
            }, 1000);
        },
    }
}
</script>
<style>
    .title-address{
        display: flex;
        flex-flow:  row nowrap;
        justify-content: space-between;
        align-items: center;
        line-height: 40px;
        background-color:#f2f4f8;
        padding-left: 15px;
        padding-right: 10px;
        font-size: 18px;
    }
    .icon-address{
        margin-right: 5px;
        color: rgb(64, 158, 255);
        font-size: 18px;
    }
</style>