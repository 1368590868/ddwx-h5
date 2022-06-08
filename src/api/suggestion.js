

import request from '@/utils/request'
/**
 * @function getSelfSuggestion
 * @description 意见反馈-分页 获取意见反馈分页列表 只查询自己
 * @param params.suggestion { Sting } 意见建议,
 * @param params.suggestionContext { Sting } 意见内容,
 * @param params.operatorType { String } 操作端
 * @param params.pageNum { String } 页码
 * @param params.pageSize { String } 每页多少条
 * @return Promise
 */
export function getSelfSuggestion(params) { 
	return request({
		url: '/gcywSuggestion/listPage',
		method: 'GET',
		params
	})
}

/**
 * @function addSuggestion
 * @description 意见反馈-增加
 * @param params.suggestion { Sting } 意见建议,
 * @param params.suggestionContext { Sting } 意见内容,
 * @param params.operatorType { String } 操作端
 * @return Promise
 */
export function addSuggestion(data) { 
	return request({
		url: '/gcywSuggestion/addSuggestion',
		method: 'POST',
		data
	})
}
