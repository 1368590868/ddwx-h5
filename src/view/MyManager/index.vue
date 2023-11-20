<template>
    <div class="user-center-container">
        <div class="user-top-container">
            <span>{{userInfo.realName}}</span>
            <span>所属单位：{{userInfo.unitName}}</span>
        </div>
        <div class="user-bottom-container">
            <div class="my-order-container box-container" v-if="checkOrderAuthority()">
                <span class="my-order-title">我的用车单</span>
                <ul>
                    <li @click="handleOrderWaitClick()">
                        <i class="order-wait default-icon-i"></i>
                        <van-badge :content="orderWaitNumber">
                            <span>进行中</span>
                        </van-badge>
                    </li>
                    <li @click="handleOrderHistoryClick()">
                        <i class="order-history default-icon-i"></i>
                        <span>历史订单</span>
                    </li>
                    <li @click="handleEvaluateClick()">
                        <i class="my-evaluate default-icon-i"></i>
                        <van-badge :content="evaluateWaitNumber">
                            <span>待评价</span>
                        </van-badge>
                    </li>
                </ul>
            </div>
            <div class="menu-container box-container">
                <ul>
                    <li @click="handleAddressClick()">
                        <i class="address default-icon-i"></i>
                        <span>常用地址</span>
                        <span class="item-arrow">></span>
                    </li>
                    <li @click="handleFeedBackClick()">
                        <i class="feedback default-icon-i"></i>
                        <span>意见反馈</span>
                        <span class="item-arrow">></span>
                    </li>
                    <li @click="handleSmsClick()">
                        <i class="sms default-icon-i"></i>
                        <span>短信消息</span>
                        <span class="sms-status-open" v-if="userInfo.smsFlag === '0'">已开启</span>
                        <span class="sms-status-close" v-else>已关闭</span>
                    </li>
                </ul>
            </div>
            <div class="user-info-container box-container">
                <span class="my-order-title">用户信息</span>
                <ul>
                    <li>
                        <span class="user-info-item">所属部门：</span>
                        <span>{{userInfo.longName || '暂无数据'}}</span>
                    </li>
                    <li>
                        <span class="user-info-item">部门职位：</span>
                        <span>{{userInfo.postName || '暂无数据'}}</span>
                    </li>
                    <li>
                        <span class="user-info-item">联系方式：</span>
                        <span>{{userInfo.phone || '暂无数据'}}</span>
                    </li>
                </ul>
            </div>
            <div class="version-code-container">
                <span>版本信息：v1.0.0</span>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {userModifys} from '@/api/auth'
import {gcywVehicleRequestDispatchCountH5} from '@/api/order'
import platform from '@/view/mixins/platform'
import {userMenu} from '@/api/auth'

