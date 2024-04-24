import Vuex from 'vuex';
const store = new Vuex.Store({
  state: {
    userInfo: {
      
    } // 初始状态,
  },
  mutations: {
    setUserInfo(state, userInfo) { 
      console.log('setUserInfo', userInfo);
      state.userInfo = userInfo;
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  },
  actions: {
    setUserInfo({ commit }, userInfo) { 
      commit('setUserInfo', userInfo);
    }
  }
});

export default store
