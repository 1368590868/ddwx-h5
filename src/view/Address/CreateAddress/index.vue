<template lang="">
    <div>
       <van-form @submit="onSubmit" :show-error="true" :show-error-message="false" style="padding:0;">
            <van-field 
                v-model="form.name" 
                label="别名：" 
                placeholder="请输入别名" 
                maxlength="20"
                label-align="right"
                :rules="[{ required: true, message: '请填写别名' }]"/>
            <van-field
                v-model="form.address"
                label="详细地址："
                type="textarea"
                placeholder="请输入详细地址"
                maxlength="50"
                label-align="right"
                :rules="[{ required: true, message: '请填写详细地址' }]"/>
            <van-field 
                label="省市区：" 
                label-align="right" 
                readonly
                @click="showPop = true" 
                placeholder="请选择省市区" 
                v-model="form.areaLongName"
                :rules="[{ required: true, message: '请选择省市区' }]">
                    <template #input>
                    </template>
            </van-field>
            <van-popup v-model="showPop" round position="bottom">
                <van-cascader
                    v-model="cascaderValue"
                    title="请选择所在地区"
                    :options="provinceOptions"
                    :field-names="fieldNames"
                    @close="showPop = false"
                    @change="onChange"
                    @finish="onFinish"/>
            </van-popup>
            <van-field label="是否默认：" label-align="right">
                <template #input>
                    <van-switch v-model="isDefualtTag" size="20" @change="handleDefaultTagChage()" />
                </template>
            </van-field>
            <div style="margin: 16px;" >
                <van-button round block type="info" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import { gcjcDivisionList ,addCommonAddress } from "@/api/mine/commonAddress"
export default {
    data () {
        return {
            //省级数据
            provinceOptions:[],
            //市级数据
            cityOptions:[],
            //区级数据
            areaOptions:[],
            //是否默认
            isDefualtTag: false,
            //显示省市区弹框
            showPop: false,
            //定义字段省市区取值字段名称
            fieldNames: {
                text: 'divisionName',
                value: 'divisionId',
                children: 'children',
            },
            //回显省市区所需要的值
            cascaderValue: '',
             //表单数据
            form:{
                id:"",
                deleteTag: '0', //保存：0;删除：1
                name:"",    //别名
                address:"", //详细地址
                defualtTag:"0",//是否默认0否 1是
                provinceId:"",//省份ID
                cityId:"",  //城市id
                areaId:"",  //区县id
                addressType:"",//地址类型 1出发地 2目的地
                areaLongName:"",//区县长名称
            },
        }
    },
    mounted(){
        //获取地址类型
        this.form.addressType = this.$route.params.addressType;
        this.getProvinceOptions(0);
    },
    methods: {
        //获取省级数据
        async getProvinceOptions(pid){
            await gcjcDivisionList({pid}).then(({data}) => {
                this.provinceOptions = data.list;
            }).catch((err) => {

            })
        },
        //获取市级数据
        async getCityOptions(pid){
            await gcjcDivisionList({pid}).then(({data}) => {
                this.cityOptions = data.list;
                this.provinceOptions.forEach((item) => {
                    if(item.divisionId===this.form.provinceId){
                        this.$set(item, 'children', this.cityOptions);
                    }
                })
            }).catch((err) => {

            })
        },
         //获取区级数据
        async getAreaOptions(pid){
            await gcjcDivisionList({pid}).then(({data}) => {
                this.areaOptions = data.list;
                let province = this.provinceOptions.find((item) => {
                    return item.divisionId===this.form.provinceId;
                })
                province.children.forEach((item) => {
                    if(item.divisionId===this.form.cityId){
                        this.$set(item, 'children', this.areaOptions);
                    }
                })
            }).catch((err) => {

            })
        },
        //是否默认选择回调
        handleDefaultTagChage(){
            this.form.defualtTag = this.isDefualtTag?"1":"0";
        },
        //保存
        async onSubmit(values) {
            await addCommonAddress(Object.assign({}, this.form)).then(({message}) => {
                this.$notify({
                    type: 'success',
                    message: message
                });
                this.$router.back();
            }).catch((err) => {
                
            })
        },
        //省市区选择监听
        onChange({  value, selectedOptions, tabIndex }){
            if(tabIndex===0){
                this.getCityOptions(value);
                this.form.provinceId = value;
            }else if(tabIndex===1){
                this.getAreaOptions(value);
                this.form.cityId = value;
            }else if(tabIndex===2){
                this.form.areaId = value;
            }
        },
        // 全部选项选择完毕后，会触发 finish 事件
        onFinish({  value, selectedOptions, tabIndex }) {
            if(tabIndex === 2){
                this.showPop = false;
                this.form.areaLongName = selectedOptions.map((option) => option.divisionName).join('/');
            }
        },
  },
}
</script>
<style>
    .van-cell{
        padding-left: 0;
    }
</style>