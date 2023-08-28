import axios from 'axios';
import * as SecureStore from '../utils/PreferenceStore';
import { uriToImageFile } from '../utils/ImageUtil';
import { axiosApiInstance } from './AxiosInstance';

export const signIn = async ({ id, password }, fcmToken = '') => {
    const response = await axiosApiInstance.get(`/user/login?id=${id}&password=${password}`, {
        headers: {
            fcmToken: fcmToken
        }
    });

    response.headers.accesstoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.ACCESS_TOKEN, response.headers.accesstoken);
    response.headers.refreshtoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.REFRESH_TOKEN, response.headers.refreshtoken);

    return response.data;
};

export const signInKaKao = async (user, fcmToken = '') => {
    const response = await axiosApiInstance.post(`/user/kakaoLogin`, user, {
        headers: {
            fcmToken: fcmToken
        }
    });

    response.headers.accesstoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.ACCESS_TOKEN, response.headers.accesstoken);
    response.headers.refreshtoken && await SecureStore.save(SecureStore.STORE_USER_KEYS.REFRESH_TOKEN, response.headers.refreshtoken);

    return response.data;
};

export const duplicateId = async (id) => {
    const response = await axiosApiInstance.get(`/user/login?id=${id}`);
    return response.data;
};
export const duplicateMail = async (mail) => {
    const response = await axiosApiInstance.get(`/user/login?mail=${mail}`);
    return response.data;
};
export const duplicateNickname = async (nickName) => {
    const response = await axiosApiInstance.get(`/user/login?nickName=${nickName}`);
    return response.data;
};

export const signUp = async (user) => {
    const response = await axiosApiInstance.post(`/user/register`, user);

    //리턴 정보가 "0"이면 실패
    return response.data === '0' ? null : user;
};

export const signOut = async (user) => {
    const response = await axiosApiInstance.post(`/user/logout`, user);

    //리턴 정보가 "0"이면 실패
    return response.data;
};

export const modify = async (user, uri) => {
    const formData = new FormData();

    //user 객체 셋팅
    const json = JSON.stringify(user);
    const blob = new Blob([json], {
        type: 'application/json',
        encoding: 'utf-8'
    });
    formData.append('user', json);

    if (uri !== null) {
        //file 객체 셋팅
        const file = uriToImageFile(user.id, uri);
        user.image = "profile.jpg";
        formData.append('file', file);
    }

    const response = await axiosApiInstance.postForm(`/user/modifyRN`, formData)
        .catch(e => {
            console.log('에러', e);
            console.log('에러 응답', e.response);
            console.log('에러 코드', e.status);
        });

    return response.data;
};

export const remove = async ({ id }) => {
    const response = await axios.delete(`/user/remove?id=${id}`);

    return response.data
};

export const getAuthMessages = (error) => {
    switch (error) {
        case 401:
            return '비밀번호가 일치하지 않습니다.';
        case 405:
            return '등록되지 않은 아이디입니다.';
        default:
            return '통신에 실패하였습니다.';
    }
};
