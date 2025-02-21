import request from '@/utils/request'

export function messageGetMessage(params) {     // 获取用户消息
	return request({
		// url: '/message/getMessage',
		url: '/gcywMessage/getMessage',
		method: 'GET',
		params
	})
}

export function messageGetMessageDetail(params) {     // 获取用户消息详情
	return request({
		url: '/gcywMessage/getMessageDetail',
		method: 'GET',
		params
	})
}


export function messageMarkRead(data) {     // 标记已读
	return request({
		url: '/gcywMessage/markRead',
		method: 'POST',
		data
	})
}

export function messageGetNoReadCount() {     // 获取未读消息数量
	return request({
		url: '/gcywMessage/getNoReadCount',
		method: 'GET',
	})
}

export function messageGetMessageBySender(params) {     // 获取发信人所有信息
	return request({
		url: '/gcywMessage/getMessageBySender',
		method: 'GET',
		params
	})
}


export function messageMarkReadBySender(data) {     // 根据发信人标记已读
	return request({
		url: '/gcywMessage/markReadBySender',
		method: 'POST',
		data
	})
}