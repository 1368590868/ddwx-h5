import { authInfo, authAuth } from "@/api/auth";
import { getIdToken, setToken, removeToken } from "@/utils/auth";
import { messageGetNoReadCount } from "@/api/message";
const state = {
  userInfo: null,
  badgeNo: 0,
};

const mutations = {
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo;
  },
  SET_BADGENO: (state, data) => {
    state.badgeNo = data;
  },
  CHANGE_SMS_STATUS:(state,smsFlag) => {
    state.userInfo.smsFlag = smsFlag;
  }
};

const actions = {
  authAuth({ commit }) {
    return new Promise((resolve, reject) => {
      authAuth({ id_token: getIdToken() })
        .then(({ data }) => {
          setToken(data.token);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  authAuthMobile({ commit },idToken) {
    return new Promise((resolve, reject) => {
      authAuth({ id_token: idToken })
        .then(({ data }) => {
          setToken(data.token);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  authInfo({ commit }) {
    return new Promise((resolve, reject) => {
      authInfo()
        .then(({ data }) => {
          commit("SET_USER_INFO", data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  readCount({ commit }) {
    messageGetNoReadCount().then(({ data }) => {
      commit("SET_BADGENO", data);
    });
  },
  changeSmsStatus({commit},data){
    commit('CHANGE_SMS_STATUS',data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
