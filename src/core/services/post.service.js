import http from "./http.service";
import storage from "../../libraries/storage/local-storage";
import { apiUrl } from "../../config.json";

const apiEndpoint = `${apiUrl}/api/posts`;

http.setJwt(storage.retrieve("token"));

export function list(filterCriteria) {
    return http.get(`${apiEndpoint}`, filterCriteria);
}

export function item(id) {
    return http.get(`${apiEndpoint}/${id}`);
}

export function save(data) {
    const { id, title, body, school, file, category } = data;
    if (id) {
        return http.put(`${apiEndpoint}/${id}`, { title, body, school, file, category });
    } else {
        return http.post(`${apiEndpoint}`, { title, body, school, file, category });
    }
}

export function remove(id) {
    return http.delete(`${apiEndpoint}/${id}`);
}

export default {
    list,
    item,
    save,
    remove,
};
