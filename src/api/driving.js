import request from '@/utils/request'

export function drivingDrivingList(params) { // 待处理列表
	return request({
		url: '/driving/drivingList',
		method: 'GET',
		params
	})
}

export function drivingHistoryList(params) { // 历史订单列表
	return request({
		url: '/driving/historyList',
		method: 'GET',
		params
	})
}

export function drivingConfirmDriving(data) { // 确认出车
	return request({
		url: '/driving/confirmDriving',
		method: 'POST',
		data
	})
}

export function drivingCconfirmReceipt(data) { // 确认接单
	return request({
		url: '/driving/confirmReceipt',
		method: 'POST',
		data
	})
}

export function drivingPickupReminder(data) { // 接车提醒
	return request({
		url: '/driving/pickupReminder',
		method: 'POST',
		data
	})
}

export function drivingreturnCar(data) { // 还车
	return request({
		url: '/driving/returnCar',
		method: 'POST',
		data
	})
}

export function checkDriving(params) { 
	return request({
		url: '/driving/checkDriving',
		method: 'GET',
		params
	})
}
