import { retrieveItem } from "@doran/react";
import http from "../../core/services/http.service";
import { apiUrl } from "../../config.json";

const apiEndpoint = `${apiUrl}/api/files`;
http.setJwt(retrieveItem("token"));

export function create(data) {
    return http.post(`${apiEndpoint}`, data);
}

export default { create };
