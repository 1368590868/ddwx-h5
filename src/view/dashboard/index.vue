<template>
  <div class="dashboard-container">
    <div class="video-container">
      <img src="/static/home-bg.png" width="100%" />
    </div>


    <div class="menu-container">
      <span class="system-title">机关维修调度系统</span>
      <div class="userinfo">
        <span>用户名：</span>
        <span>{{ userInfo.realName }}</span>
      </div>
      <div class="request-info">
        <div>
          <span class="request-number">{{ todayRequests }} </span>
          <span>今日申请</span>
        </div>
        <div>
          <span class="request-number">{{ monthRequests }} </span>
          <span>本月申请</span>
        </div>
      </div>
      <div class="menu-normal-container">
        <div :class="['menu-noraml-button-first']" @click="checkRoute(item)">
          <div class="menu-noraml-info">
            <i class="icon-sqbx default-icon-i"></i>
            <span>新增保修</span>
          </div>
        </div>
      </div>
      <div class="box-container" v-if="gridList.length !== 0">
        <div class="box-title">
            <div>工单状态</div>
            <div>工单管理 ></div>
        </div>
        <ul>
          <li
            v-for="(item, index) in gridList"
            :key="index"
            @click="checkRoute(item)"
          >
            <i :class="item.icon" class="default-icon-i" style="width: 23px;height: 26px;"></i>
            <span>{{ item.menuName }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { userMenu } from "@/api/auth";
import { mapGetters } from "vuex";
export default {
  computed: mapGetters(["userInfo"]),

  data() {
    return {
      //菜单数据
      menuData: [],
      //菜单列表
      menuList: [],
      //普通按钮数据
      normalList: [],
      //表格按钮数据
      gridList: [
        {
          status: 0,
          menuName: "待审核",
          icon: "icon-dsh",
        },
        {
          status: 1,
          menuName: "处理中",
          icon: "icon-clz",
        },
        {
          status: 2,
          menuName: "已完成",
          icon: "icon-ywc",
        },
        {
          status: 3,
          menuName: "已取消",
          icon: "icon-yqx",
        },
      ],
      todayRequests: 1,
      monthRequests: 2,
    };
  },
  mounted() {
    this.getIndexMenu();
  },
  methods: {
    //获取首页菜单信息
    async getIndexMenu() {
      await userMenu()
        .then(({ data }) => {
          this.menuData = data;
          // this.initMenu()
        })
        .catch((err) => {});
    },
    //初始化用户权限
    // initMenu(){
    //     if(this.checkMenuDisplay('myCar')){
    //         let obj = {
    //             menuName:'申请用车',
    //         }
    //         this.menuList.push(obj)
    //     }
    //     if(this.checkMenuDisplay('examineCar')){
    //         let obj = {
    //             menuName:'用车审批',
    //         }
    //         this.menuList.push(obj)
    //     }
    //     if(this.checkMenuDisplay('dispatch')){
    //         let obj = {
    //             menuName:'调度管理',
    //         }
    //         this.menuList.push(obj)
    //     }
    //     if(this.checkMenuDisplay('driverWorkBench')){
    //         let obj = {
    //             menuName:'出车管理',
    //         }
    //         this.menuList.push(obj)
    //     }
    //     if(this.checkMenuDisplay('statis')){
    //         let obj = {
    //             menuName:'统计报表',
    //         }
    //         this.menuList.push(obj)
    //     }
    //     //判断当前权限数量
    //     if(this.menuList.length <=3){
    //         this.normalList = this.menuList;
    //     }else{
    //         this.menuList.forEach((item,index) => {
    //             if(index === 0){
    //                 this.normalList.push(item);
    //             }else{
    //                 this.gridList.push(item);
    //             }
    //         })
    //     }
    // },
    //首页菜单条目是否显示判断
    checkMenuDisplay(menuUrl) {
      let display = false;
      this.menuData.forEach((item) => {
        if (item.menuUrl === menuUrl) {
          display = true;
        }
      });
      return display;
    },

    //判断路由跳转
    checkRoute(item) {
      if (item.menuName === "申请用车") {
        this.$router.push({
          name: "StartApplying",
          params: { id: "0" },
        });
      } else if (item.menuName === "用车审批") {
        this.$router.push("/CarApproval");
      } else if (item.menuName === "调度管理") {
        this.$router.push("/DispathOrder");
      } else if (item.menuName === "出车管理") {
        this.$router.push("/DrivingManage");
      } else if (item.menuName === "统计报表") {
        this.$router.push("/StatisticalStatement");
      }
      // else if(item.menuName === '变更审核'){
      //     this.$router.push('/ChangeExamine')
      // }
    },
  },
};
</script>
<style scoped lang="less">
.dashboard-container {
  .video-container {
    width: 375px;
    height: 500px;
  }
  .menu-container {
    width: 100%;
    height: 650px;
    background-image: linear-gradient(
      0,
      #d6e4f1 0%,
      rgba(231, 241, 253, 0) 100%
    );
    background-image: -webkit-linear-gradient(
      90deg,
      #d6e4f1 0%,
      #e7f1fd 78%,
      rgba(231, 241, 253, 0) 100%
    );
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    text-align: center;

    .system-title {
      font-size: 28px;
      font-weight: 600;
      margin-top: 92px;
      letter-spacing: 2px;
    }
    .userinfo {
      margin-top: 5px;

      span {
        font-size: 13px;
        font-weight: 500;
      }
      span:nth-child(2) {
        color: #2e87fc;
      }
    }
    .request-info {
      display: flex;
      margin-top: 10px;
      justify-content: space-evenly;

      div {
        display: flex;
        flex-direction: column;
        text-align: center;
        font-weight: bold;
        font-size: 16px;

        .request-number {
          font-size: 28px;
          font-weight: bold;
          color: #1e1e1e;
        }
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
        background: #0571ff;
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
          width: 23px;
          height: 23px;
          position: absolute;
          margin-top: 10px;
          filter: saturate(1.3);
        }
        span {
          margin-left: 5px;
        }
      }
    }
    .box-container {
      margin-top: 22px;
      padding: 9px 8px;
      border-radius: 5px;

      .box-title{
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        
        color: #000;
        font-size: 16px;
        padding: 0 10px;
        div:nth-last-child(1){
            font-size: 14px;
            color: #868686;
        }
      }

      ul {
       
        list-style: none;
        display: flex;
        justify-content: space-between;
        

        li {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: bold;

          i {
            margin: 0 auto;
            margin-top: 13px;
            filter: saturate(1.3);
          }

          span{
            font-size: 14px;
            display: block;
            margin-top: 5px;
            color: #1E1E1E;
          }
        }
      }
    }
  }
}
.icon-sqbx {
  background-image: url(/static/sqbx.png);
}

.icon-dsh {
  background-image: url(/static/dsh.png);
}
.icon-clz {
  background-image: url(/static/clz.png);
}
.icon-ywc {
  background-image: url(/static/ywc.png);
}
.icon-yqx {
  background-image: url(/static/yqx.png);
}

// car
.icon-ddgl-white {
  background-image: url(/static/ddgl_white.png);
}
.icon-ccgl {
  background-image: url(/static/ccgl.png);
}
.icon-ccgl-white {
  background-image: url(/static/ccgl_white.png);
}
.icon-tjbb {
  background-image: url(/static/tjbb.png);
}
.icon-tjbb-white {
  background-image: url(/static/tjbb_white.png);
}
</style>
