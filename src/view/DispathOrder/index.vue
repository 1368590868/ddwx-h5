<template>
    <div class="carApp container">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
    </div>
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