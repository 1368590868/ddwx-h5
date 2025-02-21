<template>
    <div class="app-container">
        <div class="top-info">
            <div class="top-title">
                <span>工单号：{{orderInfo.reqNo}}</span>
                <van-tag size="large" round type="primary">{{type ==='0'?'待审核':'已审核'}}</van-tag>
            </div>
            <ul>
                <li>
                    <span>申请单位：</span>
                    <span>{{orderInfo.unitName}}</span>
                </li>
                <li>
                    <span>申请部门：</span>
                    <span>{{orderInfo.deptName}}</span>
                </li>
                <li>
                    <span>申请人/电话：</span>
                    <span>{{orderInfo.reqUserName}}/{{orderInfo.reqphone}}</span>
                </li>
                <li>
                    <span>问题描述：</span>
                    <span>{{orderInfo.reqDesc}}</span>
                </li>
            </ul>
        </div>
        <div class="middle-info" v-if="appendixList.length>0">
            <ul>
                <li>
                    <span>附件</span>
                </li>
                <li v-for="(item,index) in appendixList" :key="index">
                    <span></span>
                    <!-- <a>{{item.oldFileName}}</a> -->
                    <span>{{item.oldFileName}}</span>
                </li>
            </ul>
        </div>
        <div class="bottom-info" v-if="activittList.length>0">
            <div>
                <span>审核信息</span>
            </div>
            <div class="log-info">
                <ul>
                    <li class="li-item" v-for="logItem in activittList" :key="logItem.id">
                        <span>{{logItem.endTime}}</span>
                        <em class="log-cirle"></em>
                        <span>{{logItem.realName}}</span>
                        <span>{{logItem.message}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="button-box-two" v-show="type === '0'">
            <van-button block type="default" @click="handleReject()">驳回</van-button>
            <van-button block type="info" @click="handleAdopt()">通过</van-button>
        </div>
        <!--驳回弹框-->
        <van-popup v-model="refuseShow" position="bottom" @close="handleRefuseClose">
            <van-form ref="refuseForm" @submit="onRefuseSubmit">
                <div class="refuse-box">
                    <div class="refuse-info">
                        <span class="required-icon">*</span>
                        <span>驳回原因：</span>
                    
                        <van-field
                            v-model="formData.comment"
                            type="textarea"
                            maxlength="40"
                            placeholder="请输入驳回原因"
                            show-word-limit
                            :rules="[{ required: true}]"/>
                    </div>
                    <van-button block type="info" native-type="submit">确认驳回</van-button>
                </div>
             </van-form>
        </van-popup>
        <!--选择审批人弹框-->
        <assignee-popup 
            :assigneePopupShow="assigneePopupShow" 
            :assigneeList="assigneeList"
            @assigneeSelected="assigneeSelected">
        </assignee-popup>
    </div>
</template>
<script>
import {gcywChangeRequestListFile,gcywChangeRequestActivitiLog,gcywChangeRequestReject,gcywChangeRequestComplete} from '@/api/dataChange'
import {activityAssigneeList} from '@/api/order'
import AssigneePopup from "@/components/AssigneePopup.vue";

export default {
    components: { AssigneePopup },

    data() {
        return {
            //变更单信息
            orderInfo:{},
            //附件信息
            appendixList:[],
            //审核信息
            activittList:[],
            //页面类型
            type:'',    //0：待审批 1:已审批
            //表单信息
            formData: {
                comment: '',    //驳回原因
            },
            //是否显示驳回弹框
            refuseShow:false,
            //是否显示选择审批人弹框
            assigneePopupShow:false,
            //审批人数据
            assigneeList:[],
            //审核参数
            candidateUser:[],
        }
    },
    created() {
        this.orderInfo = this.$route.params.obj;
        this.type = this.$route.params.type;

        this.getFileList();
        this.getActivitiList();
    },
    methods: {
        //获取附件数据
        getFileList(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                id:this.orderInfo.id,
            }
            gcywChangeRequestListFile(params).then(({ data }) => {
                this.appendixList = data;
            }).catch((err) => {
               
            }).finally(() => {
                toast.clear();
            })
        },
        //获取审批日志
        async getActivitiList(id){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                id:this.orderInfo.id,
            }
            await gcywChangeRequestActivitiLog(params).then(({data}) => {
                this.activittList = data;
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //驳回
        handleReject(){
            if(this.orderInfo.reqStatus === '1' || this.orderInfo.reqStatus === '2'){
                if(this.orderInfo.workflowId){
                    if(this.orderInfo.procInstId){
                        if(this.orderInfo.endTimeMe){
                            this.$toast("你不是审批人！");
                        }else{
                            this.refuseShow = true;
                        }
                    }else{
                        this.$toast("你不是审批人！");
                    }
                }else{
                    this.refuseShow = true;
                }
            }else{
                this.$toast('已审核数据无法重新审核!');
            }
        },
        //驳回弹框关闭回调
        handleRefuseClose(){
            this.formData.comment = '';
            this.$refs.refuseForm.resetValidation();
        },
        //驳回确认
        onRefuseSubmit(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在驳回..",
                forbidClick: true
            });
            let params = {
                ...this.formData,
                businessId: this.orderInfo.id,
                procInstId: this.orderInfo.procInstId,
                taskId: this.orderInfo.taskId,
            }
            gcywChangeRequestReject(params).then(({ data }) => {
                this.$router.push({
                    name: 'ChangeExamineList',
                    params: {
                        refresh:true,
                    }
                });
            }).catch((err) => {
                this.$toast.fail("驳回失败!");
            }).finally(() => {
                toast.clear();
            })
        },
        //通过
        handleAdopt(){
            if(this.orderInfo.reqStatus === '1' || this.orderInfo.reqStatus === '2'){
                if(this.orderInfo.workflowId){
                    if(this.orderInfo.procInstId){
                        if(this.orderInfo.endTimeMe){
                            this.$toast("你不是审批人！");
                        }else{
                            this.getActivityAssigneeList();
                        }
                    }else{
                        this.$toast("你不是审批人！");
                    }
                }else{
                    this.getActivityAssigneeList();
                }
            }else{
                this.$toast('已审核数据无法重新审核!');
            }    
        },
        //获取下一级审批人
        getActivityAssigneeList(){
             let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            //获取下一级审批人列表
            let params = {
                businessId: this.orderInfo.id,
                procDefId: '',
                procInstId: this.orderInfo.procInstId,
                actId: this.orderInfo.actId,
            }
            activityAssigneeList(params).then(({data}) => {
                if(data.assignee){
                    this.candidateUser.push(data.assignee);
                    this.showAgreeApprovalOrderDialog();
                }else{
                    if(data.assigneeList && data.assigneeList.length > 0){
                        this.assigneeList = this.getTreeData(data.assigneeList);
                        this.assigneePopupShow = true;
                    }else{
                        this.showAgreeApprovalOrderDialog();
                    }
                }
            }).catch((err) => {
                
            }).finally(() => {
                toast.clear();
            })
        },
        //封装van-tree数据格式
        getTreeData(data) {
            let treeList = []
            treeList.push({ text: '', children: [] })

            data.forEach((item) => {
                treeList[0].children.push({
                    text: item.name,
                    id: item.code
                })
            })
            return treeList
        },
        //选择审批人后回调
        assigneeSelected(candidateUser) {
            if(!!candidateUser){
                this.candidateUser= candidateUser;
                this.showAgreeApprovalOrderDialog();
            }
            this.assigneePopupShow = false;
        },
        //显示审批通过弹框
        showAgreeApprovalOrderDialog(){
            this.$dialog.confirm({
                title: '提示',
                message: '是否要审批通过?',
            }).then(() => {
                this.approvalOrderApi();
            }).catch(() => {
           
            });
        },
        //审核通过
        approvalOrderApi(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在提交审批..",
                forbidClick: true
            });
            let params = {
                businessId: this.orderInfo.id,
                procInstId: this.orderInfo.procInstId || '',
                taskId: this.orderInfo.taskId || '',
                comment: '同意',
                candidateUser: this.candidateUser,
            };
            gcywChangeRequestComplete(params).then(({message}) => {
                toast.clear();
                this.$router.push({
                    name: 'ChangeExamineList',
                    params: {
                        refresh:true,
                    }
                });
            }).catch((err) => {
                this.$toast.fail("审批失败!");
            })
        }
    },
}
</script>
<style lang="less" scoped>
.app-container {
    font-size: 14px;
    box-sizing: border-box;
    padding: 15px;
    background-color: #ffffff;
    overflow: auto;
    height: calc(100% - 110px);

    .top-info {
        border-bottom: 1px solid #f0f0f0;

        .top-title {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 10px;
        }

        li {
            display: flex;
            margin-bottom: 10px;

            & span:nth-child(1) {
                float: left;
                width: 90px;
            }
            & span:nth-child(2) {
                float: left;
                width: calc(100% - 90px);
            }
        }
    }
    .middle-info {
        padding-top: 10px;
        border-bottom: 1px solid #f0f0f0;

        li {
            display: flex;
            margin-bottom: 10px;

            & span:nth-child(1) {
                width: 90px;
            }
            a {
                color: #348cf8;
                font-weight: 700;
                text-decoration: underline;
            }
        }
    }
    .bottom-info {
         padding-top: 10px;
         font-size: 14px;

        .log-info {
            width: 100%;
            padding: 0 15px;
            box-sizing: border-box;
            font-size: 14px;

            .li-item {
                width: 100%;
                height: 40px;
                line-height: 40px;

                & span:nth-child(1){
                    width: 130px;
                    color: #a9aaad;
                    float: left;
                }
                & span:nth-child(3){
                    color: #348cf8;
                    margin-right: 10px;
                    font-weight: 600;
                }
                .log-cirle {
                    display: inline-block;
                    position: relative;
                    width:8px;
                    height:8px;
                    background-color:#348cf8;
                    border:1px solid;
                    border-color:#aad5ff;
                    border-radius: 50%;
                    margin: 0 10px;

                    &::after {
                        position: absolute;
                        box-sizing: border-box;
                        content: ' ';
                        pointer-events: none;
                        width: 1px;
                        height: 35px;
                        left: 3.5px;
                        background: #707070;
                        opacity: 16%;
                    }
                }
                &:last-child .log-cirle::after {
                    display: none;
                }
            }
        }
    }
    .button-box-two {
        background-color: #ffffff;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 65px;
        box-sizing: border-box;
        padding:10px;
        display: flex;
        justify-content: space-around;

        .van-button {
            width: 45%;
        }
    }
    .refuse-box {
        box-sizing: border-box;
        width: 100%;
        height: 200px;
        background-color: #ffffff;
        padding: 15px;

        .refuse-info {
            width: 100%;
            height: 120px;
            box-sizing: border-box;
            border-bottom: 1px solid #f0f0f0;

            .required-icon {
                color: red;
                float: left;
            }
            & span:nth-child(2){
                font-size: 14px;
                margin-left: 5px;
                float: left;
            }
            .van-cell,.van-field {
                float: right;
                width: 250px;
                height: 110px;
                background-color: #f6f6f6;
                margin-bottom: 10px;

                ::v-deep .van-field__control {
                    height: 70px !important;
                }
            }
        }
        .van-button {
            background-color: #348cf8;
            margin-top: 10px;
            width: 100%;
            border: #348cf8;
        }
    }
}
</style>