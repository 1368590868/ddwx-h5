import request from "@/utils/request";

let path = process.env.NODE_ENV === "development" ? process.env.VUE_APP_BASE_API : "";

// 数据变更工单-审批记录
export function gcywChangeRequestActivitiList(params) {
  return request({
      url: `/gcywChangeRequest/activitiList`,
      method: 'get',
      params
  })
}

// 数据变更工单-获取附件
export function gcywChangeRequestListFile(params) {
  return request({
      url: `/gcywChangeRequest/listFile`,
      method: 'get',
      params
  })
}

// 数据变更工单-审批日志
export function gcywChangeRequestActivitiLog(params) {
  return request({
      url: `/gcywChangeRequest/activitiLog`,
      method: 'get',
      params
  })
}

// 数据变更工单-审批拒绝
export function gcywChangeRequestReject(data) {
  return request({
      url: `/gcywChangeRequest/reject`,
      method: 'post',
      data
  })
}

// 数据变更工单-审批通过
export function gcywChangeRequestComplete(data) {
  return request({
      url: `/gcywChangeRequest/complete`,
      method: 'post',
      data
  })
}
