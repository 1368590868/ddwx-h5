<template>
    <div class="container">
        <div class="maskblack"></div>
            <div id="carBg">
                <img class="carlogo" :src="carlogoPath" :alt="carSeries">
                <h2>别克GL8</h2>
                <img class="ground" src="/static/imgs/MainBg@2x.jpg" alt="">
                <div class="closebtn"></div>
            </div>
        <div id="showCar"></div>
    </div>
</template>
<script>
import $ from 'jquery'
    $(function(){
        let carurl = '/static/imgs/'+this.carImageType+"/";
        // let carurl = '/static/imgs/GL8PNG/';
        let totalframe = 36;
        let boxwidth = $('#showCar').width();
        let current = 0; //为当前显示的帧,0为第一帧
        let state = 2; // 0为不播放, 1为指定播放， 2为入场自动播放
        let playindex = 0; //要播放几帧, 正数为向前，负数为向后
        let goto = 0;
        let allimg, mousestart, mouseend, mousemove, mousetimer;
        let autotimes = 0; //入场动画转圈次数
        
        CreatImg();
        BindRotation();  //绑定拖拽事件
        AutoPlay();  //入场自动播放2圈
        
        function CreatImg() {
            for(var i=1;i<=totalframe;i++){
                if(i<10) {
                    i = '0'+i;
                }
                // let tempdom = '<img src="/static/01.png" alt="carphoto">';
                let tempdom = '<img src="'+carurl+i+'.png" alt="carphoto">';
                // $(tempdom).appendTo('#showCar');
                $('#showCar').append(tempdom);
                // document.getElementById('showCar').appendChild(tempdom);
                console.log(tempdom);
            }
            allimg = $('#showCar').find('img');
        }
        //绑定鼠标事件
        function BindRotation() {
            $('#showCar').mousedown(function(event){
                mousestart = event.pageX;
                mousetimer = 1;
                playindex = 0;
                state = 1;
            });
            $('#showCar').mouseup(function(event){
                mousetimer = 1;
                state = 0;
                playindex = goto;
            });
            $('#showCar').mouseleave(function(event){
                mousetimer = 1;
                state = 0;
                playindex = goto;
            });
            $('#showCar').mousemove(function(event){
                if((event.pageX-mousemove)*goto >= 0) {
                    mousemove = event.pageX;
                }
                else {
                    mousestart = mousemove;
                    mousemove = event.pageX;
                }
                if(state == 1) {
                    goto = Math.round((mousemove - mousestart)/30);
                    //console.log("steps:"+goto);
                    
                    PlayFrame();
                    
                    if(mousetimer>20) {
                        mousetimer = 1;
                        playindex = 0;
                        mousestart = mousemove;
                    }
                }
            });
        }
        //修改各个状态值
        function PlayNext() {
            console.log('run');
            if(goto < 0) { 
                playindex = playindex-1;
                current = current-1;
                if(current < 0) {
                    current = totalframe-1;
                }   
            }
            if(goto > 0) {
                playindex = playindex+1;
                current = current+1;
                if(current >= totalframe) {
                    current = 0;
                }
            }
            CarPlay(current);
        }
        //根据鼠标事件，播放旋转动画
        function PlayFrame() {
            if(state == 0) {
                return;
            }
            if(playindex == goto) {
                console.log('over');
                return;
            }
            else {
                PlayNext();
                mousetimer++;

                window.requestAnimationFrame(PlayFrame);
            }

        }
        function AutoPlay() {
            if(state != 2) {
                return;
            }
            current = current+1;
            if(current >= totalframe) {
                current = 0;
                autotimes++;
            }
            if(autotimes>0 && current>8){
               state = 0;
               return; 
            }
            allimg.css('opacity',0).eq(current).css('opacity',1);
            window.requestAnimationFrame(AutoPlay);
        }
        //显示第几张图
        function CarPlay(n) {
            allimg.css('opacity',0).eq(n).css('opacity',1);
        }

    });
export default {
    name:'Car3d',
    data() {
        return {
            carSeries:'',
            carlogoPath:'',
            carImageType:'',    
        }
    },
    created() {
        this.carSeries = this.$route.params.carSeries;
        // if(!!this.carSeries){
            this.initViewParams();
        // }else{
            // this.$toast("该车型没有对应模型!");
            // return
        // }
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
                    this.carImageType='GL8PNG';
                    break;
            }
            this.carlogoPath="/static/imgs/"+this.carImageType+"/logo.png";
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
    transform: translate(-50%,-50%) scale(0.48);
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
#showCar img {
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    user-select: none;
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
    /* background: url(".static/imgs/CloseBtn@2x.png") no-repeat left top; */
    background-size: contain;
    z-index: 6;
    cursor: pointer;
    opacity: .6;
}
.closebtn:hover {
    opacity: 1;
}
</style>