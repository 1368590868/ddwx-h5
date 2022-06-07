

import request from '@/utils/request'

export function getSuggestion(params) { 
	return request({
		url: '/dict/getSuggestion',
		method: 'GET',
		params
	})
}
export function saveSuggestion(data) { 
	return request({
		url: '/suggestion/saveSuggestion',
		method: 'POST',
		data
	})
}
