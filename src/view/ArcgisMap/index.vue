<template lang="">
    <div style="width:100%;height:100%">
        <iframe  ref="arcgis" :src='url' style="width: 100%;height: 100%;"></iframe>
    
        <div class="route_info">
            <i class="icon_warning"></i>
            <span>{{carInfo.carNumber}} </span>
            <span>{{startTime}}-</span>
            <span> {{endTime}} </span>
            <span>{{miles}}KM</span>
            <a href="#" class="replay" @click="handleReplayClick" v-if="!!simNumber">
                <i class="icon_paly"></i>回放
            </a>
        </div>
    </div>
</template>
<script>
import { logisticsTrajectoryAll,logisticsGetDrivingRecord} from '@/api/driver'
import {parseTime} from '@/utils/index'
export default {
    name:'ArcgisMap',
    data() {
        return {
            //地图url
            url:'',
            //车辆信息
            carInfo:{},
            //车辆轨迹数据
            replayList:[],
            //里程
            miles:'',
            simNumber:'',
            startTime:'',
            endTime:'',
        }
    },
    mounted() {
        this.url='/static/arcgisMap.html'
        this.carInfo=Object.assign(this.carInfo, this.$route.params.carInfo);
        this.miles=Number(this.carInfo.endMiles)-Number(this.carInfo.beginMiles);
        this.getLogisticsGetDrivingRecord(this.carInfo.vinNumber,this.carInfo.reqId);
    },
    methods: { 
        //获取车辆信息
        async getLogisticsGetDrivingRecord(vinNumber,reqfoId){
            let params = {
                vinNumber:vinNumber,
                reqfoId:reqfoId,
            }
            await logisticsGetDrivingRecord(params).then(({data}) => {
                this.loading = false;

                this.startTime=parseTime(data[0].departureDate,'{m}/{d} {h}:{i} ');
                this.endTime=parseTime(data[0].returnTime,'{m}/{d} {h}:{i}');
            
                if(data.length===0 || !data[0].simNumber){
                    this.$notify({
                        type: 'warning',
                        message: '暂无行程轨迹!',
                        onClose: () => {
                            this.$router.back();
                        }
                    });
                    return;
                }
                this.simNumber=data[0].simNumber;

                this.getLogisticsTrajectoryAll()
            }).catch((err) => {

            })
        },
        //获取车辆轨迹数据
        async getLogisticsTrajectoryAll(){
            let params = {
                simNumber: this.simNumber,
                startTime: this.startTime,
                endTime: this.endTime,
                // simNumber: '121901105000',
                // startTime: '2022-08-26 15:59:55',
                // endTime: '2022-09-02 16:00:09',
            }
            await logisticsTrajectoryAll(params).then(({data}) => {
                this.replayList = data;
                this.drawRoute();
            }).catch((err) => {
            })
        },
        //显示行程轨迹
        drawRoute(){
            this.$refs.arcgis.contentWindow.drawRoute(this.replayList);
        },
        //轨迹回放
        handleReplayClick(){
            if(this.replayList.length===0){
                this.$notify({
                    type: 'warning',
                    message: '暂无行程轨迹!',
                });
                return;
            }
            this.$refs.arcgis.contentWindow.moveReplay();
        }
    },
}
</script>
<style scoped>
.route_info {
    box-sizing:border-box;
    line-height:30px;
    position: absolute;
    bottom: 10px;
    left:10px;
    padding-left:5px;
    padding-right:5px;
    background:#ffffff;
    font-size:12px;
}
.replay {
    color:#3681ee;
    margin-left:5px;
}
.icon_warning {
    background:url(../../assets/icon/icon-warning.png) no-repeat center;
    display: inline-block;
    background-size: 100%;
    width: 20px;
    height: 20px;
    transform: translateY(5px);
}
.icon_paly {
    background:url(../../assets/icon/icon-play.png) no-repeat center;
    display: inline-block;
    background-size: 100%;
    width: 20px;
    height: 20px;
    transform: translateY(5px);
}
</style>