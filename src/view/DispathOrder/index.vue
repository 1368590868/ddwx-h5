<template>
    <div class="not-scroll">
        <app-header></app-header>
        <keep-alive :include="keepPages">
            <router-view :key="key" />
        </keep-alive>
    </div>
</template>
<script>
import AppHeader from '@/components/AppHeader'

export default {
     components:{AppHeader},

    data() {
        return {};
    },
    computed: {
        key() {
            return this.$route.path
        },
        keepPages() {
            return this.$store.getters.getKeepPages;
        },
    },
};
</script>