import axios from "axios";
import { axiosApiInstance } from './AxiosInstance';
import Constants from 'expo-constants';

const { BASE_URL_API} = Constants.expoConfig.extra;

export const readCommentList = async (num) => {
    const response = await axiosApiInstance.get(`/comment/readList?num=${num}`);
    return response.data
}

export const registerComment = async (comment) => {
    const response = await axiosApiInstance.post(`/comment/register`, comment);
}

export const removeComment = async (seq) => {
    const response = await axios.delete(`${BASE_URL_API}/comment/remove?seq=${seq}`);
}
