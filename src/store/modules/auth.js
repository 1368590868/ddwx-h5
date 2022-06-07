import {sysAuth} from '@/api/auth'
import { getIdToken, setToken, removeToken } from '@/utils/auth'
import {messageGetNoReadCount} from '@/api/message'
const state = {
	userInfo: null,
	badgeNo: 0
}

const mutations = {
	SET_USERINFO: (state, userInfo) => {
		state.userInfo = userInfo;
	},
	SET_BADGENO: (state, data) => {
		state.badgeNo = data;
	}
}

const actions = {
	sysAuth ({ commit }) {
        return new Promise((resolve, reject) => {
			sysAuth({id_token: getIdToken()}).then(({data}) => {
				commit('SET_USERINFO', data);
				setToken(data.token)
				resolve(data)
			}).catch(error => {
				reject(error)
			});
		})
	},
	readCount({commit}) {
		messageGetNoReadCount().then(({data}) => {
			commit('SET_BADGENO', data);
		});
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
