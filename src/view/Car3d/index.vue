<template>
    <div class="container">
        <div class="maskblack"></div>
            <div id="carBg">
                <img class="carlogo" :src="carlogoPath" :alt="carSeries">
                <h2>{{carBrand}}{{carSeries}}</h2>
                <img class="ground" src="/static/imgs/MainBg@2x.jpg" alt="">
                <div class="closebtn" @click="handleCloseClick()"></div>
            </div>
        <div id="showCar" @touchstart='touchstart' @touchmove='touchmove' @touchend='touchend'>
             <img v-for="(path,index) in imgPathList" 
                :key="index" 
                :src="path" 
                alt=""
                :class="['img-normal', index===current? 'img-current':'img-no-current'] ">
        </div>
    </div>
</template>
<script>

export default {
    name:'Car3d',
    data() {
        return {
            //车辆品牌
            carBrand:'',
            //车系
            carSeries:'',
            //logo图片地址
            carlogoPath:'',
            //车辆图片类型
            carImageType:'',    
            //车辆图片数据
            imgPathList:[],
            //总帧数
            totalframe:36,
            //车辆图片地址
            carurl:'',
            // 0为不播放, 1为指定播放， 2为入场自动播放
            state:2,
            //当前角标
            current:0,
            //入场动画转圈次数
            autotimes:0,
            //要播放几帧, 正数为向前，负数为向后
            playindex:0,
            goto:0,
            mousestart:0,
            mouseend:0,
            mousemove: 0,
            mousetimer: 0,
        }
    },
    created() {
        this.carSeries = this.$route.params.carSeries;
        this.carBrand = this.$route.params.carBrand;

        this.initViewParams();
    },
    methods:{
        initViewParams(){
            switch (this.carSeries) {
                case 'A6L':
                    this.carImageType='A6PNG';
                    break;
                case 'GL8':
                    this.carImageType='GL8PNG';
                    break;
                case 'H9':
                    this.carImageType='H9PNG';
                    break;
                case '帕萨特':
                    this.carImageType='PassatPNG';
                    break;
                default:
                    // this.carImageType='GL8PNG';
                    break;
            }
            if(!this.carImageType){
                this.$toast("该车型没有对应模型!");
                return;
            }
            this.carlogoPath="/static/imgs/"+this.carImageType+"/logo.png";
            this.carurl="/static/imgs/"+this.carImageType+"/";
            this.creatImg();

            this.$nextTick(() => {
                this.autoPlay();
            })
        },
        creatImg() {
            for(var i=1;i<=this.totalframe;i++){
                if(i<10) {
                    i = '0'+i;
                }
                let carImgPath = this.carurl + i + '.png'
                this.imgPathList.push(carImgPath)
            }
        },
        autoPlay(){
            if(this.state != 2) {
                return;
            }
            this.current = this.current+1;
            if(this.current >= this.totalframe) {
                this.current = 0;
                this.autotimes++;
            }
            if(this.autotimes>0 && this.current>8){
               this.state = 0;
               return; 
            }
            window.requestAnimationFrame(this.autoPlay);
        },
        playFrame(){
            if(this.state == 0) {
                return;
            }
            if(this.playindex == this.goto) {
                return;
            }
            else {
                this.playNext();
                this.mousetimer++;

                window.requestAnimationFrame(this.playFrame);
            }
        },
        playNext(){
            if(this.goto < 0) { 
                this.playindex = this.playindex-1;
                this.current = this.current-1;
                if(this.current < 0) {
                    this.current = this.totalframe-1;
                }   
            }
            if(this.goto > 0) {
                this.playindex = this.playindex+1;
                this.current = this.current+1;
                if(this.current >= this.totalframe) {
                    this.current = 0;
                }
            }
        },
        touchstart(event){
            this.mousestart = event.targetTouches[0].pageX;
            this.mousetimer = 1;
            this.playindex = 0;
            this.state = 1;
        },
        touchmove(event){
            if((event.targetTouches[0].pageX-this.mousemove)*this.goto >= 0) {
                    this.mousemove = event.targetTouches[0].pageX;
            }else {
                this.mousestart = this.mousemove;
                this.mousemove = event.targetTouches[0].pageX;
            }
            if(this.state == 1) {
                this.goto = Math.round((this.mousemove - this.mousestart)/30);
                
                this.playFrame();
                
                if(this.mousetimer>20) {
                    this.mousetimer = 1;
                    this.playindex = 0;
                    this.mousestart = this.mousemove;
                }
            }
        },
        touchend(event){
            this.mousetimer = 1;
            this.state = 0;
            this.playindex = this.goto;
        },
        handleCloseClick(){
            this.$router.back();
        }
    }
}
</script>
<style >
.container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
#showCar {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0.45);
    width: 900px;
    height: 600px;
    user-select: none;
    cursor: pointer;
    z-index: 4;
}
#showCar:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
}
.img-normal {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    user-select: none;
}
.img-current {
    opacity: 1;
}
.img-no-current {
    opacity: 0;
}
.maskblack {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
    z-index: 3;
}
#carBg {
    position: absolute;
    width: 94%;
    height: 90%;
    left: 3%;
    top: 5%;
    overflow: hidden;
    z-index: 4;
}
#carBg .ground {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1920px;
    transform: translate(-50%,-50%) scale(0.38);
}
#carBg .carlogo {
    display: block;
    position: absolute;
    left: 50%;
    top: 11%;
    width: 240px;
    height: 100px;
    transform: translate(-50%,-50px) scale(0.7);
    z-index: 5;
}
#carBg h2 {
    position: absolute;
    left: 50%;
    top: 11%;
    transform: translate(-50%,28px);
    line-height: 34px;
    font-size: 24px;
    color: #fff;
    font-family: Heiti, "Microsoft YaHei";
    letter-spacing: 3px;
    z-index: 5;
}
.closebtn {
    position: absolute;
    right: 18px;
    top: 12px;
    width: 24px;
    height: 24px;
    background: url("/static/imgs/CloseBtn@2x.png") no-repeat left top;
    background-size: contain;
    z-index: 6;
    cursor: pointer;
    opacity: .6;
}
.closebtn:hover {
    opacity: 1;
}
</style>