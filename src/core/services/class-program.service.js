import http from "./http.service";
import storage from "../../libraries/storage/local-storage";
import { apiUrl } from "../../config.json";

const apiEndpoint = `${apiUrl}/api/class_programs`;

http.setJwt(storage.retrieve("token"));

export function list(filterCriteria) {
    return http.get(`${apiEndpoint}`, filterCriteria);
}

export function item(id) {
    return http.get(`${apiEndpoint}/${id}`);
}

export function save(data) {
    const { id } = data;
    if (id) {
        return http.put(`${apiEndpoint}/${id}`, data);
    } else {
        return http.post(`${apiEndpoint}`, data);
    }
}

export function remove(id) {
    return http.delete(`${apiEndpoint}/${id}`);
}

export default {
    list,
    item,
    save,
    remove
};
