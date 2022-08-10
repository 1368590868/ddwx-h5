import {getListByParentId} from '@/api/dict'

const state = {
    dictModelType: [],  // 获取车型字典
    dictReqRange: [],   // 获取用车需求字典
    dictReqReason: []   // 获取用车事由字典
}

const getters = {
    dictModelType: state => state.dictModelType,
    dictReqRange: state => state.dictReqRange,
    dictReqReason: state => state.dictReqReason
}
const mutations = {
	SET_MODELTYPE: (state, data) => {
        state.dictModelType = data;
    },
    SET_REQRANGE: (state, data) => {
        state.dictReqRange = data;
    },
    SET_REQREASON: (state, data) => {
        state.dictReqReason = data;
	}
}

const actions = {
    //获取车型字典
	dictGetModelType ({ commit, state}) {
        return new Promise((resolve) => {
            if (state.dictModelType.length !== 0) {
                resolve(state.dictModelType);
                return false;
            }
            getListByParentId("101801").then(({data}) => {
                commit('SET_MODELTYPE', data);
                resolve(data);
            });
        });
    },
    //获取用车需求字典
    dictGetReqRange ({ commit, state}) {
        return new Promise((resolve) => {
            if (state.dictReqRange.length !== 0) {
                resolve(state.dictReqRange);
                return false;
            }
            getListByParentId("10018").then(({data}) => {
                commit('SET_REQRANGE', data);
                resolve(data);
            });
        });
    },
    //获取用车事由字典
    dictGetReqReason ({ commit, state}) {
        return new Promise((resolve) => {
            if (state.dictReqReason.length !== 0) {
                resolve(state.dictReqReason);
                return false;
            }
            getListByParentId("1016").then(({data}) => {
                commit('SET_REQREASON', data);
                resolve(data);
            });
        });
    }
}

export default {
	namespaced: true,
    state,
    getters,
	mutations,
	actions
}
