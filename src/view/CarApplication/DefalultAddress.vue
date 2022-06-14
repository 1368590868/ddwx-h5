<template lang="">
    <div class="app-container">
        <div class="title-address">
            <div>
                <van-icon name="location-o" class="icon-address"/><span>{{title}}</span>
            </div>
        </div>
        <div v-for="item in addressList" :key="item.id" class="item-address" @click="handleDetail(item)">
            <span class="span-alias">{{item.name}}</span>
            <div class="div-address">
                <p>{{item.areaLongName}}{{item.areaLongName}}</p>
                <p>{{item.address}}</p>
            </div>
            <span class="span-default" v-show="item.defualtTag==='1'">默认</span>
        </div>
    </div>
</template>
<script>
import { commonAddressListAll } from "@/api/mine/commonAddress"
import eventBus from '@/utils/eventBus.js'

export default {
    data () {
        return {
            //标题
            title:"",
            //地址信息
            addressList:[],
            //地址类型
            addressType:"",
        }
    },
    mounted(){
        this.getCommonAddress();
        this.addressType = this.$route.params.addressType;
        this.$nextTick(() => {
            if(this.addressType==="1"){
                this.title = "出发地";
            }else if(this.addressType==="2"){
                this.title = "目的地";
            }
        })
    },
    methods:{
        //获取常用地址信息
        async getCommonAddress(){
            await commonAddressListAll().then(({data}) => {
                data.forEach((item) => {
                    if(this.addressType==="1"){
                        if(item.addressType==="1"){
                            this.addressList.push(item);
                        }
                    }else if(this.addressType==="2"){
                        if(item.addressType==="2"){
                            this.addressList.push(item);
                        }
                    }
                })
            }).catch((err) => {

            })
        },
        handleDetail(item){
            eventBus.$emit('defaultAddress',item);
            this.$router.back();
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
</style>