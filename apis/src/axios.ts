import { Dialog } from "vant";
import "vant/es/dialog/style";

import { Toast } from "vant";
import "vant/es/toast/style";

import axios, { AxiosRequestConfig } from "axios";

const pending = {};

const CancelToken = axios.CancelToken;
const removePending = (key: string, isRequest = false) => {
  if (Reflect.get(pending, key) && isRequest) {
    Reflect.get(pending, key)("取消重复请求");
  }
  Reflect.deleteProperty(pending, key);
};
const getRequestIdentify = (config: AxiosRequestConfig, isReuest = false) => {
  let url = config.url;
  const suburl = config.url?.substring(1, config.url?.length) ?? "";
  if (isReuest) {
    url = config.baseURL + suburl;
  }
  return config.method === "get"
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

// 创建一个AXIOS实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 16000, // 请求超时
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 拦截重复请求(即当前正在进行的相同请求)
    const requestData = getRequestIdentify(config, true);
    removePending(requestData, true);

    config.cancelToken = new CancelToken((c: any) => {
      Reflect.set(pending, requestData, c);
    });

    // 是否开启loading
    if (config.showLoading) {
      Toast.loading({
        duration: 0,
        mask: true,
        forbidClick: true,
        message: "加载中...",
        loadingType: "spinner",
      });
    }

    // 请求发送前的预处理(如:获取token等)
    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-AUTH-TOKEN'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-AUTH-TOKEN'] = getToken()
    // }
    return config;
  },
  (error: any) => {
    // do something with request error
    console.log(error); // for debug
    Toast.loading({
      message: "网络出错，请重试",
      duration: 1500,
      type: "fail",
    });
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response: { config: AxiosRequestConfig; data: any }) => {
    // 把已经完成的请求从 pending 中移除
    const requestData = getRequestIdentify(response.config);
    removePending(requestData);

    if (response.config.showLoading) {
      Toast.clear();
    }

    const res = response.data;
    return res;
  },
  (error: {
    message: string;
    config: { showLoading: any };
    response: { status: any };
    request: any;
  }) => {
    console.log(error.message);
    if (error) {
      if (error.config && error.config.showLoading) {
        Toast.clear();
      }
      if (error.response) {
        switch (error.response.status) {
          case 400:
            error.message = "错误请求";
            break;
          case 401:
            error.message = "未授权，请重新登录";
            break;
          case 403:
            error.message = "拒绝访问";
            break;
          case 404:
            error.message = "请求错误,未找到该资源";
            break;
          case 405:
            error.message = "请求方法未允许";
            break;
          case 408:
            error.message = "请求超时";
            break;
          case 500:
            error.message = "服务器端出错";
            break;
          case 501:
            error.message = "网络未实现";
            break;
          case 502:
            error.message = "网络错误";
            break;
          case 503:
            error.message = "服务不可用";
            break;
          case 504:
            error.message = "网络超时";
            break;
          case 505:
            error.message = "http版本不支持该请求";
            break;
          default:
            error.message = `连接错误${error.response.status}`;
        }
        const errData = {
          code: error.response.status,
          message: error.message,
        };
        console.log("统一错误处理: ", errData);
        Dialog({ title: "提示", message: errData.message || "Error" });
      } else if (error.request) {
        Toast.loading({
          message: "网络出错，请稍后重试",
          duration: 1500,
          type: "fail",
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
