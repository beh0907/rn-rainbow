import axios from "axios";

const BASE_URL = 'http://inhyeop.iptime.org:82/rainbow'

export const signIn = async ({id, password}) => {
    const response = await axios.get(`${BASE_URL}/user/login?id=${id}&password=${password}`);
    return response.data
}

export const duplicateId = async (id) => {
    const response = await axios.get(`${BASE_URL}/user/login?id=${id}`);
    return response.data
}

export const duplicateMail = async (mail) => {
    const response = await axios.get(`${BASE_URL}/user/login?mail=${mail}`);
    return response.data
}

export const duplicateNickname = async (nickName) => {
    const response = await axios.get(`${BASE_URL}/user/login?nickName=${nickName}`);
    return response.data
}

export const signUp = async (user) => {
    const response = await axios.post(`${BASE_URL}/user/register`, {
        params: user
    });
}

export const modify = async (user) => {
    const response = await axios.put(`${BASE_URL}/user/modify`, {
        params: user
    });
}

export const remove = async ({id}) => {
    const response = await axios.delete(`${BASE_URL}/user/remove?id=${id}`);
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
