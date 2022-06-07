const state = {
    isFefresh: false,
    CarOneData: {},
    CarOneHist: {},
    CarCopData: {} // 此对象如果有值  则证明为复制订单
}

const getters = {
    isFefresh: state => state.isFefresh,
    CarOneData: state => state.CarOneData,
    CarOneHist: state => state.CarOneHist,
    CarCopData: state => state.CarCopData   // 此对象如果有值  则证明为复制订单
}
const mutations = {
	SET_CARONEDATA: (state, data) => {
        let sFromAddr = data.sFromAddr.split('/').join(',');
        let sTargetAddr = data.sTargetAddr.split('/').join(',');
        let dDepartureTimeDetail = data.dDepartureTimeDetail +':00';
        state.CarOneHist = data;
        state.CarOneData = {
            sFromAddr: sFromAddr + ',' + data.sFromAddrDetail,      // (string, optional): 出发地 ,
            sTargetAddr: sTargetAddr + ',' + data.sTargetAddrDetail,    // (string, optional): 目的地
            dDepartureTime: data.dDepartureTime + ' ' +dDepartureTimeDetail // (string, optional): 出发时刻 ,
        };
    },
    CLEAR_CARONEDATA: (state) => {
        state.CarOneData = {};
        state.CarOneHist = {};
        state.CarCopData = {};
    },

    SET_CARCOPdATA: (state, data) => {
        state.CarCopData = data;
    },
    SET_FEFRESH: (state, data) => {
        state.isFefresh = data;
    }

}

const actions = {
	setOneDataAction ({ commit}, data) {
        return new Promise((resolve) => {
            commit('SET_CARONEDATA', data);
            resolve();
        });
    },
    clearOneDataAction ({commit}) {
        commit('CLEAR_CARONEDATA');
    },

    setCopyDataAction ({commit}, data){
        commit('SET_CARCOPdATA', data);
    },

    triggerFefresh ({commit}, data){
        commit('SET_FEFRESH', data);
    },

}

export default {
	namespaced: true,
    state,
    getters,
	mutations,
	actions
}
