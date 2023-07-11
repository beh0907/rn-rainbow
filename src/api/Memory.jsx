import axios from "axios";
import { BASE_URL_API } from "@env"


export const readList = async (num, type) => {
    const response = await axios.get(`${BASE_URL_API}/memory/readList?num=${num}&type=${type}`);
    return response.data
}

export const registerImage = async (memory, file) => {
    const formData = new FormData()
    formData.append('memory', memory);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/memory/registerImage`, formData);
    return response.data
}

export const registerVideo = async (memory, file) => {
    const formData = new FormData()
    formData.append('memory', memory);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/memory/registerVideo`, formData);
    return response.data
}

export const modify = async (memory) => {
    const response = await axios.post(`${BASE_URL_API}/memory/modify`, memory);
    return response.data
}


export const remove = async (memory) => {
    const response = await axios.delete(`${BASE_URL_API}/memory/remove`, {
        data: memory
    });
    return response.data
}
