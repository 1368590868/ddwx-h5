import request from '@/utils/request'

/**
 * @function authAuth
 * @description 根据url地址携带的参数获取用户的token
 * @param params.id_token { String } 编码
 * @return void
 */
export function authAuth(params) {
	return request({
		url: '/auth/auth',
		method: 'GET',
		params
	})
}


// 根据token获取用户信息
export function authInfo(params) {
	return request({
		url: '/auth/info',
		method: 'GET',
		params
	})
}