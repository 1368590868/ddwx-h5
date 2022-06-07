<template>
    <van-tabbar v-model="active" :fixed="false">
        <!-- <van-tabbar-item v-for="route in permission_routes"
            v-if="!route.hidden"
            :name="route.meta.base_path"
            :key="route.path" 
            :icon="route.icon" 
            :to="route.path">{{route.meta.name}}</van-tabbar-item> -->

        <van-tabbar-item name="/dashboard" icon="home-o" to="/dashboard">首页</van-tabbar-item>
        <van-tabbar-item name="/Information" icon="friends-o" to="/Information" v-if="badgeNo" :badge="badgeNo">消息</van-tabbar-item>
        <van-tabbar-item name="/Information" icon="friends-o" to="/Information" v-else>消息</van-tabbar-item>
        <van-tabbar-item name="/MyManager" icon="manager-o" to="/MyManager">我的</van-tabbar-item>
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
            console.log(meta.base_path);
            this.active = meta.base_path;
        },
    },
    data () {
        return {
            active: '/dashboard'
        }
    },
    methods: {
        messageGetNoReadCount() {
            messageGetNoReadCount().then(({data}) => {
                this.badgeNo = data || 0;
            });
        },
        activeIndex (route) {
            if (route.path.includes('/dashboard')){
                this.active = '/dashboard';
            } else if (route.path.includes('/Information')){
                this.active = '/Information';
            } else if (route.path.includes('/MyManager')) {
                this.active = '/MyManager';
            };
        }
    },
    created () {
        this.$store.dispatch('auth/readCount');
        this.activeIndex(this.$route);
    }
}
</script>