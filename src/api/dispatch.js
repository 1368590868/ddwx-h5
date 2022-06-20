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
    url: `/gcjcDriverClass/getAvailableDriver`,
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
