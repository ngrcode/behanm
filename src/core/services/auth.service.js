import http from "./http.service";
import storage from "../../libraries/storage/local-storage";
import { apiUrl, tokenKey } from "../../config.json";
// import jwtDecode from "jwt-decode";

export async function register(data) {
    return await http.post(`${apiUrl}/api/people`, data);
}

export async function login(data) {
    const result = await http.post(`${apiUrl}/login_check`, data);

    const {
        data:{token:{token},user}
    } = result;

    if (token) {
        storage.store(tokenKey, token);
        storage.store("user", JSON.stringify(user));
    }
    return result;
}

export async function logout(history) {
    storage.remove(tokenKey);
    history.push("/login");
}

export function currentUser() {
    try {
        const user = storage.retrieve("user");
        return JSON.parse(user);
    } catch (ex) {
        return null;
    }
}



export default {
    register,
    login,
    logout,
    currentUser
};
