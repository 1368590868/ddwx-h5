<template>
    <div class="container">
        <div class="wrapper">
            <van-list v-model="messageLoading" offset="30" :finished="messageFinished" finished-text="没有更多了..." @load="messageGetMessage">
                <div class="info-container"  v-for="(msgItem, msgIndex) in messageList" :key="msgIndex">
                    <div class="log-title">{{msgIndex | timeAgo('{m}-{d}', true)}}</div>
                    <div class="info-div" v-for="(childItem, childIndex) in msgItem" :key="childIndex">
                        <dl class="into-dl" @click="goMessageDetail(childItem.sSendUser)">
                            <dt>{{childItem.sSendUserName | sliceName}}</dt>
                            <dd>
                                <div class="dl-title"><b>{{childItem.sSendUserName}}<van-badge v-if="childItem.count!=='0'" :content="childItem.count" /></b><time>{{childItem.dCreateDate | timeAgo('{h}:{i}')}}</time></div>
                                <p class="into-text">[{{userInfo.name}}]{{childItem.sMessage}}</p>
                            </dd>
                        </dl>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>
    
<script>
    import {messageGetMessage} from '@/api/message'
    import {mapGetters} from 'vuex'
export default {
    computed: mapGetters(['userInfo']),
    data () {
        return {
            messageQuery: {
                pageSize: 10,
                pageIndex: 0
            },
            messageList: {},
            messageLoading: false,
            messageFinished: false,
        }
    },
    methods: {
        messageGetMessage() {
            let pageIndex = this.messageQuery.pageIndex;
            this.messageLoading = true;
            this.messageQuery.pageIndex = pageIndex + 1;
            messageGetMessage(this.messageQuery).then(({data}) => {
                if (Object.keys(data).length===0) {
                    this.messageFinished = true;
                };
                this.messageLoading = false;
                this.messageList = this.computedGroupDate(data, 'messageList')
            }).catch(()=>{
                console.log('err')
            });

        },
        goMessageDetail (sSendUser) {
            this.$router.push({
                name: 'MessageDetail',
                params: {sSendUser}
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
        this.$store.dispatch('auth/readCount');
        this.messageGetMessage();
    }

}
</script>


