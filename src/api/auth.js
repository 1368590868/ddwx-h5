import request from '@/utils/request'


export function sysAuth(params) {
	return request({
		url: '/sys/auth',
		method: 'GET',
		params
	})
}

export function authAuth(params) {
	return request({
		url: '/auth/auth',
		method: 'GET',
		params
	})
}