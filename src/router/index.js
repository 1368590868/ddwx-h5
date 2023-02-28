import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

import Layout from '@/layout'

export const routes = [
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		icon: 'home-o',
		meta: {title: '首页', base_path: '/'},
		children: [
			{
				path: 'dashboard',
				meta: {title: '首页', base_path: '/'},
				component: () => import('@/view/dashboard/index')
			}
		]
	},
	{
		path: '/CarApplication',
		component: () => import('@/view/CarApplication/index.vue'),
		redirect: '/CarApplication/OutstandOrder',
		meta: {title: '用车申请'},
		hidden: true,
		children: [
			{
				path: 'StartApplying/:id',
				name: 'StartApplying',
				meta: {title: '开始申请'},
				component: () => import('@/view/CarApplication/StartApplying')
			}, {
				path: 'PerfectInfo',
				name: 'PerfectInfo',
				meta: {title: '完善信息'},
				component: () => import('@/view/CarApplication/PerfectInfo')
			}, {	// :sAddProofFlag/:scheckType/:typeCode
				path: 'SubSuccess/:id',
				name: 'SubSuccess',
				meta: {title: '提交成功'},
				component: () => import('@/view/CarApplication/SubSuccess')
			}, {
				path: 'OrderDetail/:id',
				name: 'OrderDetail',
				meta: {title: '订单详情'},
				component: () => import('@/view/CarApplication/OrderDetail')
			}, {
				path: 'OutstandOrder',
				name: 'OutstandOrder',
				meta: {title: '用车申请单', keepAlive: true},
				component: () => import('@/view/CarApplication/OutstandOrder')
			},{
				path: 'DefalultAddress',
				name: 'DefalultAddress',
				meta: {title: '常用地址'},
				component: () => import('@/view/CarApplication/DefalultAddress')
			}
		]
	},
	{
		path: '/CarApproval',
		component: () => import('@/view/CarApproval/index.vue'),
		redirect: '/CarApproval/index',
		meta: {title: '用车审批'},
		hidden: true,
		children: [
			{
				path: 'index',
				name: 'ApprovalPending',
				meta: {title: '待审批', keepAlive: true},
				component: () => import('@/view/CarApproval/ApprovalPending')
			},{
				path: 'ApprovalDetail/:id',
				name: 'ApprovalDetail',
				meta: {title: '订单详情'},
				component: () => import('@/view/CarApproval/ApprovalDetail')
			},
			// {
			// 	path: 'reject/:autoId',
			// 	name: 'reject',
			// 	meta: {title: '订单详情'},
			// 	component: () => import('@/view/CarApproval/reject')
			// },
			{	// :sAddProofFlag/:scheckType/:typeCode
				path: 'approvalSuccess/:id',
				name: 'approvalSuccess',
				meta: {title: '提交成功'},
				component: () => import('@/view/CarApproval/SubSuccess')
			}, ]	
	},

	{
		path: '/Information',
		component: Layout,
		redirect: '/Information/index',
		meta: {title: '消息', base_path: '/Information'},
		icon: 'setting-o',
		children: [
			{
				path: 'index',
				meta: {title: '消息列表', base_path: '/Information'},
				component: () => import('@/view/Information/MessageList')
			},
			{
				path: 'MessageDetail/:sendUser',
				name: 'MessageDetail',
				meta: {title: '详细消息', base_path: '/Information'},
				component: () => import('@/view/Information/MessageDetail')
			}
		]
	},
	{
		path: '/MyManager',
		component: Layout,
		redirect: '/MyManager/index',
		meta: {title: '我的'},
		children: [
			{
				path: 'index',
				meta: {title: '我的'},
				component: () => import('@/view/MyManager/index')
			}
		]
	},
	{
		path:'/address',
		redirect:"/address/index",
		component: () => import('@/view/Address'),
		meta: {title: '常用地址'},
		children: [
			{
				path:'index',
				name:'AddressList',
				meta: {title: '常用地址'},
				component: () => import('@/view/Address/AddressList')
			},
			{
				path:'create',
				name:'CreateAddress',
				meta: {title: '新建常用地址'},
				component: () => import('@/view/Address/CreateAddress')
			},
			{
				path:'detail',
				name:'AddressDetail',
				meta: {title: '常用地址详情'},
				component: () => import('@/view/Address/AddressDetail')
			},
		]
	},
	{
		path: '/DispathOrder',
		component: () => import('@/view/DispathOrder/index.vue'),
		redirect: '/DispathOrder/index',
		meta: {title: '调度管理'},
		hidden: true,
		children: [
			{
				path: 'index',
				name: 'DispatchOrderList',
				meta: {title: '调配管理',keepAlive: true},
				component: () => import('@/view/DispathOrder/DispatchOrderList')
			},
			{
				path: 'DispathApply/:type/:id',
				name: 'DispathApply',
				meta: {title: '人工调配', keepAlive: true},
				component: () => import('@/view/DispathOrder/DispathApply')
			},
			{
				path: 'DispathPerfec/:type/:id',
				name: 'DispathPerfect',
				meta: {title: '人工调配'},
				component: () => import('@/view/DispathOrder/DispathPerfect')
			},			
			{
				path: 'DispatchVehicle/:type/:id',
				name: 'DispatchVehicle',  // vehicie{0:"上一步", 1: "正常已审批派单"}
				meta: {title: '请选择车辆'},
				component: () => import('@/view/DispathOrder/DispatchVehicle')
			},
			{	
				path: 'DispathDriver/:type/:id',
				name: 'DispathDriver',
				meta: {title: '请选择司机', keepAlive: true},
				component: () => import('@/view/DispathOrder/DispathDriver')
			},
			{
				path: 'DispatchDetails/:type/:id',	// type {0: 人工调派, 。 2： 改派}
				name: 'DispatchDetails',
				meta: {title: '调度详情'},
				component: () => import('@/view/DispathOrder/DispatchDetails')
			},
			{
				path: 'ConfirmDistribute/:type/:id',	// type {5: 正常已审批派单。}
				name: 'ConfirmDistribute',
				meta: {title: '派单详情'},
				component: () => import('@/view/DispathOrder/ConfirmDistribute')
			},
			{
				path: 'CreateOder', // 创建调度单 人工派车
				name: 'CreateOder',
				meta: {title: '派单详情'},
				component: () => import('@/view/DispathOrder/CreateOder')
			},
			{
				path: 'CopyOder/:type/:id', // 创建调度单 人工派车
				name: 'CopyOder',
				meta: {title: '复制订单'},
				component: () => import('@/view/DispathOrder/CopyOder')
			},
			{
				path: 'ReassignmentOrder/:type/:id', // 创建调度单 人工派车
				name: 'ReassignmentOrder',
				meta: {title: '改派订单'},
				component: () => import('@/view/DispathOrder/ReassignmentOrder')
			},
			{
				path: 'ChangeOder/:type/:id',	// type {0: 人工调派, 1: 正常已审批派单。 2： 改派}
				name: 'ChangeOder',
				meta: {title: '转单'},
				component: () => import('@/view/DispathOrder/ChangeOder')
			},
			{
				path: 'DefaultAddress',
				name: 'DefaultAddress',
				meta: {title: '常用地址'},
				component: () => import('@/view/DispathOrder/DefaultAddress')
			},
			{
				path: 'DispathSuccess/:id',
				name: 'DispathSuccess',
				meta: {title: '提交成功'},
				component: () => import('@/view/DispathOrder/DispathSuccess')
			}, 
		]
	},


	{
		path: '/DispatchAdminstration',
		component: () => import('@/view/DispatchAdminstration/index.vue'),
		redirect: '/DispatchAdminstration/index',
		meta: {title: '调度管理'},
		hidden: true,
		children: [
			{
				path: 'index',
				name: 'order',
				meta: {title: '调配管理',keepAlive: true},
				component: () => import('@/view/DispatchAdminstration/order')
			},
			{
				path: 'artificials/:autoId',
				name: 'artificials',
				meta: {title: '人工调配'},
				component: () => import('@/view/DispatchAdminstration/artificials')
			},
			{
				path: 'details/:type/:autoId',
				name: 'details',
				meta: {title: '详情页'},
				component: () => import('@/view/DispatchAdminstration/details')
			},
			{
				path: 'ChoiceVehicie/:typeVehicie',
				name: 'ChoiceVehicie',
				meta: {title: '请选择车辆',keepAlive: true},
				component: () => import('@/view/DispatchAdminstration/ChoiceVehicie')
			},
			{
				path: 'ChoiceDriver/:typeDriver',
				name: 'ChoiceDriver',
				meta: {title: '请选择司机',keepAlive: true},
				component: () => import('@/view/DispatchAdminstration/ChoiceDriver')
			},
			{
				path: 'subSuccess',
				name: 'subSuccess',
				meta: {title: '提交成功'},
				component: () => import('@/view/DispatchAdminstration/subSuccess')
			}, 
			{
				path: 'StartApplyings/:autoId/:type',
				name: 'StartApplyings',
				meta: {title: '人工调配'},
				component: () => import('@/view/DispatchAdminstration/StartApplyings')
			},
		]
	},
	{
		path: '/DrivingManage',
		component: () => import('@/view/DrivingManage/index.vue'),
		redirect: '/DrivingManage/index',
		meta: {title: '出车管理'},
		hidden: true,
		children: [
			{
				path: 'index',
				name: 'DrivingList',
				meta: {title: '出车管理',keepAlive: true},
				component: () => import('@/view/DrivingManage/DrivingList')
			},
			{
				path: 'DrivingDetails/:autoId',
				name: 'DrivingDetails',
				meta: {title: '出车管理详情'},
				component: () => import('@/view/DrivingManage/DrivingDetails')
			},
			{
				path: 'DriSuccess/:autoId',
				name: 'DriSuccess',
				meta: {title: '还车成功'},
				component: () => import('@/view/DrivingManage/DriSuccess')
				
			}
		]
	},
	{
		path: '/ChangeExamine',
		component: () => import('@/view/ChangeExamine/index.vue'),
		redirect: '/ChangeExamine/index',
		meta: {title: '变更审核'},
		hidden: true,
		children: [
			{
				path: 'index',
				name: 'ChangeExamineList',
				meta: {title: '变更审核',keepAlive: true},
				component: () => import('@/view/ChangeExamine/ChangeExamineList')
			},
			{
				path: 'ChangeExamineDetail',
				name: 'ChangeExamineDetail',
				meta: {title: '变更单详情'},
				component: () => import('@/view/ChangeExamine/ChangeExamineDetail')
			},
		]
	},
	{
		path: '/StatisticalStatement',
		component: () => import('@/view/StatisticalStatement/index.vue'),
		redirect: '/StatisticalStatement/index',
		meta: {title: '统计报表'},
		hidden: true,
		children:[
			{
				path: 'index',
				name: 'StatisticalCar',
				meta: {title: '统计报表'},
				component: () => import('@/view/StatisticalStatement/StatisticalCar')
			}
		]
	},
	{
		path: '/Suggestion',
		component: () => import('@/view/Suggestion/index.vue'),
		redirect: '/Suggestion/index',
		meta: {title: '意见反馈'},
		children: [
			{
				path:'index',
				name:'Suggestion',
				meta: {title: '意见反馈'},
				component: () => import('@/view/Suggestion/suggestionList.vue')
			},
			{
				path:'createSuggestion',
				name:'createSuggestion',
				meta: {title: '意见反馈'},
				component: () => import('@/view/Suggestion/createSuggestion')
			},
			{
				path:'suggestionDetail',
				name:'suggestionDetail',
				meta: {title: '意见反馈详情'},
				component: () => import('@/view/Suggestion/suggestionDetail')
			},
		]
	},		
	{
		path: '/jsapi',
		name: 'jsapi',
		component: () => import('@/view/platform/index.vue'),
		// redirect: '/DrivingManage/index',
		meta: {title: '文档管理'},
		hidden: true,
	},
	{
		path:'/car3d',
		name:'Car3d',
		component: () => import('@/view/Car3d/index.vue'),
		meta: {title: '车辆展示',keepAlive: false},
	},
	{
		path:'/arcgisMap',
		name:'ArcgisMap',
		component: () => import('@/view/ArcgisMap/index.vue'),
		meta: {keepAlive: false},
	},
];

// add route path
routes.forEach(route => {
	route.path = route.path || '/' + (route.title || '');
});

const router = new Router({ 
	mode: 'history',
	routes,
	// fallback: true,
	scrollBehavior: function (to, from, savePostion) {
		return savePostion ? savePostion:{y:0}
	}

});

export default router;
