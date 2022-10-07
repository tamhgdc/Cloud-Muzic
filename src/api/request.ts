import axios, { AxiosRequestConfig } from "axios";
import { Operate } from "utils";

// 请求实例
let Request = (config: AxiosRequestConfig) => {
  // 实例
  const instance = axios.create({
    baseURL: "https://awesome404.vercel.app/",
    timeout: 5000,
    withCredentials: true,
  });

  // 响应拦截器
  instance.interceptors.response.use(reqData => reqData.data, error => {
    let { response: { data: { code, msg } } } = error;
    if (code == 301 && msg == "需要登录") {
      // 登陆状态失效时, 清除登陆权限
      Operate.clearLoginStatus();
    }
  });

  // 返回实例
  return instance(config);
};

// GET请求
export const GET = (url: string, params?: object) => {
  return Request({
    url,
    method: "GET",
    params: { ...params, timestamp: Date.now() },
  })
};

// POST请求
export const POST = (url: string, data?: object) => {
  return Request({
    url,
    method: "POST",
    data: { ...data, timestamp: Date.now() },
  });
};