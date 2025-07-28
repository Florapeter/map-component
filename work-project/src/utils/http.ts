import service from "./axios";

interface ResponseData{
  code: number;
  message: string;
  data: any;
}

// 封装 get 方法
// params可有可无，有的话就传入params，没有的话就不用传入参数
export function get(url: string, params?: any):Promise<ResponseData> {
  return service.get(url, {
    params
  });
}

// 封装 post 方法
export function post(url: string, data?: any):Promise<ResponseData> {
  return service.post(url, data);
}
