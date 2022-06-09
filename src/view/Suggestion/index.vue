<template>
    <!-- <transition name="fade-transform" mode="out-in"> -->
    <div class="not-scroll">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
    </div>
    <!-- </transition> -->
</template>


<script>
export default {
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