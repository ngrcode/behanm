import http from "./http.service";
import storage from "../../libraries/storage/local-storage";
import { apiUrl } from "../../config.json";

const apiEndpoint = `${apiUrl}/api/banners`;

http.setJwt(storage.retrieve("token"));

export function list(filterCriteria) {
    return http.get(`${apiEndpoint}`, filterCriteria);
}

export function item(id) {
    return http.get(`${apiEndpoint}/${id}`);
}

export function create(data) {
    return http.post(`${apiEndpoint}`, data);
}

export function update(id, data) {
    return http.put(`${apiEndpoint}/${id}`, data);
}

export function remove(id) {
    return http.delete(`${apiEndpoint}/${id}`);
}

export default {
    list,
    item,
    create,
    update,
    remove
};
