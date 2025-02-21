import request from '@/utils/request'

export function carStatisticByModel(params) {  // 获取按车型统计数据
	return request({
		url: '/statistic/carStatisticByModel',
		method: 'GET',
		params
	})
}
export function carStatisticByOver(params) {  // 获取按超标统计数据
	return request({
		url: '/statistic/carStatisticByOver',
		method: 'GET',
		params
	})
}
export function carStatisticByYear(params) {  // 获取按年份统计数据
	return request({
		url: '/statistic/carStatisticByYear',
		method: 'GET',
		params
	})
}
export function useStatisticByYear(params) {  // 获取按年份统计使用情况数据
	return request({
		url: '/statistic/useStatisticByYear',
		method: 'GET',
		params
	})
}

export function getParentUnit(params) {  // 获取单位列表
	return request({
		url: '/statistic/getParentUnit',
		method: 'GET',
		params
	})
}

