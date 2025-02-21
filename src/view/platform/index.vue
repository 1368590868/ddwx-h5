<template>
    <div>
        <van-collapse v-model="activeNames">
            <van-collapse-item title="容器" :name="1">
                <van-button type="primary" @click="versionMessage">获取容器信息</van-button>
            </van-collapse-item>
            <van-collapse-item title="弹窗" :name="2">
                <van-button type="primary" @click="deviceNotificationAlert">弹窗alert</van-button>
                <van-button type="primary" @click="deviceNotificationConfirm">弹窗confirm</van-button>
                <van-button type="primary" @click="deviceNotificationVibrate">手机振动</van-button>
                <van-button type="primary" @click="deviceNotificationToast">Toast</van-button>
                <van-button type="primary" @click="deviceNotificationActionSheet">ActionSheet</van-button>
                <van-button type="primary" @click="deviceNotificationShowPreloader">打开加载框</van-button>
                <van-button type="primary" @click="deviceNotificationHidePreloader">关闭加载框</van-button>
                <van-button type="primary" @click="bizUtilSingleSelect">单选</van-button>
                <van-button type="primary" @click="bizUtilMultiSelect">多选</van-button>
            </van-collapse-item>
            <van-collapse-item title="设备" :name="3">
                <van-button type="primary" @click="deviceConnectionGetNetworkType">获取网络信息</van-button>
                <van-button type="primary" @click="deviceBaseGetWifiStatus">获取wifi状态</van-button>
                <van-button type="primary" @click="deviceBaseGetPhoneInfo">获取手机信息</van-button>
                <van-button type="primary" @click="deviceBaseGetInterface">获取热点信息</van-button>
                <van-button type="primary" @click="deviceUtilSetAlarm">设置闹钟</van-button>
                <van-button type="primary" @click="deviceUtilTurnOnFlash">打开闪光灯</van-button>
                <van-button type="primary" @click="deviceUtilTurnOffFlash">关闭闪光灯</van-button>
                <van-button type="primary" @click="deviceUtilSound">打开手机铃声</van-button>
                <van-button type="primary" @click="deviceUtilTakePhoto">拍照</van-button>
                <van-button type="primary" @click="deviceUtilChoosePhoto">打开相册</van-button>
                <van-button type="primary" @click="deviceBaseIncreaseVolume">调高音量</van-button>
                <van-button type="primary" @click="deviceBaseLowerVolume">调低音量</van-button>
                <van-button type="primary" @click="deviceBaseSetVolume">设置音量</van-button>
                <van-button type="primary" @click="deviceBaseIncreaseBrightness">调高屏幕亮度</van-button>
                <van-button type="primary" @click="deviceBaseLowerBrightness">调低屏幕亮度</van-button>
                <van-button type="primary" @click="deviceBaseSetBrightness">设置屏幕亮度</van-button>
            </van-collapse-item>

            <van-collapse-item title="日期&月历" :name="3">
                <van-button type="primary" @click="bizUtilDatepicker">选择日期</van-button>
                <van-button type="primary" @click="bizUtilTimepicker">选择时间</van-button>
                <van-button type="primary" @click="bizUtilDatetimepicker">选择日期和时间</van-button>
                <van-button type="primary" @click="bizCalendarChooseOneDay">打开日历</van-button>
                <van-button type="primary" @click="bizCalendarChooseDateTime">打开日历并选择时间</van-button>
                <van-button type="primary" @click="bizCalendarChooseHalfDay">打开日历并选择半天</van-button>
                <van-button type="primary" @click="bizCalendarChooseInterval">选择一段时间</van-button>
            </van-collapse-item>
            
            <van-collapse-item title="导航栏" :name="4">
                <van-button type="primary" @click="bizNavigationBgcolor">设置标题栏背景颜色</van-button>
                <van-button type="primary" @click="bizNavigationSetLeft">设置左侧导航按钮文本</van-button>
                <van-button type="primary" @click="bizNavigationSetTitle">设置标题</van-button>
                <van-button type="primary" @click="bizNavigationSetIcon">显示导航栏右侧按钮并设置点击事件</van-button>
                <van-button type="primary" @click="bizNavigationClose">关闭当前页面</van-button>
                <van-button type="primary" @click="bizNavigationSetRight">设置右侧按钮</van-button>
                <van-button type="primary" @click="bizNavigationSetMenu">设置菜单</van-button>
                <van-button type="primary" @click="bizNavigationReplace">替换页面</van-button>
                <van-button type="primary" @click="bizNavigationSetActionBarVisible">显示标题栏</van-button>
                <van-button type="primary" @click="bizNavigationSetActionBarColor">设置标题栏字体及图标颜色</van-button>
                <van-button type="primary" @click="bizNavigationSetActivityImmersion">设置手机状态栏颜色</van-button>
            </van-collapse-item>
            <van-collapse-item title="UI控件" :name="5">
                <van-button type="primary" @click="uiInputPlain">打开输入框</van-button>
                <van-button type="primary" @click="uiProgressBarSetColors">改变顶部进度条颜色</van-button>
                <van-button type="primary" @click="uiPullToRefreshEnable">允许下拉刷新</van-button>
                <van-button type="primary" @click="uiPullToRefreshDisable">禁止下拉刷新</van-button>
                <van-button type="primary" @click="bizUtilScan">扫描二维码</van-button>
                <van-button type="primary" @click="utilDomainStorageSetItem">设置存储信息</van-button>
                <van-button type="primary" @click="utilDomainStorageGetItem">获取存储信息</van-button>
                <van-button type="primary" @click="utilDomainStorageRemoveItem">删除存储信息</van-button>
            </van-collapse-item>
            <van-collapse-item title="地图" :name="6">
                <van-button type="primary" @click="deviceGeolocatioGet">定位</van-button>
                <van-button type="primary" @click="deviceGeolocationStart">连续定位</van-button>
                <van-button type="primary" @click="deviceGeolocationStop">停止连续定位</van-button>
                <van-button type="primary" @click="bizMapSearch">打开地图查找位置</van-button>
                <van-button type="primary" @click="bizClipboardDataSetData">设置粘贴板文字</van-button>
                <van-button type="primary" @click="bizClipboardDataGetData">获取粘贴板文字</van-button>
                <van-button type="primary" @click="bizMicroAppOpenApp">打开原生应用</van-button>
            </van-collapse-item>
            <van-collapse-item title="文件" :name="7">
                <van-button type="primary" @click="bizUtilIsLocalFileExist">检测文件是否存在</van-button>
                <van-button type="primary" @click="bizUtilDownloadFile">下载文件</van-button>
                <van-button type="primary" @click="bizUtilChooseFile">打开本地文件</van-button>
                <van-button type="primary" @click="bizUtilPlayVideo">打开视频</van-button>
                <van-button type="primary" @click="bizUtilPlayNativeVideo">打开原生播放器</van-button>
                <van-button type="primary" @click="bizUtilPlayMusic">打开音频</van-button>
                <van-button type="primary" @click="bizUtilCloseMusic">关闭音频</van-button>
                <van-button type="primary" @click="bizUtilOpenDocument">打开文件</van-button>
                <van-button type="primary" @click="bizUtilPreviewImage">打开画廊</van-button>
            </van-collapse-item>

            <van-collapse-item title="电话" :name="8">
                <van-button type="primary" @click="bizTelephoneShowCallMenu">拨打电话</van-button>
                <van-button type="primary" @click="bizTelephoneSendMessage">发送短信</van-button>
                <van-button type="primary" @click="bizContactChooseMobileContacts">打开手机通讯录</van-button>
                <van-button type="primary" @click="bizContactOpenUnitAddressBook">打开单位通讯录</van-button>
                <van-button type="primary" @click="deviceNotificationAddContact">手机通讯录添加联系人</van-button>
            </van-collapse-item>
            <van-collapse-item title="音频接口" :name="9">
                <van-button type="primary" @click="deviceAudioPlay">语音合成</van-button>
                <van-button type="primary" @click="deviceAudioStop">取消语音合成</van-button>
                <van-button type="primary" @click="deviceAudioPause">暂停语音合成</van-button>
                <van-button type="primary" @click="deviceAudioResume">继续语音合成</van-button>
                <van-button type="primary" @click="deviceAudioTranslateVoice">语音识别</van-button>
                <van-button type="primary" @click="bizUtilEncrypt">数据加密</van-button>
                <van-button type="primary" @click="bizUtilDecrypt">数据解密</van-button>
            </van-collapse-item>
            <van-collapse-item title="屏幕旋转" :name="10">
                <van-button type="primary" @click="deviceScreenVertical">切换为竖屏</van-button>
                <van-button type="primary" @click="deviceScreenHorizontal">切换为横屏</van-button>
                <van-button type="primary" @click="deviceScreenAuto">根据手机状态自动切换</van-button>
                <van-button type="primary" @click="deviceScreenFull">全屏显示</van-button>
                <van-button type="primary" @click="deviceScreenQuitfull">关闭全屏显示</van-button>
            </van-collapse-item>
            <van-collapse-item title="打开新页面" :name="11">
                <van-button type="primary" @click="deviceOpenBrowser">在浏览器打开新网页</van-button>
                <van-button type="primary" @click="deviceOpenLink">在新窗口上打开链接</van-button>
            </van-collapse-item>
            <van-collapse-item title="账号验证" :name="12">
                <van-button type="primary" @click="deviceIsTurnOnGesture">手机是否开启手势验证</van-button>
                <van-button type="primary" @click="deviceIsTurnOnFingerprint">手势验证</van-button>
                <van-button type="primary" @click="deviceVerifyFingerprint">手机是否开启指纹验证</van-button>
                <van-button type="primary" @click="deviceVerifyFingerprint">指纹验证</van-button>
            </van-collapse-item>
            <van-collapse-item title="浏览器操作" :name="13">
                <van-button type="primary" @click="deviceGetUrlHistory">获取网址历史记录</van-button>
                <van-button type="primary" @click="deviceClearUrlHistory">清除网页记录</van-button>
                <van-button type="primary" @click="deviceGoBackOrForward">前进或后退网页</van-button>
            </van-collapse-item>
        </van-collapse>
    </div>
