<template>
<div class="stats-container">
<van-tabs type="card" :sticky="true" v-model="activeIndex"  :animated="true" offset-top="0px" @click="tabClick">
    <van-tab title="车辆统计" :name="0">
      <div class="stas-content">  
          <div class="stas-title"> 
              总车辆数：{{totalCount}} 辆 
          </div>       
          <van-row>
            <van-col span="6" class="stas-type-label">
              按车型分：
            </van-col>
            <van-col span="18">
              <template v-for="(item,index) in carStatisticList">
                <van-col span="10" :offset="(index+1)%2==0?2:0" :key="index">
                  <div class="stas-item">
                    <van-image :src="carImage[item.name]"></van-image>
                    <div class="stas-count"> {{item.name+item.count}}辆</div>
                  </div>  
                </van-col>
              </template>           
            </van-col>
            <van-col span="24" class="stas-type-label" style="margin-top:15px">
              按超标分：
            </van-col>
            <van-col span="24">
              <div ref="byOvers" class="ByOver"></div>   
            </van-col>
            <van-col span="24" class="stas-type-label">
              按年份分：
            </van-col>
            <van-col span="24">
              <div ref="byYear" class="ByYear"></div>   
            </van-col>
             <!-- <van-col span="24" class="stas-type-label">
              <div class="form-data">
                  <van-field label="选择年份" :value="dateval" readonly clickable name="year-picker" placeholder="点击选择年份" @click="showPicker=true">
                  </van-field>
                  <van-popup v-model="showPicker" position="bottom">
                      <van-picker show-toolbar :columns="yeardata" @cancel="showPicker=false" @confirm="onConfirm">
                      </van-picker>
                  </van-popup>                  
              </div>
            </van-col>  
            <van-col  span="24">
             {{dateval}}年度公务车使用情况月统计：
            </van-col>
            <van-col span="24">           
              <div class="UseByYear" ref="useByYear">
              </div>  
            </van-col>  -->
            
          </van-row>
      </div>
    </van-tab>
    <van-tab title="运营统计" :name="1">
      <van-row>
          <van-col span="24" class="stas-type-label">
              <van-col span="22" offset="1" style="margin-top:15px">{{dateval===''?'2021':dateval}}年度公务车使用情况月统计：  </van-col>
                           
              <van-col span="24">
              
              <van-cell-group>
                 <van-field label="选择年份" :value="dateval" readonly clickable name="year-picker" right-icon="arrow" placeholder="点击选择年份" @click="showPicker=true">
                </van-field>
                <van-field label="选择单位" :value="unitval" readonly clickable name="unit-picker" right-icon="arrow" placeholder="点击选择单位" @click="showUnitPicker=true">
                </van-field> 
              </van-cell-group>
                  
              </van-col>
              <van-col span="24" v-if="userInfo.rank === '1'">
                  
              </van-col>
            </van-col>  
            
            <van-col span="24">           
              <div class="UseByYear" ref="useByYear">
              </div>  
            </van-col>  
      </van-row>              
    </van-tab>  
</van-tabs>
<van-popup v-model="showPicker" position="bottom">
    <van-picker show-toolbar :columns="yeardata" @cancel="showPicker=false" @confirm="onConfirm">
    </van-picker>
</van-popup>
<van-popup v-model="showUnitPicker" position="bottom">
    <van-picker show-toolbar :columns="unitdata" @cancel="showUnitPicker=false" value-key="unitName" @confirm="onUnitConfirm">
    </van-picker>
</van-popup>
 
