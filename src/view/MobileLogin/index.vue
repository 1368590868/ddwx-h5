<template lang="">
    <div>
        
    </div>
</template>
<script>
import sm4 from '@/utils/sm4.js'

export default {
    data () {
        return {
            
        }
    },
    mounted () {
        window.getUserInfo = this.getUserInfo;
    },
    methods: {
        //获取用户信息
		async getUserInfo(userInfo) {
			let {userName} = JSON.parse(sm4.decrypt(userInfo));

			await this.$store.dispatch("auth/authAuthMobile",userName).then((res) => {

                this.$store.dispatch("auth/authInfo").then((res) => {
                    this.$router.push('/dashboard')
                }).catch((err) => {
                    
                })
            }).catch((err) => {

            })
		}
    }
}
</script>
<style>
    
</style>