import AxiosApi from "./AxiosApi";
import MgopApi from "./MgopApi";
class BaseApi {
  baseService;
  urlPropertyName;
  constructor() {
    this.baseService =
      process.env.APP_API_TYPE === "mgop"
        ? new MgopApi({ baseURL: "https://mapi.zjzwfw.gov.cn/" })
        : new AxiosApi({ baseURL: `${process.env.APP_BASE_URL}` });
    this.urlPropertyName =
      process.env.APP_API_TYPE === "mgop" ? "mgopUrl" : "axiosUrl";
  }
  get(url, ...args) {
    const tempUrl = typeof url === "string" ? url : url[this.urlPropertyName];
    if (tempUrl) {
      return this.baseService.get(tempUrl, ...args);
    }
  }
  post(url, ...args) {
    const tempUrl = typeof url === "string" ? url : url[this.urlPropertyName];
    if (tempUrl) {
      return this.baseService.post(tempUrl, ...args);
    }
  }
}
export default new BaseApi();
