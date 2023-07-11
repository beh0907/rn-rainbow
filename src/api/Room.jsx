import axios from "axios";
import { BASE_URL_API } from "@env"

export const read = async (roomNum) => {
    const response = await axios.get(`${BASE_URL_API}/room/read?roomNum=${roomNum}`);
    return response.data
}

export const readList = async (page, type, keyword) => {
    const response = await axios.get(`${BASE_URL_API}/room/readList?page=${page}&type=${type}&keyword=${keyword}`);
    return response.data
}

export const readMyList = async (id) => {
    const response = await axios.get(`${BASE_URL_API}/room/readMyList?id=${id}`);
    return response.data
}

export const readBookmarkList = async (listRoomNum) => {
    const response = await axios.post(`${BASE_URL_API}/room/readBookmarkList`, listRoomNum);
    return response.data
}

export const register = async (room, file) => {
    const formData = new FormData()
    formData.append('room', room);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/room/register`, formData);
    return response.data
}

export const modify = async (room, file) => {
    const formData = new FormData()
    formData.append('room', room);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/room/modify`, formData);
    return response.data
}

export const remove = async (room) => {
    const response = await axios.delete(`${BASE_URL_API}/room/remove`, {
        data: room
    });
    return response.data
}
