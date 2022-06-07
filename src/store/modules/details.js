
const state = {
	autoId: '',
	Details: {},	// 用户详情信息的数据
	ChoiceVehicie: {},
	ChoiceDriver: {},
	


    CarOneHist: {},	// 开始页面数据，防止返回上一步
	CarOneData: {},	// 拼接的一次性数据，在开始之后的页面展示
    CarCopData: {} // 此对象如果有值  则证明为复制订单
}

const mutations = {
	AUTO_ID: (state, autoId) => {
		state.autoId = autoId
	},
	DETAILS_FUN: (state, Details) => {
		state.Details = Details
	},
	CHOICE_VEHICIE: (state, ChoiceVehicie) => {
		state.ChoiceVehicie = ChoiceVehicie
	},
	CHOICE_DRIVER: (state, ChoiceDriver) => {
		state.ChoiceDriver = ChoiceDriver
	},


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
	
	SET_CARCOPdATA: (state, data) => {	 // 复制订单操作
        state.CarCopData = data;
    },


}
const getters = {
	autoId: state => state.autoId,
	Details: state => state.Details,
	ChoiceVehicie: state => state.ChoiceVehicie,
	ChoiceDriver: state => state.ChoiceDriver,


	CarOneData: state => state.CarOneData,
    CarOneHist: state => state.CarOneHist,
    CarCopData: state => state.CarCopData   // 此对象如果有值  则证明为复制订单
}



const actions = {
	setAutoId ({commit},data) {
		commit('AUTO_ID', data)
	},
	setDetails ({commit},data) {
		commit('DETAILS_FUN', data)
	},
	setChoiceVehicie ({commit},data) {
		commit('CHOICE_VEHICIE', data)
	},
	setChoiceDriver ({commit},data) {
		commit('CHOICE_DRIVER', data)
	},



	setOneDataAction ({ commit}, data) {
        return new Promise((resolve) => {
            commit('SET_CARONEDATA', data);
            resolve();
        });
	},

	setCopyDataAction ({commit}, data){
        commit('SET_CARCOPdATA', data);
    },
	


}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
