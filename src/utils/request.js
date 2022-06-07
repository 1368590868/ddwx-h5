import axios from 'axios'
import store from '@/store'
import {Dialog} from 'vant'
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	withCredentials: false,
	timeout: 5 * 60 * 1000
})
service.interceptors.request.use(
	config => {
		if (store.getters.userInfo) {
			config.headers['token'] = store.getters.userInfo.token;
		};
		config.url = config.url
		return config
	},
	error => {
		return Promise.reject(error)
	}
)
service.interceptors.response.use(
	response => {
		const res = response.data
		
		if (res.code !== 0) {
			Dialog.alert({
				title: '提示',
				message: res.msg || JSON.stringify(res),
				theme: 'round-button'
			});
			return Promise.reject(res.message);
		} else {
			return res || {};
		}
	},
	error => {
		let res = error.response.data;
		// Message({
		// 	message: error.message,
		// 	type: 'error',
		// 	duration: 5 * 1000
		// })
		// store.dispatch('errorLog/addErrorLog', {
		// 	err: '服务端错误接口',
		// 	vm: error.response.status,
		// 	info: res.message,
		// 	url: error.response.config.url,
		// 	type: 'server'
		// });
		return Promise.reject(error)
	}
)

export default service
