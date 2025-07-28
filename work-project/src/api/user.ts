import { post } from "../utils/http";

const Api = {
  Login: '/login',
};

interface LoginParams {
    username: string;
    password: string;
}

function loginApi(data: LoginParams): Promise<any> {
  return post(Api.Login, data);
}

export { loginApi }
