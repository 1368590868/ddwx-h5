<template>
    <div class="container">
        <div class="search-container">
            <form action="/">
               <van-search
                    v-model="searchText"
                    show-action
                    left-icon="/static/icon_search.png"
                    placeholder="支持按账号/姓名搜索"
                    @search="onSearch"
                    @input='handleSearchInput'>
                    <template #action>
                        <div @click="onSearch">搜索</div>
                    </template>
                </van-search>
            </form>
        </div>
        <div class="nav-container" v-if="!showSearch">
            <ul>
                <li v-for="(item,index) in navOptions" :key="index" @click="handleNavClick(item,index)" :class="{ 'nav-checked': item.isChecked }">
                    {{item.deptName}}
                    <span v-if="index !== navOptions.length -1">{{'\u00A0'}}>{{'\u00A0'}}</span>
                </li>
            </ul>
        </div>
        <div class="list-container">
            <van-list
                v-if="!showSearch"
                :finished="true"
                finished-text="已无更多结果">
                
                <div class="list-item" v-for="(item,index) in listOptions" :key="index" @click="handleListItemClick(item)">
                    <div>
                        <i class="default-icon-i unit-icon" v-if="item.realName === null"></i>
                        <span class="short-name" v-else>{{checkShortName(item.realName)}}</span>
                    </div>
                    <span class="full-name">{{checkFullName(item)}}</span>
                    <i class="default-icon-i arrow-right"  v-if="item.children.length"></i>
                    <i class="default-icon-i" :class="{ 'checked-icon': item.isChecked }"></i>
                </div>
            </van-list>
            <van-list
                v-if="showSearch"
                :finished="true"
                finished-text="已无更多结果">
                
                <div class="list-item-search" v-for="(item,index) in searchOptions" :key="index" @click="handleSearchListItemClick(item)">
                    <span class="short-name">{{checkShortName(item.realName)}}</span>
                    <div>
                        <p class="full-name">{{checkFullName(item)}}</p>
                        <p class="unit-name">{{checkNavName(item,item.navMenuId)}}</p>
                    </div>
                    <i class="default-icon-i" :class="{ 'checked-icon': item.isChecked }"></i>
                </div>
            </van-list>
        </div>
        <div class="bottom-container" v-if="checkedUser.length !== 0">
            <div class="bottom-container-left" @click="handleCheckedUserClick()">
                <div class="top-container">
                    <span>已选{{'\u00A0'}}</span>
                    <span class="default-number">{{checkedUser.length}}</span>
                    <span>{{'\u00A0'}}人</span>
                    <i class="default-icon-i"></i>
                </div>
                <p>{{checkDefaultUser()}}</p>
            </div>
            <div class="bottom-container-right">
                <van-button block type="info" @click="handleConfirmClick" round>确定</van-button>
            </div>
        </div>
        <!--已选择联系人-->
        <van-popup v-model="showCheckedUserPop" round position="bottom">
            <div class="checked-user-container">
                <div class="top-container">
                    <span>已选{{'\u00A0'}}</span>
                    <span class="default-number">{{checkedUser.length}}</span>
                    <span>{{'\u00A0'}}人</span>
                    <i class="default-icon-i"></i>
                </div>
                <van-list>
                    <div class="list-item-checked" v-for="(item,index) in checkedUser" :key="index">
                        <span class="short-name">{{checkShortName(item.realName)}}</span>
                        <div>
                            <p class="full-name">{{checkFullName(item)}}</p>
                            <p class="unit-name">{{checkNavName(item,item.navMenuId)}}</p>
                        </div>
                        <div class="delete-checked" @click="handleDeleteCheckedUser(index)">
                            <span>移除</span>
                        </div>
                    </div>
                </van-list>
            </div>
        </van-popup>
    </div>
</template>
<script>
import { userListAllForDept } from '@/api/dict'
import { mapGetters } from 'vuex'
import eventBus from '@/utils/eventBus.js'

