<template>
  <div class="container">
    <div class="wrapper">
      <van-list
        v-model="messageLoading"
        offset="30"
        :finished="messageFinished"
        finished-text="没有更多了..."
        @load="messageGetMessage"
      >
        <div
          class="info-container"
          v-for="msgItem in messageList"
          :key="msgItem.id"
        >
          <!-- <div class="log-title">{{msgIndex | timeAgo('{m}-{d}', true)}}</div> -->
          <!-- <div
            class="info-div"
            v-for="(childItem, childIndex) in msgItem"
            :key="childIndex"
          > -->
          <div class="info-div">
            <!-- <dl
              class="into-dl"
              @click="goMessageDetail(msgItem.id)"
            > -->
            <dl class="into-dl">
              <!-- <dt>{{ childItem.sSendUserName | sliceName }}</dt> -->
              <dt>无名</dt>
              <dd>
                <div class="dl-title"><b>{{msgItem.noticeTitle}}
                    <!-- <van-badge
                      v-if="childItem.count!=='0'"
                      :content="childItem.count"
                    /> -->
                    <van-badge :content="`没返回`" />
                  </b><time>{{msgItem.createTime | timeAgo('{m}-{d} {h}:{i}')}}</time></div>
                <p class="into-text">[{{userInfo.name || '没返回'}}]{{msgItem.noticeMessage}}</p>
              </dd>
            </dl>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
    
<script>
import { messageGetMessage } from '@/api/message'
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters(['userInfo']),
  data() {
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
      // let pageIndex = this.messageQuery.pageIndex;
      this.messageLoading = true;
      // this.messageQuery.pageIndex = pageIndex + 1;
      // messageGetMessage(this.messageQuery).then(({data}) => {
      //     if (Object.keys(data).length===0) {
      //         this.messageFinished = true;
      //     };
      //     this.messageLoading = false;
      //     this.messageList = this.computedGroupDate(data, 'messageList')
      // }).catch(()=>{
      //     console.log('err')
      // });
      // 
      messageGetMessage().then(({ data }) => {
        // this.messageList = this.computedGroupDate(data, 'messageList')
        this.messageList = data?.list || [];
        console.log("🚀 ~ file: MessageList.vue ~ line 83 ~ messageGetMessage ~ data", data)
      }).catch(() => {
        console.log('err')
      }).finally(() => {
        this.messageLoading = false;
        this.messageFinished = true;
      })

    },
    goMessageDetail(sSendUser) {
      this.$router.push({
        name: 'MessageDetail',
        params: { sSendUser }
      });
    },
    // computedGroupDate(data, dataKey) {
    //   let list = this[dataKey];
    //   for (let key in data) {
    //     if (Object.keys(list).includes(key)) {
    //       list[key] = list[key].concat(data[key]);
    //     } else {
    //       list[key] = data[key];
    //     };
    //   };
    //   return list;
    // },
  },
  created() {
    this.$store.dispatch('auth/readCount');
    this.messageGetMessage();
  }

}
</script>


