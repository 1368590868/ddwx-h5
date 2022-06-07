<template>
    <div class="container message-wapper">
        <div class="wrapper message-wapper">
            <van-list v-model="msgDetaiLoading" offset="30" :finished="msgDetaiFinished" finished-text="没有更多了..." @load="messageGetMessageBySender">
                <div class="message-container" v-for="(msgDetail, mesIndex) in msgDetailList" :key="mesIndex">
                    <!-- <div class="message-time">{{mesIndex | timeFormat('{m}月{d}日 {h}:{i}')}}</div> -->
                    <div class="message-box" v-for="(childItem, childIndex) in msgDetail" :key="childIndex">
                        <div class="message-time">{{childItem.dCreateDate | timeFormat}}</div>                    
                        <dl class="message-dl">
                            <dt class="message-dt">{{childItem.sSendUserName | sliceName}}</dt>
                            <dd class="message-dd">
                                <div class="message-name">[{{childItem.sSendUserName}}]</div>
                                <div class="message-content">{{childItem.sMessage}}</div>
                                <span class="message-read">{{childItem.cState|readState}}</span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    import {messageGetMessageBySender, messageMarkReadBySender} from '@/api/message'
    import {mapGetters} from 'vuex'

export default {
    computed: mapGetters(['userInfo']),
    data () {
        let sendUser = this.$route.params.sSendUser;
        return {
            msgDetailList: {},
            msgDetaiLoading: false,
            msgDetaiFinished: false,

            listQuery: {
                sendUser,
                pageSize: 6,
                pageIndex: 0 
            }
        }
    },
    beforeRouteEnter(to, from, next){
        messageMarkReadBySender({sendUser: to.params.sSendUser}).then(() => {
            next();
        });
    },
    methods: {
        messageGetMessageBySender(){
            // messageGetMessageBySender(this.listQuery).then(({data}) => {
                
            //     this.msgDetailList = data || {};
            // });


            let pageIndex = this.listQuery.pageIndex;
            this.msgDetaiLoading = true;
            this.listQuery.pageIndex = pageIndex + 1;
            messageGetMessageBySender(this.listQuery).then(({data}) => {
                if (Object.keys(data).length===0) {
                    this.msgDetaiFinished = true;
                };
                this.msgDetaiLoading = false;
                this.msgDetailList = this.computedGroupDate(data, 'msgDetailList');
            }).catch(()=>{
                console.log('err')
            });
        },
        computedGroupDate (data, dataKey) { 
            let list = this[dataKey];
            for (let key in data){
                if (Object.keys(list).includes(key)) {
                    list[key] = list[key].concat(data[key]);
                } else {
                    list[key] = data[key];
                };
            };
            return list;
        },
    },
    created () {
        // this.messageGetMessageBySender();
        this.$store.dispatch('auth/readCount');
    }
}
</script>
<style lang="less" scoped>
    .message-wapper {
        background-color:#f3f5f7;
    }
    .message-time {
        padding-top: 14px;
        color:#585858;
        font-size:12px;
        text-align:center;
    }
    .message-dl {
        width: 80%;
        display: flex;
        display: -webkit-flex;
        padding: 14px;
        .message-dt {
            width: 46px;
            height: 46px;
            line-height: 46px;
            text-align: center;
            border-radius:5px;
            color:#ffffff;
            font-size:14px;
            background-color:#4897ff;
        }
        .message-dd {
            flex: 1;
            -webkit-flex: 1;
            padding-left: 10px;
            box-sizing: border-box;
            position: relative;
            .message-name {
                color:#3c4351;
                font-size:12px;
                padding-bottom: 5px;
            }
            .message-content {
                position: relative;
                padding: 13px 15px;
                box-sizing: border-box;
                color:#1b1b1b;
                font-size:14px;
                line-height:22px;
                background-color:#ffffff;
                border-radius:0px 4px 4px 4px;
                &::before {
                    position: absolute;
                    box-sizing: border-box;
                    content: ' ';
                    pointer-events: none;
                    top: 0;
                    left: -7px;
                    border: 8px solid transparent;
                    border-right-color: #fff;
                    transform: rotate(-90deg);
                }
            }
            .message-read {
                color:#a7a8aa;
                font-size:12px;
                position: absolute;
                right: -30px;
                top: 20px;
            }
        }
    }

</style>