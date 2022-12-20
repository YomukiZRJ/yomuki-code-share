import { mgop, setDefaultHeader } from "@aligov/jssdk-mgop";
/**
 * @description: mgop类封装
 * @param {*} baseURL
 * @return {*}
 */
export default class MgopClass {
  baseURL = "";
  timeout = 30000;
  constructor({ baseURL }) {
    this.baseURL = baseURL;
  }
  // 进行发送操作
  doRequest = (method, api, data, authorization = false, type = "JSON") => {
    if (!authorization) {
      const token = sessionStorage.getItem("USER_TOKEN");
      if (!token) {
        return Promise.reject("非法请求！");
      } else {
        setDefaultHeader({
          Authorization: token,
        });
      }
    }
    return new Promise((resolve, reject) => {
      mgop({
        api: "mgop.xxxx" + api,
        host: this.baseURL,
        dataType: type,
        data: data,
        type: method,
        timeout: this.timeout,
        appKey: "appKey",
        onSuccess: (data) => {
          resolve(data.data);
        },
        onFail: (err) => {
          reject(err);
        },
      });
    });
  };
  get = (api, data = {}) => {
    return this.doRequest("GET", api, data);
  };
  post = (api, data = {}, authorization = false) => {
    return this.doRequest("POST", api, data, authorization);
  };
  delete = (api, data = {}) => {
    return this.doRequest("DELETE", api, data);
  };
  put = (api, data = {}) => {
    return this.doRequest("PUT", api, data);
  };
}
// export default new MgopClass("https://mapi.zjzwfw.gov.cn/");
