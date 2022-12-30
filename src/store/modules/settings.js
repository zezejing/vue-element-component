import defaultSettings from "@/settings";

const {
  showSettings,
  typeSiderbar,
  fixedHeader,
  isCollapse,
  breadcrumb,
  tagsView,
  sidebarLogo,
  isVersion,
  isFooter
} = defaultSettings;

const settingData = JSON.parse(sessionStorage.getItem("defaultSettings"));
const state = {
  // 是否显示设置
  showSettings: settingData ? settingData.showSettings : showSettings,
  // 导航栏模式
  typeSiderbar: settingData ? settingData.typeSiderbar : typeSiderbar,
  // 是否固定Header
  fixedHeader: settingData ? settingData.fixedHeader : fixedHeader,
  // 菜单折叠按钮
  isCollapse: settingData ? settingData.isCollapse : isCollapse,
  // 是否展示面包屑导航
  breadcrumb: settingData ? settingData.breadcrumb : breadcrumb,
  // 是否展示标签导航
  tagsView: settingData ? settingData.tagsView : tagsView,
  // 是否展示logo
  sidebarLogo: settingData ? settingData.sidebarLogo : sidebarLogo,
  // 是否显示版本信息
  isVersion: settingData ? settingData.isVersion : isVersion,
  // 是否显示页脚信息
  isFooter: settingData ? settingData.isFooter : isFooter
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
    sessionStorage.setItem("defaultSettings", JSON.stringify(state));
  }
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
