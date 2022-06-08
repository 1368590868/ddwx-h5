import request from '@/utils/request'

export function dictGetModelType(params) {  // 获取车型字典
	return request({
		url: '/dict/getModelType',
		method: 'GET',
		params
	})
}

export function dictGetReqRange(params) {   // 获取用车需求字典
	return request({
		url: '/dict/getReqRange',
		method: 'GET',
		params
	})
}

export function dictGetReqReason(params) {  // 获取用车事由字典
	return request({
		url: '/dict/getReqReason',
		method: 'GET',
		params
	})
}
// 获取通用字典  parentId 上级字典id
export function getListByParentId(parentId) {
  return request({
    url: `/dict/getListByParentId/${parentId}`,
    method: 'GET',
  })
}