</template>
<script>
export default {
    data () {
        return {
            activeNames: ['1']
        }
    },
    methods: {
        versionMessage () {
            this.$ww.version.message({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceNotificationAlert () {
            this.$ww.device.notification.alert({
                title: '标题',
                message: '6666666666666666',
                buttonName: '收到',
                onSuccess: function() {
                    alert("已确认");
                },
                onFail: function(err) {}
            });
        },
        deviceNotificationConfirm () {
            this.$ww.device.notification.confirm({
                title: "标题",
                message: "显示内容",
                buttonLabels: ['是', '否'],
                onSuccess: function(result) {
                    //被点击按钮的索引值，Number类型，从0开始
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        deviceNotificationVibrate () {
            this.$ww.device.notification.vibrate({
                duration: 3000, //震动时间，android可配置 iOS忽略
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        deviceNotificationToast () {
            this.$ww.device.notification.toast({
                message: "我是Toast"
            });
        },
        deviceNotificationActionSheet () {
            this.$ww.device.notification.actionSheet({
                title: "谁是最棒哒？", //标题
                cancelButton: '取消', //取消按钮文本
                otherButtons: ["孙悟空", "猪八戒", "唐僧", "沙和尚"],
                onSuccess: function(result) {
                    //onSuccess将在点击button之后回调
                    /*{
                        buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1
                    }*/
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceNotificationShowPreloader () {
            this.$ww.device.notification.showPreloader({
                message: '正在加载'
            });
        },
        deviceNotificationHidePreloader () {
            this.$ww.device.notification.hidePreloader();
        },
        bizUtilSingleSelect () {
            this.$ww.biz.util.singleSelect({
                options: ['选项1', '选项2', '选项3', '选项4'],
                selectOption: '选项3',
                onSuccess: function(result) {
                    /* 返回用户选中的index数组，从0开始。 例如
                        [ 2, 3 ]
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizUtilMultiSelect () {
            this.$ww.biz.util.multiSelect({
                options: ['选项1', '选项2', '选项3', '选项4'],
                selectOption: ['选项3', '选项4'],
                onSuccess: function(result) {
                    /* 返回用户选中的index数组，从0开始。 例如
                        [ 2, 3 ]
                    */
                   alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        // ---------------------------------------------------------
        // ---------------------------------------------------------
        deviceConnectionGetNetworkType () {
            this.$ww.device.connection.getNetworkType({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(error) {

                }
            });
        },
        deviceBaseGetWifiStatus () {
            this.$ww.device.base.getWifiStatus({
                onSuccess: function(result) {
                    //WIFI_STATE_DISABLED(1) 已关闭,WIFI_STATE_DISABLING(0) 关闭中,WIFI_STATE_ENABLED(3) 已连接,WIFI_STATE_ENABLING(2) 连接中,WIFI_STATE_UNKNOWN(4) 未知
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceBaseGetPhoneInfo () {
            this.$ww.device.base.getPhoneInfo({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceBaseGetInterface () {
            this.$ww.device.base.getInterface({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceUtilSetAlarm () {
            this.$ww.device.util.setAlarm({
                "hour": 11,
                "minutes": 11,
                "week": "1,2,3,4,5",
                "message": "打卡闹钟",
                "vibrate": true,
                "skipUi": true,
                "resId": 0,
                onSuccess: function() {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceUtilTurnOnFlash () {
            this.$ww.device.util.turnOnFlash({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceUtilTurnOffFlash () {
            this.$ww.device.util.turnOffFlash({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceUtilSound () {
            this.$ww.device.util.sound({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceUtilTakePhoto () {
            this.$ww.device.util.takePhoto({
                onSuccess: function(result) {
                    document.getElementById('location').innerHTML = result;
                    var img = document.getElementById("img");
                    img.src = "data:image/png;base64," + result;
                },
                onFail: function(err) {}
            });
        },
        deviceUtilChoosePhoto () {
            this.$ww.device.util.choosePhoto({
                "size": 9,
                onSuccess: function(result) {

                },
                onFail: function(err) {}
            });
        },
        deviceBaseIncreaseVolume () {
            this.$ww.device.base.increaseVolume ({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceBaseLowerVolume () {
            this.$ww.device.base.lowerVolume ({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceBaseSetVolume () {
            this.$ww.device.base.setVolume ({
                "percentage": 0.8,
                onSuccess: function() {},
                onFail: function(err) {}
            });

        },
        deviceBaseIncreaseBrightness () {
            this.$ww.device.base.increaseBrightness({
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        deviceBaseLowerBrightness () {
            this.$ww.device.base.lowerBrightness({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        deviceBaseSetBrightness () {
            this.$ww.device.base.setBrightness({
                percentage: 0.8,
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        // -----------------------------------------
        bizUtilDatepicker () {
            this.$ww.biz.util.datepicker({
                format: 'yyyy-MM-dd', //注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
                value: '2015-04-17', //默认显示日期
                onSuccess: function(result) {
                    //onSuccess将在点击完成之后回调
                    /*{
                        value: "2015-02-10"
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        
        
        bizUtilTimepicker () {
            this.$ww.biz.util.timepicker({
                format: 'HH:mm',
                value: '14:00', //默认显示时间  0.0.3
                onSuccess: function(result) {
                    //onSuccess将在点击完成之后回调
                    /*{
                        value: "10:00"
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizUtilDatetimepicker () {
            this.$ww.biz.util.datetimepicker({
                format: 'yyyy-MM-dd HH:mm',
                value: '2015-04-17 08:00', //默认显示
                onSuccess: function(result) {
                    //onSuccess将在点击完成之后回调
                    /*{
                        value: "2015-06-10 09:50"
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizCalendarChooseOneDay () {
            this.$ww.biz.calendar.chooseOneDay({
                onSuccess: function(result) {
                    //onSuccess将在点击确定之后回调
                    /*{
                        chosen:1494345600000,
                        timezone:8
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizCalendarChooseDateTime () {
            this.$ww.biz.calendar.chooseDateTime({
                onSuccess: function(result) {
                    //onSuccess将在点击确定之后回调
                    /*{
                        chosen:1494345600000,
                        timezone:8
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizCalendarChooseHalfDay() {
            this.$ww.biz.calendar.chooseHalfDay({
                onSuccess: function(result) {
                    //onSuccess将在点击确定之后回调
                    /*{
                        chosen:1494345600000,
                        timezone:8
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizCalendarChooseInterval () {
            this.$ww.biz.calendar.chooseInterval({
                onSuccess: function(result) {
                    //onSuccess将在点击确定之后回调
                    /*{
                        start: 1514908800000,
                        end: 1514995200000,
                        timezone:8
                    }
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        //-----------------------------------------------------
        bizNavigationBgcolor () {
            this.$ww.biz.navigation.bgcolor({
                bgcolor: '#00ff00',
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        bizNavigationSetLeft () {
            this.$ww.biz.navigation.setLeft({
                control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
                text: '首页', //控制显示文本
                onSuccess: function() {
                    /*
                    {}
                    */
                    //如果control为true，则onSuccess将在发生按钮点击事件被回调
                    alert('左侧按钮被点击');
                },
                onFail: function(err) {}
            });
        },
        bizNavigationSetTitle () {
            this.$ww.biz.navigation.setTitle({
                title: '我的标题',
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        bizNavigationSetIcon () {
            this.$ww.biz.navigation.setIcon({
                showIcon: true, //是否显示icon
                imageUrl: "", //图片地址
                onSuccess: function() {
                    /*结构
                    {
                    }*/
                    //点击icon之后将会回调这个函数
                    alert('问号被点击了');
                },
                onFail: function(err) {
                    //jsapi调用失败将会回调此函数
                }
            })
        },
        bizNavigationClose () {
            this.$ww.biz.navigation.close();
        },
        bizNavigationSetRight () {
            this.$ww.biz.navigation.setRight({
                show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
                control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
                text: '发送', //控制显示文本，空字符串表示显示默认文本
                onSuccess: function() {
                    //如果control为true，则onSuccess将在发生按钮点击事件被回调
                    /*
                    {}
                    */
                    alert('右侧被点击了');
                },
                onFail: function(err) {}
            });
        },
        bizNavigationSetMenu () {
            this.$ww.biz.navigation.setMenu({
                show: true,
                items: [{
                        "id": "1", //字符串
                        "iconId": "https://img.alicdn.com/tfs/TB10oldD6DpK1RjSZFrXXa78VXa-240-240.png", //字符串，图标命名
                        "text": "设置"
                    },
                    {
                        "id": "2",
                        "iconId": "https://img.alicdn.com/tfs/TB1FmNuD3HqK1RjSZFkXXX.WFXa-240-240.png",
                        "text": "编辑"
                    },
                    {
                        "id": "3",
                        "iconId": "https://img.alicdn.com/tfs/TB1FmNuD3HqK1RjSZFkXXX.WFXa-240-240.png",
                        "text": "disange",
                    },
                    {
                        "id": "4",
                        "iconId": "https://img.alicdn.com/tfs/TB1FmNuD3HqK1RjSZFkXXX.WFXa-240-240.png",
                        "text": "disige"
                    }
                ],
                onSuccess: function(data) {
                    /*
                    {"id":"1"}
                    */
                    alert(data);
                },
                onFail: function(err) {}
            });
        },
        bizNavigationReplace () {
            this.$ww.biz.navigation.replace({
                url: 'https://www.baidu.com', // 新的页面链接
                onSuccess: function() {
                    /*
                    {}
                    */
                },
                onFail: function(err) {}
            });
        },
        bizNavigationSetActionBarVisible () {
            this.$ww.biz.navigation.setActionBarVisible({
                isVisible: isVisible,
                onSuccess: function() {

                },
                onFail: function(err) {}
            });
        },
        bizNavigationSetActionBarColor () {
            this.$ww.biz.navigation.setActionBarColor({
                color: '#ffffff',
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        bizNavigationSetActivityImmersion () {
            this.$ww.biz.navigation.setActivityImmersion({
                color: '#000000',
                isLight: false,
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        // -------------------------------------
        uiInputPlain (text) {
            this.$ww.ui.input.plain({
                placeholder: '说点什么吧', //占位符
                text: text || 'hello word', //默认填充文本
                onSuccess: function(result) {
                    //onSuccess将在点击发送之后调用
                    /*{
                        text: String
                    }*/
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {

                }
            })
        },
        uiProgressBarSetColors () {
            this.$ww.ui.progressBar.setColors({
                color: "#ff0000", //进度条颜色  onSuccess: function() {
                    /*
                        true:成功  false:失败
                    */
                onFail: function(err) {}
            })
        },
        uiPullToRefreshEnable () {
            this.$ww.ui.pullToRefresh.enable({
                onSuccess: function(options) {
                    alert(options, "允许下拉刷新")
                },
                onFail: function(err) {}
            })
        },
        uiPullToRefreshDisable () {
            this.$ww.ui.pullToRefresh.disable()
        },
        bizUtilScan () {
            this.$ww.biz.util.scan({
                type: "all", // type 为 all、qrCode、barCode，默认是all。
                onSuccess: function(data) {
                    //onSuccess将在扫码成功之后回调
                    /* data结构
                    { 'text': String}
                    */
                    alert(data);
                },
                onFail: function(err) {}
            })
        },
        utilDomainStorageSetItem () {
            this.$ww.util.domainStorage.setItem({
                name: 'key', // 存储信息的key值
                value: 'value------ooooo', // 存储信息的Value值
                onSuccess: function() {

                },
                onFail: function(err) {

                }
            });
        },
        utilDomainStorageGetItem () {
            this.$ww.util.domainStorage.getItem({
                name: 'key', // 存储信息的key值
                onSuccess: function(result) {
                    /*{
                        value: 'value' // 获取存储的信息
                    }*/
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {
                    alert(JSON.stringify(err));
                }
            });
        },
        utilDomainStorageRemoveItem () {
            this.$ww.util.domainStorage.removeItem({
                name: 'key', // 存储信息的key值
                onSuccess: function() {

                },
                onFail: function(err) {

                }
            });
        },
        // ------------------------------------------------------------------------

        deviceGeolocatioGet () {
            this.$ww.device.geolocation.get({
                vendor: "baidu",
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceGeolocationStart () {
            this.$ww.device.geolocation.start({
                vendor: 'baidu', // 定位场景id,
                onSuccess: function(result) {
                    /*  结果同ww.device.geolocation.get */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        deviceGeolocationStop () {
            this.$ww.device.geolocation.stop({
                vendor: 'baidu', // 定位类型baidu,gaode
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            });
        },
        bizMapSearch () {
            this.$ww.biz.map.search({
                onSuccess: function(poi) {
                    alert(poi);
                },
                onFail: function(err) {}
            });
        },
        bizClipboardDataSetData () {
            this.$ww.biz.clipboardData.setData({
                text: "要复制粘贴板的内容", //要复制粘贴板的内容
                onSuccess: function() {
                    /**/
                },
                onFail: function(err) {}
            })
        },
        bizClipboardDataGetData () {
            this.$ww.biz.clipboardData.getData({
                onSuccess: function(result) {
                    /**/
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizMicroAppOpenApp () {
            this.$ww.biz.microApp.openApp({
                packageName: 'com.carsmobileoa',
                content: '内容',
                onSuccess: function() {},
                onFail: function(err) {}
            })
        },
        // -----------------------------------------------------------
        bizUtilIsLocalFileExist () {
            this.$ww.biz.util.isLocalFileExist({
                fileNames: ["日程设计.docx", "API.xlsx"],
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizUtilDownloadFile () {
            this.$ww.biz.util.downloadFile({
                url: 'https://192.168.60.39/MobilePlatform/download/package/MobilePlatform.apk', //要下载的文件的url
                name: '一个图片.jpg', //定义下载文件名字
                onProgress: function(msg) {
                    // 文件下载进度回调
                    document.getElementById('location').innerHTML = msg;
                },
                onSuccess: function(result) {
                    /*
                    true
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizUtilChooseFile () {
            this.$ww.biz.util.chooseFile({
                onSuccess: function(result) {
                    /*
                    true
                    */
                    alert(JSON.stringify(result));
                },
                onFail: function(err) {}
            })
        },
        bizUtilPlayVideo () {
            this.$ww.biz.util.playVideo({
                title: '演讲视频',
                url: 'http://9890.vod.myqcloud.com/9890_4e292f9a3dd011e6b4078980237cc3d3.f20.mp4',
                onSuccess: function() {
                    /*
                    true
                    */
                },
                onFail: function(err) {}
            });
        },
        bizUtilPlayNativeVideo () {
            this.$ww.biz.util.playNativeVideo({
                title: '演讲视频',
                url: 'http://9890.vod.myqcloud.com/9890_4e292f9a3dd011e6b4078980237cc3d3.f20.mp4',
                onSuccess: function() {
                    /*
                    true
                    */
                },
                onFail: function(err) {}
            });
        },
        bizUtilPlayMusic () {
            this.$ww.biz.util.playMusic({
                title: '音乐',
                url: 'https://mbrbimg.oss-cn-shanghai.aliyuncs.com/picturebook/audio/35_591d9f4cb39e2_08o.mp3',
                onSuccess: function() {
                    /*
                    true
                    */
                },
                onFail: function(err) {}
            });
        },
        bizUtilCloseMusic () {
            this.$ww.biz.util.closeMusic({
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        bizUtilOpenDocument () {
            this.$ww.biz.util.openDocument({
                url: 'https://app.rails.cn/MobilePlatform/download/document/平台集成H5子应用手册.pdf',
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        bizUtilPreviewImage () {
            this.$ww.biz.util.previewImage({
                content: [{
                        "url": "https://app.rails.cn/MobilePlatform/download/images/banner1.png"
                    },
                    {
                        "url": "https://app.rails.cn/MobilePlatform/download/images/banner2.png"
                    },
                    {
                        "url": "https://app.rails.cn/MobilePlatform/download/images/banner3.png"
                    },
                    {
                        "url": "https://app.rails.cn/MobilePlatform/download/images/banner4.png"
                    },
                ], //图片地址列表
                current: 2, //当前显示的图片链接
                onSuccess: function() {
                    /**/
                },
                onFail: function(err) {}
            });
        },
        // -------------------------------------------------------
        bizTelephoneShowCallMenu () {
            this.$ww.biz.telephone.showCallMenu({
                phoneNumber: '13031115722', // 期望拨打的电话号码
                code: '+86', // 国家代号，中国是+86
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        bizTelephoneSendMessage () {
            this.$ww.biz.telephone.sendMessage({
                phoneNumber: '10086', // 期望拨打的电话号码
                code: '+86', // 国家代号，中国是+86
                message: 'hello world', // 是否显示即时通电话
                onSuccess: function() {},
                onFail: function(err) {}
            });
        },
        bizContactChooseMobileContacts () {
            this.$ww.biz.contact.chooseMobileContacts({
                onSuccess: function(data) {
                    //onSuccess将在选人结束，点击确定按钮的时候被回调
                    /* data结构
                    [{
                        "name": "张三", //姓名
                        "phone": "110" //用户手机号
                    },
                    ...
                    ]
                    */
                    alert(data);
                },
                onFail: function(err) {}
            });
        },
        bizContactOpenUnitAddressBook () {
            this.$ww.biz.contact.openUnitAddressBook();
        },
        deviceNotificationAddContact () {
            this.$ww.device.notification.addContact({
                name: '李四',
                phone: '123456789'
            });
        },
        deviceAudioPlay () {
            this.$ww.device.audio.play({
                "text": "内容",
                "voice_name": "xiaoyan",
                "speed": 50,
                "volume": 50,
                "pitch": 50,
                onSuccess: function() {
                },
                onFail: function(err) {}
            });
        },
        deviceAudioStop () {
            this.$ww.device.audio.stop();
        },
        deviceAudioPause () {
            this.$ww.device.audio.pause();
        },
        deviceAudioResume () {
            this.$ww.device.audio.resume();
        },
        deviceAudioTranslateVoice () {
            this.$ww.device.audio.translateVoice({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
        bizUtilEncrypt () {
            this.$ww.biz.util.encrypt({
                text: '加密前数据',
                type: "sm2",
                key: "",
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
        bizUtilDecrypt () {
            this.$ww.biz.util.decrypt({
                text: '加密后数据',
                type: "sm2",
                key: "",
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
        // ---------------------------------------------------------------------------------
        deviceScreenVertical (){
            this.$ww.device.screen.vertical()
        },
        deviceScreenHorizontal (){
            this.$ww.device.screen.horizontal()
        },
        deviceScreenAuto (){
            this.$ww.device.screen.auto();
        },
        deviceScreenFull (){
            this.$ww.device.screen.full();
        },
        deviceScreenQuitfull (){
            this.$ww.device.screen.quitfull();
        },
        deviceOpenBrowser (){
            this.$ww.device.screen.openBrowser({
                url: "http://www.baidu.com"
            });
        },
        deviceOpenLink (){
            this.$ww.device.screen.openLink({
                url: "http://www.baidu.com"
            });
        },
        deviceIsTurnOnGesture (){
            this.$ww.device.verify.isTurnOnGesture({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
        deviceIsTurnOnFingerprint (){
            this.$ww.device.verify.isTurnOnFingerprint({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
        deviceVerifyFingerprint (){
            this.$ww.device.verify.verifyFingerprint({
                onSuccess: function() {
                },
                onError: function(err) {

                }
            });
        },
        deviceGetUrlHistory (){
            let _this = this;
            this.$ww.device.webview.getUrlHistory({
                onSuccess: function(result) {
                    alert(JSON.stringify(result));
                    _this.uiInputPlain(JSON.stringify(result));
                },
                onError: function(err) {

                }
            });
        },
         deviceClearUrlHistory (){
            this.$ww.device.webview.clearUrlHistory();
        },
         deviceGoBackOrForward (){
            this.$ww.device.webview.goBackOrForward({
                position: -1
            });
        },
        
            
        // deviceVerifyFingerprint (){
        //     this.$ww.device.verify.verifyFingerprint({
        //         onSuccess: function() {
        //         },
        //         onError: function(err) {

        //         }
        //     });
        // },
        





        
    }
}
</script>
<style scoped lang="less">
    .van-button {
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>