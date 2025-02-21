<template>
    <div>
        <div class="hearder">
            <span>{{title}}</span>
            <img src="@/assets/icon/arrow_back_black.png" class="img-back" @click="handleBackClick()"/>
            <img src="@/assets/icon/icon_close.png" class="img-close" @click="handleCloseClick()"/>
            <span class="back-home" @click="handleBackHomeClick()" v-if="checkDisplay()">返回首页</span>
        </div>
    </div>
</template>
<script>
import { useRouter } from "vue-router";


export default {
    name: 'AppHeader',

    computed: {
        title() {
            return this.$route.meta.title
        }
    },
    data () {
        return {
            
        }
    },
    mounted () {

    },
    methods: {
        checkDisplay(){
            return this.$route.path !== '/dashboard'
                    && this.$route.path !== '/Information/index'
                    && this.$route.path !== '/MyManager/index'
        },
        handleBackClick(){
            this.$router.go(-1);
        },
        handleCloseClick(){
            window.railsMobilePlatform.closepage();
        },
        async handleBackHomeClick(){
            // let backlength = window.history.length-1;
            // console.log(window.history)
            // await window.history.go(-backlength);
            this.$router.replace({ path: '/dashboard' });
        
        }
    }
}
</script>
<style lang="less" scoped>
    .hearder {
        width: 100%;
        height: 45px;
        background: #ffffff;
        text-align: center;
        line-height: 45px;
        position: relative;
        border-bottom: 1px solid #f3f5f7;

        span {
            color: #314457;
            font-size: 18px;
            font-weight: 600;
        }
        .img-back {
            width: 24px;
            height: 24px;
            position: absolute;
            left: 10px;
            top: 10px;
        }
        .img-close {
            width: 24px;
            height: 24px;
            position: absolute;
            left: 44px;
            top: 10px;
        }
        .back-home {
            position: absolute;
            right: 10px;
            color: #314457;
            font-size: 13px;
        }
    }
</style>