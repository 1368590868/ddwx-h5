import request from '@/utils/request'


export function sysAuth(params) {
	return request({
		url: '/sys/auth',
		method: 'GET',
		params
	})
}