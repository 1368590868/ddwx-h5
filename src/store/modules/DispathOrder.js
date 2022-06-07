
const state = {
	isFefresh: false,
	autoId: '',
	Details: {},	// 用户详情信息的数据
	
	
	ChoiceVehicie: {}, // 选择车辆
	ChoiceDriver: {},  // 选择司机

    CarOneHist: {},	// 开始页面数据，防止返回上一步
	CarOneData: {},	// 拼接的一次性数据，在开始之后的页面展示
    CarCopData: {}, // 此对象如果有值  则证明为复制订单
	CarPerfect: {},	// 为选择车辆上一步数据
}

const getters = {
	isFefresh: state => state.isFefresh,

	autoId: state => state.autoId,
	Details: state => state.Details,
	ChoiceVehicie: state => state.ChoiceVehicie,
	ChoiceDriver: state => state.ChoiceDriver,


	CarOneData: state => state.CarOneData,
    CarOneHist: state => state.CarOneHist,
    CarCopData: state => state.CarCopData,   // 此对象如果有值  则证明为复制订单
	CarPerfect: state => state.CarPerfect	 // 选择车辆上一步数据 
}




const mutations = {
	AUTO_ID: (state, autoId) => {
		state.autoId = autoId
	},
	DETAILS_FUN: (state, Details) => {
		state.Details = Details
	},
	CHOICE_VEHICIE: (state, data) => {	// 选择车辆
		state.ChoiceVehicie = data;
	},
	CHOICE_DRIVER: (state, ChoiceDriver) => {   // 选择司机
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
		state.CarPerfect = {};
		state.ChoiceVehicie = {};
		state.ChoiceDriver = {};
    },
	
	SET_CARCOPdATA: (state, data) => {	 // 复制订单操作
        state.CarCopData = data;
    },
	SET_CARPERFECT: (state, data) => {	 // 选择车辆上一步数据
		state.CarPerfect = data;
	},
	SET_FEFRESH: (state, data) => {
        state.isFefresh = data;
    }

}



const actions = {
	setAutoId ({commit},data) {
		commit('AUTO_ID', data)
	},
	setDetails ({commit},data) {
		commit('DETAILS_FUN', data)
	},
	setChoiceVehicie ({commit},data) {	// 选择车辆	
		return new Promise((resolve) => {
			commit('CHOICE_VEHICIE', data)
            resolve();
        });
	},
	setChoiceDriver ({commit},data) {	// 选择司机
		return new Promise((resolve) => {
            commit('CHOICE_DRIVER', data)
            resolve();
        });
		
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
	
	setPerfectAction ({commit}, data) {
		return new Promise((resolve) => {
            commit('SET_CARPERFECT', data);
            resolve();
        });
		
	},
	clearOneDataAction ({commit}) {
        commit('CLEAR_CARONEDATA');
    },
	triggerFefresh ({commit}, data){
        commit('SET_FEFRESH', data);
    },

}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
