import axios from "axios";
import { BASE_URL_API } from "@env"
import { axiosApiInstance } from './AxiosInstance';


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

export const registerVideo = async (memory, file) => {
    const formData = new FormData()
    formData.append('memory', memory);
    formData.append('file', file)

    const response = await axiosApiInstance.post(`/memory/registerVideo`, formData);
    return response.data
}

export const modifyMemory = async (memory) => {
    const response = await axiosApiInstance.post(`/memory/modify`, memory);
    return response.data
}


export const removeMemory = async (memory) => {
    const response = await axios.delete(`${BASE_URL_API}/memory/remove`, {
        data: memory
    });
    return response.data
}
