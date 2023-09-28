<template>
    <div class="not-scroll">
        <app-header></app-header>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="key" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="key" />
    </div>
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