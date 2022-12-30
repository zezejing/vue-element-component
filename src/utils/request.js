import axios from "axios";
import { Notification } from "element-ui";
import router from "../router";
import { delCookie } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000, // request timeout
  withCredentials: true // 是否允许带cookie这些
});

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers["Content-Type"] = "application/json";
    config.headers["X-Requested-With"] = "XMLHttpRequest";

    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  error => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if (response.headers.authorization) {
    //   sessionStorage.setItem("token", response.headers.authorization);
    // }
    return res;
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          router.replace({
            path: "/login"
          });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token
        // 跳转登录页面
        case 403:
          Notification({
            title: "警告",
            message: "登录过期，请重新登录",
            type: "error",
            duration: 1000
          });
          // 清除token
          delCookie();
          // 跳转登录页面
          setTimeout(() => {
            router.replace({
              path: "/login"
            });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          Notification({
            message: "网络请求不存在",
            duration: 1500,
            type: "error"
          });
          break;
        // 其他错误，直接抛出错误提示
        default:
          Notification({
            message: error.response.data.message,
            duration: 1500,
            type: "error"
          });
      }

    }
    return Promise.reject(error);
  }
);

export default service;
