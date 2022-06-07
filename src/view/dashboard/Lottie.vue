<template>
    <div id="lottie-container" ref=""></div>
</template>
<script>
import lottie from 'lottie-web'
import jsonData from './data.json'
export default {
    data () {
        return {

        }
    },
    mounted () {
        var params = {
            container: document.getElementById('lottie-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: jsonData
        };
        lottie.loadAnimation(params); 
        
    }
}
</script>
<style>
    #lottie-container{
        background-color:#4395FB;
        width:100%;
        height:30%;
        display:block;
        overflow: hidden;
        transform: translate3d(0,0,0);
        text-align: center;
        opacity: 1;
    }
</style>