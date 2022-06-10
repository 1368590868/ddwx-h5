<template>
    <div class="dashboard-container">
        <lottie />
        <div class="dashboard-menu">
            <div class="menu-title">
                <h3>公务用车管理系统</h3>
                <p>用户名：{{userInfo.username}}</p>
            </div>
            <div class="menu-btnlist">
                <van-button color="#3681ee" v-if="checkMenuDisplay('myCar')" type="primary" :icon="dash1" block to="/CarApplication/OutstandOrder">申请用车</van-button>
                <van-button color="#3681ee" v-if="checkMenuDisplay('examineCar')" type="primary" :icon="dash2" block to="/CarApproval">用车审批</van-button>
                <!-- <van-button color="#3681ee" v-if="(userInfo.auth || []).includes('DISPATCH')" type="primary" :icon="dash3" block to="/DispatchAdminstration">调度管理</van-button> -->
                <van-button color="#3681ee" v-if="checkMenuDisplay('dispatch')" type="primary" :icon="dash3" block to="/DispathOrder">调度管理</van-button>
                <van-button color="#3681ee" v-if="checkMenuDisplay('driverWorkBench')" type="primary" :icon="dash4" block to="/DrivingManage">出车管理</van-button>
                <van-button color="#3681ee" v-if="checkMenuDisplay('statis')" type="primary" :icon="dash4" block to="/StatisticalStatement">统计报表</van-button>
            </div>
        </div>
    </div>
</template>

<script>
import Lottie from './Lottie'
import dash1 from '@/assets/icon/dash1.png';
import dash2 from '@/assets/icon/dash2.png';
import dash3 from '@/assets/icon/dash3.png';
import dash4 from '@/assets/icon/dash4.png';
import {userMenu} from '@/api/auth'
import {mapGetters} from 'vuex'
export default {
    components: {Lottie},
    computed: mapGetters(['userInfo']),
    data (){
        return {
            dash1,
            dash2,
            dash3,
            dash4,
            //菜单数据
            menuData:[]
        }
    },
    methods: {
		bizNavigationSetRight () {
			let _this = this;
            this.$ww.biz.navigation.setRight({
                show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
                control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
                text: '首页', //控制显示文本，空字符串表示显示默认文本
                onSuccess: function() {
					_this.$router.push('/dashboard');
                },
                onFail: function(err) {}
            });
        },
        //获取首页菜单信息
        async getIndexMenu(){
            await userMenu().then(({data}) => {
                this.menuData = data;
            }).catch((err) => {
                
            })
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
        }
	},
	mounted (){
        this.bizNavigationSetRight();
        this.getIndexMenu();
	}
}
</script>
<style scoped lang="less">
.dashboard-container {
    background-color:#4395FB;
    .dashboard-menu {
        height: 70%;
        .menu-title {
            padding-top: 10px;
            box-sizing: border-box;
            text-align: center;
            color: #fff;
            h3 {
                font-family: Source Han Sans CN;
                font-size: 28px;
            }
            p {
                font-size: 14px;
                font-weight: bold;
                margin-top: 12px;
            }
        }
        .menu-btnlist {
            width:327px;
            height: calc(100% - 78px);
            margin: 0 auto;
            display: flex;
            display: -webkit-flex;
            flex-direction: column;
            -webkit-flex-direction: column;
            justify-content: space-evenly;
            -webkit-justify-content: space-evenly;
            .van-button {
                font-size: 16px;
                height:52px;
                // margin-bottom: 12px;
                .van-icon__image {
                    width: 1rem;
                    height: 1rem;
                    margin-top: 5px;
                }
            }
        }
    }
    
}
</style>