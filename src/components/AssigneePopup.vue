<template>
    <van-popup v-model="showAssignee" position="bottom" @close="handlePopupClose">
        <div class="popup-title">请选择下一级审批人</div>
        <van-tree-select 
            :items="assigneeList"
            :active-id.sync="activeIds" 
            :main-active-index.sync="activeIndex">
        </van-tree-select>
        <van-button type="info" @click="handleTreeSelect">确定</van-button>
    </van-popup>
</template>
<script>
export default {
    props: {
        assigneePopupShow: {
            type: Boolean,
            default:false,
        },
        assigneeList: {
            type: Array,
            default:[],
        },
    },
    data () {
        return {
            //是否显示弹框
            showAssignee:false,
            //选中的id值
            activeIds:[],
            //左侧高亮索引
            activeIndex:0,
        }
    },
    methods: {
        //弹框关闭回调
        handlePopupClose(){
            this.$emit('assigneeSelected')
        },
        //选择审批人回调
        handleTreeSelect(){
            this.$emit('assigneeSelected',this.activeIds)
        }
    },
    watch: {
        assigneePopupShow: function (newData, oldData) {
            this.showAssignee = newData;
        }
    }
}
</script>
<style lang="less" scoped>
.van-popup {
    height: 350px;

    .popup-title {
        box-sizing: border-box;
        width: 100%;
        height: 40px;
        padding: 10px;
        font-size: 15px;
    }
    .van-tree-select {
        height: 250px !important;
    }
    .van-sidebar,.van-tree-select__nav {
        display: none;
    }
    .van-button {
        height: 40px;
        width: 90%;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #348cf8;
        border: #348cf8;
    }
}
</style>