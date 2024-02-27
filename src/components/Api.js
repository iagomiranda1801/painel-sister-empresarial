import axios from "axios";
import { getToken, logout } from "./Auth";
const baseURL = process.env.REACT_APP_API_URL
// const baseURLProd = "https://api.sisterpay.app.br/"
// const url = "https://dev-api.sisterpay.app.br/"

const api = axios.create({
  // baseURL: (process.env.NODE_ENV === 'production' ? baseURLProd : baseURL)
  baseURL: (baseURL)
});

api.interceptors.request.use(async config => {

  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json'
  return config;
});


api.interceptors.response.use(async response => {

  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status === 401 && error.response.status !== undefined) {
    //  toast.error("Sessao expirada, Favor realizar o login novamente!");
    logout();
    window.location.href = '/#/login';
  }
  return Promise.reject(error.response);
})



export default api;
