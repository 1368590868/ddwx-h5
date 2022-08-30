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
// h5用户菜单
export function userMenu(params) {
	return request({
		url: '/user/h5menu',
		method: 'GET',
		params
	})
}

// 修改短信状态
export function userModifys(data) {
	return request({
		url: '/user/modifys',
		method: 'POST',
		data
	})
}