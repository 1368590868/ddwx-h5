import request from '@/utils/request'

export function orderSaveOrderRequest(data) {
	return request({
		url: '/order/saveOrderRequest',
		method: 'POST',
		data
	})
}



export function orderGetOrderDetail(params) {	// 获取订单详情
	return request({
		url: '/order/getOrderDetail',
		method: 'GET',
		params
	})
}


export function orderRequestList(params) {	// 用车申请未完成列表
	return request({
		url: '/order/requestList',
		method: 'GET',
		params
	})
}


export function orderHistoryOrderList(params) {	// 用车申请历史订单列表
	return request({
		url: '/order/historyOrderList',
		method: 'GET',
		params
	})
}


export function orderApprovalLog(params) {	// 获取审批日志
	return request({
		url: '/order/approvalLog',
		method: 'GET',
		params
	})
}

export function orderCancelOrder(data) {	// 取消订单
	return request({
		url: '/order/cancelOrder',
		method: 'POST',
		data
	})
}
export function approvalOrder(data) {	// 审批订单
	return request({
		url: '/order/approvalOrder',
		method: 'POST',
		data
	})
}
export function approvalOrderList(params) {	// 获取待审批列表
	return request({
		url: '/order/approvalOrderList',
		method: 'GET',
		params
	})
}
export function approvaledOrderList(params) {	// 获取已审批列表
	return request({
		url: '/order/approvaledOrderList',
		method: 'GET',
		params
	})
}
export function orderConfirmUserCar(data) {	// 确认用车
	return request({
		url: '/order/confirmUserCar',
		method: 'POST',
		data
	})
}
export function getAvailableUnit(params) {  // 单位列表
	return request({
		url: '/dispatch/getAvailableUnit',
		method: 'GET',
		params
	})
}
export function getDeptByUnit(params) {  // 部门列表
	return request({
		url: '/dispatch/getDeptByUnit',
		method: 'GET',
		params
	})
}

