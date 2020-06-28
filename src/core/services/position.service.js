import { retrieveItem } from "@doran/react";
import http from "../../core/services/http.service";
import { apiUrl } from "../../config.json";
// import { from } from "jalali-moment";

const apiEndpoint = `${apiUrl}/api/positions`;
http.setJwt(retrieveItem("token"));

export function list(data) {
    return http.get(`${apiEndpoint}`, data);
}

export function item(positionId) {
    return http.get(`${apiUrl}${positionId}`);
}

// export function save(data) {
//     const { _id, firstName, lastName, email, roles, username, password, forums, avatar } = data;
//     if (_id) {
//         return http.put(`${apiEndpoint}/${_id}`, { firstName, lastName, email, username, roles, forums, avatar });
//     }

//     return http.post(`${apiEndpoint}`, { firstName, lastName, email, username, password, roles, forums, avatar });
// }

// export function updateProfile(data) {
//     const { _id, firstName, lastName, email, username, avatar } = data;
//     return http.put(`${apiEndpoint}/${_id}/profile`, { firstName, lastName, email, username, avatar });
// }

// export function remove(userId) {
//     return http.delete(`${apiEndpoint}/${userId}`);
// }

// export function emailConfirm(data) {
//     const { _id, emailConfirmed } = data;
//     return http.put(`${apiEndpoint}/${_id}/email-confirm`, { emailConfirmed });
// }

// export function changeStatus(data) {
//     const { _id, status } = data;
//     return http.put(`${apiEndpoint}/${_id}/status`, { status });
// }

// export function changePassword(data) {
//     const { _id, password, expiredOn } = data;
//     return http.put(`${apiEndpoint}/${_id}/change-password`, { password, expiredOn });
// }

// export function profileChangePassword(data) {
//     const { _id, password } = data;
//     return http.put(`${apiEndpoint}/${_id}/profile-change-password`, { password });
// }

// export function resetPassword(data) {
//     const { _id } = data;
//     return http.put(`${apiEndpoint}/${_id}/reset-password`);
// }

// export function lockUser(data) {
//     const { _id, lockoutEnd } = data;
//     return http.put(`${apiEndpoint}/${_id}/lock`, { lockoutEnd });
// }

// export function loginList(data) {
//     const { _id, pageNumber } = data;
//     return http.post(`${apiEndpoint}/select/${_id}/logins`, { pageNumber });
// }

// export function expireToken(data) {
//     const { userId, loginId } = data;
//     return http.put(`${apiEndpoint}/${userId}/logins/${loginId}/expire`);
// }

export default {
    list,
    item
    // save,
    // updateProfile,
    // remove,
    // emailConfirm,
    // changeStatus,
    // changePassword,
    // profileChangePassword,
    // resetPassword,
    // lockUser,
    // loginList,
    // expireToken
};
