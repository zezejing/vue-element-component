import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// ElementUI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import enlocale from "element-ui/lib/locale/lang/en"; 英文
import zhlocale from "element-ui/lib/locale/lang/zh-CN"; // 中文
Vue.use(ElementUI, { zhlocale });

// 注册全局汉字转拼音方法
import pinyin from "@/utils/pinyin.js";
Vue.prototype.$pinyin = pinyin;

// 引入SvgIcon
import "./icons";

// 自定义表格组件
import bTable from "@/components/bTable";
Vue.component("bTable", bTable);
import ChildColumn from "@/components/bTable/ChildColumn";
Vue.component("ChildColumn", ChildColumn);
// Fragment
import Fragment from "vue-fragment";
Vue.use(Fragment.Plugin);

// 分页全局引用
import Pagination from "@/components/Pagination";
Vue.component("Pagination", Pagination);

// 文本编辑器
import CKEditor from "@ckeditor/ckeditor5-vue2";
Vue.use(CKEditor);

// 全局样式
import "@/styles/index.scss";

// 路由守卫
import "@/permission";

// vue复选框实现拖拽排序
import VueDND from "awe-dnd";
Vue.use(VueDND);

//接口
import { default as api } from "@/api/index";
Vue.prototype.$api = api;

// 导入极验验证
import "@/utils/gt.js";
// eslint-disable-next-line no-undef
Vue.prototype.$initGeet = initGeetest;

// 侧边栏
import SidebarItem from "@/components/Sidebar/SidebarItem";
Vue.component("sidebar-item", SidebarItem);

Vue.config.productionTip = false;

// 打印单据
import Print from "vue-print-nb";
Vue.use(Print); // 打印注册

// 返回顶部
import BackToTop from "@/components/BackToTop";
Vue.component("back-to-top", BackToTop);

// 下拉框滚动加载数据
Vue.directive("loadmore", {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(".el-select-dropdown .el-select-dropdown__wrap");
    SELECTWRAP_DOM.addEventListener("scroll", function () {

      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
