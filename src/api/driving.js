import request from '@/utils/request'

export function drivingDrivingList(params) { // 待处理列表
	return request({
		url: '/gcywVehicleReqAssignmennt/listPage',
		method: 'GET',
		params
	})
}

export function drivingHistoryList(params) { // 历史订单列表
	return request({
		url: '/gcywVehicleReqAssignmennt/listPage',
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
		url: '/gcywVehicleReqAssignmennt/driving/checkDriving',
		method: 'GET',
		params
	})
}

//司机-拒绝
export function gcywVehicleRequesCancelOrder(params) {
	return request({
		url: `/gcywVehicleReqAssignmennt/cancelOrder`,
		method: 'get',
		params
	})
}

//司机-接单
export function gcywVehicleRequesTakeOrder(params) {
	return request({
		url: `/gcywVehicleReqAssignmennt/takeOrder`,
		method: 'get',
		params
	})
}

//司机-到达提醒
export function gcywVehicleRequesRemind(params) {
	return request({
		url: `/gcywVehicleReqAssignmennt/remind`,
		method: 'get',
		params
	})
}

//司机-出车
export function gcywVehicleRequesDriving(data) {
	return request({
		url: `/gcywVehicleReqAssignmennt/driving`,
		method: 'post',
		data
	})
}

//司机-还车
export function gcywVehicleRequesReturning(data) {
	return request({
		url: `/gcywVehicleReqAssignmennt/returning`,
		method: 'post',
		data
	})
}

//上传附件
export function minioUpload(data) {
	return request({
		url: `/minio/upload`,
		method: 'post',
		data
	})
}

//判断车辆是否限行
export function carIsDriving(params) {
  return request({
    url: `/vehicleInfo/isRestriction`,
    method: 'get',
    params
  })
}