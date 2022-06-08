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
};

const actions = {
  authAuth({ commit }) {
    return new Promise((resolve, reject) => {
      authAuth({ id_token: getIdToken() })
        .then(({ data }) => {
          console.log("🚀 ~ file: auth.js ~ line 33 ~ .then ~ data", data);
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
