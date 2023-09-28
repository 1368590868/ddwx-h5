<template>
    <div class="dashboard-container">
        <div class="video-container">
            <video
                src="/static/banner_app.mp4"
                width="100%"
                height="100%"
                autoplay
                loop
                muted
            ></video>
        </div>
        <div class="menu-container">
            <span class="system-title">公务用车管理系统</span>
            <div class="userinfo">
                <span>当前用户：</span>
                <span>{{userInfo.realName}}</span>
            </div>
            <div class="menu-normal-container">
                <div v-for="(item,index) in normalList" 
                    :key="index"
                    :class="['menu-noraml-button-first', index === 0 ? '':'menu-noraml-button-other'] "
                    @click="checkRoute(item)">

                    <div class="menu-noraml-info">
                        <i :class="checkMenuIcon(item,index)" class="default-icon-i"></i>
                        <span>{{item.menuName}}</span>
                    </div>
                </div>
            </div>
            <div class="box-container" v-if="gridList.length !== 0">
                <ul>
                    <li v-for="(item,index) in gridList" :key="index" @click="checkRoute(item)">
                        <i :class="checkMenuIcon(item,-1)" class="default-icon-i"></i>
                        <span>{{item.menuName}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {userMenu} from '@/api/auth'
import {mapGetters} from 'vuex'
import dash1 from '@/assets/icon/dash1.png';
export default {
    computed: mapGetters(['userInfo']),

    data (){
        return {
            dash1,
            //菜单数据
            menuData:[],
            //菜单列表
            menuList:[],
            //普通按钮数据
            normalList:[],
            //表格按钮数据
            gridList:[],
        }
    },
    mounted (){
        // this.bizNavigationSetRight();
        this.getIndexMenu();
	},
    methods: {
		bizNavigationSetRight () {
			// let _this = this;
            // this.$ww.biz.navigation.setRight({
            //     show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
            //     control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
            //     text: '首页', //控制显示文本，空字符串表示显示默认文本
            //     onSuccess: function() {
			// 		_this.$router.push('/dashboard');
            //     },
            //     onFail: function(err) {}
            // });
        },
        //获取首页菜单信息
        async getIndexMenu(){
            await userMenu().then(({data}) => {
                this.menuData = data;
                this.initMenu()
            }).catch((err) => {
                
            })
        },
        //初始化用户权限
        initMenu(){
            if(this.checkMenuDisplay('myCar')){
                let obj = {
                    menuName:'申请用车',
                }
                this.menuList.push(obj)
            }
            if(this.checkMenuDisplay('examineCar')){
                let obj = {
                    menuName:'用车审批',
                }
                this.menuList.push(obj)
            }
            if(this.checkMenuDisplay('dispatch')){
                let obj = {
                    menuName:'调度管理',
                }
                this.menuList.push(obj)
            }
            if(this.checkMenuDisplay('driverWorkBench')){
                let obj = {
                    menuName:'出车管理',
                }
                this.menuList.push(obj)
            }
            if(this.checkMenuDisplay('statis')){
                let obj = {
                    menuName:'统计报表',
                }
                this.menuList.push(obj)
            }
            //判断当前权限数量
            if(this.menuList.length <=3){
                this.normalList = this.menuList;
            }else{
                this.menuList.forEach((item,index) => {
                    if(index === 0){
                        this.normalList.push(item);
                    }else{
                        this.gridList.push(item);
                    }
                })
            }
        },
        //首页菜单条目是否显示判断
        checkMenuDisplay(menuUrl){
            let display = false;
            this.menuData.forEach((item) => {
                if(item.menuUrl===menuUrl){
                    display = true;
                }
            })
            return display;
        },
        //判断按钮图标
        checkMenuIcon(item,index){
            if(item.menuName === '申请用车'){
                return 'icon-sqyc'
            }else if(item.menuName === '用车审批'){
                if(index === 0){
                    return 'icon-ycsp-white'
                }
                return 'icon-ycsp'
            }else if(item.menuName === '调度管理'){
                if(index === 0){
                    return 'icon-ddgl-white'
                }
                return 'icon-ddgl'
            }else if(item.menuName === '出车管理'){
                if(index === 0){
                    return 'icon-ccgl-white'
                }
                return 'icon-ccgl'
            }else if(item.menuName === '统计报表'){
                if(index === 0){
                    return 'icon-tjbb-white'
                }
                return 'icon-tjbb'
            }
        },
        //判断路由跳转
        checkRoute(item){
            if(item.menuName === '申请用车'){
                this.$router.push({
                    name: 'StartApplying',
                    params: { id: '0' }
                });
            }else if(item.menuName === '用车审批'){
                this.$router.push('/CarApproval')
            }else if(item.menuName === '调度管理'){
                this.$router.push('/DispathOrder')
            }else if(item.menuName === '出车管理'){
                this.$router.push('/DrivingManage')
            }else if(item.menuName === '统计报表'){
                this.$router.push('/StatisticalStatement')
            }
            // else if(item.menuName === '变更审核'){
            //     this.$router.push('/ChangeExamine')
            // }
        },
	},
}
</script>
<style scoped lang="less">
.dashboard-container {
    .video-container {
        width: 375px;
        height: 500px;
    }
    .menu-container {
        width: 100%;
        height:401px;
        background-image:linear-gradient(0,rgba(231, 241, 253, 1) 0%,rgba(231, 241, 253, 0) 100%);
        background-image: -webkit-linear-gradient(90deg, #e7f1fd 0%,#e7f1fd 78%, rgba(231, 241, 253, 0) 100%);
        position: absolute;
        bottom: 0px;
        display: flex;
        flex-direction: column;
        text-align: center;

        .system-title {
            font-size: 28px;
            font-weight: 600;
            margin-top: 75px;
            letter-spacing: 2px;
        }
        .userinfo {
            margin-top: 5px;

            span {
                font-size: 13px;
                font-weight: 500;
            }
            span:nth-child(2){
                color: #2e87fc;
            }
        }
        .menu-normal-container {
            margin-top: 24px;
            padding: 0px 40px;
            position: relative;

            .menu-noraml-button-first {
                height: 44px;
                line-height: 44px;
                font-size: 16px;
                background: #0571FF;
                color: #ffffff;
                border-radius: 50px;
            }
            .menu-noraml-button-other {
                margin-top: 12px;
                height: 44px;
                line-height: 44px;
                font-size: 16px;
                background: #ffffff;
                color: #101010;
                border-radius: 50px;
            }
            .menu-noraml-info {
                width: 130px;
                margin: 0 auto;

                i {
                    width: 32px;
                    height: 32px;
                    position: absolute; 
                    margin-top:5px;
                    filter: saturate(1.3);
                }
                span {
                    margin-left: 5px;
                }
            }
        }
        .box-container {
            height: 99px;
            margin-top: 22px;
            padding: 0px 8px;
            border-radius: 12px;

            ul {
                width: 100%;
                height: 100%;
                list-style: none;
                display: flex;
                justify-content: space-between;

                li {
                    flex:1;
                    text-align: center;
                    font-size: 13px;

                    i {
                        width: 54px;
                        height: 54px;
                        margin: 0 auto; 
                        margin-top: 13px;
                        filter: saturate(1.3);
                    }
                }
            }
        }
    }
}
.icon-sqyc {
     background-image:url(/static/sqyc.png);
}
.icon-ycsp {
     background-image:url(/static/ycsp.png);
}
.icon-ycsp-white {
     background-image:url(/static/ycsp_white.png);
}
.icon-ddgl {
     background-image:url(/static/ddgl.png);
}
.icon-ddgl-white {
     background-image:url(/static/ddgl_white.png);
}
.icon-ccgl {
     background-image:url(/static/ccgl.png);
}
.icon-ccgl-white {
     background-image:url(/static/ccgl_white.png);
}
.icon-tjbb {
     background-image:url(/static/tjbb.png);
}
.icon-tjbb-white {
     background-image:url(/static/tjbb_white.png);
}

</style>