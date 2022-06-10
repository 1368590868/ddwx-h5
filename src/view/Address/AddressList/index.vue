<template lang="">
    <div class="app-container">
        <!--出发地-->
        <div class="title-address">
            <div>
                <van-icon name="location-o" class="icon-address"/><span>出发地</span>
            </div>
            <van-icon name="plus"  class="icon-address" @click="startAddressAdd()"/>
        </div>
        <div v-for="item in startAddressList" :key="item.id" >
            <div class="item-address" @click="handleDetail(item)">
                <span class="span-alias">{{item.name}}</span>
                <div class="div-address">
                    <p>{{item.areaLongName}}{{item.areaLongName}}</p>
                    <p>{{item.address}}</p>
                </div>
                <span class="span-default" v-show="item.defualtTag==='1'">默认</span>
            </div>
        </div>
        </van-list> 
        <!--目的地-->
        <div class="title-address">
            <div>
                <van-icon name="location-o" class="icon-address"/><span>目的地</span>
            </div>
            <van-icon name="plus"  class="icon-address" @click="endAddressAdd()"/>
        </div>
        <div v-for="item in endAddressList" :key="item.id" >
            <div class="item-address" @click="handleDetail(item)">
                <span class="span-alias">{{item.name}}</span>
                <div class="div-address">
                    <p>{{item.areaLongName}}{{item.areaLongName}}</p>
                    <p>{{item.address}}</p>
                </div>
                <span class="span-default" v-show="item.defualtTag==='1'">默认</span>
            </div>
        </div>
    </div>
</template>
<script>
import { commonAddressListAll } from "@/api/mine/commonAddress"
export default {
    data () {
        return {
            //出发地
            startAddressList:[],
            //目的地
            endAddressList:[],
        }
    },
    mounted(){
        this.getCommonAddress();
    },
    methods:{
        //获取常用地址信息
        async getCommonAddress(){
            await commonAddressListAll().then(({data}) => {
                data.forEach((item) => {
                    if(item.addressType==="1"){
                        this.startAddressList.push(item);
                    }else{
                        this.endAddressList.push(item);
                    }
                })
            }).catch((err) => {
            })
        },
        //出发地添加
        startAddressAdd(){
            this.$router.push({
                name: 'CreateAddress',
                params:{addressType:"1"}
            });
        },
        //目的地添加
        endAddressAdd(){
            this.$router.push({
                name: 'CreateAddress',
                params:{addressType:"2"}
            });
        },
        handleDetail(item){
            this.$router.push({
                name: 'AddressDetail',
                params:{addressInfo:item}
            });
        }
    }
}
</script>
<style>
    p{
        overflow: hidden;
		text-overflow: ellipsis;
        white-space: nowrap;
    }
    .app-container {
        height: 100%;
        overflow: auto;
    }
    .title-address{
        display: flex;
        flex-flow:  row nowrap;
        justify-content: space-between;
        align-items: center;
        line-height: 40px;
        background-color:#f2f4f8;
        padding-left: 15px;
        padding-right: 10px;
        font-size: 18px;
        font-weight: bold;
    }
    .icon-address{
        margin-right: 5px;
        color: rgb(64, 158, 255);
        font-size: 18px;
    }
    .item-address{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        height: 80px;
        background: #ffffff;
        margin-bottom: 5px;
    }
    .span-alias{
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px;
        margin-left: 15px;
        border-radius: 50px;
        line-height: 30px;
        width:60px;
        text-align: center;
        background: rgb(184, 217, 253);
        overflow: hidden;
		text-overflow: ellipsis;
        white-space: nowrap;
    }
    .div-address{
        width: 200px;
        margin-left: 10px;
    }
    .span-default{
        margin-left: 20px;
        font-weight: bold;
    }
    .loading{
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>