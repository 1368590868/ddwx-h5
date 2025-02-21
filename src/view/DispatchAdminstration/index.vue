<template>
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <div class="carApp container">
        <app-header></app-header>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
    </div>
    <!-- </transition> -->
</template>
<script>
import AppHeader from '@/components/AppHeader'

export default {
    components:{AppHeader},

    data () {
        return {

        }
    },
    computed: {
        key() {
            return this.$route.path
        }
    }
}
</script>