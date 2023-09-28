/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		return value.toString().padStart(2, '0')
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time) {
	const d = new Date(time)
	const now = Date.now()
	const diff = (now - d) / 1000
	if (parseTime(d, '{y}-{m}-{d}') === parseTime(now, '{y}-{m}-{d}')) { //今天的日子
		if (diff < 30) {
			return '刚刚'
		} else if (diff < 3600) {
			return Math.ceil(diff / 60) + '分钟前'
		} else if (parseTime(d, '{h}') >= 12) {
			return '下午 '+ parseTime(d, '{h}:{s}');
		} else if (parseTime(d, '{h}') < 12) {
			return '上午 '+ parseTime(d, '{h}:{s}');
		}
	} else if (diff < 3600 * 24 * 2) {
		return '昨天'
	}
	if (parseTime(d, '{y}') == new Date().getFullYear()) { // 同一年
		return parseTime(time, '{m}月{d}日');
	} else {
		return parseTime(d, '{y}/{m}/{d}');
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
		decodeURIComponent(search)
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g, '":"')
			.replace(/\+/g, ' ') +
		'"}'
	)
}
/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}


/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}

export function jsonp(url, params = null, callback) {
	if (!url) {
		return false;
	}
	let script_id = Math.random().toString().substr(2, 5);
	let callbackName = 'jsonp_callback' + Date.now() + script_id;
	let script = document.createElement('script');
		script.id = script_id;
	let data = params ? ('?' + param(params)): '?';
	script.src = url + data + '&callback=' + callbackName;

	document.body.appendChild(script);
	window[callbackName] = (response) => {
		delete window[callbackName];
		typeof callback === 'function' && callback(response);
		document.body.removeChild(script);
	};
}



/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}

	return function (...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}
}

/**
 * 规范数字输入,整数位默认8,小数位2
 * @param obj 表单项或绑定的对象
 * @param key 对象的属性名
 * @param intLimit 整数位限制,默认为8
 */
 export function handleNumberLimit(obj, key, intLimit = 8) {
	 console.log(obj)
	 console.log(key)
	 console.log(intLimit)
	 console.log(obj[key])
	// 先把非数字的都替换掉，除了数字和 .
	obj[key] = obj[key].replace(/[^\d.]/g, '')
	// 保证只有出现一个 . 而没有多个 .
	obj[key] = obj[key].replace(/\.{2,}/g, '.')
	// 必须保证第一个为数字而不是 .
	obj[key] = obj[key].replace(/^\./g, '')
	// 保证 . 只出现一次，而不能出现两次以上
	obj[key] = obj[key]
	  .replace('.', '$#$')
	  .replace(/\./g, '')
	  .replace('$#$', '.')
	// 只能输入 2 位小数
	obj[key] = obj[key].replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
	// 动态生成整数位限制正则
	let intReg = new RegExp(`^\\D*(\\d{0,${intLimit}}(?:\\.\\d{0,2})?).*$`, 'g')
	obj[key] = obj[key].replace(intReg, '$1')
  }