</div>
</template>
<script>
import car from '../../assets/img/car.jpg'
import carBusiness from '../../assets/img/car_business.jpg'
import carCargo from '../../assets/img/car_cargo.jpg'
import carCoach from '../../assets/img/car_coach.jpg'
import carSuv from '../../assets/img/car_suv.jpg'
import carSpecial from '../../assets/img/car_special.jpg'
import {mapGetters} from 'vuex'
import {carStatisticByModel,carStatisticByOver,carStatisticByYear,useStatisticByYear,getParentUnit} from '@/api/statistic.js'
export default {  
  computed: mapGetters(['userInfo']),
  data(){     
    return {
        activeIndex:0,
        totalCount:0,
        carStatisticList:[],
        pieDatas:[],
        barDatas:[],
        barxAxisData:[],
        useByYearData:[0,0,0,0,0,0,0,0,0,0,0,0],
        useByYearyAxisData:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        showPicker:false,
        showUnitPicker:false,
        yeardata:['2022','2021','2020','2019','2018','2017','2016'],
        unitdata:[],
        unitval:'',
        selectedUnitId:'',
        dateval:'2022',
        carImage:{
          '轿车': car,
          '商务车':carBusiness,
          '货车':carCargo,
          '客车':carCoach,
          '越野车':carSuv,
          '专用车':carSpecial,
        }
    }
  },
  methods:{
    tabClick(name,title){
        if(name == '1'){
          this.getUseStatisticByYear()
        }
    },
    onConfirm(value){
      this.dateval=value
      this.getUseStatisticByYear()
      this.showPicker = false
    },
    onUnitConfirm(value){
      this.unitval = value.unitName;
      this.selectedUnitId = value.id;
      this.getUseStatisticByYear();
      this.showUnitPicker = false
    },
    getParentUnit(){
      getParentUnit().then(({data})=>{
        let udata = [{unitName:'全部',id:''}]
        data.forEach(item => {
          udata.push(item)
        })
        this.unitdata = udata
        this.unitval = this.unitdata[0].unitName
        this.selectedUnitId = ''
      })
    },
    getCarStatisticByModel(){
      carStatisticByModel().then(({data}) => {
        console.log(data)
        this.totalCount = (data && data.totalCount) || 0;
        this.carStatisticList = (data && data.list) || []
      })
    },
    getCarStatisticByOver(){
      carStatisticByOver().then(({data}) => {
       let ndata =  data.map((item) =>{
          return {name:item.name,value:parseInt(item.count)}
        })
        this.pieDatas = ndata
        this.initPieCharts()
      })      
    },
    getCarStatisticByYear(){
      carStatisticByYear().then(({data})=>{
        if(data){
          let bardata = []
          let xdata = []
          data.forEach(item=>{
            xdata.push(item.name)
            bardata.push(item.count)
          })
          this.barDatas = bardata
          this.barxAxisData = xdata
          this.initBarCharts()
        }
      })
    },
    getUseStatisticByYear(){
      let year = this.dateval === ''?'2021':this.dateval
        useStatisticByYear({year:year,selectedUnitId:this.selectedUnitId}).then(({data})=>{
            if(data){
              let yData = []
              let xData = []
              data.forEach(item=>{
                yData.push(item.name)
                xData.push(item.count)
              })
              this.useByYearyAxisData = yData
              this.useByYearData = xData
              this.initUseByYearBarCharts()
            }
        })
    },
    initBarCharts(){
        let barCharts = this.$echarts.init(this.$refs.byYear);
        barCharts.setOption({
          xAxis:{
            type:'category',
            data:this.barxAxisData
          },
          yAxis:{
            type:'value',
            // axisLabel:{
            //   formatter:'{value}辆'
            // }
            axisLine:{
              show:true
            },
            axisTick:{
              show:true
            }
          },
          color:['#b7eb8f'],
          series:[
            {
              type:'bar',
              data:this.barDatas,
              label:{
                show:true,
                position:'top',
                formatter:'{c}辆'
              }
            }
          ]
        })
     
    },
    initUseByYearBarCharts(){
        let useByYearbarCharts = this.$echarts.init(this.$refs.useByYear);
        useByYearbarCharts.setOption({
          color:['#5087ec'],
          xAxis:{
            type:'value',
            minInterval:5,
            axisLine:{
              show:true
            },
            axisTick:{
              show:true
            }
          },
          yAxis:{            
            type:'category',
            data:this.useByYearyAxisData
            
          },
          series:[
            {
              type:'bar',
              data:this.useByYearData,
              label:{
                show:true,
                position:'right',
                formatter:'{c}次'
              }
            }
          ]
        })
     
    },
     initPieCharts(){
        let pieCharts = this.$echarts.init(this.$refs.byOvers);
        pieCharts.setOption({
          
          color:['#68bbc4','#5087ec'],          
          series:[            
            {
              name:'按超标分',
              type:'pie',
              radius:'60%',
              center:['50%','45%'],
              data:this.pieDatas,
              label:{
                formatter:'{b}\n{d}%\n{c}辆',
                lineHeight:20
              },
              itemStyle:{
                borderRadius:3
              }
            }
          ]
        })
     
    }   
  },
  created(){
    this.getCarStatisticByModel()
    this.getCarStatisticByYear()
  },
  mounted(){
    this.getCarStatisticByOver()
    this.getParentUnit();
    //this.getUseStatisticByYear()
    //this.initBarCharts()
    // this.initPieCharts()
  }
}
</script>
<style lang="less">

  .UseByYear{
    width:100%;
    height:500px;
    background:#fff;
  }
.stas-content {
  padding:20px;
  background:#fff;
  .stas-title {
    font-weight:bold;
    margin-bottom:10px
  }
  .stas-type-label{
    font-weight:bold;
  }
  .ByOver,.ByYear{
    width:100%;
    height:260px
  }

  .stas-item{
      border:1px solid #bbb;
      margin-bottom:10px;
      .stas-count{
        background:#f5f5f5;
        padding:3px 0px;
        width:100%;
        text-align:center;
        border-top:1px solid #bbb
      }
  }

}
.not-scroll{
  background:#FFF
}
</style>