import axios from "axios";
export default class BaseApi {
  baseService;
  constructor({ baseURL, timeout = 60000 }) {
    const baseServiceConfig = {
      baseURL,
      timeout,
    };
    this.baseService = axios.create(baseServiceConfig);
    this._setInterceptorsRequest();
    this._setInterceptorsResponse();
  }
  get(url, params = {}) {
    return this.request(url, "get", params, {});
  }
  post(url, data = {}, authorization) {
    return this.request(url, "post", {}, data, authorization);
  }
  request(
    url,
    method,
    params,
    data,
    authorization,
    contentType = "application/json"
  ) {
    const headers = {
      "Content-Type": contentType,
    };
    if (!authorization) {
      const token = sessionStorage.getItem("USER_TOKEN");
      if (!token) {
        return Promise.reject("非法请求！");
      } else {
        headers.Authorization = token;
      }
    }
    return this.baseService({
      method,
      url: url,
      params: params,
      data: data,
      headers,
      responseType: "json",
    });
  }
  // 请求拦截器
  _setInterceptorsRequest() {
    this.baseService.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  // 响应拦截器
  _setInterceptorsResponse() {
    this.baseService.interceptors.response.use(
      function (response) {
        if (response.status >= 200 && response.status <= 299) {
          switch (response.data.res) {
            case 200:
              return Promise.resolve(response.data);
            case 500:
              return Promise.reject("服务器异常");
            case 400:
              return Promise.reject(response.data.res.message);
            default:
              return Promise.resolve(response.data);
          }
        }
        return Promise.reject("error");
      },
      function (error) {
        if (
          error.code === "ECONNABORTED" &&
          error.message.indexOf("timeout") !== -1
        ) {
          return Promise.reject("请求超时");
        }
        return Promise.reject(error);
      }
    );
  }
}
//   export default new BaseApi({ baseURL: `${process.env.APP_BASE_URL}`});
