<template>
    <keep-alive :include="keepPages">
        <router-view></router-view>
    </keep-alive>
</template>


<script>
export default {
    data() {
        return {};
    },
    computed: {
        keepPages() {
            return this.$store.getters.getKeepPages;
        },
    },
};
</script>