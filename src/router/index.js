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
				path: 'index/:autoId',
				name: 'StartApplying',
				meta: {title: '开始申请',},
				component: () => import('@/view/CarApplication/StartApplying')
			}, {
				path: 'PerfectInfo',
				name: 'PerfectInfo',
				meta: {title: '完善信息'},
				component: () => import('@/view/CarApplication/PerfectInfo')
			}, {	// :sAddProofFlag/:scheckType/:typeCode
				path: 'SubSuccess/:autoId',
				name: 'SubSuccess',
				meta: {title: '提交成功'},
				component: () => import('@/view/CarApplication/SubSuccess')
			}, {
				path: 'Orderdetails/:autoId',
				name: 'Orderdetails',
				meta: {title: '订单详情'},
				component: () => import('@/view/CarApplication/Orderdetails')
			}, {
				path: 'OutstandOrder',
				name: 'OutstandOrder',
				meta: {title: '用车申请单', keepAlive: true},
				component: () => import('@/view/CarApplication/OutstandOrder')
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
				path: 'Approvaldetails/:autoId',
				name: 'Approvaldetails',
				meta: {title: '订单详情'},
				component: () => import('@/view/CarApproval/Approvaldetails')
			},
			// {
			// 	path: 'reject/:autoId',
			// 	name: 'reject',
			// 	meta: {title: '订单详情'},
			// 	component: () => import('@/view/CarApproval/reject')
			// },
			{	// :sAddProofFlag/:scheckType/:typeCode
				path: 'approvalSuccess/:autoId',
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
				path: 'MessageDetail/:sSendUser',
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
			},
			{
				path:'suggestion',
				name:'Suggestion',
				meta: {title: '意见反馈'},
				component: () => import('@/view/MyManager/Suggestion/index')
			},
			{
				path:'createSuggestion',
				name:'createSuggestion',
				meta: {title: '意见反馈'},
				component: () => import('@/view/MyManager/Suggestion/createSuggestion')
			},
			{
				path:'suggestionDetail',
				name:'suggestionDetail',
				meta: {title: '意见反馈详情'},
				component: () => import('@/view/MyManager/Suggestion/suggestionDetail')
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
				name: 'DispathOrderList',
				meta: {title: '调配管理',keepAlive: true},
				component: () => import('@/view/DispathOrder/DispathOrderList')
			},
			{
				path: 'DispathApply/:autoId',
				name: 'DispathApply',
				meta: {title: '人工调配'},
				component: () => import('@/view/DispathOrder/DispathApply')
			},
			{
				path: 'DispathPerfect/:autoId',
				name: 'DispathPerfect',
				meta: {title: '人工调配'},
				component: () => import('@/view/DispathOrder/DispathPerfect')
			},
			{
				path: 'DispathVehicle/:type/:autoId',
				name: 'DispathVehicle',  // vehicie{0:"上一步", 1: "正常已审批派单"}
				meta: {title: '请选择车辆', keepAlive: true},
				component: () => import('@/view/DispathOrder/DispathVehicle')
			},
			{	
				path: 'DispathDriver/:type/:autoId',
				name: 'DispathDriver',
				meta: {title: '请选择司机', keepAlive: true},
				component: () => import('@/view/DispathOrder/DispathDriver')
			},
			{
				path: 'DispathDetails/:type/:autoId',	// type {0: 人工调派, 1: 正常已审批派单。 2： 改派}
				name: 'DispathDetails',
				meta: {title: '调度详情'},
				component: () => import('@/view/DispathOrder/DispathDetails')
			},
			{
				path: 'DispathSuccess/:autoId',
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
		path: '/jsapi',
		name: 'jsapi',
		component: () => import('@/view/platform/index.vue'),
		// redirect: '/DrivingManage/index',
		meta: {title: '文档管理'},
		hidden: true,
	}
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
