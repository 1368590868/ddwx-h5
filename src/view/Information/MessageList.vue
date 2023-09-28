<template>
  <div class="message-container">
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
          v-for="(msgItem, messageDate) in messageList"
          :key="messageDate"
        >
          <div class="log-title">{{messageDate | timeAgo('{m}-{d}', true)}}</div>
          <div
            class="info-div"
            v-for="(childItem, childIndex) in msgItem"
            :key="childIndex"
          >
            <dl
              class="into-dl"
              @click="goMessageDetail(childItem.sendUser)"
            >
              <dt>{{childItem.sendUserName | sliceName}}</dt>
              <dd>
                <div class="dl-title"><b>{{childItem.sendUserName}}
                    <van-badge
                      v-if="childItem.count!=='0'"
                      :content="childItem.count"
                    />
                  </b><time>{{childItem.createDate | timeAgo('{h}:{i}')}}</time></div>
                <p class="into-text">[{{userInfo.nickName}}]{{childItem.message}}</p>
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
        pageNum: 0
      },
      messageList: {},
      messageLoading: false,
      messageFinished: false,
    }
  },
  methods: {
    messageGetMessage() {
      let pageNum = this.messageQuery.pageNum;
      this.messageLoading = true;
      this.messageQuery.pageNum = pageNum + 1;
      messageGetMessage(this.messageQuery).then(({ data }) => {
        if (Object.keys(data).length === 0) {
          this.messageFinished = true;
        }
        this.messageLoading = false;
        this.messageList = this.computedGroupDate(data, 'messageList')
      }).catch(() => {
        console.log('err')
      });

    },
    goMessageDetail(sendUser) {
      this.$router.push({
        name: 'MessageDetail',
        params: { sendUser }
      });
    },
    computedGroupDate(data, dataKey) {
      let list = this[dataKey];
      for (let date in data) {
        if (Object.keys(list).includes(date)) {
          list[date] = list[date].concat(data[date]);
        } else {
          list[date] = data[date];
        }
      }
      return list;
    },
  },
  created() {
    this.$store.dispatch('auth/readCount');
    this.messageGetMessage();
  }

}
</script>

<style scoped>
.message-container {
  width: 100%;
  background-color: #fff;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
}
</style>


