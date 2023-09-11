import axios from "axios";
import { axiosApiInstance } from './AxiosInstance';
import Constants from 'expo-constants';

// export const readCommentList = async (num) => {
//     const response = await axiosApiInstance.get(`/comment/readList?num=${num}`);
//     return response.data
// }

export const readCommentList = async (num, { page, amount, type }) => {
    const response = await axiosApiInstance.get(`/comment/readList?num=${num}&page=${page}&amount=${amount}&type=${type}`);
    return response.data
}

export const registerComment = async (comment) => {
    const response = await axiosApiInstance.post(`/comment/register`, comment);
}

export const removeComment = async (seq) => {
    const response = await axiosApiInstance.delete(`/comment/remove?seq=${seq}`);
}
