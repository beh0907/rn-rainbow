import axios from "axios";
import { BASE_URL_API } from "@env"

export const readRoom = async (roomNum) => {
    const response = await axios.get(`${BASE_URL_API}/room/read?roomNum=${roomNum}`);
    return response.data
}

export const readRoomList = async ({page, type, keyword}) => {
    const response = await axios.get(`${BASE_URL_API}/room/readList?page=${page}&type=${type}&keyword=${keyword}`);
    return response.data
}

export const readMyRoomList = async (id) => {
    const response = await axios.get(`${BASE_URL_API}/room/readMyList?id=${id}`);
    return response.data
}

export const readBookmarkRoomList = async (listRoomNum) => {
    const response = await axios.post(`${BASE_URL_API}/room/readBookmarkList`, listRoomNum);
    return response.data
}

export const registerRoom = async (room, file) => {
    const formData = new FormData()
    formData.append('room', room);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/room/register`, formData);
    return response.data
}

export const modifyRoom = async (room, file) => {
    const formData = new FormData()
    formData.append('room', room);
    formData.append('file', file)

    const response = await axios.post(`${BASE_URL_API}/room/modify`, formData);
    return response.data
}

export const removeRoom = async (room) => {
    const response = await axios.delete(`${BASE_URL_API}/room/remove`, {
        data: room
    });
    return response.data
}
