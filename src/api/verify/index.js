import request from "@/utils/request";
/**
 * 图片验证码
 */
export const getCaptcha = params => {
  return request({
    url: "/captcha",
    baseURL: "/captcha",
    method: "get",
    params
  });
};
/**
 * 发送短信验证码
 */
export const getUcenter = params => {
  return request({
    url: "/ucenter/sms/send",
    baseURL: "/ucenter",
    method: "post",
    data: params
  });
};
/**
 * 极验验证码
 */
export const getGees = params => {
  return request({
    url: "/init?t=" + new Date().getTime(),
    baseURL: "/gees",
    method: "get",
    params
  });
};
