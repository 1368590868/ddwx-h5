import { param2Obj } from "./index";

const TokenKey = "id_token";
const expires = {
  expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
};

export function getIdToken() {
  let query = param2Obj(window.location.search);
  if (query[TokenKey]) {
    window.sessionStorage.setItem(TokenKey, query[TokenKey]);
    return query[TokenKey];
  } else {
    let tokenString = window.sessionStorage.getItem(TokenKey);
    if (tokenString) {
      return tokenString;
    } else {
      return null;
    }
  }
}
export function getToken() {
  return window.sessionStorage.getItem("token");
}

export function setToken(data) {
  window.sessionStorage.setItem("token", data);
}

export function removeToken(name) {
  return window.sessionStorage.removeItem(TokenKey);
}

export function setCookie(name, value) {
  // return Cookies.set(name, value, expires)
}

export function getCookie(name) {
  // return Cookies.get(name)
}

export const uploadHaders = {
  "x-user-header": getToken(),
};
