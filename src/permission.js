import router from "./router";
import store from "./store";
import getPageTitle from "@/utils/get-page-title";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style


const white = ["/login"];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  // 锁定屏幕页面进行浏览器回退
  if (sessionStorage.getItem("LOCK_SCREEN") && to.path !== "/components/lockScreen") {
    next({ path: "/components/lockScreen" });
  }

  // 锁屏解锁后可使用浏览器回退至锁屏的问题
  if (!sessionStorage.getItem("LOCK_SCREEN") && to.path === "/components/lockScreen") {
    next({ path: "/" });
  }

  const hasToken = sessionStorage.getItem("token");
  if (hasToken) {
    if (to.path === "/login") {
      next({
        path: "/"
      });
      NProgress.done();
    } else {
      let accessRoutes = store.getters.routes;
      if (accessRoutes.length > 0) {
        next();
      } else {
        accessRoutes = await store.dispatch("permission/generateRoutes");
        accessRoutes.forEach(item => {
          router.addRoute(item);
        });
        next({ ...to, replace: true });
      }
    }
  } else {
    if (white.indexOf(to.path) !== -1) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
