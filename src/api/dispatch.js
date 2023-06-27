import request from "@/utils/request";

let path =
  process.env.NODE_ENV === "development" ? process.env.VUE_APP_BASE_API : "";

export const carPic = path + "/dispatch/carPic";

export function dispatchDispatchList(params) {
  // 获取待派单列表
  return request({
    url: "/dispatch/dispatchList",
    method: "GET",
    params,
  });
}

export function dispatchDispatchedList(params) {
  // 获取已派单列表
  return request({
    url: "/dispatch/dispatchedList",
    method: "GET",
    params,
  });
}

export function historyList(params) {
  // 获取历史列表
  return request({
    url: "/dispatch/historyList",
    method: "GET",
    params,
  });
}

export function getAvailableCar(params) {
  // 获取车辆
  return request({
    url: "/dispatch/getAvailableCar",
    method: "GET",
    params,
  });
}

export function getCarCount(params) {
  // 获取车辆总数
  return request({
    url: "/vehicleInfo/getAssignCount",
    method: "GET",
    params,
  });
}

export function getAvailableDriver(params) {
  // 获取司机
  return request({
    url: "/dispatch/getAvailableDriver",
    method: "GET",
    params,
  });
}

export function saveOrderDispatch(data) {
  // 确认接单
  return request({
    url: "/dispatch/saveOrderDispatch",
    method: "POST",
    data,
  });
}

export function dispatchReassignment(data) {
  // 改派
  return request({
    url: "/dispatch/reassignment",
    method: "POST",
    data,
  });
}

export function dispatchCheckDriver(params) {
  return request({
    url: "/dispatch/checkDriver",
    method: "GET",
    params,
  });
}
export function dispatchCheckCar(params) {
  return request({
    url: "/dispatch/checkCar",
    method: "GET",
    params,
  });
}
export function getAvailableButton(params) {
  return request({
    url: "/dispatch/getAvailableButton",
    method: "GET",
    params,
  });
}
export function redispatch(data) {
  return request({
    url: "/dispatch/redispatch",
    method: "POST",
    data,
  });
}
export function reject(data) {
  return request({
    url: "/dispatch/reject",
    method: "POST",
    data,
  });
}

//选择车辆 H5 派车时获取可用车辆
export function vehicleInfoGetAvailableCar(params, reassignUnitCode) {
  return request({
    url: `/vehicleInfo/${
      reassignUnitCode ? "getResAvailableCar" : "getAvailableCar"
    }`,
    method: "get",
    params,
  });
}

// 选择派车司机
export function getDispatchAvailableDriver(params) {
  return request({
    url: `/gcjcDriverClass/getRGAvailableDriver`,
    method: "get",
    params,
  });
}
//获取车辆图片
export function vehicleInfoGetVehicleFile(params) {
  return request({
    url: `/vehicleInfo/getVehicleFile`,
    method: "get",
    params,
  });
}

// 确认派单 调度管理页面 H5
export function dispatchOrder(data) {
  return request({
    url: "/gcywVehicleRequest/saveOrderDispatch",
    method: "POST",
    data,
  });
}

//改派
export function reassignment(data) {
  return request({
    url: `/gcywVehicleRequest/reassignment`,
    method: 'POST',
    data
  })
}

//   获取 转单  转派 单位
export function getTurnUnit() {
  return request({
    url: `/gcjcTurnUnit/listAll`,
    method: 'GET',
  })
}

// 转单  转派
export function changeOrder(data) {
  return request({
    url: `/gcywVehicleRequest/redispatch`,
    method: 'POST',
    data,
  })
}

// 转派拒绝 转派取消
export function updateChangeOrder(data) {
  return request({
    url: `/gcywVehicleRequest/updateRessUnit`,
    method: 'post',
    data
  })
}

// 派车可用单为列表
export function getAvailableUnit(params) {  // 单位列表
	return request({
		url: '/system/unit/getAvailableUnit',
		method: 'GET',
		params
	})
}

// 派车可用部门列表 根据单位选择变化而变化
export function getDispatchDept(params) {  
	return request({
		url: '/dept/tree',
		method: 'GET',
		params
	})
}