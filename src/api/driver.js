import request from '@/utils/request'

//车载设备轨迹信息数据接口
export function logisticsTrajectoryAll(params) {
  return request({
    url: `/logistics/trajectoryAll`,
    method: 'get',
    params
  })
}

//车载设备基础信息数据接口
export function logisticsListAll(params) {
  return request({
    url: `/logistics/listAll`,
    method: 'get',
    params
  })
}

export function logisticsGetDrivingRecord(params) {
  return request({
    url: `/logistics/getDrivingRecord`,
    method: 'get',
    params
  })
}