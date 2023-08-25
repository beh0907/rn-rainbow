import { uriToImageFile } from '../utils/imageUtil';
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
    //즐겨찾는 추모관이 없을 경우 API를 호출하지 않고 빈 배열을 리턴한다
    if (listRoomNum.length === 0) return [];

    const response = await axiosApiInstance.post(`/room/readBookmarkList`, listRoomNum);
    return response.data;
};

export const registerRoom = async (room, uri) => {
    const formData = setFormData(room, uri);

    const response = await axiosApiInstance.postForm(`/room/register`, formData)
        .catch(e => {
            console.log('에러', e);
            console.log('에러 응답', e.response);
            console.log('에러 코드', e.status);
        });

    return response.data;
};

export const modifyRoom = async (room, uri) => {
    const formData = setFormData(room, uri);

    const response = await axiosApiInstance.postForm(`/room/modify`, formData)
        .catch(e => {
            console.log('에러', e);
            console.log('에러 응답', e.response);
            console.log('에러 코드', e.status);
        });

    return response.data;
};

export const removeRoom = async (room) => {
    const response = await axiosApiInstance.delete(`/room/remove`, {
        data: room
    });
    return response.data;
};


const setFormData = (room, uri) => {
    const formData = new FormData();

    if (uri !== null) {
        //file 객체 셋팅
        const file = uriToImageFile(room.id, uri);
        room.image = file.name;
        formData.append('file', file);
    }

    //room 객체 셋팅
    const json = JSON.stringify(room);
    const blob = new Blob([json], {
        type: 'application/json;'
    });
    formData.append('room', json);

    return formData;
};
