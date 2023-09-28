<template>
    <van-tabbar v-model="active" :fixed="false">
        <van-tabbar-item name="/dashboard" icon="home-o" to="/dashboard">首页
            <template #icon="props">
                <img :src="props.active ? activeIconHome : inactiveIconHome" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item name="/Information" icon="comment-o" to="/Information" :badge="checkBadgeNo()">消息
            <template #icon="props">
                <img :src="props.active ? activeIconMsg : inactiveIconMsg" />
            </template>
        </van-tabbar-item>
        <van-tabbar-item name="/MyManager" icon="manager-o" to="/MyManager">我的
            <template #icon="props">
                <img :src="props.active ? activeIconUser : inactiveIconUser" />
            </template>
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    watch: {
        $route: function (route) {
            this.activeIndex(route);
        }
    },
    computed: {
        ...mapGetters(['badgeNo']),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            this.active = meta.base_path;
        },
    },
    data () {
        return {
            active: '/dashboard',

            activeIconHome:'/static/icon_home_current.png',
            inactiveIconHome:'/static/icon_home.png',
            activeIconMsg:'/static/icon_message_current.png',
            inactiveIconMsg:'/static/icon_message.png',
            activeIconUser:'/static/icon_mine_current.png',
            inactiveIconUser:'/static/icon_mine.png',
        }
    },
    methods: {
        activeIndex (route) {
            if (route.path.includes('/dashboard')){
                this.active = '/dashboard';
            } else if (route.path.includes('/Information')){
                this.active = '/Information';
            } else if (route.path.includes('/MyManager')) {
                this.active = '/MyManager';
            }
        },
        checkBadgeNo(){
            return !!this.badgeNo?this.badgeNo:null;
        }
    },
    created () {
        //清空所有缓存页面
        this.$store.commit('changeKeepPages', 'index') // 经测试include为空值时所有页面都会缓存
        this.$store.dispatch('auth/readCount');
        this.activeIndex(this.$route);
    }
}
</script>
<style lang="less" scoped>
.van-tabbar {
    height: 52px;

    .van-tabbar-item {
        flex-direction: row;
        position: relative;

        ::v-deep .van-tabbar-item__icon{
            margin-right: 3px;
        }
        ::v-deep .van-info {
            right: -30px;
        }
        &::before {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            width: 1px;
            height: 52px;
            left: 3.5px;
            background: #f2f2f2;
        }
        &:nth-child(1)::before {
            display: none;
        }
    }
    
}
</style>