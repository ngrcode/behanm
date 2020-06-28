import axios from "axios";
import storage from "../../libraries/storage/local-storage";
import { tokenKey } from "../../config.json";

axios.defaults.headers.common["Content-Type"] = "application/ld+json";
axios.defaults.headers.common["Accept"] = "application/ld+json";

function setJwt(jwt) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

function handleResponse(data) {
    const {
        response: { status },
    } = data;
    if (status === 401) {
        storage.remove(tokenKey);
        return (window.location = "/login");
    }

    return Promise.reject(data);
}

export function get(url, params = null, headers = {}) {
    return (params === null ? axios.get(url) : axios.get(url, { params, headers })).catch((data) => handleResponse(data));
}

export function post(url, data) {
    return axios.post(url, data).catch((data) => handleResponse(data));
}

export function put(url, data) {
    return axios.put(url, data).catch((data) => handleResponse(data));
}

export function remove(url) {
    return axios.delete(url).catch((data) => handleResponse(data));
}

export default {
    get,
    post,
    put,
    delete: remove,
    setJwt,
};
