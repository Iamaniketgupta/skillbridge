import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const token = cookies.get('accessToken');
export const setCookie = (name,token) => {

    cookies.set(name, token);
}
export const removeCookie = (name) => {

    cookies.remove(name);
}

export const getCookie = (name) => {
   return cookies.get(name);
}
