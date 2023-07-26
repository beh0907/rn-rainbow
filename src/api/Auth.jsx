import axios from "axios";
import {BASE_URL_API} from "@env"
import * as SecureStore from "../utils/PreferenceStore";
import {Platform} from "react-native";
import {getLocalUri} from "../components/list/ImagePicker";

export const signIn = async ({id, password}) => {
    const response = await axios.get(`${BASE_URL_API}/user/login?id=${id}&password=${password}`, {
        headers: {
            fcmToken: ""
        }
    });
    response.headers.accesstoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.ACCESS_TOKEN, response.headers.accesstoken)
    response.headers.refreshtoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.REFRESH_TOKEN, response.headers.refreshtoken)

    return response.data
}
export const duplicateId = async (id) => {
    const response = await axios.get(`${BASE_URL_API}/user/login?id=${id}`);
    return response.data
}
export const duplicateMail = async (mail) => {
    const response = await axios.get(`${BASE_URL_API}/user/login?mail=${mail}`);
    return response.data
}
export const duplicateNickname = async (nickName) => {
    const response = await axios.get(`${BASE_URL_API}/user/login?nickName=${nickName}`);
    return response.data
}

export const signUp = async (user) => {
    const response = await axios.post(`${BASE_URL_API}/user/register`, user);

    //리턴 정보가 "0"이면 실패
    return response.data === "0" ? null : user
}

export const modify = async (user, photo) => {
    // const localUri = Platform.select({
    //     ios: await getLocalUri(photo.id),
    //     android: photo.uri,
    // });

    const formData = new FormData()
    formData.append("user", new Blob([JSON.stringify(user)], { type: "application/json" }));
    formData.append("file", {uri: photo.uri, type: "image/jpeg", filename: photo.filename});

    const response = await axios.post(`${BASE_URL_API}/user/modifyTest`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    // const response = await axios.put(`${BASE_URL_API}/user/modify`, user);
    return response.data
}

export const remove = async ({id}) => {
    const response = await axios.delete(`${BASE_URL_API}/user/remove?id=${id}`);
}

export const getAuthMessages = (error) => {
    switch (error) {
        case 401:
            return '비밀번호가 일치하지 않습니다.'
        case 405:
            return '등록되지 않은 아이디입니다.'
        default:
            return '통신에 실패하였습니다.'
    }
}