export default {
    computed: {
        ...mapGetters(['userInfo']),
    },

    data() {
        return {
            loading: true,
            finished: true,
            //搜索字段
            searchText:'',
            //导航数据
            navOptions:[],
            //所有数据
            dataList:[],
            //列表数据
            listOptions:[],
            //返回的数据
            returnItem:{},
            //搜索列表
            searchOptions:[],
            //是否显示搜索列表
            showSearch:false,
            //已选中人员
            checkedUser:[],
            //已选中联系人
            showCheckedUserPop:false,

            //传递过来的数据
            transferCheckedUser:[],
        }
    }, 
    created() {
        this.checkedUser = JSON.parse(this.$route.params.checkedUser);
        
        this.getUserListAllForDept();
    },
    methods: {
        //获取树形数据
        getUserListAllForDept(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            userListAllForDept().then(({ data }) => {
                this.dataList = data;

                this.initListOptions(this.userInfo.deptId);
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //搜索数据
        getUserBySearch(){
            let toast = this.$toast.loading({
                duration: 0,
                message: "正在加载...",
                forbidClick: true
            });
            let params = {
                userCode:this.searchText,
            }
            userListAllForDept(params).then(({ data }) => {
                this.searchOptions = data;

                this.searchOptions.forEach((item) => {
                    this.$set(item, 'navMenuId', item.deptId);
                })
                this.initCheckedIcon(this.searchOptions);
            }).catch((err) => {

            }).finally(() => {
                toast.clear();
            })
        },
        //初始化列表和导航数据
        initListOptions(deptId){
            //初始化列表数据
            this.listOptions = [];

            let obj = this.getObjByDeptId(this.dataList[0],deptId);
         
            obj.children.forEach((item) => {
                this.listOptions.push(item);
            })
            this.initCheckedIcon(this.listOptions);
            //初始化导航数据
            this.navOptions = [];
            this.navOptions = this.findParent(deptId,this.navOptions);
        },
        //判断选中状态
        initCheckedIcon(listData){
            listData.forEach((item) => {
                this.$set(item, 'isChecked', false);

                let obj = this.checkedUser.find((checkedItem) => {
                    return checkedItem.id === item.id;
                })
                if(!!obj){
                    this.$set(item, 'isChecked', true);
                }
            })
        },
        //查找父节点数据
        findParent(parentId,resultOptions) {
            if(parentId !== null && parentId !== undefined){
                let objFind = this.getObjByDeptId(this.dataList[0],parentId);

                if(!!objFind){
                    let navObj = {
                        deptName:objFind.deptName,
                        deptId:objFind.deptId,
                        isChecked:false,
                    }
                    resultOptions.unshift(navObj);
                    this.findParent(objFind.parentId,resultOptions);
                }
            }
            return resultOptions;
        },
        //根据部门id查找部门数据
        getObjByDeptId(node, deptId){
            if (!!node && node.deptId === deptId) {
                return node;
            } else if (!!node && node.children !== undefined) {
                for (let i = 0; i < node.children.length; i++) {
                    const result = this.getObjByDeptId(node.children[i], deptId)
                    if (result !== null) {
                        return result
                    }
                }
            }
            return null
        },
        //显示简称
        checkShortName(realName){
            return realName.substr(realName.length-2);
        },
        //显示全称
        checkFullName(item){
            if(item.realName !== null){
                return item.realName;
            }
            return item.deptName;
        },
        //导航点击
        handleNavClick(item,index){
            this.initListOptions(item.deptId);
        },
        //列表条目点击
        handleListItemClick(item){
            if(item.children.length !==0){
                this.initListOptions(item.deptId);
            }else {
                this.$set(item, 'isChecked', true);
                this.$set(item, 'navMenuId', item.parentId);
                this.addCheckUser(item);
            }
        },
        //搜索
        onSearch(){
            if(!!this.searchText){
                this.showSearch = true;
                this.getUserBySearch();  
            }
        },
        //搜索栏输入
        handleSearchInput(){
            if(!this.searchText){
                this.showSearch = false;
                this.searchOptions = [];
            }
        },
        //搜索列表点击
        handleSearchListItemClick(item){
            this.addCheckUser(item)
        },
        //选择乘车人
        addCheckUser(item){
            let user = this.checkedUser.some((someItem) => {
                return item.id === someItem.id;
            })
            if(user){
                this.$notify({
                    type: 'warning',
                    message: '乘车人已存在，请重新选择!',
                });
                return
            }
            if(this.checkedUser.length === 30){
                this.$notify({
                    type: 'warning',
                    message: '最多选择30名乘车人，请重新选择!',
                });
                return
            }
            this.checkedUser.push(item);
            this.initCheckedIcon(this.listOptions)
            this.initCheckedIcon(this.searchOptions)
        },
        //显示部门导航
        checkNavName(item,parentId){
            let tempArr = [];

            tempArr = this.findParent(parentId,tempArr)

            let resultStr = '';
            tempArr.forEach((item,index) => {
                if(index === tempArr.length -1){
                    resultStr = resultStr + item.deptName;
                }else{
                    resultStr = resultStr + item.deptName + '/';
                }
            })
            return resultStr;
        },
        //显示已选择乘车人
        checkDefaultUser(){
            if(this.checkedUser.length === 1){
                return this.checkedUser[0].realName;
            }
            let returnStr = '';

            this.checkedUser.forEach((item,index) => {
                if(index === this.checkedUser.length -1){
                    returnStr = returnStr + item.realName;
                }else{
                    returnStr = returnStr + item.realName + '、';
                }
            })
            return returnStr;
        },
        //显示已选择联系人列表
        handleCheckedUserClick(){
            this.showCheckedUserPop = true;
        },
        //删除已选择联系人
        handleDeleteCheckedUser(index){
            this.checkedUser.splice(index, 1)

            if(this.checkedUser.length === 0){
                this.showCheckedUserPop = false;
            }
            this.initCheckedIcon(this.listOptions);
            this.initCheckedIcon(this.searchOptions);
        },
        //确定
        handleConfirmClick(){
            this.$router.go(-1);   
        },
    },
    destroyed(){
        if(this.checkedUser.length !== 0){
            eventBus.$emit('addUserConfirm',this.checkedUser);
        }
    }
}
</script>
<style lang="less" scoped>
.container {
    background: #f2f4f8;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .search-container {
        width: 100%;
        height: 48px;
        box-sizing: border-box;

        .van-search {
            height: 48px;
        }
        .van-search__content {
            border-radius: 50px;
            height: 34px;
        }
        .van-icon__image {
            width: 24px;
            height: 24px;
        }
    }
    .nav-container {
        width: 100%;
        height: 40px;
        background: #f4f4f4;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;

        ul {
            display: block;
            white-space: nowrap;
            overflow-x: scroll;

            li {
                display: inline-block;
                line-height: 40px;
                font-size: 14px;
                color: #2e2e2e;
            }
            .nav-checked {
                color: #969799;
            }
        }
    }
    .list-container {
        background: #ffffff;
        flex: 1;
        padding-left: 8px;
        padding-right: 8px;
        box-sizing: border-box;
        overflow-y: auto;

        .list-item {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            padding-left: 8px;
            position: relative;

            .unit-icon {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-image: url(/static/unit_icon.png);
                margin-right: 22px;
            }
            .short-name {
                display: inline-block;
                width: 40px;
                height: 40px;
                background:#2282ff;
                color: #ffffff;
                font-size: 14px;
                border-radius: 5px;
                text-align: center;
                line-height: 40px;
                margin-right: 22px;
            }
            .full-name {
                display: inline-block;
                font-size: 14px;
                color: #112b5d;
                font-weight: 600;
            }
            .arrow-right {
                width: 22px;
                height: 22px;
                background-image: url(/static/arrow_right.png);
                position: absolute;
                right: 6px;
            }
            .checked-icon {
                background-image: url(/static/checked_user.png);
                position: absolute;
                right: 30px
            }
        }
        .list-item-search {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            padding-left: 8px;
            position: relative;

            .short-name {
                display: inline-block;
                width: 40px;
                height: 40px;
                background:#2282ff;
                color: #ffffff;
                font-size: 14px;
                border-radius: 5px;
                text-align: center;
                line-height: 40px;
                margin-right: 22px;
            }
            .full-name {
                display: inline-block;
                font-size: 14px;
                color: #112b5d;
                font-weight: 600;
            }
            .unit-name {
                color: #a9aaad;
                font-size: 12px;
                margin-top: 5px;
            }
            .checked-icon {
                background-image: url(/static/checked_user.png);
                position: absolute;
                right: 30px
            }
        }
    }
    .bottom-container {
        background: #ffffff;
        width: 100%;
        height: 54px;
        position: fixed;
        bottom: 0px;
        display: flex;
        box-shadow:0px -1px 6px rgba(0, 0, 0, 0.12);

        .bottom-container-left {
            width: 187px;
            padding:5px 20px 8px 15px;
            box-sizing: border-box;
            position: relative;

            .top-container {
                display: flex;
                align-items: center;

                span {
                    color: #112b5d;
                    font-weight: 600;
                    font-size: 14px;
                }
                .default-number {
                    color: #2282ff;
                }
                i {
                    background-image: url(/static/arrow_top_full.png);
                }
            }
            p {
                margin-top: 5px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                color: #272b31;
                font-size: 11px;
            }
            &::after {
                position: absolute;
                box-sizing: border-box;
                content: ' ';
                pointer-events: none;
                width: 1px;
                height: 38px;
                right: 0px;
                background: #f0f0f0;
                top: 8px;
            }
        }
        .bottom-container-right {
            text-align: center;
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                color: #ffffff;
                font-size: 14px;
            }
            .van-button {
                width: 132px;
                height: 38px;
            }
        }
    }
    .checked-user-container {
        height: 550px;
        box-sizing: border-box;

        .top-container {
            display: flex;
            align-items: center;
            height: 48px;
            padding:15px;
            box-sizing: border-box;

            span {
                color: #112b5d;
                font-weight: 600;
                font-size: 14px;
            }
            .default-number {
                color: #2282ff;
            }
        }
        .list-item-checked {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #f0f0f0;
            padding-left: 15px;
            position: relative;
            box-sizing: border-box;

            .short-name {
                display: inline-block;
                width: 40px;
                height: 40px;
                background:#2282ff;
                color: #ffffff;
                font-size: 14px;
                border-radius: 5px;
                text-align: center;
                line-height: 40px;
                margin-right: 22px;
            }
            .full-name {
                display: inline-block;
                font-size: 14px;
                color: #112b5d;
                font-weight: 600;
            }
            .unit-name {
                color: #a9aaad;
                font-size: 12px;
                margin-top: 8px;
            }
            .delete-checked {
                width: 60px;
                height: 24px;
                border: 1px solid #f0f0f0;
                border-radius: 50px;
                text-align: center;
                color: #112b5d;
                font-size: 12px;
                line-height: 24px;
                position: absolute;
                right: 24px;
            }
        }
    }
}
</style>