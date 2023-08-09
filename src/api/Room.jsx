import axios from 'axios';
import { BASE_URL_API } from '@env';
import { uriToFile } from '../utils/imageUtil';
import { axiosApiInstance } from './AxiosInstance';

export const readRoom = async (roomNum) => {
    const response = await axiosApiInstance.get(`/room/read?roomNum=${roomNum}`);
    return response.data;
};

export const readRoomList = async ({ page, amount, type, keyword }) => {
    const response = await axiosApiInstance.get(`/room/readList?page=${page}&amount=${amount}&type=${type}&keyword=${keyword}`);
    return response.data;
};

export const readMyRoomList = async (id) => {
    const response = await axiosApiInstance.get(`/room/readMyList?id=${id}`);
    return response.data;
};

export const readBookmarkRoomList = async (listRoomNum) => {
    const response = await axiosApiInstance.post(`/room/readBookmarkList`, listRoomNum);
    return response.data;
};

export const registerRoom = async (room, uri) => {

    const formData = new FormData();

    if (uri !== null) {
        //file 객체 셋팅
        const file = uriToFile(room.id, uri);
        room.image = file.name;
        formData.append('file', file);
    }

    //room 객체 셋팅
    const json = JSON.stringify(room);
    const blob = new Blob([json], {
        type: 'application/json;'
    });
    formData.append('room', json);

    const response = await axios.postForm(`${BASE_URL_API}/room/register`, formData)
        .catch(e => {
            console.log('에러', e);
            console.log('에러 응답', e.response);
            console.log('에러 코드', e.status);
        });

    return response.data;
};

export const modifyRoom = async (room, file) => {
    const formData = new FormData();
    formData.append('room', room);
    formData.append('file', file);

    const response = await axiosApiInstance.post(`/room/modify`, formData);
    return response.data;
};

export const removeRoom = async (room) => {
    const response = await axios.delete(`${BASE_URL_API}/room/remove`, {
        data: room
    });
    return response.data;
};
