const state = {
  sidebar: {
    // 收缩菜单
    opened: sessionStorage.getItem("sidebarStatus")
      ? !!+sessionStorage.getItem("sidebarStatus")
      : true,
    withoutAnimation: false
  }
};

const mutations = {
  // 打开收缩
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      sessionStorage.setItem("sidebarStatus", 1);
    } else {
      sessionStorage.setItem("sidebarStatus", 0);
    }
  },
  // 关闭收缩
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    sessionStorage.setItem("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
