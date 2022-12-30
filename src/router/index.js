import Vue from "vue";
import VueRouter from "vue-router";
// 布局
import Layout from "@/layout";

Vue.use(VueRouter);

export const constsRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    meta: {
      title: "首页",
      icon: "el-icon-s-home"
    },
    children: [
      {
        path: "/dashboard",
        component: () => import("@/views/index"),
        name: "dashboard",
        meta: {
          title: "首页",
          icon: "el-icon-s-home",
          affix: true,
          routerParent: "/",
          hideMenu: true
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    hidden: true
  },
  // 小屏
  {
    path: "/min-screen",
    component: () => import("@/components/MinScreen"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/errorPage/404"),
    hidden: true
  }
];

export const asyncRoutes = [
  {
    path: "/components",
    component: Layout,
    redirect: "/components/pay",
    name: "components",
    meta: {
      title: "组件",
      icon: "el-icon-menu"
    },
    children: [
      {
        path: "/components/pay",
        component: () => import("@/views/pay"),
        name: "pay",
        meta: {
          title: "支付中",
          roles: ["a"],
          routerParent: "/components"
        }
      },
      {
        path: "/components/table",
        component: () => import("@/views/table"),
        name: "table",
        meta: {
          title: "表格",
          routerParent: "/components"
        }
      },
      {
        path: "/components/ckeditor",
        component: () => import("@/views/ckeditor"),
        name: "ckeditor",
        meta: {
          title: "富文本编辑器",
          routerParent: "/components"
        }
      },
      {
        path: "/components/upload",
        component: () => import("@/views/upload"),
        name: "upload",
        meta: {
          title: "文件/图片上传",
          routerParent: "/components"
        }
      },
      {
        path: "/components/documents",
        component: () => import("@/views/documents"),
        name: "documents",
        meta: {
          title: "打印单据",
          routerParent: "/components"
        }
      },
      {
        path: "/components/echarts",
        component: () => import("@/views/echarts"),
        name: "echarts",
        meta: {
          title: "图表组件",
          routerParent: "/components"
        }
      },
      {
        path: "/components/lockScreen",
        component: () => import("@/views/lockScreen"),
        name: "lockScreen",
        meta: {
          title: "锁定屏幕",
          routerParent: "/components"
        }
      },
      {
        path: "/components/select-multiple",
        component: () => import("@/views/selectMultiple"),
        name: "selectMultiple",
        meta: {
          title: "下拉组件",
          routerParent: "/components"
        }
      },
      {
        path: "*",
        redirect: "/404",
        hidden: true
      }
    ]
  },
  {
    path: "/about",
    component: Layout,
    redirect: "/about/index",
    meta: {
      title: "关于",
      icon: "el-icon-question"
    },
    children: [
      {
        path: "/about/index",
        component: () => import("@/views/index"),
        name: "about",
        meta: {
          title: "关于",
          icon: "el-icon-question",
          affix: true,
          routerParent: "/about",
          hideMenu: true
        }
      }
    ]
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];

const createRouter = () =>
  new VueRouter({
    // mode: "history",
    base: process.env.BASE_URL,
    routes: constsRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
