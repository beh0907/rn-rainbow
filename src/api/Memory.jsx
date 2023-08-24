import axios from "axios";
import { axiosApiInstance } from './AxiosInstance';
import Constants from 'expo-constants';
import { uriToImageFile, uriToVideoFile } from '../utils/imageUtil';

const { BASE_URL_API} = Constants.expoConfig.extra;

export const readMemoryList = async (num, type) => {
    const response = await axiosApiInstance.get(`/memory/readList?num=${num}&type=${type}`);
    return response.data
}

export const registerImage = async (memory, file) => {
    const formData = new FormData()
    formData.append('memory', memory);
    formData.append('file', file)

    const response = await axiosApiInstance.post(`/memory/registerImage`, formData);
    return response.data
}

export const registerVideo = async (memory, uri, imageUri) => {
    const formData = setFormData(memory, uri, imageUri);

    const response = await axiosApiInstance.postForm(`/memory/registerVideo`, formData)
        .catch(e => {
            console.log('에러', e);
            console.log('에러 응답', e.response);
            console.log('에러 코드', e.status);
        });

    return response.data
}

export const modifyMemory = async (memory) => {
    const response = await axiosApiInstance.post(`/memory/modify`, memory);
    return response.data
}


export const removeMemory = async (memory) => {
    const response = await axios.delete(`${BASE_URL_API}/memory/remove`, memory);
    return response.data
}


const setFormData = (memory, uri, imageUri) => {
    const formData = new FormData();

    if (uri !== null) {
        //file 객체 셋팅
        const file = uriToVideoFile(memory.id, uri);
        memory.name = file.name;
        formData.append('file', file);
    }

    if (imageUri !== null) {
        //file 객체 셋팅
        const thumbnail = uriToImageFile(memory.id, imageUri);
        thumbnail.name = "s_" + memory.name;
        formData.append('thumbnail', thumbnail);
    }

    //memory 객체 셋팅
    const json = JSON.stringify(memory);
    const blob = new Blob([json], {
        type: 'application/json;'
    });
    formData.append('memory', json);

    return formData
}