export default {
    mixins: [platform],
    computed: mapGetters(['userInfo']),

    beforeRouteEnter (to, from, next) {
        next((vm) => {
            vm.gcywVehicleRequestDispatchCountH5();
        });
    },


    data () {
        return {
            menuData:[],
            orderWaitNumber:null,
            evaluateWaitNumber:null,
        }
    },
    mounted() {
        this.getIndexMenu()
    },
    methods:{
        //获取首页菜单信息
        async getIndexMenu(){
            await userMenu().then(({data}) => {
                this.menuData = data;
                this.initMenu()
            }).catch((err) => {
                
            })
        },
        //进行中和待评价 总数量
        gcywVehicleRequestDispatchCountH5(){
            let  params = {
                isFinsh: '2',
            }
            gcywVehicleRequestDispatchCountH5(params).then(({data}) => {
                this.orderWaitNumber = data.ingCount === 0 ? null:data.ingCount;
                this.evaluateWaitNumber = data.noCount === 0 ? null:data.noCount;
            }).catch((err) => {
                
            }).finally(() => {
                
            })
        },
        //进行中的订单
        handleOrderWaitClick(){
            this.$router.push({
                name: 'OutstandOrder',
                params: {
                    menuActiveIndex:0,                    
                },
            })
        },
        //历史订单
        handleOrderHistoryClick(){
            this.$router.push({
                name: 'OutstandOrder',
                params: {
                    menuActiveIndex:1,                    
                },
            })
        },
        //我的评价
        handleEvaluateClick(){
            this.$router.push({
                path: '/Evaluate',
            });
        },
        //常用地址
        handleAddressClick(){
            this.$router.push({
                path: '/address',
            });
        },
        //意见反馈
        handleFeedBackClick(){
            this.$router.push({
                path: '/Suggestion',
            });
        },
        //判断我的用车单菜单权限
        checkOrderAuthority(){
            let objBoolean = this.menuData.some((item) => {
                return item.menuName === '我的用车单';
            })
            return objBoolean;
        },
        //判断短信开关
        checkSmsStatus(){
            return this.userInfo.smsFlag==='0'?'已开启':'未开启';
        },
        //短信开关点击
        handleSmsClick(){
            let smsFlag;
            let msg = this.userInfo.smsFlag === '0'?'是否关闭短信服务？':'是否开启短信服务？'

            if(this.userInfo.smsFlag === '0'){
                smsFlag = '1';
            }else{
                smsFlag = '0';
            }
            this.$dialog.confirm({
                title: '提示',
                message: msg,
            }).then(() => {
                this.smsUserModifys(smsFlag);
            }).catch(() => {
           
            });
        },
        //开启关闭短信服务
        smsUserModifys(smsFlag){
            let paramsArr = [];
            let obj = {};
            this.$set(obj, 'id', this.userInfo.id);
            this.$set(obj, 'smsFlag', smsFlag);
            paramsArr.push(obj);

            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });

            userModifys(paramsArr).then(({message}) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.userInfo.smsFlag = smsFlag;
                this.$store.dispatch('auth/changeSmsStatus',smsFlag);
            }).catch((err) => {
                this.$toast.fail("操作失败!");
            }).finally(() => {
                toast.clear();
            })
        },
    }
}
</script>
<style lang="less" scoped>
.user-center-container {
    height: 100%;
    overflow-y: auto;
    background: #eceef2;
    box-sizing: border-box;
    position: relative;

    .user-top-container {
        width: 100%;
        height: 239px;
        background-image: url(/static/user_center_top_bg.png);
        background-size: cover;
        background-position: center;  
        padding: 21px 0 0 22px;
        position: relative;
        box-sizing: border-box;

        & span:nth-child(1) {
            font-size: 26px;
            color: #ffffff;
            font-weight: 600;
        }
        & span:nth-child(2) {
            padding: 2px 16px;
            background:linear-gradient(270deg,#0f3fc1 0%,#5043e5 100%);
            border-radius:50px;
            color: #ffffff;
            font-size: 14px;
            position: absolute;
            top: 65px;
            left: 22px;
        }
    }
    .user-bottom-container {
        width: 100%;
        position: absolute;
        top: 110px;
        box-sizing: border-box;

        .my-order-container {
            height: 104px;
            padding: 8px 15px 15px 15px;

            .my-order-title {
                color: #112b5d;
                font-size: 15px;
                font-weight: 600;
            }
            ul {
                margin-top: 13px;
                display: flex;
                list-style: none;

                li {
                    flex:1;
                    height: 48px;
                    display: flex;
                    align-items: center;

                    i {
                        width: 48px;
                        height: 48px;
                    }
                    span {
                        color: #2e2e2e;
                        font-size: 13px;
                    }
                    .order-wait {
                        background-image:url(/static/user_center_order_wait.png);
                    }
                    .order-history {
                        background-image:url(/static/user_center_order_history.png);
                    }
                    .my-evaluate {
                        background-image:url(/static/user_center_evaluate.png);
                    }
                }
            }
        }
        .menu-container {
            margin-top: 10px;
            height: 196px;
            padding: 8px 15px 15px 15px;

            ul {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;

                li {
                    flex:1;
                    color: #2e2e2e;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #f4f4f4;
                    position: relative;

                    i {
                        width: 40px;
                        height: 40px;
                        margin-right: 10px;
                    }
                    .address {
                         background-image:url(/static/user_center_address.png);
                    }
                    .feedback {
                         background-image:url(/static/user_center_feedback.png);
                    }
                    .sms {
                         background-image:url(/static/user_center_sms.png);
                    }
                    .item-arrow{
                        color: #bcc4d5;
                        position: absolute;
                        font-size: 15px;
                        right: 0px;
                    }
                    .sms-status-open {
                        color: #2e2e2e;
                        font-size: 12px;
                        position: absolute;
                        right: 0px;
                    }
                    .sms-status-open::after {
                        position: absolute;
                        width: 6px;
                        height: 6px;
                        background-color: #29c936;
                        border-radius: 50%;
                        content: '';
                        pointer-events: none;
                        right: 40px;
                        top: 5px;
                    }
                    .sms-status-close {
                        color: #2e2e2e;
                        font-size: 12px;
                        position: absolute;
                        right: 0px;
                    }
                    .sms-status-close::after {
                        position: absolute;
                        width: 6px;
                        height: 6px;
                        background-color: #ff9565;
                        border-radius: 50%;
                        content: '';
                        pointer-events: none;
                        right: 40px;
                        top: 5px;
                    }
                }
                li:nth-child(3){
                    border-bottom: none;
                }
            }
        }
        .user-info-container {
            margin-top: 10px;
            padding: 8px 15px 15px 15px;

            .my-order-title {
                color: #112b5d;
                font-size: 15px;
                font-weight: 600;
            }
            ul {
                margin-top: 14px;

                li {
                    display: flex;
                    flex:1;
                    color: #2e2e2e;
                    font-size: 13px;
                    align-items: center;
                    margin-bottom: 8px;
                    position: relative;

                    .user-info-item {
                        margin-left: 12px;
                    }
                    .user-info-item::after {
                        position: absolute;
                        width: 5px;
                        height: 5px;
                        background-color: #c1d8e7;
                        border-radius: 50%;
                        content: '';
                        pointer-events: none;
                        left: 0px;
                        top: 5px;
                    }
                }
            }
        }
    }
    .version-code-container {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
        color: #b3b4b7;
        font-size: 12px;
    }
}
</style>
